"use client";

import { motion } from "framer-motion";

export function PipelineSVG() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto my-12"
    >
      <svg viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border-subtle)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="800" height="200" fill="url(#grid)" opacity="0.3" rx="12" />

        {/* Flow line */}
        <motion.path
          d="M 80 100 L 720 100"
          stroke="url(#flowGrad)"
          strokeWidth="2"
          strokeDasharray="8 4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Node 1: Input */}
        <g>
          <rect x="30" y="60" width="100" height="80" rx="12" fill="#8b5cf620" stroke="#8b5cf6" strokeWidth="1.5" />
          <text x="80" y="90" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="bold" fontFamily="monospace">📚 INPUT</text>
          <text x="80" y="110" textAnchor="middle" fill="var(--muted)" fontSize="9" fontFamily="sans-serif">1000+ Books</text>
          <text x="80" y="125" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8" fontFamily="sans-serif">PDF · EPUB · TXT</text>
        </g>

        {/* Arrow 1 */}
        <polygon points="140,100 150,95 150,105" fill="#8b5cf6" opacity="0.8" />

        {/* Node 2: Distill */}
        <g>
          <rect x="170" y="60" width="100" height="80" rx="12" fill="#3b82f620" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="220" y="90" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="bold" fontFamily="monospace">🧠 DISTILL</text>
          <text x="220" y="110" textAnchor="middle" fill="var(--muted)" fontSize="9" fontFamily="sans-serif">LangChain</text>
          <text x="220" y="125" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8" fontFamily="sans-serif">Chunk + Embed</text>
        </g>

        {/* Arrow 2 */}
        <polygon points="280,100 290,95 290,105" fill="#3b82f6" opacity="0.8" />

        {/* Node 3: Vector Store */}
        <g>
          <rect x="310" y="60" width="100" height="80" rx="12" fill="#22c55e20" stroke="#22c55e" strokeWidth="1.5" />
          <text x="360" y="90" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold" fontFamily="monospace">💾 VECTOR</text>
          <text x="360" y="110" textAnchor="middle" fill="var(--muted)" fontSize="9" fontFamily="sans-serif">MongoDB Atlas</text>
          <text x="360" y="125" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8" fontFamily="sans-serif">HNSW Index</text>
        </g>

        {/* Arrow 3 */}
        <polygon points="420,100 430,95 430,105" fill="#22c55e" opacity="0.8" />

        {/* Node 4: Route */}
        <g>
          <rect x="450" y="60" width="100" height="80" rx="12" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="500" y="90" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">🎯 ROUTE</text>
          <text x="500" y="110" textAnchor="middle" fill="var(--muted)" fontSize="9" fontFamily="sans-serif">Semantic Router</text>
          <text x="500" y="125" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8" fontFamily="sans-serif">Intent Classify</text>
        </g>

        {/* Arrow 4 */}
        <polygon points="560,100 570,95 570,105" fill="#f59e0b" opacity="0.8" />

        {/* Node 5: Generate */}
        <g>
          <rect x="590" y="60" width="120" height="80" rx="12" fill="#ef444420" stroke="#ef4444" strokeWidth="1.5" />
          <text x="650" y="90" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold" fontFamily="monospace">✨ GENERATE</text>
          <text x="650" y="110" textAnchor="middle" fill="var(--muted)" fontSize="9" fontFamily="sans-serif">Gemini · Grok</text>
          <text x="650" y="125" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8" fontFamily="sans-serif">Multi-Modal Output</text>
        </g>

        {/* Decorative dots */}
        <circle cx="155" cy="100" r="3" fill="#8b5cf6" opacity="0.6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="295" cy="100" r="3" fill="#3b82f6" opacity="0.6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="0.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="435" cy="100" r="3" fill="#22c55e" opacity="0.6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="0.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="575" cy="100" r="3" fill="#f59e0b" opacity="0.6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="1.2s" repeatCount="indefinite" />
        </circle>

        {/* Top label */}
        <text x="400" y="30" textAnchor="middle" fill="var(--muted-foreground)" fontSize="10" fontFamily="monospace" letterSpacing="3">
          KNOWLEDGE DISTILLATION PIPELINE
        </text>

        {/* Bottom stats */}
        <text x="80" y="170" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8">1000+ docs</text>
        <text x="220" y="170" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8">99.5% fidelity</text>
        <text x="360" y="170" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8">2.4M vectors</text>
        <text x="500" y="170" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8">&lt;5ms latency</text>
        <text x="650" y="170" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8">multi-modal</text>
      </svg>
    </motion.div>
  );
}

export function EcosystemSVG() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-3xl mx-auto my-12"
    >
      <svg viewBox="0 0 600 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <defs>
          <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border-subtle)" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="600" height="320" fill="url(#grid2)" opacity="0.2" rx="12" />

        {/* Center hub */}
        <circle cx="300" cy="160" r="50" fill="var(--primary)" opacity="0.1" stroke="var(--primary)" strokeWidth="1.5" />
        <circle cx="300" cy="160" r="35" fill="var(--primary)" opacity="0.05" />
        <text x="300" y="155" textAnchor="middle" fill="var(--primary)" fontSize="12" fontWeight="bold" fontFamily="monospace">OECE</text>
        <text x="300" y="172" textAnchor="middle" fill="var(--primary)" fontSize="9" fontFamily="monospace" opacity="0.7">.tech</text>

        {/* Orbiting nodes */}
        {/* AI Infrastructure - top */}
        <line x1="300" y1="110" x2="300" y2="55" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
        <rect x="245" y="15" width="110" height="40" rx="8" fill="#3b82f620" stroke="#3b82f6" strokeWidth="1" />
        <text x="300" y="33" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold">🤖 AI Engine</text>
        <text x="300" y="47" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8">Gemini · Grok · Claude</text>

        {/* Security - right */}
        <line x1="350" y1="160" x2="430" y2="160" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
        <rect x="430" y="140" width="110" height="40" rx="8" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
        <text x="485" y="158" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">🛡️ Security</text>
        <text x="485" y="172" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8">Red/Blue Team</text>

        {/* Knowledge - bottom */}
        <line x1="300" y1="210" x2="300" y2="260" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
        <rect x="240" y="260" width="120" height="40" rx="8" fill="#8b5cf620" stroke="#8b5cf6" strokeWidth="1" />
        <text x="300" y="278" textAnchor="middle" fill="#8b5cf6" fontSize="10" fontWeight="bold">📚 Knowledge</text>
        <text x="300" y="292" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8">1000+ Distilled Books</text>

        {/* Dev Tools - left */}
        <line x1="250" y1="160" x2="170" y2="160" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
        <rect x="60" y="140" width="110" height="40" rx="8" fill="#22c55e20" stroke="#22c55e" strokeWidth="1" />
        <text x="115" y="158" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">🔧 Dev Tools</text>
        <text x="115" y="172" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8">MCP · CLI · APIs</text>

        {/* Corner badges */}
        <rect x="60" y="30" width="80" height="28" rx="6" fill="#f59e0b10" stroke="#f59e0b" strokeWidth="0.8" />
        <text x="100" y="48" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold">🔮 Divination</text>

        <rect x="460" y="30" width="80" height="28" rx="6" fill="#06b6d410" stroke="#06b6d4" strokeWidth="0.8" />
        <text x="500" y="48" textAnchor="middle" fill="#06b6d4" fontSize="8" fontWeight="bold">🤝 Community</text>

        <rect x="60" y="265" width="80" height="28" rx="6" fill="#ec489910" stroke="#ec4899" strokeWidth="0.8" />
        <text x="100" y="283" textAnchor="middle" fill="#ec4899" fontSize="8" fontWeight="bold">🎨 Creative</text>

        <rect x="460" y="265" width="80" height="28" rx="6" fill="#14b8a610" stroke="#14b8a6" strokeWidth="0.8" />
        <text x="500" y="283" textAnchor="middle" fill="#14b8a6" fontSize="8" fontWeight="bold">📱 Telegram</text>

        {/* Connecting lines to corners */}
        <line x1="265" y1="130" x2="140" y2="55" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="335" y1="130" x2="460" y2="55" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="265" y1="190" x2="140" y2="268" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="335" y1="190" x2="460" y2="268" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3 3" />

        {/* Animated orbital ring */}
        <circle cx="300" cy="160" r="70" fill="none" stroke="var(--primary)" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 6">
          <animateTransform attributeName="transform" type="rotate" from="0 300 160" to="360 300 160" dur="30s" repeatCount="indefinite" />
        </circle>
      </svg>
    </motion.div>
  );
}
