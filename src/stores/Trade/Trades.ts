import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

export interface TTradeTradeItem {
  coin: string
  side: string
  price: string
  size: string
  blockTime: number
  hash: string
  tid: number
  users: [string, string] // [buyer, seller]
}

export type TTradeTradesStore = {
  coin: string // 当前币，大写

  maxRecordItem: number // 最大保留条目数
  lastRecord: Array<any>

  reset: () => void
}

const DEFAULT = {
  coin: '',

  maxRecordItem: 50,
  lastRecord: []
}

const tradeTradesStore: TTradeTradesStore = {
  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useTradeTradesStore = createStore<TTradeTradesStore>(tradeTradesStore)

