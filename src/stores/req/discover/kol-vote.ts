import BN from 'bignumber.js'

import { merge, defaults, formatPer } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TDiscoverStore, TDiscoverKolStore } from '@/stores'

import { formatPositionByItem, formatUPnlStatus, formatStatusClassName, timeToLocal } from '../utils'

type DiscoverKolVoteResult = {
  data: Record<string, any>,
  error: boolean
}

export type TDiscoverKolVote = {
  discoverKolVote: (accountStore: TAccountStore, discoverKolStore: TDiscoverKolStore) => Promise<DiscoverKolVoteResult>
  discoverKolVoteBusy: boolean
}

export const discoverKolVote: TDiscoverKolVote = {
  async discoverKolVote(accountStore, discoverKolStore) {
    const result: DiscoverKolVoteResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.discoverKolVoteBusy) return result

    this.discoverKolVoteBusy = true


    const res = await baseApi.put('/leaderboard/kol/vote', {
      id: discoverKolStore.voteId,
      trustOrDoubt: discoverKolStore.voteType
    })

    result.error = baseCheck(res, accountStore)
    this.discoverKolVoteBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
    }

    return result
  },
  discoverKolVoteBusy: false,
}