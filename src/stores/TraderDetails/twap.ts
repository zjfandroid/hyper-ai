import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

interface TItem {
}

export type TTraderDetailsTWAPStore = {
  sortColumnId: string

  list: Array<TItem>
  last: Array<TItem>
  _last: Array<TItem>
  size: number
  current: number
  total: number
  isEnd: boolean
  isFirst: boolean
  isLast: boolean
  count: number
  next(): void

  reset: () => void
}

const DEFAULT = {
  sortColumnId: 'time',

  list: [],
  _last: [],

  // pagination
  size: 100,
  current: 1,
  total: 0,
  isEnd: false,
}

const traderDetailsTWAPStore: TTraderDetailsTWAPStore = {
  ...DEFAULT,

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

  reset() {
    merge(this, DEFAULT)
  }
}

export const useTraderDetailsTWAPStore = createStore<TTraderDetailsTWAPStore>(traderDetailsTWAPStore)

