import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

interface TLeaderboardPointReferralItem {
  idx: number
  rank: number
  tgId: string
  avatar: string
  tgUsername: string
  tgFirstName: string
  tgLastName: string
  totalInvited: number
  tier1: number
  tier2: number
  tier3: number
}

export type TLeaderboardPointReferralStore = {
  list: Array<TLeaderboardPointReferralItem>
  _last: Array<TLeaderboardPointReferralItem>
  last: Array<TLeaderboardPointReferralItem>

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

const leaderboardPointReferralStore: TLeaderboardPointReferralStore = {
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

export const useLeaderboardPointReferralStore = createStore<TLeaderboardPointReferralStore>(leaderboardPointReferralStore)

