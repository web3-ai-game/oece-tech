'use client'

import { useState } from 'react'
import { Sparkles, RefreshCw, Calendar } from 'lucide-react'

const TAROT_CARDS = [
  '愚者', '魔術師', '女祭司', '皇后', '皇帝', '教皇', '戀人', '戰車',
  '力量', '隱士', '命運之輪', '正義', '倒吊人', '死神', '節制', '惡魔',
  '高塔', '星星', '月亮', '太陽', '審判', '世界'
]

interface MysticToolProps {
  type: 'tarot' | 'astrology' | 'soul20q' | 'therapy'
}

export default function MysticTool({ type }: MysticToolProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [flipped, setFlipped] = useState(false)
  const [selectedCard, setSelectedCard] = useState('')
  const [count, setCount] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [currentQuestion, setCurrentQuestion] = useState('')

  const checkDailyLimit = () => {
    const today = new Date().toDateString()
    const lastUse = localStorage.getItem(`mystic_${type}_date`)
    const useCount = parseInt(localStorage.getItem(`mystic_${type}_count`) || '0')

    if (lastUse === today && useCount >= 3) {
      alert('今日使用次數已達上限（3次），明天再來吧 ✨')
      return false
    }

    if (lastUse !== today) {
      localStorage.setItem(`mystic_${type}_date`, today)
      localStorage.setItem(`mystic_${type}_count`, '1')
    } else {
      localStorage.setItem(`mystic_${type}_count`, String(useCount + 1))
    }
    return true
  }

  const drawTarot = async () => {
    if (!checkDailyLimit()) return

    const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)]
    setSelectedCard(card)
    
    setTimeout(() => setFlipped(true), 500)
    setLoading(true)

    try {
      const res = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: card, 
          type: 'tarot' 
        })
      })
      
      const data = await res.json()
      setResult(data.text)
    } catch (error) {
      setResult('抱歉，神秘力量暫時失聯...')
    } finally {
      setLoading(false)
    }
  }

  const getAstrology = async () => {
    if (!checkDailyLimit()) return

    const signs = ['白羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座', 
                   '天秤座', '天蠍座', '射手座', '摩羯座', '水瓶座', '雙魚座']
    
    const userSign = prompt('請輸入你的星座 (例如: 天蠍座)')
    if (!userSign || !signs.includes(userSign)) {
      alert('請輸入有效的星座名稱')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userSign.replace('{sign}', userSign), 
          type: 'astrology' 
        })
      })
      
      const data = await res.json()
      setResult(data.text)
    } catch (error) {
      setResult('星象暫時混亂，請稍後再試...')
    } finally {
      setLoading(false)
    }
  }

  const play20Q = async () => {
    if (count === 0) {
      if (!checkDailyLimit()) return
      alert('請在心中想好一個人物或物品，我會用最多20個問題猜出來！')
      setCount(1)
      setAnswers([])
      setCurrentQuestion('這是一個真實存在的人物嗎？')
      return
    }

    const answer = prompt(currentQuestion + '\n\n請回答: 是 / 否')
    if (!answer) return

    const newAnswers = [...answers, `${currentQuestion}|${answer}`]
    setAnswers(newAnswers)
    setCount(count + 1)

    if (count >= 20) {
      setCurrentQuestion('')
      setResult('20個問題用完了！你贏了這回合 🎉')
      setCount(0)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `已問${count}個問題，之前的問答：${newAnswers.join('; ')}`, 
          type: 'soul20q' 
        })
      })
      
      const data = await res.json()
      
      if (data.text.includes('我猜') || data.text.includes('答案是')) {
        const correct = confirm(data.text + '\n\n我猜對了嗎？')
        if (correct) {
          setResult(`🎯 ${count}個問題後猜中了！\n\n${data.text}`)
          setCount(0)
        } else {
          setCurrentQuestion(data.text.split('?')[0] + '?')
        }
      } else {
        setCurrentQuestion(data.text)
      }
    } catch (error) {
      setResult('遊戲出錯了...')
      setCount(0)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult('')
    setFlipped(false)
    setSelectedCard('')
    setCount(0)
    setAnswers([])
    setCurrentQuestion('')
  }

  const renderContent = () => {
    switch (type) {
      case 'tarot':
        return (
          <div className="mystic-content tarot">
            <h3>🔮 AI 塔羅解讀</h3>
            <p>靜心後點擊抽牌，接收今日訊息</p>
            
            {!selectedCard ? (
              <button className="mystic-btn" onClick={drawTarot} disabled={loading}>
                <Sparkles size={20} />
                抽一張牌
              </button>
            ) : (
              <div className="tarot-card-container">
                <div className={`tarot-card ${flipped ? 'flipped' : ''}`}>
                  <div className="card-back">🂠</div>
                  <div className="card-front">
                    <div className="card-name">{selectedCard}</div>
                  </div>
                </div>
                
                {result && !loading && (
                  <div className="tarot-reading">
                    <h4>牌義解讀</h4>
                    <p>{result}</p>
                    <button className="reset-btn" onClick={reset}>
                      <RefreshCw size={16} />
                      重新抽牌
                    </button>
                  </div>
                )}
                
                {loading && <div className="loading-text">解讀中...</div>}
              </div>
            )}
          </div>
        )

      case 'astrology':
        return (
          <div className="mystic-content astro">
            <h3>✨ AI 星象師</h3>
            <p>輸入星座，獲取本周運勢分析</p>
            
            {!result ? (
              <button className="mystic-btn" onClick={getAstrology} disabled={loading}>
                <Calendar size={20} />
                查看運勢
              </button>
            ) : (
              <div className="astro-result">
                <div className="astro-content">{result}</div>
                <button className="reset-btn" onClick={reset}>
                  <RefreshCw size={16} />
                  查看其他星座
                </button>
              </div>
            )}
          </div>
        )

      case 'soul20q':
        return (
          <div className="mystic-content soul20q">
            <h3>🎯 20Q 靈魂拷問</h3>
            <p>想一個人/物，我用20個問題猜出來</p>
            
            {count === 0 && !result ? (
              <button className="mystic-btn" onClick={play20Q}>
                開始遊戲
              </button>
            ) : count > 0 && currentQuestion ? (
              <div className="game-active">
                <div className="question-count">問題 {count}/20</div>
                <div className="question-text">{currentQuestion}</div>
                <button className="answer-btn" onClick={play20Q}>
                  回答問題
                </button>
                {loading && <div className="loading-text">AI思考中...</div>}
              </div>
            ) : result ? (
              <div className="game-result">
                <p>{result}</p>
                <button className="reset-btn" onClick={reset}>
                  再玩一次
                </button>
              </div>
            ) : null}
          </div>
        )

      case 'therapy':
        return (
          <div className="mystic-content therapy">
            <h3>💊 解憂小愛</h3>
            <p>傾訴你的煩惱，獲得溫暖的回應</p>
            <button className="mystic-btn" onClick={() => alert('此功能整合在主聊天室中')}>
              前往聊天
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="mystic-tool">
      {renderContent()}

      <style jsx>{`
        .mystic-tool {
          background: linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 100%);
          border-radius: 16px;
          padding: 30px;
          border: 1px solid rgba(138, 43, 226, 0.3);
          box-shadow: 0 8px 32px rgba(138, 43, 226, 0.2);
        }

        .mystic-content {
          text-align: center;
        }

        .mystic-content h3 {
          font-size: 24px;
          color: #da70d6;
          margin-bottom: 12px;
        }

        .mystic-content p {
          color: #aaa;
          margin-bottom: 24px;
        }

        .mystic-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #da70d6, #9370db);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .mystic-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(218, 112, 214, 0.4);
        }

        .mystic-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .tarot-card-container {
          margin-top: 30px;
        }

        .tarot-card {
          width: 200px;
          height: 320px;
          margin: 0 auto 30px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s;
          cursor: pointer;
        }

        .tarot-card.flipped {
          transform: rotateY(180deg);
        }

        .card-back, .card-front {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
          border: 2px solid rgba(218, 112, 214, 0.5);
        }

        .card-back {
          background: linear-gradient(135deg, #4a148c, #6a1b9a);
        }

        .card-front {
          background: linear-gradient(135deg, #fff, #f0e6ff);
          transform: rotateY(180deg);
        }

        .card-name {
          font-size: 24px;
          font-weight: 700;
          color: #4a148c;
        }

        .tarot-reading {
          background: rgba(218, 112, 214, 0.1);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid rgba(218, 112, 214, 0.3);
        }

        .tarot-reading h4 {
          color: #da70d6;
          margin-bottom: 16px;
          font-size: 18px;
        }

        .tarot-reading p {
          color: #e0e0e0;
          line-height: 1.8;
          margin-bottom: 20px;
          white-space: pre-line;
        }

        .astro-result {
          background: rgba(218, 112, 214, 0.1);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid rgba(218, 112, 214, 0.3);
        }

        .astro-content {
          color: #e0e0e0;
          line-height: 1.8;
          margin-bottom: 20px;
          white-space: pre-line;
        }

        .game-active {
          margin-top: 30px;
        }

        .question-count {
          color: #da70d6;
          font-size: 14px;
          margin-bottom: 16px;
          font-weight: 600;
        }

        .question-text {
          background: rgba(218, 112, 214, 0.1);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(218, 112, 214, 0.3);
          color: #fff;
          font-size: 18px;
          margin-bottom: 20px;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .answer-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #da70d6, #9370db);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .answer-btn:hover {
          transform: translateY(-2px);
        }

        .game-result {
          margin-top: 30px;
          background: rgba(218, 112, 214, 0.1);
          padding: 24px;
          border-radius: 12px;
        }

        .game-result p {
          color: #e0e0e0;
          margin-bottom: 20px;
          white-space: pre-line;
        }

        .reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.1);
          color: #da70d6;
          border: 2px solid rgba(218, 112, 214, 0.3);
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .reset-btn:hover {
          background: rgba(218, 112, 214, 0.2);
          border-color: #da70d6;
        }

        .loading-text {
          color: #da70d6;
          font-size: 14px;
          margin-top: 16px;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .mystic-tool {
            padding: 20px;
          }

          .tarot-card {
            width: 160px;
            height: 256px;
          }

          .card-back, .card-front {
            font-size: 60px;
          }

          .card-name {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  )
}
