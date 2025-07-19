import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'
import i18n from '@/i18n'

export * from './trading-statistics'
export * from './recommend'
export * from './kol'

interface TDiscoverItem {

}
interface TCycleItem {
  value: string
  i18n?: string
  label: string
}


export type TDiscoverStore = {
  mainTypeValue: string
  mainTypeRadios: Array<{value: string, i18n: string}>

  CYCLE_KEYS: Record<string, TCycleItem>
  // id 与 key 相同
  SORT_KEYS: Record<string, { id: string, i18n?: string, value: number, label: string }>

  openTradingStatistics: boolean

  cycles: Array<TCycleItem>
  selectedCycleValue: string
  selectedCycleItem: TCycleItem

  sortByKey: string

  list: Array<TDiscoverItem>
  last: Array<TDiscoverItem>
  _last: Array<TDiscoverItem>
  size: number
  current: number
  total: number
  isEnd: boolean
  isFirst: boolean
  isLast: boolean
  count: number
  next(): void
  resetList: () => void

  searchAddressInput: string
  searchAddress: string
  searchList: Array<any>
  resetSearch: () => void

  reset: () => void
}

const CYCLE_KEYS = {
  day: { value: '1', i18n: 'common.oneD', label: '1D' },
  week: { value: '7', i18n: 'common.sevenD', label: '7D' },
  month: { value: '30', i18n: 'common.thirtyD', label: '30D' },
  allTime:  { value: '0', i18n: 'common.all', label: 'All' },
}

// NOTE: 对应接口
const SORT_KEYS = {
  winRate: { id: 'winRate', i18n: 'common.winRate', value: 0, label: 'Win Rate' },
  accountTotalValue: { id: 'accountTotalValue', i18n: 'common.accountTotalValue', value: 1, label: 'Account Total Value' },
  roi: { id: 'roi', i18n: 'common.roi', value: 2, label: 'ROI' },
  pnl: { id: 'pnl', i18n: 'common.pnl', value: 3, label: 'Pnl' },
  executedTrades: { id: 'executedTrades', i18n: 'common.tradesCount', value: 4, label: 'Executed Trades' },
  profitableTrades: { id: 'profitableTrades', i18n: 'common.profitableTradesCount', value: 5, label: 'Profitable Trades' },
  lastOperation: { id: 'lastOperation', i18n: 'common.lastOperationTime', value: 6, label: 'Last Operation Time' },
  avgHoldingPeriod: { id: 'avgHoldingPeriod', i18n: 'common.avgHoldingPeriod', value: 7, label: 'Avg Holding Period' },
  currentPosition: { id: 'currentPosition', i18n: 'common.currentPosition', value: 8, label: 'Current Position' },
}

const DEFAULT_SEARCH = {
  searchAddressInput: '',
  searchAddress: '',
  searchList: [],
}

const DEFAULT_LIST = {
  list: [],
  _last: [],

  // pagination
  size: 10,
  current: 1,
  total: 0,
  isEnd: false,
}



const DEFAULT = {
  sortByKey: SORT_KEYS.profitableTrades.id,

  ...DEFAULT_LIST,
  ...DEFAULT_SEARCH,
}

const discoverStore: TDiscoverStore = {
  // XXX: 最好移到别的地方
  openTradingStatistics: false,

  mainTypeValue: 'smart',
  mainTypeRadios: [
    { value: 'smart', i18n: 'discover.smartTrader' },
    { value: 'kol', i18n: 'discover.kolTrader' },
  ],

  CYCLE_KEYS,
  SORT_KEYS,

  cycles: [
    CYCLE_KEYS.day,
    CYCLE_KEYS.week,
    CYCLE_KEYS.month,
    CYCLE_KEYS.allTime
  ],
  selectedCycleValue: CYCLE_KEYS.week.value,

  ...DEFAULT,

  get selectedCycleItem () {
    return this.cycles.find(item => item.value === this.selectedCycleValue)
  },

  get last() {
    return this._last
  },
  set last(val) {
    const result = this._last = val

    // update
    this.list = this.list.concat(result)
  },
  get isFirst() {
    return this.current <= 1
  },
  get isLast() {
    return this.current >= this.count
  },
  get count() {
    const { total, size } = this

    return Math.ceil(total / size || 1)
  },
  next() {
    this.current += 1
  },
  resetList() {
    merge(this, DEFAULT_LIST)
  },
  resetSearch() {
    merge(this, DEFAULT_SEARCH)
  },
  reset() {
    merge(this, DEFAULT)
  }
}

export const useDiscoverStore = createStore<TDiscoverStore>(discoverStore)

