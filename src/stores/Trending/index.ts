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

  topList: Array<Record<string, any>>
  lowList: Array<Record<string, any>>

  reset: () => void
}

const DEFAULT = {
  tabId: 'net_flow',
  tabs: [
    { id: 'net_flow', i18n: 'trending.netFlow' },
    { id: 'oi', i18n: 'trending.openInterest' },
    { id: 'depth', i18n: 'trending.depth' },
    { id: 'rates', i18n: 'trending.fundingRates' },
    { id: 'price', i18n: 'trending.priceMovers' },
  ],

  duration: '24h',
  durations: [
    { value: '1h', label: '1H' },
    { value: '4h', label: '4H' },
    { value: '12h', label: '12H' },
    { value: '24h', label: '24H' },
  ],

  limit: 50,

  topList: [],
  lowList: [],
}

const trendingStore: TTrendingStore = {
  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useTrendingStore = createStore<TTrendingStore>(trendingStore)
