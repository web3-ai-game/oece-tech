import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          // 標題
          h1: ({ children }) => (
            <h1 className="text-pixel-xl mb-6 mt-8 text-neon border-b-2 border-pixel-grid pb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-pixel-lg mb-4 mt-6 text-neon-pink">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-pixel-base mb-3 mt-4 text-pixel-accent">
              {children}
            </h3>
          ),
          
          // 段落
          p: ({ children }) => (
            <p className="mb-4 text-pixel-light/90 font-sans leading-relaxed text-base md:text-lg">
              {children}
            </p>
          ),
          
          // 列表
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 space-y-2 list-decimal">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-pixel-light/90 font-sans leading-relaxed">
              <span className="text-pixel-primary mr-2">▸</span>
              {children}
            </li>
          ),
          
          // 代碼塊
          code: ({ inline, className, children, ...props }: unknown) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            
            return !inline && language ? (
              <div className="my-6 code-block">
                <div className="bg-pixel-dark border-t-4 border-pixel-primary px-4 py-2 flex items-center justify-between">
                  <span className="text-pixel-xs text-pixel-accent font-mono uppercase">
                    {language}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(String(children).replace(/\n$/, '&apos;))
                    }}
                    className="text-pixel-xs text-pixel-light/50 hover:text-pixel-primary transition-colors font-mono"
                  >
                    複製代碼
                  </button>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={language}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    background: '#1a1a2e',
                    fontSize: '14px',
                    lineHeight: '1.6',
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: 'JetBrains Mono, monospace',
                    }
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '&apos;)}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className="px-2 py-1 bg-pixel-dark border border-pixel-grid text-pixel-accent font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            )
          },
          
          // 引用
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-pixel-accent bg-pixel-dark/50 pl-4 py-2 my-4 italic">
              {children}
            </blockquote>
          ),
          
          // 鏈接
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pixel-accent hover:text-pixel-primary underline transition-colors"
            >
              {children}
            </a>
          ),
          
          // 強調
          strong: ({ children }) => (
            <strong className="text-pixel-primary font-bold">
              {children}
            </strong>
          ),
          
          em: ({ children }) => (
            <em className="text-pixel-accent italic">
              {children}
            </em>
          ),
          
          // 水平線
          hr: () => (
            <hr className="my-8 border-t-2 border-pixel-grid" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
