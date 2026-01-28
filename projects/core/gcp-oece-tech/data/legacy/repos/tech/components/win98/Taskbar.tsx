'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Win98Taskbar() {
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [time, setTime] = useState(new Date())

  // 更新时间
  useState(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  })

  return (
    <>
      {/* 开始菜单 */}
      {startMenuOpen && (
        <div 
          className="fixed bottom-7 left-0 bg-[#C0C0C0] w-48 z-[10000]"
          style={{
            boxShadow: '2px -2px 2px rgba(0,0,0,0.2)'
          }}
        >
          {/* 侧边栏 */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-6 text-white font-bold flex items-end pb-2"
            style={{
              background: 'linear-gradient(to bottom, #000080, #1084D0)',
              writingMode: 'vertical-rl',
              fontFamily: '"MS Sans Serif", sans-serif',
              fontSize: '14px',
              letterSpacing: '2px'
            }}
          >
            OECE 98
          </div>
          
          {/* 菜单项 */}
          <div className="ml-6 py-1">
            <Link 
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-[11px]"
              onClick={() => setStartMenuOpen(false)}
            >
              <span>🏠</span>
              <span>首頁</span>
            </Link>
            <Link 
              href="/tutorials"
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-[11px]"
              onClick={() => setStartMenuOpen(false)}
            >
              <span>📚</span>
              <span>教程</span>
            </Link>
            <Link 
              href="/tools"
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-[11px]"
              onClick={() => setStartMenuOpen(false)}
            >
              <span>🔧</span>
              <span>工具</span>
            </Link>
            <Link 
              href="/forum"
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-[11px]"
              onClick={() => setStartMenuOpen(false)}
            >
              <span>💬</span>
              <span>論壇</span>
            </Link>
            <div className="h-px bg-[#808080] mx-2 my-1" />
            <Link 
              href="/auth/login"
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-[11px]"
              onClick={() => setStartMenuOpen(false)}
            >
              <span>🔐</span>
              <span>登入</span>
            </Link>
            <Link 
              href="/pricing"
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#000080] hover:text-white text-[11px]"
              onClick={() => setStartMenuOpen(false)}
            >
              <span>💰</span>
              <span>價格</span>
            </Link>
          </div>
        </div>
      )}
      
      {/* 点击外部关闭菜单 */}
      {startMenuOpen && (
        <div 
          className="fixed inset-0 z-[9999]"
          onClick={() => setStartMenuOpen(false)}
        />
      )}
      
      {/* 任务栏 */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-7 bg-[#C0C0C0] flex items-center px-0.5 gap-1 z-[10001]"
        style={{
          borderTop: '2px solid #FFFFFF'
        }}
      >
        {/* 开始按钮 */}
        <button
          className="h-[22px] px-2 bg-[#C0C0C0] flex items-center gap-1 font-bold text-[11px]"
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          style={{
            fontFamily: '"MS Sans Serif", sans-serif',
            boxShadow: startMenuOpen
              ? 'inset 1px 1px 0 #000000, inset -1px -1px 0 #FFFFFF'
              : 'inset -1px -1px 0 #000000, inset 1px 1px 0 #FFFFFF, inset -2px -2px 0 #808080, inset 2px 2px 0 #DFDFDF'
          }}
        >
          <span>開始</span>
        </button>
        
        {/* 分隔线 */}
        <div 
          className="h-full w-0.5"
          style={{
            borderLeft: '1px solid #808080',
            borderRight: '1px solid #FFFFFF'
          }}
        />
        
        {/* 任务项（示例） */}
        <div className="flex-1" />
        
        {/* 系统托盘 */}
        <div 
          className="h-[22px] px-2 bg-[#C0C0C0] flex items-center gap-2"
          style={{
            borderLeft: '1px solid #808080',
            borderTop: '1px solid #808080',
            borderRight: '1px solid #FFFFFF',
            borderBottom: '1px solid #FFFFFF'
          }}
        >
          {/* 时间 */}
          <span 
            className="text-[11px]"
            style={{
              fontFamily: '"MS Sans Serif", sans-serif'
            }}
          >
            {time.toLocaleTimeString('zh-TW', { 
              hour: '2-digit', 
              minute: '2-digit&apos; 
            })}
          </span>
        </div>
      </div>
    </>
  )
}
