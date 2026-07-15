import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'

interface TTabItem {
  id: string
  i18n?: string
  label?: string
  durationRequired?: boolean
}

interface TDurationItem {
  value: string
  i18n?: string
  label: string
}

export type TTrendingStore = {
  tabId: string
  tabs: Array<TTabItem>

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
  tabs: [
    { id: 'bias_radar', i18n: 'trending.biasRadar' },
    { id: 'net_flow', i18n: 'trending.netFlow' },
    { id: 'oi', i18n: 'trending.openInterest' },
    { id: 'depth', i18n: 'trending.depth' },
    { id: 'rates', i18n: 'trending.fundingRates' },
    { id: 'price', i18n: 'trending.priceMovers' },
    { id: 'ai500', i18n: 'trending.ai500' },
    { id: 'prediction', i18n: 'trending.prediction' },
    { id: 'hl_perp', i18n: 'trending.hlPerp' },
    { id: 'hl_spot', i18n: 'trending.hlSpot' },
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
