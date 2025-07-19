import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'
import exp from 'constants'

export * from './OrderBook'
export * from './Trades'
export * from './Coins'

interface TTabItem {
  id: string
  i18n?: string
  label?: string
  disabled?: boolean
}

export type TTradeStore = {
  openSelectCoins: boolean

  DEFAULT_COIN: string
  coin: string // 交易币，大写

  // 当前链接的钱包地址
  address: string

  sideTabId: string
  sideTabs: Array<TTabItem>

  recordTabId: string
  recordTabs: Array<TTabItem>
  reset: () => void
}

const DEFAULT = {
  openSelectCoins: false,

  DEFAULT_COIN: 'BTC', // 不存在或异常时的缺省值
  coin: '',

  address: '',

  sideTabId: 'orderBook',
  sideTabs: [
    { id: 'orderBook', i18n: 'common.orderBook' },
    { id: 'trades', i18n: 'common.trades' },
  ],

  recordTabId: 'positions',
  recordTabs: [
    { id: 'positions', i18n: 'common.perpPositions' },
    { id: 'openOrders', i18n: 'common.openOrders' },
    { id: 'recentFills', i18n: 'common.recentFills' },
    { id: 'historicalOrders', i18n: 'common.historicalOrders' },
    // { id: 'completedTrades', i18n: 'common.completedTrades', label: 'Completed Trades' },
    { id: 'twap', i18n: 'common.twap' },
    { id: 'depositsAndWithdrawals', i18n: 'common.depositsAndWithdrawals' },
  ],
}

const tradeStore: TTradeStore = {
  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useTradeStore = createStore<TTradeStore>(tradeStore)

