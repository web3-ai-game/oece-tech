import React from 'react';
import styles from './Progress.module.css';

interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  current?: boolean;
}

interface CircularProgressProps {
  percentage: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  strokeWidth?: number;
  variant?: 'gradient' | 'solid';
}

interface StepProgressProps {
  steps: ProgressStep[];
  variant?: 'linear' | 'vertical';
  showDescription?: boolean;
}

/**
 * 环形进度条组件 - 渐变风格
 */
export const CircularProgressGradient: React.FC<CircularProgressProps> = ({
  percentage,
  size = 'medium',
  showLabel = true,
  strokeWidth = 8,
}) => {
  const sizeMap = {
    small: 80,
    medium: 120,
    large: 160,
  };

  const radius = (sizeMap[size] - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`${styles.circularContainer} ${styles[size]}`}>
      <svg
        className={styles.circularSvg}
        width={sizeMap[size]}
        height={sizeMap[size]}
      >
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        
        {/* 背景圆环 */}
        <circle
          className={styles.circularBg}
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        
        {/* 进度圆环 */}
        <circle
          className={styles.circularProgress}
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          stroke="url(#progress-gradient)"
        />
      </svg>
      
      {showLabel && (
        <div className={styles.circularLabel}>
          <span className={styles.circularPercentage}>{Math.round(percentage)}%</span>
          <span className={styles.circularText}>完成</span>
        </div>
      )}
    </div>
  );
};

/**
 * 环形进度条组件 - 纯色动态风格
 */
export const CircularProgressAnimated: React.FC<CircularProgressProps> = ({
  percentage,
  size = 'medium',
  showLabel = true,
  strokeWidth = 10,
}) => {
  const sizeMap = {
    small: 100,
    medium: 150,
    large: 200,
  };

  const radius = (sizeMap[size] - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`${styles.circularAnimated} ${styles[size]}`}>
      <svg
        className={styles.circularSvgAnimated}
        width={sizeMap[size]}
        height={sizeMap[size]}
      >
        {/* 装饰性外圈 */}
        <circle
          className={styles.outerRing}
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius + 15}
          strokeWidth="1"
          fill="none"
          strokeDasharray="5 5"
        />
        
        {/* 背景圆环 */}
        <circle
          className={styles.circularBgAnimated}
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        
        {/* 进度圆环 */}
        <circle
          className={styles.circularProgressAnimated}
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
        
        {/* 光点效果 */}
        <circle
          className={styles.glowDot}
          cx={sizeMap[size] / 2}
          cy={strokeWidth / 2}
          r="4"
          fill="#a855f7"
          style={{
            transformOrigin: `${sizeMap[size] / 2}px ${sizeMap[size] / 2}px`,
            transform: `rotate(${(percentage / 100) * 360 - 90}deg)`,
          }}
        />
      </svg>
      
      {showLabel && (
        <div className={styles.circularLabelAnimated}>
          <div className={styles.percentageAnimated}>{Math.round(percentage)}</div>
          <div className={styles.percentageSymbol}>%</div>
          <div className={styles.progressStatus}>
            {percentage === 100 ? '已完成' : '学习中'}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 步骤进度条组件 - 线性风格
 */
export const StepProgressLinear: React.FC<StepProgressProps> = ({
  steps,
  showDescription = false,
}) => {
  const currentIndex = steps.findIndex(step => step.current);
  
  return (
    <div className={styles.stepLinearContainer}>
      <div className={styles.stepLinearTrack}>
        {steps.map((step, index) => (
          <div key={step.id} className={styles.stepLinearItem}>
            <div className={styles.stepLinearContent}>
              <div 
                className={`
                  ${styles.stepLinearCircle} 
                  ${step.completed ? styles.completed : ''}
                  ${step.current ? styles.current : ''}
                  ${!step.completed && !step.current ? styles.pending : ''}
                `}
              >
                {step.completed ? (
                  <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              
              <div className={styles.stepLinearInfo}>
                <h4 className={`${styles.stepLinearTitle} ${step.current ? styles.currentTitle : ''}`}>
                  {step.title}
                </h4>
                {showDescription && step.description && (
                  <p className={styles.stepLinearDescription}>{step.description}</p>
                )}
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`
                  ${styles.stepLinearLine} 
                  ${steps[index + 1].completed || steps[index + 1].current ? styles.activeLine : ''}
                `}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* 进度统计 */}
      <div className={styles.stepLinearStats}>
        <span className={styles.statsText}>
          已完成 {steps.filter(s => s.completed).length} / {steps.length} 步
        </span>
        <div className={styles.linearProgressBar}>
          <div 
            className={styles.linearProgressFill}
            style={{ width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * 步骤进度条组件 - 垂直时间线风格
 */
export const StepProgressVertical: React.FC<StepProgressProps> = ({
  steps,
  showDescription = true,
}) => {
  return (
    <div className={styles.stepVerticalContainer}>
      {steps.map((step, index) => (
        <div key={step.id} className={styles.stepVerticalItem}>
          <div className={styles.stepVerticalLeft}>
            <div 
              className={`
                ${styles.stepVerticalIcon} 
                ${step.completed ? styles.completedIcon : ''}
                ${step.current ? styles.currentIcon : ''}
                ${!step.completed && !step.current ? styles.pendingIcon : ''}
              `}
            >
              {step.completed ? (
                <svg className={styles.verticalCheckIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : step.current ? (
                <div className={styles.currentDot} />
              ) : (
                <span className={styles.stepNumber}>{index + 1}</span>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`
                  ${styles.stepVerticalLine} 
                  ${step.completed ? styles.completedLine : ''}
                `}
              />
            )}
          </div>
          
          <div className={styles.stepVerticalRight}>
            <div 
              className={`
                ${styles.stepVerticalCard} 
                ${step.current ? styles.currentCard : ''}
                ${step.completed ? styles.completedCard : ''}
              `}
            >
              <h4 className={styles.stepVerticalTitle}>
                {step.title}
                {step.current && <span className={styles.currentBadge}>当前</span>}
              </h4>
              {showDescription && step.description && (
                <p className={styles.stepVerticalDescription}>{step.description}</p>
              )}
              
              {step.completed && (
                <div className={styles.completedTag}>
                  <svg className={styles.miniCheck} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  已完成
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {/* 总体进度 */}
      <div className={styles.overallProgress}>
        <CircularProgressGradient 
          percentage={(steps.filter(s => s.completed).length / steps.length) * 100}
          size="small"
        />
        <div className={styles.overallText}>
          <h5>课程进度</h5>
          <p>{steps.filter(s => s.completed).length} / {steps.length} 章节</p>
        </div>
      </div>
    </div>
  );
};

export default CircularProgressGradient;
