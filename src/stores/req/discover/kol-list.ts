import BN from 'bignumber.js'

import { merge, defaults, formatPer } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TDiscoverStore, TDiscoverKolStore } from '@/stores'

import { formatPositionByItem, formatUPnlStatus, formatStatusClassName, timeToLocal } from '../utils'

type DiscoverKolListResult = {
  data: Record<string, any>,
  error: boolean
}

export type TDiscoverKolList = {
  discoverKolList: (accountStore: TAccountStore, discoverStore: TDiscoverStore, discoverKolStore: TDiscoverKolStore) => Promise<DiscoverKolListResult>
  discoverKolListBusy: boolean
}

export const discoverKolList: TDiscoverKolList = {
  async discoverKolList(accountStore, discoverStore, discoverKolStore) {
    const result: DiscoverKolListResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.discoverKolListBusy) return result

    this.discoverKolListBusy = true

    const params: Record<string, any> = {
      pageNum: discoverKolStore.current,
      pageSize: discoverKolStore.size,
      period: +discoverStore.selectedCycleValue,
    }

    if (discoverKolStore.searchKol) {
      params.username = discoverKolStore.searchKol
    }
    const res = await baseApi.get('/leaderboard/kol', {
      params
    })

    result.error = baseCheck(res, accountStore)
    this.discoverKolListBusy = false

    if (result.error) return result

    // update
    const { list = [], total } = res.data.data

    result.data = {
      last: list.map((item: any, idx: number) => {
        const bnTrustCount = new BN(item.trustCount || 0)
        const bnDoubtCount = new BN(item.doubtCount || 0)
        const bnVoteCount = bnTrustCount.plus(bnDoubtCount)

        return {
          id: item.id,
          address: item.address,
          avatar: item.profilePicture,
          xUsername: item.username,
          xNickname: item.twitterName,
          identityType: item.type, // 0、未认证 1、社区认证 2、官方认证

          trustCount: bnTrustCount.toString(), // 信任总数
          trustCountPer: bnVoteCount.gt(0) ? bnTrustCount.div(bnVoteCount).times(100).toFixed(constants.decimalPlaces.__COMMON__) : '-',
          doubtCount: bnDoubtCount.toString(), // 怀疑总数
          doubtCountPer: bnVoteCount.gt(0) ? bnDoubtCount.div(bnVoteCount).times(100).toFixed(constants.decimalPlaces.__COMMON__) : '-',
          voteCount: bnVoteCount.toString(),

          winRate: formatPer(item.winRate),
          accountTotalValue: new BN(item.accountTotalValue || 0).toFixed(constants.decimalPlaces.__COMMON__),
          pnl: new BN(item.totalPnl || 0).toFixed(constants.decimalPlaces.__uPnl__),
          tradesCount: +item.positionCount,
          createTs: item.createTime,

          voted: item.isVote
        }
      }),
      total: total,
      isEnd: list.length < discoverKolStore.size
    }

    // update
    merge(discoverKolStore, result.data)

    return result
  },
  discoverKolListBusy: false,
}