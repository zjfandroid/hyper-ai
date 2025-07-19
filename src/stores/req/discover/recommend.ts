import BN from 'bignumber.js'

import { merge, defaults, formatPer } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TDiscoverRecommendStore } from '@/stores'

import { formatPositionByItem, formatUPnlStatus, formatStatusClassName, timeToLocal } from '../utils'

type DiscoverRecommendResult = {
  data: Record<string, any>,
  error: boolean
}

export type TDiscoverRecommend = {
  discoverRecommend: (accountStore: TAccountStore, discoverRecommendStore: TDiscoverRecommendStore) => Promise<DiscoverRecommendResult>
  discoverRecommendBusy: boolean
}

export const discoverRecommend: TDiscoverRecommend = {
  async discoverRecommend(accountStore, discoverRecommendStore) {
    const result: DiscoverRecommendResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.discoverRecommendBusy) return result

    this.discoverRecommendBusy = true

    const res = await baseApi.get('/leaderboard/smart/recommend', {
      params: {
        lang: discoverRecommendStore.selectedLanguage
      }
    })

    result.error = baseCheck(res, accountStore)
    this.discoverRecommendBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      list: (data || []).map((item: any, idx: number) => {
        return {
          address: item.address,
          perpValue: new BN(item.perp).toFixed(constants.decimalPlaces.__COMMON__), // 永续合约价值
          spotValue: new BN(item.spot).toFixed(constants.decimalPlaces.__COMMON__), // 现货价值

          winRate: formatPer(item.winRate),
          accountTotalValue: new BN(item.accountTotalValue).toFixed(constants.decimalPlaces.__COMMON__),

          marginUsed: new BN(item.marginUsage).toFixed(constants.decimalPlaces.__COMMON__), // 
          marginUsedRatio: formatPer(item.marginUsageRate, true),

          note: item.remark,
          pnl: new BN(item.realizedPnL).toFixed(constants.decimalPlaces.__uPnl__),
          tags: item.labels,
          tradesCount: item.tradesCount,
          lastActionTs: item.lastOperationAt,
          // "lastAssetSnapshotPosCount": 0,
        }
      }),
    }

    // update
    merge(discoverRecommendStore, result.data)

    return result
  },
  discoverRecommendBusy: false,
}