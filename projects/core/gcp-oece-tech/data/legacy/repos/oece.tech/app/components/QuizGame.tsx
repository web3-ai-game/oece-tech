'use client'

import { useState, useEffect } from 'react'
import { Brain, Zap, Trophy, RefreshCw } from 'lucide-react'

interface Question {
  q: string
  options: string[]
  answer: string
  explanation: string
}

interface QuizGameProps {
  type: 'iq' | 'eq' | 'imdb'
  title: string
  icon: string
  description: string
}

export default function QuizGame({ type, title, icon, description }: QuizGameProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const lastPlay = localStorage.getItem(`quiz_${type}_last`)
    if (lastPlay) {
      const hoursSince = (Date.now() - parseInt(lastPlay)) / 1000 / 60 / 60
      if (hoursSince < 24) {
        const attemptsToday = parseInt(localStorage.getItem(`quiz_${type}_attempts`) || '0')
        if (attemptsToday >= 3) {
          alert('今日測試次數已用完，明天再來吧！')
          return
        }
      } else {
        localStorage.setItem(`quiz_${type}_attempts`, '0')
      }
    }
  }, [type])

  useEffect(() => {
    if (questions.length > 0 && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (timeLeft === 0 && !showResult) {
      handleAnswer('')
    }
  }, [timeLeft, showResult, questions])

  const startQuiz = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `生成${type}測試題目`, 
          type 
        })
      })
      
      const data = await res.json()
      const parsed = JSON.parse(data.text.match(/\[[\s\S]*\]/)?.[0] || '[]')
      
      if (parsed.length === 5) {
        setQuestions(parsed)
        setCurrentQ(0)
        setAnswers([])
        setShowResult(false)
        setTimeLeft(20)
        setScore(0)
      } else {
        alert('生成題目失敗，請重試')
      }
    } catch (error) {
      alert('啟動失敗：' + error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (choice: string) => {
    const newAnswers = [...answers, choice]
    setAnswers(newAnswers)
    
    if (choice === questions[currentQ].answer) {
      setScore(s => s + 20)
    }

    if (currentQ < 4) {
      setCurrentQ(c => c + 1)
      setTimeLeft(20)
    } else {
      setShowResult(true)
      const attempts = parseInt(localStorage.getItem(`quiz_${type}_attempts`) || '0')
      localStorage.setItem(`quiz_${type}_attempts`, String(attempts + 1))
      localStorage.setItem(`quiz_${type}_last`, String(Date.now()))
    }
  }

  const reset = () => {
    setQuestions([])
    setCurrentQ(0)
    setAnswers([])
    setShowResult(false)
    setTimeLeft(20)
    setScore(0)
  }

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>AI正在生成題目...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-start">
        <div className="quiz-start-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="quiz-start-btn" onClick={startQuiz}>
          <Zap size={20} />
          開始測試 (5題 · 100秒)
        </button>
      </div>
    )
  }

  if (showResult) {
    const level = score >= 80 ? '大師' : score >= 60 ? '高手' : score >= 40 ? '熟練' : '新手'
    return (
      <div className="quiz-result">
        <Trophy className="result-trophy" size={64} />
        <h3>測試完成！</h3>
        <div className="result-score">{score}分</div>
        <div className="result-level">{level}級別</div>
        
        <div className="result-details">
          {questions.map((q, i) => (
            <div key={i} className={`result-item ${answers[i] === q.answer ? 'correct' : 'wrong'}`}>
              <p className="result-q">Q{i + 1}: {q.q}</p>
              <p className="result-ans">
                你的答案: {answers[i] || '未答'} | 正確答案: {q.answer}
              </p>
              <p className="result-exp">{q.explanation}</p>
            </div>
          ))}
        </div>

        <div className="result-actions">
          <button className="result-btn share">分享結果</button>
          <button className="result-btn reset" onClick={reset}>
            <RefreshCw size={18} />
            再測一次
          </button>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]
  return (
    <div className="quiz-playing">
      <div className="quiz-header">
        <div className="quiz-progress">
          <span>題目 {currentQ + 1}/5</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentQ + 1) / 5) * 100}%` }}></div>
          </div>
        </div>
        <div className={`quiz-timer ${timeLeft <= 5 ? 'urgent' : ''}`}>
          ⏱ {timeLeft}s
        </div>
      </div>

      <div className="quiz-question">
        <h4>{q.q}</h4>
      </div>

      <div className="quiz-options">
        {q.options.map((opt, i) => (
          <button
            key={i}
            className="quiz-option"
            onClick={() => handleAnswer(String.fromCharCode(65 + i))}
          >
            <span className="option-letter">{String.fromCharCode(65 + i)}</span>
            <span className="option-text">{opt}</span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .quiz-loading, .quiz-start {
          text-align: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(0, 255, 157, 0.2);
          border-top-color: #00ff9d;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .quiz-start-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .quiz-start h3 {
          font-size: 28px;
          color: #00ff9d;
          margin-bottom: 12px;
        }

        .quiz-start p {
          color: #aaa;
          margin-bottom: 30px;
        }

        .quiz-start-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #00ff9d, #00d4ff);
          color: #000;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .quiz-start-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 255, 157, 0.4);
        }

        .quiz-playing {
          padding: 30px;
        }

        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .quiz-progress {
          flex: 1;
          margin-right: 20px;
        }

        .quiz-progress span {
          display: block;
          color: #aaa;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00ff9d, #00d4ff);
          transition: width 0.3s;
        }

        .quiz-timer {
          font-size: 24px;
          font-weight: 700;
          color: #00ff9d;
          min-width: 80px;
          text-align: center;
        }

        .quiz-timer.urgent {
          color: #ff4757;
          animation: pulse 0.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .quiz-question {
          background: rgba(0, 255, 157, 0.05);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid rgba(0, 255, 157, 0.2);
          margin-bottom: 24px;
        }

        .quiz-question h4 {
          font-size: 20px;
          line-height: 1.6;
          color: #fff;
        }

        .quiz-options {
          display: grid;
          gap: 12px;
        }

        .quiz-option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(0, 255, 157, 0.3);
          border-radius: 12px;
          color: #fff;
          font-size: 16px;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s;
        }

        .quiz-option:hover {
          background: rgba(0, 255, 157, 0.1);
          border-color: #00ff9d;
          transform: translateX(5px);
        }

        .option-letter {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #00ff9d, #00d4ff);
          color: #000;
          border-radius: 8px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .option-text {
          flex: 1;
        }

        .quiz-result {
          padding: 40px 20px;
          text-align: center;
        }

        .result-trophy {
          color: #ffd700;
          margin-bottom: 20px;
        }

        .quiz-result h3 {
          font-size: 32px;
          color: #00ff9d;
          margin-bottom: 20px;
        }

        .result-score {
          font-size: 72px;
          font-weight: 700;
          background: linear-gradient(135deg, #00ff9d, #00d4ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }

        .result-level {
          font-size: 24px;
          color: #aaa;
          margin-bottom: 30px;
        }

        .result-details {
          text-align: left;
          margin: 30px 0;
          max-height: 400px;
          overflow-y: auto;
        }

        .result-item {
          padding: 16px;
          margin-bottom: 12px;
          border-radius: 8px;
          border-left: 4px solid;
        }

        .result-item.correct {
          background: rgba(0, 255, 157, 0.1);
          border-color: #00ff9d;
        }

        .result-item.wrong {
          background: rgba(255, 71, 87, 0.1);
          border-color: #ff4757;
        }

        .result-q {
          font-weight: 600;
          margin-bottom: 8px;
          color: #fff;
        }

        .result-ans {
          font-size: 14px;
          color: #aaa;
          margin-bottom: 8px;
        }

        .result-exp {
          font-size: 13px;
          color: #888;
          font-style: italic;
        }

        .result-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 30px;
        }

        .result-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .result-btn.share {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
        }

        .result-btn.reset {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 2px solid rgba(0, 255, 157, 0.3);
        }

        .result-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .quiz-playing {
            padding: 20px;
          }

          .quiz-question h4 {
            font-size: 18px;
          }

          .quiz-option {
            font-size: 14px;
            padding: 14px 16px;
          }
        }
      `}</style>
    </div>
  )
}
