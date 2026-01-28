'use client'

import { useState } from 'react'
import { Mail, Lock, User, Key, PlayCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const [method, setMethod] = useState<'invite' | 'ads' | null>(null)
  const [adsWatched, setAdsWatched] = useState(0)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    inviteCode: '',
  })
  
  const REQUIRED_ADS = 5

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="inline-block font-mono text-xs text-pixel-primary border border-pixel-primary px-3 py-1 mb-4">
            [REGISTRATION_SYSTEM]
          </div>
          <h1 className="text-pixel-2xl text-neon mb-4">註冊帳號</h1>
          <p className="text-pixel-light/70 font-mono">選擇你的註冊方式</p>
        </div>

        {!method ? (
          // 选择注册方式
          <div className="space-y-6">
            {/* 邀请码注册 */}
            <div 
              onClick={() => setMethod('invite')}
              className="card-pixel-glow p-8 cursor-pointer group hover:border-pixel-primary transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-pixel-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Key className="text-pixel-primary" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-pixel-lg mb-2 font-mono">使用邀請碼註冊</h3>
                  <p className="text-sm text-pixel-light/70 mb-4">
                    如果你有邀請碼，可以直接註冊並獲得額外獎勵
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-pixel-primary">✓ 立即註冊</span>
                    <span className="text-pixel-accent">✓ 額外 50 積分</span>
                  </div>
                </div>
                <ArrowRight className="text-pixel-primary group-hover:translate-x-2 transition-transform" size={24} />
              </div>
            </div>

            {/* 广告注册 */}
            <div 
              onClick={() => setMethod('ads')}
              className="card-pixel-glow p-8 cursor-pointer group hover:border-pixel-accent transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-pixel-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlayCircle className="text-pixel-accent" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-pixel-lg mb-2 font-mono">觀看廣告免費註冊</h3>
                  <p className="text-sm text-pixel-light/70 mb-4">
                    觀看 {REQUIRED_ADS} 個廣告即可免費註冊
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-pixel-accent">✓ 完全免費</span>
                    <span className="text-pixel-primary">✓ 新手 100 積分</span>
                  </div>
                </div>
                <ArrowRight className="text-pixel-accent group-hover:translate-x-2 transition-transform" size={24} />
              </div>
            </div>

            {/* 提示 */}
            <div className="text-center text-sm text-pixel-light/50 font-mono">
              已有帳號？
              <Link href="/auth/login" className="text-pixel-primary hover:text-pixel-accent ml-2">
                立即登入
              </Link>
            </div>
          </div>
        ) : method === 'ads' ? (
          // 观看广告流程
          <AdRegistrationFlow 
            adsWatched={adsWatched}
            required={REQUIRED_ADS}
            onAdComplete={() => setAdsWatched(prev => prev + 1)}
            onBack={() => setMethod(null)}
            onContinue={() => {
              // 广告看完后显示注册表单
            }}
            formData={formData}
            setFormData={setFormData}
          />
        ) : (
          // 邀请码注册表单
          <InviteCodeForm 
            formData={formData}
            setFormData={setFormData}
            onBack={() => setMethod(null)}
          />
        )}
      </div>
    </div>
  )
}

// 广告注册流程组件
function AdRegistrationFlow({ adsWatched, required, onAdComplete, onBack, onContinue, formData, setFormData }: unknown) {
  const [showingAd, setShowingAd] = useState(false)
  const progress = (adsWatched / required) * 100

  if (adsWatched >= required) {
    return <RegisterForm formData={formData} setFormData={setFormData} method="ads" onBack={onBack} />
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <button onClick={onBack} className="text-sm text-pixel-light/70 hover:text-pixel-primary">
        ← 返回選擇
      </button>

      {/* 进度卡片 */}
      <div className="card-pixel-glow p-8">
        <div className="text-center mb-8">
          <h3 className="text-pixel-lg mb-2 font-mono">觀看廣告解鎖註冊</h3>
          <p className="text-sm text-pixel-light/70">
            已觀看 <span className="text-pixel-primary font-bold">{adsWatched}</span> / {required} 個廣告
          </p>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="h-3 bg-pixel-darker rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-pixel-primary to-pixel-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-pixel-light/50 font-mono">
            <span>0%</span>
            <span>{progress.toFixed(0)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* 广告显示区域 */}
        {!showingAd ? (
          <div className="text-center">
            <button 
              onClick={() => setShowingAd(true)}
              className="btn-pixel mx-auto"
            >
              <PlayCircle className="inline mr-2" size={20} />
              觀看下一個廣告
            </button>
          </div>
        ) : (
          <div className="card-pixel p-8 bg-pixel-darker/50 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-pixel-accent/20 flex items-center justify-center animate-pulse">
                <PlayCircle className="text-pixel-accent" size={32} />
              </div>
            </div>
            <p className="text-sm text-pixel-light/70 mb-6">
              廣告播放中... (模擬 30 秒)
            </p>
            <button 
              onClick={() => {
                setShowingAd(false)
                onAdComplete()
              }}
              className="btn-pixel-outline"
            >
              完成觀看 (+10 積分)
            </button>
          </div>
        )}

        {/* 奖励提示 */}
        <div className="mt-6 text-center text-sm text-pixel-accent font-mono">
          完成後獲得 100 新手積分 + 註冊權限
        </div>
      </div>
    </div>
  )
}

// 邀请码表单组件
function InviteCodeForm({ formData, setFormData, onBack }: unknown) {
  const [verifying, setVerifying] = useState(false)
  const [codeValid, setCodeValid] = useState<boolean | null>(null)

  const verifyInviteCode = async () => {
    setVerifying(true)
    // 模拟验证
    setTimeout(() => {
      setCodeValid(formData.inviteCode.length > 0)
      setVerifying(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <button onClick={onBack} className="text-sm text-pixel-light/70 hover:text-pixel-primary">
        ← 返回選擇
      </button>

      <div className="card-pixel-glow p-8">
        <h3 className="text-pixel-lg mb-6 text-center font-mono">邀請碼註冊</h3>

        {/* 邀请码输入 */}
        <div className="mb-6">
          <label className="block text-sm text-pixel-light/70 mb-2">邀請碼</label>
          <div className="flex gap-2">
            <input 
              type="text"
              value={formData.inviteCode}
              onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value.toUpperCase() })}
              placeholder="GEEK-XXXX-XXXX"
              className="input-pixel flex-1 font-mono text-center text-lg tracking-wider"
            />
            <button 
              onClick={verifyInviteCode}
              disabled={verifying || !formData.inviteCode}
              className="btn-pixel-outline px-6"
            >
              {verifying ? '驗證中...' : '驗證'
            </button>
          </div>
          {codeValid === true && (
            <p className="text-sm text-pixel-primary mt-2">✓ 邀請碼有效</p>
          )}
          {codeValid === false && (
            <p className="text-sm text-pixel-danger mt-2">✗ 邀請碼無效或已過期</p>
          )}
        </div>

        {/* 注册表单 */}
        {codeValid && (
          <RegisterForm formData={formData} setFormData={setFormData} method="invite" />
        )}

        {/* 购买邀请码提示 */}
        <div className="mt-6 p-4 card-pixel bg-pixel-darker/50">
          <p className="text-sm text-pixel-light/70 text-center mb-2">
            沒有邀請碼？
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/pricing" className="text-sm text-pixel-primary hover:text-pixel-accent">
              購買邀請碼
            </Link>
            <span className="text-pixel-light/30">|</span>
            <button 
              onClick={onBack}
              className="text-sm text-pixel-accent hover:text-pixel-primary"
            >
              觀看廣告註冊
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 注册表单组件
function RegisterForm({ formData, setFormData, method, onBack }: unknown) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 处理注册逻辑
    console.log('Register:', formData, method)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 用户名 */}
      <div>
        <label className="block text-sm text-pixel-light/70 mb-2">
          <User className="inline mr-1" size={14} />
          用戶名
        </label>
        <input 
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="選擇你的用戶名"
          className="input-pixel"
          required
        />
      </div>

      {/* 邮箱 */}
      <div>
        <label className="block text-sm text-pixel-light/70 mb-2">
          <Mail className="inline mr-1" size={14} />
          電子郵箱
        </label>
        <input 
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="your@email.com"
          className="input-pixel"
          required
        />
      </div>

      {/* 密码 */}
      <div>
        <label className="block text-sm text-pixel-light/70 mb-2">
          <Lock className="inline mr-1" size={14} />
          密碼
        </label>
        <input 
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="至少 8 個字符"
          className="input-pixel"
          required
        />
      </div>

      {/* 提交按钮 */}
      <button type="submit" className="btn-pixel w-full">
        完成註冊
      </button>

      {/* 奖励提示 */}
      <div className="text-center text-sm text-pixel-accent font-mono">
        註冊成功後獲得 {method === 'invite' ? '150' : '100' 積分
      </div>
    </form>
  )
}
