import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

export * from './point-overall'
export * from './point-referral'

interface TTabItem {
  id: string
  i18n?: string
  label?: string
  disabled?: boolean
}

export type TLeaderboardStore = {
  CYCLE_KEYS: Record<string, { value: string, i18n?: string, label: string }>
  scrollY: number

  pointsTabId: string
  pointsTabs: Array<TTabItem>

  marketTabId: string
  marketTabs: Array<TTabItem>

  mainTypeValue: string
  mainTypeRadios: Array<{
    value: string
    i18n?: string
    label?: string
  }>

  pageSize: number
  cycles: Array<{
    value: string
    label: string
  }>
  selectedCycleValue: string

  profitList: Array<{
    idx: number
    totalValue: string
    address: string
    pnl: string
    pnlStatus: number
    pnlStatusClassName: string
    roi: string
    roiStatus: number
    roiStatusClassName: string
    volume: string
  }>
  profitSortColumnId: string // 当前 sort columnId
  resetProfit: () => void

  searchProfitAddressInput: string
  searchProfitAddress: string
  searchProfitList: Array<{
    idx: number
    cycle: string
    totalValue: string
    address: string
    pnl: string
    pnlStatus: number
    pnlStatusClassName: string
    roi: string
    roiStatus: number
    roiStatusClassName: string
    volume: string
  }>
  resetSearchProfit: () => void

  coinList: Array<{
    idx: number
    symbol: string
    price: string
    volume24h: string
    quoteVolume24h: string
    priceChange24h: string
    priceChange24hStatus: number
    priceChange24hClassName: string
    priceChangePercent24h: string
    funding8h: string
    funding8hStatus: number
    openInterest: string

    open24h: string
    high24h: string
    low24h: string
    close24h: string
  }>
  resetCoin: () => void

  reset: () => void
}

const CYCLE_KEYS = {
  day: { value: 'day', i18n: 'common.oneD', label: '1D' },
  week: { value: 'week', i18n: 'common.sevenD', label: '7D' },
  month: { value: 'month', i18n: 'common.thirtyD', label: '30D' },
  allTime:  { value: 'allTime', i18n: 'common.all', label: 'All' },
}

const DEFAULT_PROFIT = {
  profitList: [],
  profitSortColumnId: 'roi',
}

const DEFAULT_SEARCH_PROFIT = {
  searchProfitAddressInput: '',
  searchProfitAddress: '',
  searchProfitList: [],
}

const DEFAULT_COIN = {
  coinList: [],
}

const DEFAULT = {
  scrollY: 0,

  mainTypeValue: 'points',
  mainTypeRadios: [
    { value: 'points', i18n: 'leaderboard.pointsLeaderboard' },
    { value: 'market', i18n: 'leaderboard.marketLeaderboard' },
  ],

  pointsTabId: 'overall',
  pointsTabs: [
    { id: 'overall', i18n: 'leaderboard.overall' },
    { id: 'referral', i18n: 'leaderboard.referral' },
  ],

  marketTabId: 'profit',
  marketTabs: [
    { id: 'profit', i18n: 'common.profitList' },
    { id: 'gainer', i18n: 'common.gainers' },
    { id: 'newly', i18n: 'common.newlyListed', label: 'Newly Listed' },
    { id: 'popular', i18n: 'common.popularCoins', label: 'Popular Coins' },
    { id: 'loser', i18n: 'common.losers', label: 'Losers' },
    { id: 'volume', i18n: 'common.volume', label: 'Volume' },
  ],

  ...DEFAULT_PROFIT,
  ...DEFAULT_COIN,
  ...DEFAULT_SEARCH_PROFIT
}

const leaderboardStore: TLeaderboardStore = {
  CYCLE_KEYS,

  pageSize: 50,
  cycles: [
    CYCLE_KEYS.day,
    CYCLE_KEYS.week,
    CYCLE_KEYS.month,
    CYCLE_KEYS.allTime
  ],
  selectedCycleValue: CYCLE_KEYS.week.value,

  ...DEFAULT,

  resetProfit() {
    merge(this, DEFAULT_PROFIT)
  },
  resetSearchProfit() {
    merge(this, DEFAULT_SEARCH_PROFIT)
  },
  resetCoin() {
    merge(this, DEFAULT_COIN)
  },

  reset() {
    merge(this, DEFAULT)
  }
}

export const useLeaderboardStore = createStore<TLeaderboardStore>(leaderboardStore)

