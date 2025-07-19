import BN from 'bignumber.js'

import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardStore } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type LeaderboardProfitListResult = {
  data: Record<string, any>,
  error: boolean
}

export type TLeaderboardProfitList = {
  leaderboardProfitList: (accountStore: TAccountStore, leaderboardStore: TLeaderboardStore) => Promise<LeaderboardProfitListResult>
  leaderboardProfitListBusy: boolean
}

// NOTE: 多个解耦合并
export const leaderboardProfitList: TLeaderboardProfitList = {
  async leaderboardProfitList(accountStore, leaderboardStore) {
    const result: LeaderboardProfitListResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.leaderboardProfitListBusy) return result

    this.leaderboardProfitListBusy = true

    const columnIds: Record<string, string> = {
      totalValue: '/leaderboard/address/top-account-value',
      pnl: '/leaderboard/address/top-pnl',
      roi: '/leaderboard/address/top-roi',
      volume: '/leaderboard/address/top-vlm'
    }

    const res = await baseApi.get(columnIds[leaderboardStore.profitSortColumnId], {
      params: {
        window: leaderboardStore.selectedCycleValue, // 时间窗口，day/week(or 7d)/month(or 30d)/allTime
        take: leaderboardStore.pageSize
      }
    })

    result.error = baseCheck(res, accountStore)
    this.leaderboardProfitListBusy = false

    if (result.error) return result

    // update
    const { data } = res.data
    const _arrWindow = {
      day: '0',
      week: '1',
      month: '2',
      allTime: '3'
    }
    result.data = {
      profitList: (data || []).map((item, idx) => {
        // NOTE: totalValue 与别的不同
        const _tv = leaderboardStore.profitSortColumnId === 'totalValue'
        const _windowPerformancesIdx = _arrWindow[leaderboardStore.selectedCycleValue]
        const _item = item.windowPerformances ? item.windowPerformances[_windowPerformancesIdx]?.performance : {}

        const { decimalPlaces } = constants
        const bnPnl = new BN(_tv ? _item.pnl : item.pnl)
        const bnRoi = new BN(_tv ? _item.roi : item.roi)
        const pnlStatus = formatUPnlStatus(bnPnl)
        const roiStatus = formatUPnlStatus(bnRoi)

        return {
          idx,
          rank: idx + 1,
          totalValue: new BN(item.accountValue).toFixed(decimalPlaces.__COMMON__),
          address: item.ethAddress,
          pnl: bnPnl.toFixed(constants.decimalPlaces.__uPnl__),
          pnlStatus,
          pnlStatusClassName: formatStatusClassName(pnlStatus),
          roi: bnRoi.times(100).toFixed(2),
          roiStatus,
          roiStatusClassName: formatStatusClassName(roiStatus),
          volume: new BN(_tv ? _item.vlm : item.vlm).toFixed(decimalPlaces.__COMMON__),
        }
      })
    }

    // update
    merge(leaderboardStore, result.data)

    return result
  },
  leaderboardProfitListBusy: false,
}