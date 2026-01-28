import React, { useState } from 'react';
import styles from './Quiz.module.css';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
  type: 'single' | 'multiple';
}

interface QuizProps {
  questions: QuizQuestion[];
  variant?: 'card' | 'inline';
  showProgress?: boolean;
  onComplete?: (score: number) => void;
}

/**
 * 测验组件 - 卡片风格
 */
export const QuizCard: React.FC<QuizProps> = ({
  questions,
  showProgress = true,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleOptionSelect = (optionId: string) => {
    if (answeredQuestions.has(currentQuestionIndex)) return;

    if (currentQuestion.type === 'single') {
      setSelectedAnswers([optionId]);
    } else {
      setSelectedAnswers(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const handleSubmitAnswer = () => {
    const correctOptions = currentQuestion.options.filter(opt => opt.isCorrect);
    const isCorrect = currentQuestion.type === 'single'
      ? selectedAnswers[0] === correctOptions[0]?.id
      : correctOptions.every(opt => selectedAnswers.includes(opt.id)) &&
        selectedAnswers.length === correctOptions.length;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnsweredQuestions(prev => new Set(prev).add(currentQuestionIndex));
    setShowResult(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete?.(score);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswers([]);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className={styles.quizCard}>
      {showProgress && (
        <div className={styles.progressContainer}>
          <div className={styles.progressHeader}>
            <span className={styles.progressText}>
              问题 {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className={styles.scoreText}>得分: {score}</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      <div className={styles.questionCard}>
        <h3 className={styles.questionText}>{currentQuestion.question}</h3>
        
        <div className={styles.optionsContainer}>
          {currentQuestion.options.map(option => {
            const isSelected = selectedAnswers.includes(option.id);
            const showCorrect = showResult && option.isCorrect;
            const showIncorrect = showResult && isSelected && !option.isCorrect;
            
            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={showResult}
                className={`
                  ${styles.optionButton} 
                  ${isSelected ? styles.selected : ''}
                  ${showCorrect ? styles.correct : ''}
                  ${showIncorrect ? styles.incorrect : ''}
                `}
              >
                <span className={styles.optionIndicator}>
                  {currentQuestion.type === 'single' ? (
                    <span className={styles.radio}>
                      {isSelected && <span className={styles.radioDot} />}
                    </span>
                  ) : (
                    <span className={styles.checkbox}>
                      {isSelected && (
                        <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                  )}
                </span>
                <span className={styles.optionText}>{option.text}</span>
                {showResult && (
                  <span className={styles.resultIndicator}>
                    {option.isCorrect ? '✓' : isSelected ? '✗' : ''}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {currentQuestion.type === 'multiple' && !showResult && (
          <p className={styles.hint}>选择所有正确答案</p>
        )}

        {showResult && (
          <div className={`${styles.explanation} ${
            answeredQuestions.has(currentQuestionIndex) ? styles.show : ''
          }`}>
            <div className={styles.explanationHeader}>
              {selectedAnswers.length > 0 && 
               currentQuestion.options.find(opt => selectedAnswers.includes(opt.id) && opt.isCorrect) 
                ? '✓ 正确!' 
                : '✗ 不正确'}
            </div>
            <p className={styles.explanationText}>{currentQuestion.explanation}</p>
          </div>
        )}

        <div className={styles.actionButtons}>
          {!showResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswers.length === 0}
              className={styles.submitButton}
            >
              提交答案
            </button>
          ) : (
            <>
              {isLastQuestion ? (
                <>
                  <div className={styles.finalScore}>
                    最终得分: {score} / {questions.length}
                  </div>
                  <button onClick={handleRestart} className={styles.restartButton}>
                    重新开始
                  </button>
                </>
              ) : (
                <button onClick={handleNext} className={styles.nextButton}>
                  下一题 →
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 测验组件 - 内联风格
 */
export const QuizInline: React.FC<{ question: QuizQuestion }> = ({ question }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    if (showResult) return;

    if (question.type === 'single') {
      setSelectedAnswers([optionId]);
      // 单选题自动提交
      setTimeout(() => handleSubmit([optionId]), 300);
    } else {
      const newSelection = selectedAnswers.includes(optionId)
        ? selectedAnswers.filter(id => id !== optionId)
        : [...selectedAnswers, optionId];
      setSelectedAnswers(newSelection);
    }
  };

  const handleSubmit = (answers: string[] = selectedAnswers) => {
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedAnswers([]);
    setShowResult(false);
  };

  const correctOptions = question.options.filter(opt => opt.isCorrect);
  const isCorrect = question.type === 'single'
    ? selectedAnswers[0] === correctOptions[0]?.id
    : correctOptions.every(opt => selectedAnswers.includes(opt.id)) &&
      selectedAnswers.length === correctOptions.length;

  return (
    <div className={styles.quizInline}>
      <div className={styles.inlineHeader}>
        <span className={styles.quizIcon}>💡</span>
        <h4 className={styles.inlineTitle}>快速测验</h4>
      </div>
      
      <p className={styles.inlineQuestion}>{question.question}</p>
      
      <div className={styles.inlineOptions}>
        {question.options.map(option => {
          const isSelected = selectedAnswers.includes(option.id);
          const showCorrect = showResult && option.isCorrect;
          const showIncorrect = showResult && isSelected && !option.isCorrect;
          
          return (
            <label
              key={option.id}
              className={`
                ${styles.inlineOption}
                ${isSelected ? styles.inlineSelected : ''}
                ${showCorrect ? styles.inlineCorrect : ''}
                ${showIncorrect ? styles.inlineIncorrect : ''}
                ${showResult ? styles.disabled : ''}
              `}
            >
              <input
                type={question.type === 'single' ? 'radio' : 'checkbox'}
                name={`quiz-${question.id}`}
                checked={isSelected}
                onChange={() => handleOptionSelect(option.id)}
                disabled={showResult}
                className={styles.hiddenInput}
              />
              <span className={styles.inlineOptionContent}>
                <span className={styles.inlineIndicator}>
                  {question.type === 'single' ? '○' : '□'}
                  {isSelected && (question.type === 'single' ? '●' : '✓')}
                </span>
                {option.text}
                {showResult && (
                  <span className={styles.inlineResult}>
                    {option.isCorrect ? '✓' : isSelected ? '✗' : ''}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {question.type === 'multiple' && !showResult && (
        <div className={styles.inlineActions}>
          <button
            onClick={() => handleSubmit()}
            disabled={selectedAnswers.length === 0}
            className={styles.inlineSubmit}
          >
            检查答案
          </button>
        </div>
      )}

      {showResult && (
        <div className={styles.inlineExplanation}>
          <div className={`${styles.inlineStatus} ${isCorrect ? styles.success : styles.error}`}>
            {isCorrect ? '✓ 回答正确！' : '✗ 再想想看'}
          </div>
          <p className={styles.inlineExplanationText}>{question.explanation}</p>
          <button onClick={handleReset} className={styles.inlineReset}>
            重试
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
