import { NodeLocation } from '@/types/map'

// 東南亞數字遊民熱點節點
export const SOUTHEAST_ASIA_NODES: NodeLocation[] = [
  {
    id: 'bkk-1',
    name: 'Bangkok Node',
    country: 'Thailand',
    lat: 13.7563,
    lng: 100.5018,
    status: 'online',
    arbitrageScore: 8.5,
    costOfLiving: 1200,
    internetSpeed: 250,
    community: 9,
    description: 'Digital nomad hub with vibrant tech scene'
  },
  {
    id: 'cmi-1',
    name: 'Chiang Mai Node',
    country: 'Thailand',
    lat: 18.7883,
    lng: 98.9853,
    status: 'online',
    arbitrageScore: 9.2,
    costOfLiving: 800,
    internetSpeed: 200,
    community: 10,
    description: 'Ultimate digital nomad paradise'
  },
  {
    id: 'sgn-1',
    name: 'Ho Chi Minh City Node',
    country: 'Vietnam',
    lat: 10.8231,
    lng: 106.6297,
    status: 'online',
    arbitrageScore: 8.8,
    costOfLiving: 900,
    internetSpeed: 180,
    community: 8,
    description: 'Fast-growing tech ecosystem'
  },
  {
    id: 'han-1',
    name: 'Hanoi Node',
    country: 'Vietnam',
    lat: 21.0285,
    lng: 105.8542,
    status: 'online',
    arbitrageScore: 8.3,
    costOfLiving: 850,
    internetSpeed: 170,
    community: 7,
    description: 'Cultural hub with growing remote work scene'
  },
  {
    id: 'bali-1',
    name: 'Canggu Node',
    country: 'Indonesia',
    lat: -8.6481,
    lng: 115.1375,
    status: 'online',
    arbitrageScore: 7.9,
    costOfLiving: 1100,
    internetSpeed: 100,
    community: 9,
    description: 'Beach paradise for digital nomads'
  },
  {
    id: 'kl-1',
    name: 'Kuala Lumpur Node',
    country: 'Malaysia',
    lat: 3.1390,
    lng: 101.6869,
    status: 'online',
    arbitrageScore: 8.1,
    costOfLiving: 1000,
    internetSpeed: 220,
    community: 7,
    description: 'Modern city with excellent infrastructure'
  },
  {
    id: 'mnl-1',
    name: 'Manila Node',
    country: 'Philippines',
    lat: 14.5995,
    lng: 120.9842,
    status: 'unstable',
    arbitrageScore: 7.5,
    costOfLiving: 950,
    internetSpeed: 150,
    community: 6,
    description: 'Emerging tech hub with challenges'
  },
  {
    id: 'sin-1',
    name: 'Singapore Node',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    status: 'online',
    arbitrageScore: 6.2,
    costOfLiving: 3500,
    internetSpeed: 500,
    community: 8,
    description: 'Premium tech hub with high costs'
  },
]

// 地理套利熱力圖數據
export const generateHeatmapData = () => {
  return SOUTHEAST_ASIA_NODES.map(node => ({
    lat: node.lat,
    lng: node.lng,
    value: node.arbitrageScore,
    color: getArbitrageColor(node.arbitrageScore)
  }))
}

export const getArbitrageColor = (score: number): string => {
  if (score >= 9) return '#00FF41' // matrix green
  if (score >= 8) return '#00FFF0' // neon cyan
  if (score >= 7) return '#9333EA' // shadow purple
  return '#FF0080' // glitch pink
}

export const getStatusColor = (status: NodeLocation['status']): string => {
  switch (status) {
    case 'online': return '#00FF41'
    case 'offline': return '#FF0080'
    case 'unstable': return '#FFD700'
    default: return '#00FFF0'
  }
}
