import BN from 'bignumber.js'

import { merge, defaults, getDecimalLength } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardStore } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type LeaderboardCoinListResult = {
  data: Record<string, any>,
  error: boolean
}

export type TLeaderboardCoinList = {
  leaderboardCoinList: (accountStore: TAccountStore, leaderboardStore: TLeaderboardStore) => Promise<LeaderboardCoinListResult>
  leaderboardCoinListBusy: boolean
}

const COLUMN_IDS: Record<string, string> = {
  gainer: '/leaderboard/coin/gainers',
  loser: '/leaderboard/coin/losers',
  volume: '/leaderboard/coin/top-volume',
  popular: '/leaderboard/coin/most-popular',
  newly: '/leaderboard/coin/newly-listed',
}

// NOTE: 多个解耦合并
export const leaderboardCoinList: TLeaderboardCoinList = {
  async leaderboardCoinList(accountStore, leaderboardStore) {
    const result: LeaderboardCoinListResult = { data: {}, error: true }
    const { logged } = accountStore
    const path = COLUMN_IDS[leaderboardStore.marketTabId]

    if (this.leaderboardCoinListBusy || !path) return result

    this.leaderboardCoinListBusy = true

    const res = await baseApi.get(path)

    result.error = baseCheck(res, accountStore)
    this.leaderboardCoinListBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      coinList: (data || []).map((item, idx) => {
        const { decimalPlaces } = constants
        const bnPriceChange24h = new BN(item.change24h)
        const bnFunding8h = new BN(item.funding)
        const priceChange24hStatus = formatUPnlStatus(bnPriceChange24h)
        const funding8hStatus = formatUPnlStatus(bnFunding8h)
        const price = item.price
        const priceDecimal = getDecimalLength(price)
        return {
          idx,
          symbol: item.coin,
          price,
          volume24h: new BN(item.volume24h).toFixed(decimalPlaces.__COMMON__), // 交易量（基础币种）
          quoteVolume24h: new BN(item.quoteVolume24h).toFixed(decimalPlaces.__COMMON__), // 交易量（计价币种）
          priceChange24h: bnPriceChange24h.toFixed(priceDecimal), // 价格变化
          priceChange24hStatus,
          priceChange24hClassName: formatStatusClassName(priceChange24hStatus),
          priceChangePercent24h: new BN(item.changePercent24h).toFixed(decimalPlaces.__COMMON__), // 价格变化百分比
          funding8h: bnFunding8h.times(100).toString(), // 资金费率
          funding8hStatus,
          openInterest: new BN(item.openInterest).toFixed(decimalPlaces.__COMMON__), // 未平仓量

          open24h: new BN(item.open24h).toString(),
          close24h: new BN(item.close24h).toString(),
          high24h: new BN(item.high24h).toString(),
          low24h: new BN(item.low24h).toString(),
        }
      })
    }

    // update
    merge(leaderboardStore, result.data)

    return result
  },
  leaderboardCoinListBusy: false,
}