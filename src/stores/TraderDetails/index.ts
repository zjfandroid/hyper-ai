import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

export * from './positions'
export * from './recent-fills'
export * from './twap'
export * from './non-funding'
export * from './open-orders-additional'
export * from './portfolio-kline'
export * from './historical-orders'

interface TAssetItem {
  tokenIdx: number
  coin: string
  amount: string
  value?: string // 需要  forEach traderDetailsStore.spotAssets 后才会有该值
}

export type TTraderDetailsStore = {
  openSpotAssets: boolean

  MAX_LEVERAGE: number // 最大杠杆
  address: string
  busy: boolean

  spotAssets: Record<string, TAssetItem>
  totalSpotPricedAssetsNum: number // 总现货有价值资产的coin数
  totalSpotValue: string

  // 由组件维护更新，这里只是做同步至其他组件时使用
  isAutoRefreshing: boolean

  hasPosition: boolean
  totalPositionValue: string
  totalLongPositionValue: string
  totalLongPositionValueRatio: string
  totalLongPositionValuePct: string
  totalShortPositionValue: string
  totalShortPositionValueRatio: string
  totalShortPositionValuePct: string
  directionBias: string
  perpEquity: string
  totalMarginUsageRatio: string
  totalMarginUsagePct: string
  totalMarginUsed: string
  leverageRatio: string
  totalUPnl: string
  totalROERatio: string
  totalROEPct: string
  withdrawable: string
  withdrawableRatio: string
  withdrawablePct: string

  tabId: string
  tabs: Array<{
    id: string
    i18n?: string
    label?: string
    disabled?: boolean
  }>

  reset: () => void
}

const DEFAULT = {
  openSpotAssets: false,

  address: '',
  busy: false,

  isAutoRefreshing: false,

  spotAssets: {},
  totalSpotPricedAssetsNum: 0,
  totalSpotValue: '0',

  hasPosition: false,
  totalPositionValue: '0',
  totalLongPositionValue: '0',
  totalLongPositionValueRatio: '0',
  totalLongPositionValuePct: '0',
  totalShortPositionValue: '0',
  totalShortPositionValueRatio: '0',
  totalShortPositionValuePct: '0',
  directionBias: '',
  perpEquity: '0',
  totalMarginUsageRatio: '0',
  totalMarginUsagePct: '0',
  totalMarginUsed: '0',
  leverageRatio: '0',
  totalUPnl: '0',
  totalROERatio: '0',
  totalROEPct: '0',
  withdrawable: '0',
  withdrawableRatio: '0',
  withdrawablePct: '0',

  tabId: 'positions',
}

const traderDetailsStore: TTraderDetailsStore = {
  MAX_LEVERAGE: 40,
  tabs: [
    { id: 'positions', i18n: 'common.perpPositions', label: 'Positions' },
    { id: 'openOrders', i18n: 'common.openOrders', label: 'Open Orders' },
    { id: 'recentFills', i18n: 'common.recentFills', label: 'Recent Fills' },
    { id: 'historicalOrders', i18n: 'common.historicalOrders' },
    // { id: 'completedTrades', i18n: 'common.completedTrades', label: 'Completed Trades' },
    { id: 'twap', i18n: 'common.twap', label: 'TWAP' },
    { id: 'depositsAndWithdrawals', i18n: 'common.depositsAndWithdrawals', label: 'Deposits & Withdrawals' },
  ],

  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useTraderDetailsStore = createStore<TTraderDetailsStore>(traderDetailsStore)

