import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'

interface TTabItem {
  id: string
  i18n?: string
  label?: string
  durationRequired?: boolean
  group?: 'radar' | 'crypto' | 'stock'
}

interface TDurationItem {
  value: string
  i18n?: string
  label: string
}

export type TTrendingStore = {
  tabId: string
  tabs: Array<TTabItem>
  group: 'radar' | 'crypto' | 'stock'

  duration: string
  durations: Array<TDurationItem>

  limit: number

  // 牛熊雷达（bullish/bearish 双榜）
  radarList: Array<Record<string, any>>

  topList: Array<Record<string, any>>
  lowList: Array<Record<string, any>>

  // AI500 / 预测市场（单列表）
  categoryList: Array<Record<string, any>>

  // HyperLiquid 合约 / 现货（单列表）
  hlList: Array<Record<string, any>>

  reset: () => void
}

const DEFAULT = {
  // bias_radar 作为优先重点展示，放在第一位
  tabId: 'bias_radar',
  group: 'radar' as 'radar' | 'crypto' | 'stock',
  tabs: [
    { id: 'bias_radar', i18n: 'trending.biasRadar', group: 'radar' as const },
    { id: 'net_flow', i18n: 'trending.netFlow', group: 'crypto' as const },
    { id: 'oi', i18n: 'trending.openInterest', group: 'crypto' as const },
    { id: 'depth', i18n: 'trending.depth', group: 'crypto' as const },
    { id: 'rates', i18n: 'trending.fundingRates', group: 'crypto' as const },
    { id: 'price', i18n: 'trending.priceMovers', group: 'crypto' as const },
    { id: 'ai500', i18n: 'trending.ai500', group: 'stock' as const },
    { id: 'prediction', i18n: 'trending.prediction', group: 'stock' as const },
    { id: 'hl_perp', i18n: 'trending.hlPerp', group: 'crypto' as const },
    { id: 'hl_spot', i18n: 'trending.hlSpot', group: 'crypto' as const },
  ],

  duration: '24h',
  durations: [
    { value: '1h', label: '1H' },
    { value: '4h', label: '4H' },
    { value: '12h', label: '12H' },
    { value: '24h', label: '24H' },
  ],

  limit: 50,

  radarList: [],

  topList: [],
  lowList: [],

  categoryList: [],

  hlList: [],
}

const trendingStore: TTrendingStore = {
  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useTrendingStore = createStore<TTrendingStore>(trendingStore)
