import React, { useState } from 'react';
import styles from './CodeDisplay.module.css';

interface CodeDisplayProps {
  code: string;
  language: string;
  theme?: 'dark' | 'light';
  variant?: 'minimal' | 'full';
  showLineNumbers?: boolean;
  highlightLines?: number[];
  fileName?: string;
  showCopy?: boolean;
}

/**
 * 代码展示组件 - 极简风格
 */
export const CodeDisplayMinimal: React.FC<CodeDisplayProps> = ({
  code,
  language,
  theme = 'dark',
  showLineNumbers = false,
  highlightLines = [],
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const lines = code.split('\n');

  return (
    <div className={`${styles.container} ${styles[theme]} ${styles.minimal}`}>
      <div className={styles.header}>
        <span className={styles.language}>{language}</span>
        <button 
          onClick={handleCopy}
          className={styles.copyButton}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              已复制
            </>
          ) : (
            <>
              <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              复制
            </>
          )}
        </button>
      </div>
      <pre className={styles.codeBlock}>
        <code>
          {lines.map((line, index) => (
            <div 
              key={index} 
              className={`${styles.codeLine} ${highlightLines.includes(index + 1) ? styles.highlighted : ''}`}
            >
              {showLineNumbers && (
                <span className={styles.lineNumber}>{index + 1}</span>
              )}
              <span className={styles.lineContent}>{line || '\n'}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

/**
 * 代码展示组件 - 完整功能风格
 */
export const CodeDisplayFull: React.FC<CodeDisplayProps> = ({
  code,
  language,
  theme = 'dark',
  showLineNumbers = true,
  highlightLines = [],
  fileName,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const lines = code.split('\n');
  const lineCount = lines.length;

  return (
    <div className={`${styles.container} ${styles[theme]} ${styles.full}`}>
      <div className={styles.headerFull}>
        <div className={styles.headerLeft}>
          {fileName && (
            <div className={styles.fileName}>
              <svg className={styles.fileIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              {fileName}
            </div>
          )}
          <span className={styles.languageBadge}>{language}</span>
          <span className={styles.lineCount}>{lineCount} 行</span>
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={() => setExpanded(!expanded)}
            className={styles.expandButton}
            aria-label="Toggle expand"
          >
            <svg 
              className={`${styles.icon} ${expanded ? styles.rotated : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={handleCopy}
            className={styles.copyButtonFull}
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                已复制
              </>
            ) : (
              <>
                <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                复制代码
              </>
            )}
          </button>
        </div>
      </div>
      {expanded && (
        <pre className={styles.codeBlockFull}>
          <code>
            {lines.map((line, index) => (
              <div 
                key={index} 
                className={`${styles.codeLineFull} ${highlightLines.includes(index + 1) ? styles.highlightedFull : ''}`}
              >
                {showLineNumbers && (
                  <span className={styles.lineNumberFull}>{index + 1}</span>
                )}
                <span className={styles.lineContentFull}>{line || '\n'}</span>
              </div>
            ))}
          </code>
        </pre>
      )}
    </div>
  );
};

export default CodeDisplayMinimal;
