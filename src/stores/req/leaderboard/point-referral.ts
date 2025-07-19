import BN from 'bignumber.js'

import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardPointReferralStore } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type LeaderboardPointReferralListResult = {
  data: Record<string, any>,
  error: boolean
}

export type TLeaderboardPointReferralList = {
  leaderboardPointReferralList: (accountStore: TAccountStore, leaderboardPointReferralStore: TLeaderboardPointReferralStore ) => Promise<LeaderboardPointReferralListResult>
  leaderboardPointReferralListBusy: boolean
}

export const leaderboardPointReferralList: TLeaderboardPointReferralList = {
  async leaderboardPointReferralList(accountStore, leaderboardPointReferralStore) {
    const result: LeaderboardPointReferralListResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.leaderboardPointReferralListBusy) return result

    this.leaderboardPointReferralListBusy = true

    const { current, size } = leaderboardPointReferralStore

    const res = await baseApi.get('/rank/referral', {
      params: {
        pageNum: current,
        pageSize: size
      }
    })

    result.error = baseCheck(res, accountStore)
    this.leaderboardPointReferralListBusy = false

    if (result.error) return result

    // update
    const { total = 0, list = [] } = res.data.data

    result.data = {
      last: list.map((item, idx) => {
        return {
          idx,
          rank: idx + 1 + (current - 1) * size,
          address: item.address || undefined,
          tgId: item.userId,
          avatar: item.userPhoto,
          tgUsername: item.username,
          tgFirstName: item.firstName,
          tgLastName: item.lastName,
          totalInvited: item.total,
          tier1: item.level1,
          tier2: item.level2,
          tier3: item.level3
        }
      }),
      isEnd: list.length < leaderboardPointReferralStore.size,
      total
    }

    // update
    merge(leaderboardPointReferralStore, result.data)

    return result
  },
  leaderboardPointReferralListBusy: false,
}