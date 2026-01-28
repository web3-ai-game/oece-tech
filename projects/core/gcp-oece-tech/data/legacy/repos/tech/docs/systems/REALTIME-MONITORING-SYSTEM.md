# 实时监控与测速系统

## 核心功能：实时VPN评测 + 全球节点测速 + 匿名化友链

---

## 一、实时节点监控面板

### 监控数据结构

```typescript
interface NodeStatus {
  id: string
  name: string           // 节点名称（使用黑话）
  realName: string       // 实际名称（内部使用）
  location: string       // 地理位置
  provider: string       // 服务商
  status: 'online' | 'offline' | 'slow' | 'busy'
  latency: number        // 延迟(ms)
  speed: {
    download: number     // 下载速度(Mbps)
    upload: number       // 上传速度(Mbps)
  }
  load: number          // 负载(%)
  uptime: number        // 在线时间(%)
  lastCheck: Date       // 最后检测时间
  score: number         // 综合评分(0-100)
}
```

### 实时监控页面

```tsx
// app/monitor/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { SpeedTestWidget } from '@/components/monitor/SpeedTestWidget'
import { NodeMap } from '@/components/monitor/NodeMap'

export default function MonitorPage() {
  const [nodes, setNodes] = useState<NodeStatus[]>([])
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [testResults, setTestResults] = useState<any[]>([])
  
  // WebSocket连接实时数据
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!)
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'nodeUpdate') {
        setNodes(data.nodes)
      } else if (data.type === 'speedTest') {
        setTestResults(prev => [...prev, data.result])
      }
    }
    
    return () => ws.close()
  }, [])
  
  // 按地区分组
  const groupedNodes = nodes.reduce((acc, node) => {
    const region = getRegion(node.location)
    if (!acc[region]) acc[region] = []
    acc[region].push(node)
    return acc
  }, {} as Record<string, NodeStatus[]>)
  
  return (
    <div className="min-h-screen bg-[#0D0221] p-6">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <h1 className="text-5xl font-bold text-center mb-12"
            style={{
              background: 'linear-gradient(135deg, #05FFA1, #01CDFE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
          全球传送点实时监控
        </h1>
        
        {/* 地区选择器 */}
        <div className="flex justify-center gap-4 mb-8">
          {['all', 'asia', 'america', 'europe'].map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-6 py-2 font-['VT323'] text-lg transition-all
                ${selectedRegion === region 
                  ? 'bg-[#05FFA1] text-[#0D0221]' 
                  : 'bg-[#1A0E2E] text-[#FFFB96] hover:bg-[#2D1B3D]'
                }`}
            >
              {region === 'all' ? '全部' : 
               region === 'asia' ? '亚太' :
               region === 'america' ? '美洲' : '欧洲'}
            </button>
          ))}
        </div>
        
        {/* 实时状态卡片 */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {(selectedRegion === 'all' ? nodes : groupedNodes[selectedRegion] || [])
            .sort((a, b) => b.score - a.score)
            .slice(0, 12)
            .map(node => (
              <NodeCard key={node.id} node={node} />
            ))}
        </div>
        
        {/* 速度测试工具 */}
        <SpeedTestWidget onTestComplete={(result) => {
          // 上传测试结果
          uploadTestResult(result)
        }} />
        
        {/* 实时地图 */}
        <NodeMap nodes={nodes} />
      </div>
    </div>
  )
}

// 节点卡片组件
function NodeCard({ node }: { node: NodeStatus }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return '#05FFA1'
      case 'slow': return '#FFAA00'
      case 'busy': return '#FF71CE'
      case 'offline': return '#FF3366'
      default: return '#808080'
    }
  }
  
  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'S'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    return 'D'
  }
  
  return (
    <div className="bg-[#1A0E2E] border-2 border-[#05FFA1] p-4 hover:border-[#01CDFE] transition-all">
      {/* 头部 */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-[#05FFA1]">{node.name}</h3>
          <p className="text-xs text-[#808080]">{node.location}</p>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: getStatusColor(node.status) }}
          />
          <span className="text-2xl font-bold text-[#FFFB96]">
            {getScoreGrade(node.score)}
          </span>
        </div>
      </div>
      
      {/* 数据 */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[#808080]">延迟</span>
          <span className="text-[#05FFA1] font-mono">{node.latency}ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#808080]">下载</span>
          <span className="text-[#01CDFE] font-mono">{node.speed.download}Mbps</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#808080]">负载</span>
          <div className="flex items-center gap-2">
            <div className="w-20 bg-[#2D1B3D] h-2 rounded-full">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-[#05FFA1] to-[#FF71CE]"
                style={{ width: `${node.load}%` }}
              />
            </div>
            <span className="text-[#FFFB96] font-mono text-xs">{node.load}%</span>
          </div>
        </div>
      </div>
      
      {/* 测速按钮 */}
      <button className="w-full mt-3 py-2 bg-[#05FFA1]/20 border border-[#05FFA1] text-[#05FFA1] hover:bg-[#05FFA1] hover:text-[#0D0221] transition-all text-sm font-bold">
        立即测速
      </button>
    </div>
  )
}
```

---

## 二、智能测速系统

### 测速核心模块

```typescript
// lib/speed-test.ts

export class SpeedTest {
  private testServers: TestServer[] = []
  private currentTest: TestInstance | null = null
  
  // 初始化测试服务器
  async initialize() {
    this.testServers = await this.fetchTestServers()
  }
  
  // 开始测速
  async startTest(nodeId?: string): Promise<TestResult> {
    const server = nodeId 
      ? this.testServers.find(s => s.id === nodeId)
      : await this.findBestServer()
    
    if (!server) throw new Error('No test server available')
    
    this.currentTest = new TestInstance(server)
    
    // 执行测试步骤
    const results = {
      ping: await this.testPing(server),
      download: await this.testDownload(server),
      upload: await this.testUpload(server),
      jitter: await this.testJitter(server),
      packetLoss: await this.testPacketLoss(server)
    }
    
    // 计算综合评分
    const score = this.calculateScore(results)
    
    return {
      ...results,
      score,
      server,
      timestamp: new Date(),
      id: generateTestId()
    }
  }
  
  // Ping测试
  private async testPing(server: TestServer): Promise<number> {
    const samples = []
    
    for (let i = 0; i < 10; i++) {
      const start = performance.now()
      await fetch(`${server.url}/ping`, { method: 'HEAD' })
      const end = performance.now()
      samples.push(end - start)
    }
    
    // 返回中位数
    samples.sort((a, b) => a - b)
    return samples[Math.floor(samples.length / 2)]
  }
  
  // 下载测试
  private async testDownload(server: TestServer): Promise<number> {
    const chunks = []
    const testDuration = 10000 // 10秒
    const startTime = Date.now()
    
    while (Date.now() - startTime < testDuration) {
      const chunkStart = performance.now()
      const response = await fetch(`${server.url}/download?size=10MB`)
      const data = await response.blob()
      const chunkEnd = performance.now()
      
      const speed = (data.size * 8) / ((chunkEnd - chunkStart) / 1000) / 1000000 // Mbps
      chunks.push(speed)
    }
    
    // 返回平均速度
    return chunks.reduce((a, b) => a + b, 0) / chunks.length
  }
  
  // 上传测试
  private async testUpload(server: TestServer): Promise<number> {
    const testData = new Blob([new ArrayBuffer(5 * 1024 * 1024)]) // 5MB
    const chunks = []
    const iterations = 5
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now()
      await fetch(`${server.url}/upload`, {
        method: 'POST',
        body: testData
      })
      const end = performance.now()
      
      const speed = (testData.size * 8) / ((end - start) / 1000) / 1000000 // Mbps
      chunks.push(speed)
    }
    
    return chunks.reduce((a, b) => a + b, 0) / chunks.length
  }
  
  // 计算综合评分
  private calculateScore(results: any): number {
    let score = 100
    
    // 延迟评分 (0-30分)
    if (results.ping > 100) score -= 10
    if (results.ping > 200) score -= 10
    if (results.ping > 300) score -= 10
    
    // 下载速度评分 (0-40分)
    if (results.download < 10) score -= 20
    if (results.download < 5) score -= 10
    if (results.download < 1) score -= 10
    
    // 上传速度评分 (0-20分)
    if (results.upload < 5) score -= 10
    if (results.upload < 1) score -= 10
    
    // 稳定性评分 (0-10分)
    if (results.jitter > 50) score -= 5
    if (results.packetLoss > 1) score -= 5
    
    return Math.max(0, score)
  }
}
```

### 测速组件

```tsx
// components/monitor/SpeedTestWidget.tsx

'use client'

import { useState } from 'react'
import { SpeedTest } from '@/lib/speed-test'

export function SpeedTestWidget({ onTestComplete }: { onTestComplete: (result: any) => void }) {
  const [testing, setTesting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState('')
  const [results, setResults] = useState<any>(null)
  
  const startTest = async () => {
    setTesting(true)
    setProgress(0)
    setResults(null)
    
    const speedTest = new SpeedTest()
    await speedTest.initialize()
    
    // 测试阶段
    const phases = [
      { name: '检测延迟', weight: 20 },
      { name: '测试下载', weight: 40 },
      { name: '测试上传', weight: 30 },
      { name: '分析稳定性', weight: 10 }
    ]
    
    let totalProgress = 0
    
    for (const phase of phases) {
      setCurrentPhase(phase.name)
      
      // 模拟进度
      for (let i = 0; i < phase.weight; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        totalProgress++
        setProgress(totalProgress)
      }
    }
    
    // 获取结果
    const result = await speedTest.startTest()
    setResults(result)
    onTestComplete(result)
    setTesting(false)
  }
  
  return (
    <div className="bg-[#1A0E2E] border-2 border-[#01CDFE] p-8 mb-8">
      <h2 className="text-3xl text-[#01CDFE] mb-6 text-center font-['VT323']">
        智能测速系统
      </h2>
      
      {!testing && !results && (
        <div className="text-center">
          <button
            onClick={startTest}
            className="px-12 py-4 bg-gradient-to-r from-[#05FFA1] to-[#01CDFE] text-[#0D0221] font-bold text-xl hover:shadow-[0_0_40px_#05FFA1] transition-all"
          >
            开始测速
          </button>
          <p className="mt-4 text-[#808080]">
            测试您当前的网络连接质量
          </p>
        </div>
      )}
      
      {testing && (
        <div className="space-y-4">
          <div className="text-center text-2xl text-[#05FFA1] mb-4">
            {currentPhase}...
          </div>
          
          {/* 进度条 */}
          <div className="w-full bg-[#2D1B3D] h-8 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#05FFA1] to-[#01CDFE] transition-all duration-300 flex items-center justify-center"
              style={{ width: `${progress}%` }}
            >
              <span className="text-[#0D0221] font-bold">{progress}%</span>
            </div>
          </div>
          
          {/* 实时数据 */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-3xl text-[#05FFA1] font-['VT323'] animate-pulse">
                --
              </div>
              <div className="text-sm text-[#808080]">延迟</div>
            </div>
            <div className="text-center">
              <div className="text-3xl text-[#01CDFE] font-['VT323'] animate-pulse">
                --
              </div>
              <div className="text-sm text-[#808080]">下载</div>
            </div>
            <div className="text-center">
              <div className="text-3xl text-[#FF71CE] font-['VT323'] animate-pulse">
                --
              </div>
              <div className="text-sm text-[#808080]">上传</div>
            </div>
          </div>
        </div>
      )}
      
      {results && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {results.score >= 90 ? '🏆' : 
               results.score >= 70 ? '⭐' : 
               results.score >= 50 ? '✓' : '⚠️'}
            </div>
            <div className="text-4xl text-[#05FFA1] font-bold mb-2">
              综合评分: {results.score}
            </div>
          </div>
          
          {/* 详细结果 */}
          <div className="grid grid-cols-3 gap-4">
            <ResultCard
              label="延迟"
              value={`${results.ping}ms`}
              color="#05FFA1"
              grade={results.ping < 50 ? 'A' : results.ping < 100 ? 'B' : 'C'}
            />
            <ResultCard
              label="下载速度"
              value={`${results.download.toFixed(1)}Mbps`}
              color="#01CDFE"
              grade={results.download > 50 ? 'A' : results.download > 10 ? 'B' : 'C'}
            />
            <ResultCard
              label="上传速度"
              value={`${results.upload.toFixed(1)}Mbps`}
              color="#FF71CE"
              grade={results.upload > 20 ? 'A' : results.upload > 5 ? 'B' : 'C'}
            />
          </div>
          
          {/* 操作按钮 */}
          <div className="flex justify-center gap-4">
            <button
              onClick={startTest}
              className="px-6 py-2 bg-[#05FFA1] text-[#0D0221] font-bold hover:shadow-[0_0_20px_#05FFA1]"
            >
              重新测试
            </button>
            <button className="px-6 py-2 border-2 border-[#01CDFE] text-[#01CDFE] font-bold hover:bg-[#01CDFE] hover:text-[#0D0221]">
              分享结果
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// 结果卡片
function ResultCard({ label, value, color, grade }: any) {
  return (
    <div className="bg-[#2D1B3D] p-4 rounded border-2" style={{ borderColor: color }}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-[#808080]">{label}</span>
        <span className="text-lg font-bold" style={{ color }}>{grade}</span>
      </div>
      <div className="text-2xl font-['VT323']" style={{ color }}>
        {value}
      </div>
    </div>
  )
}
```

---

## 三、匿名化友情链接

### 友链数据

```typescript
// data/anonymous-links.ts

export const ANONYMOUS_LINKS = {
  tools: [
    {
      name: '隐私检测器',
      url: 'https://example.com/privacy-check',
      description: '检测您的网络隐私泄露',
      category: 'privacy',
      icon: '🔒'
    },
    {
      name: '指纹测试',
      url: 'https://example.com/fingerprint',
      description: '浏览器指纹检测',
      category: 'privacy',
      icon: '🔍'
    },
    {
      name: 'IP查询',
      url: 'https://example.com/ip-check',
      description: '查看您的真实IP',
      category: 'network',
      icon: '🌍'
    },
    {
      name: 'DNS泄露测试',
      url: 'https://example.com/dns-leak',
      description: '检测DNS泄露',
      category: 'network',
      icon: '🛡️'
    },
    {
      name: 'WebRTC测试',
      url: 'https://example.com/webrtc',
      description: 'WebRTC泄露检测',
      category: 'privacy',
      icon: '📡'
    }
  ],
  
  resources: [
    {
      name: '隐私工具箱',
      url: 'https://example.com/privacy-tools',
      description: '各类隐私保护工具',
      category: 'tools',
      icon: '🧰'
    },
    {
      name: '加密通讯',
      url: 'https://example.com/encrypted-chat',
      description: '端到端加密聊天',
      category: 'communication',
      icon: '💬'
    },
    {
      name: '匿名邮箱',
      url: 'https://example.com/anon-email',
      description: '临时匿名邮箱服务',
      category: 'communication',
      icon: '📧'
    }
  ],
  
  communities: [
    {
      name: '隐私社区',
      url: 'https://example.com/privacy-forum',
      description: '隐私保护讨论区',
      category: 'forum',
      icon: '👥'
    },
    {
      name: '技术论坛',
      url: 'https://example.com/tech-forum',
      description: '技术交流社区',
      category: 'forum',
      icon: '💻'
    }
  ]
}
```

### 友链页面

```tsx
// app/links/page.tsx

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-[#0D0221] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12"
            style={{
              background: 'linear-gradient(135deg, #05FFA1, #01CDFE, #FF71CE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
          隐私工具导航
        </h1>
        
        {/* 工具链接 */}
        <section className="mb-12">
          <h2 className="text-2xl text-[#05FFA1] mb-6">检测工具</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ANONYMOUS_LINKS.tools.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A0E2E] border border-[#05FFA1] p-4 hover:border-[#01CDFE] hover:shadow-[0_0_20px_#05FFA1] transition-all group"
              >
                <div className="text-3xl mb-2">{link.icon}</div>
                <h3 className="text-[#05FFA1] font-bold mb-1 group-hover:text-[#01CDFE]">
                  {link.name}
                </h3>
                <p className="text-xs text-[#808080]">{link.description}</p>
              </a>
            ))}
          </div>
        </section>
        
        {/* 资源链接 */}
        <section className="mb-12">
          <h2 className="text-2xl text-[#01CDFE] mb-6">隐私资源</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ANONYMOUS_LINKS.resources.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A0E2E] border border-[#01CDFE] p-4 hover:border-[#FF71CE] hover:shadow-[0_0_20px_#01CDFE] transition-all group"
              >
                <div className="text-3xl mb-2">{link.icon}</div>
                <h3 className="text-[#01CDFE] font-bold mb-1 group-hover:text-[#FF71CE]">
                  {link.name}
                </h3>
                <p className="text-xs text-[#808080]">{link.description}</p>
              </a>
            ))}
          </div>
        </section>
        
        {/* 社区链接 */}
        <section>
          <h2 className="text-2xl text-[#FF71CE] mb-6">友好社区</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ANONYMOUS_LINKS.communities.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A0E2E] border border-[#FF71CE] p-6 hover:border-[#05FFA1] hover:shadow-[0_0_20px_#FF71CE] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{link.icon}</div>
                  <div>
                    <h3 className="text-[#FF71CE] font-bold mb-1 group-hover:text-[#05FFA1]">
                      {link.name}
                    </h3>
                    <p className="text-sm text-[#808080]">{link.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
```

---

## 四、综合数据API

```typescript
// app/api/monitor/nodes/route.ts

export async function GET() {
  // 获取所有节点状态
  const nodes = await getNodesStatus()
  
  // 按评分排序
  nodes.sort((a, b) => b.score - a.score)
  
  return NextResponse.json({
    nodes,
    summary: {
      total: nodes.length,
      online: nodes.filter(n => n.status === 'online').length,
      avgLatency: nodes.reduce((acc, n) => acc + n.latency, 0) / nodes.length,
      avgSpeed: nodes.reduce((acc, n) => acc + n.speed.download, 0) / nodes.length
    }
  })
}

// app/api/speedtest/route.ts

export async function POST(req: Request) {
  const { nodeId } = await req.json()
  
  const speedTest = new SpeedTest()
  await speedTest.initialize()
  
  const result = await speedTest.startTest(nodeId)
  
  // 保存结果
  await saveTestResult(result)
  
  // 返回结果
  return NextResponse.json(result)
}
```

---

**实时监控系统完成！**

系统已包含：
- 全球节点实时监控
- 智能测速系统
- 匿名化友链导航
- 完整API接口

准备推送到GitHub...
