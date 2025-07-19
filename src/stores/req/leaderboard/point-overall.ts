import BN from 'bignumber.js'

import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardPointOverallStore } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type LeaderboardPointOverallListResult = {
  data: Record<string, any>,
  error: boolean
}

export type TLeaderboardPointOverallList = {
  leaderboardPointOverallList: (accountStore: TAccountStore, leaderboardPointOverallStore: TLeaderboardPointOverallStore ) => Promise<LeaderboardPointOverallListResult>
  leaderboardPointOverallListBusy: boolean
}

export const leaderboardPointOverallList: TLeaderboardPointOverallList = {
  async leaderboardPointOverallList(accountStore, leaderboardPointOverallStore) {
    const result: LeaderboardPointOverallListResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.leaderboardPointOverallListBusy) return result

    this.leaderboardPointOverallListBusy = true
    const { current, size } = leaderboardPointOverallStore

    const res = await baseApi.get('/rank/point', {
      params: {
        pageNum: current,
        pageSize: size
      }
    })

    result.error = baseCheck(res, accountStore)
    this.leaderboardPointOverallListBusy = false

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
          totalPoints: new BN(item.totalAmount).toString(),
          refEarnings: item.refEarnings,
          txnEarnings: item.txnEarnings,
          taskEarnings: item.taskEarnings
        }
      }),
      isEnd: list.length < leaderboardPointOverallStore.size,
      total
    }

    // update
    merge(leaderboardPointOverallStore, result.data)

    return result
  },
  leaderboardPointOverallListBusy: false,
}