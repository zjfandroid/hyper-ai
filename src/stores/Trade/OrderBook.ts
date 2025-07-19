import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

export interface TOrderBookSigFigItem {
  value: string
  label: string
}

export interface TDepthItem {
  price: string
  size: string
  totalSize?: string // 累计量
  orders: string // 订单数
  totalOrders?: string // 累计订单数
  sizeUSD?: string // 美元价值
  totalSizeUSD?: string // 累计美元价值
  noData?: boolean
}

export type TTradeOrderBookStore = {
  coin: string // 当前币，大写

  levels: number
  buyDepth: Array<TDepthItem>
  sellDepth: Array<TDepthItem>
  // maxTotalSize: string
  // bidAskSpread: string

  DEFAULT_SIG_FIG_ITEMS: Array<TOrderBookSigFigItem>
  selectedSigFigValue: string
  sigFigItems: Array<TOrderBookSigFigItem>
  mantissa: string

  reset: () => void
}

const DEFAULT = {
  coin: '',

  levels: 10, // max 20
  buyDepth: [],
  sellDepth: [],
  // maxTotalSize: '0',
  // bidAskSpread: 0

  DEFAULT_SIG_FIG_ITEMS: [
    // { label: 'null', value: 'null' },
    { label: '0.00001', value: '5_null' },
    { label: '0.00002', value: '5_2' },
    { label: '0.00005', value: '5_5' },
    { label: '0.0001', value: '4' },
    { label: '0.001', value: '3' },
    { label: '0.01', value: '2' },
  ],
  selectedSigFigValue: '5_null', // 2 3 4 5 null
  mantissa: 'null', // 1 2 5 null
  sigFigItems: []
}

const tradeOrderBookStore: TTradeOrderBookStore = {
  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useTradeOrderBookStore = createStore<TTradeOrderBookStore>(tradeOrderBookStore)

