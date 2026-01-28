import React, { useEffect, useRef } from 'react';

/**
 * AnimatedVisual Component
 * 动态SVG视觉元素，象征知识流动和代码构建
 * 包含多层动画效果：节点连接、粒子流动、脉冲效果
 */
const AnimatedVisual: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // 添加鼠标跟随效果
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      
      const rect = svgRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // 更新CSS变量用于交互效果
      svgRef.current.style.setProperty('--mouse-x', `${x}%`);
      svgRef.current.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 主SVG容器 */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 渐变定义 */}
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8">
              <animate attributeName="stop-color" values="#a855f7;#ec4899;#a855f7" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8">
              <animate attributeName="stop-color" values="#ec4899;#a855f7;#ec4899" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
          </linearGradient>

          {/* 光晕滤镜 */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 模糊滤镜 */}
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>

        {/* 背景网格线 */}
        <g className="opacity-20">
          {[...Array(8)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 50 + 50}
              x2="400"
              y2={i * 50 + 50}
              stroke="url(#gradient2)"
              strokeWidth="0.5"
              strokeDasharray="5,5"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="10"
                dur="20s"
                repeatCount="indefinite"
              />
            </line>
          ))}
          {[...Array(8)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 50 + 50}
              y1="0"
              x2={i * 50 + 50}
              y2="400"
              stroke="url(#gradient2)"
              strokeWidth="0.5"
              strokeDasharray="5,5"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="10"
                dur="20s"
                repeatCount="indefinite"
              />
            </line>
          ))}
        </g>

        {/* 主要连接线 */}
        <g className="opacity-60">
          {/* 中心到各节点的连接线 */}
          <path
            d="M200,200 L100,100 M200,200 L300,100 M200,200 L300,300 M200,200 L100,300"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
            strokeDasharray="200"
            strokeDashoffset="0"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="200"
              to="0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>

          {/* 节点间的连接线 */}
          <path
            d="M100,100 L300,100 L300,300 L100,300 Z"
            stroke="url(#gradient2)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="5,10"
            opacity="0.5"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="15"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* 流动的粒子路径 */}
        <g>
          {/* 粒子路径1 */}
          <circle r="3" fill="#a855f7" filter="url(#glow)">
            <animateMotion
              path="M100,100 Q200,50 300,100 T300,300 T100,300 T100,100"
              dur="8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>

          {/* 粒子路径2 */}
          <circle r="2" fill="#ec4899" filter="url(#glow)">
            <animateMotion
              path="M300,100 Q350,200 300,300 T100,300 T100,100 T300,100"
              dur="10s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="10s"
              repeatCount="indefinite"
            />
          </circle>

          {/* 粒子路径3 */}
          <circle r="2.5" fill="#3b82f6" filter="url(#glow)">
            <animateMotion
              path="M200,50 Q250,200 200,350 T100,200 T200,50"
              dur="6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* 主要节点 */}
        <g>
          {/* 中心核心节点 */}
          <g transform="translate(200, 200)">
            <circle r="15" fill="url(#gradient1)" filter="url(#glow)">
              <animate
                attributeName="r"
                values="15;18;15"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="8" fill="#1f2937" />
            <circle r="5" fill="#a855f7">
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* 周围节点 */}
          {[
            { x: 100, y: 100, delay: '0s' },
            { x: 300, y: 100, delay: '0.5s' },
            { x: 300, y: 300, delay: '1s' },
            { x: 100, y: 300, delay: '1.5s' },
          ].map((node, i) => (
            <g key={i} transform={`translate(${node.x}, ${node.y})`}>
              <circle r="10" fill="url(#gradient2)" opacity="0.6" filter="url(#glow)">
                <animate
                  attributeName="r"
                  values="10;12;10"
                  dur="3s"
                  begin={node.delay}
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="5" fill="#1f2937" />
              <circle r="3" fill="#8b5cf6">
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="3s"
                  begin={node.delay}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </g>

        {/* 装饰性元素 - 代码符号 */}
        <g className="opacity-40" fontFamily="monospace" fontSize="12" fill="#a855f7">
          <text x="80" y="80">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="4s"
              repeatCount="indefinite"
            />
            {'</>'}
          </text>
          <text x="280" y="80">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="4s"
              begin="1s"
              repeatCount="indefinite"
            />
            {'{ }'}
          </text>
          <text x="280" y="320">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="4s"
              begin="2s"
              repeatCount="indefinite"
            />
            {'[ ]'}
          </text>
          <text x="80" y="320">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="4s"
              begin="3s"
              repeatCount="indefinite"
            />
            {'( )'}
          </text>
        </g>

        {/* 轨道圆环 */}
        <g transform="translate(200, 200)">
          <circle
            r="120"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="0.5"
            opacity="0.3"
            strokeDasharray="10,5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="30s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            r="80"
            fill="none"
            stroke="url(#gradient2)"
            strokeWidth="0.5"
            opacity="0.3"
            strokeDasharray="5,10"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 0 0"
              to="0 0 0"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>

      {/* 额外的装饰光效 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default AnimatedVisual;
