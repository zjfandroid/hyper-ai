import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

interface TLeaderboardPointOverallItem {
  idx: number
  rank: number
  tgId: string
  avatar: string
  tgUsername: string
  tgFirstName: string
  tgLastName: string
  totalPoints: string
  refEarnings: string
  txnEarnings: string
  taskEarnings: string
}

export type TLeaderboardPointOverallStore = {
  list: Array<TLeaderboardPointOverallItem>
  _last: Array<TLeaderboardPointOverallItem>
  last: Array<TLeaderboardPointOverallItem>

  size: number
  current: number
  total: number
  count: number
  isEnd: boolean

  reset: () => void
}

const DEFAULT = {
  list: [],
  _last: [],

  size: 10,
  current: 1,
  total: 0,
  count: 0,
  isEnd: false,
}

const leaderboardPointOverallStore: TLeaderboardPointOverallStore = {
  ...DEFAULT,

  get last() {
    return this._last
  },
  set last(val) {
    const result = this._last = val

    // update
    this.list = this.list.concat(result)
  },

  reset() {
    merge(this, DEFAULT)
  }
}

export const useLeaderboardPointOverallStore = createStore<TLeaderboardPointOverallStore>(leaderboardPointOverallStore)

