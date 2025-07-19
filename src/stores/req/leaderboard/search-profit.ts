import BN from 'bignumber.js'

import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardStore } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type LeaderboardSearchProfitResult = {
  data: Record<string, any>,
  error: boolean
}

export type TLeaderboardSearchProfit = {
  leaderboardSearchProfit: (accountStore: TAccountStore, leaderboardStore: TLeaderboardStore) => Promise<LeaderboardSearchProfitResult>
  leaderboardSearchProfitBusy: boolean
}

// NOTE: 多个解耦合并
export const leaderboardSearchProfit: TLeaderboardSearchProfit = {
  async leaderboardSearchProfit(accountStore, leaderboardStore) {
    const result: LeaderboardSearchProfitResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.leaderboardSearchProfitBusy) return result

    this.leaderboardSearchProfitBusy = true

    // update
    // NOTE: 搜索如果失败（不存在），则返回data null
    leaderboardStore.searchProfitAddress = leaderboardStore.searchProfitAddressInput

    const res = await baseApi.get(`/leaderboard/address/one/${leaderboardStore.searchProfitAddressInput}`)

    result.error = baseCheck(res, accountStore)
    this.leaderboardSearchProfitBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      searchProfitList: (data?.windowPerformances || []).map((item, idx) => {
        const { decimalPlaces } = constants
        const bnPnl = new BN(item.performance.pnl)
        const bnRoi = new BN(item.performance.roi)
        const pnlStatus = formatUPnlStatus(bnPnl)
        const roiStatus = formatUPnlStatus(bnRoi)

        return {
          idx,
          totalValue: new BN(data.accountValue).toFixed(decimalPlaces.__COMMON__),
          address: data.ethAddress,
          cycle: item.window,
          pnl: bnPnl.toFixed(constants.decimalPlaces.__uPnl__),
          pnlStatus,
          pnlStatusClassName: formatStatusClassName(pnlStatus),
          roi: bnRoi.times(100).toFixed(2),
          roiStatus,
          roiStatusClassName: formatStatusClassName(roiStatus),
          volume: new BN(item.performance.vlm).toFixed(decimalPlaces.__COMMON__),
        }
      })
    }

    // update
    merge(leaderboardStore, result.data)

    return result
  },
  leaderboardSearchProfitBusy: false,
}