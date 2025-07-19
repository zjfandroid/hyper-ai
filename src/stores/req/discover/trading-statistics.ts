import BN from 'bignumber.js'

import { merge, defaults, formatPer } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TDiscoverTradingStatisticsStore } from '@/stores'

import { formatPositionByItem, formatUPnlStatus, formatStatusClassName } from '../utils'

type DiscoverTradingStatisticsResult = {
  data: Record<string, any>,
  error: boolean
}

export type TDiscoverTradingStatistics = {
  discoverTradingStatistics: (accountStore: TAccountStore, discoverTradingStatisticsStore: TDiscoverTradingStatisticsStore) => Promise<DiscoverTradingStatisticsResult>
  discoverTradingStatisticsBusy: boolean
}

export const discoverTradingStatistics: TDiscoverTradingStatistics = {
  async discoverTradingStatistics(accountStore, discoverTradingStatisticsStore) {
    const result: DiscoverTradingStatisticsResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.discoverTradingStatisticsBusy) return result

    this.discoverTradingStatisticsBusy = true

    const res = await baseApi.get('/leaderboard/smart/detailed-trading-statistics', {
      params: {
        address: discoverTradingStatisticsStore.address,
        period: +discoverTradingStatisticsStore.selectedCycleValue
      }
    })
    // TEST
    // const res = {
    //   data: {
    //     code: 0,
    //     data: {
    //     "totalPnl": -10677.0319,
    //     "gross": -13878.9971,
    //     "fees": -3201.9652,
    //     "longPnl": -20125.5654,
    //     "shortPnl": 9448.5335,
    //     "winRate": 0.6363636363636364,
    //     "winning": 84,
    //     "total": 132,
    //     "tradeDuration": 0,
    //     "minDuration": 2,
    //     "maxDuration": 11567,
    //     "bestTrades": [
    //         {
    //             "coin": "BTC",
    //             "direction": "short",
    //             "duration": 1158000,
    //             "createAt": 1748398710000,
    //             "pnl": 3191.27935600
    //         },
    //         {
    //             "coin": "BTC",
    //             "direction": "short",
    //             "duration": 1786000,
    //             "createAt": 1748398710000,
    //             "pnl": 2600.70122700
    //         },
    //         {
    //             "coin": "BTC",
    //             "direction": "short",
    //             "duration": 201000,
    //             "createAt": 1748398710000,
    //             "pnl": 2504.72290900
    //         },
    //         {
    //             "coin": "BTC",
    //             "direction": "short",
    //             "duration": 5919000,
    //             "createAt": 1748398710000,
    //             "pnl": 1931.54043000
    //         },
    //         {
    //             "coin": "SOL",
    //             "direction": "long",
    //             "duration": 270000,
    //             "createAt": 1748354226000,
    //             "pnl": 1702.02613700
    //         },
    //         {
    //             "coin": "WIF",
    //             "direction": "short",
    //             "duration": 11567000,
    //             "createAt": 1748398710000,
    //             "pnl": 1496.20268700
    //         },
    //         {
    //             "coin": "ETH",
    //             "direction": "long",
    //             "duration": 636000,
    //             "createAt": 1746549351000,
    //             "pnl": 1422.97451100
    //         },
    //         {
    //             "coin": "ETH",
    //             "direction": "short",
    //             "duration": 4308000,
    //             "createAt": 1748398710000,
    //             "pnl": 1257.26528000
    //         },
    //         {
    //             "coin": "BTC",
    //             "direction": "long",
    //             "duration": 1746000,
    //             "createAt": 1748398710000,
    //             "pnl": 998.98009800
    //         },
    //         {
    //             "coin": "ETH",
    //             "direction": "short",
    //             "duration": 3958000,
    //             "createAt": 1748398710000,
    //             "pnl": 740.16747000
    //         }
    //     ],
    //     "performanceAssets": [
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 7,
    //             "coin": "WIF",
    //             "pnl": 1580.55938900,
    //             "fees": -18.60189800
    //         },
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 3,
    //             "coin": "DOGE",
    //             "pnl": 1032.73735000,
    //             "fees": -33.33980000
    //         },
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 22,
    //             "coin": "FARTCOIN",
    //             "pnl": 1000.04779400,
    //             "fees": -27.84939500
    //         },
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 16,
    //             "coin": "ENA",
    //             "pnl": 435.26707200,
    //             "fees": -14.69457100
    //         },
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 2,
    //             "coin": "XRP",
    //             "pnl": 424.12006300,
    //             "fees": -12.28028600
    //         },
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 8,
    //             "coin": "SUI",
    //             "pnl": 284.38207600,
    //             "fees": -40.40186300
    //         },
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 11,
    //             "coin": "VIRTUAL",
    //             "pnl": 238.67713200,
    //             "fees": -11.46824800
    //         },
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 6,
    //             "coin": "POPCAT",
    //             "pnl": 10.62606600,
    //             "fees": -1.60742700
    //         },
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 7,
    //             "coin": "WLD",
    //             "pnl": -170.05668600,
    //             "fees": -5.49551800
    //         },
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 6,
    //             "coin": "AAVE",
    //             "pnl": -176.02886600,
    //             "fees": -7.75123400
    //         },
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 8,
    //             "coin": "kPEPE",
    //             "pnl": -310.87629800,
    //             "fees": -28.83660800
    //         },
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 10,
    //             "coin": "SOL",
    //             "pnl": -1662.85760000,
    //             "fees": -202.67935300
    //         },
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 11,
    //             "coin": "ETH",
    //             "pnl": -8703.34823100,
    //             "fees": -240.08263500
    //         },
    //         {
    //             "address": "0x48cd535b80439fefd6d00f74e5cf9b152adf2671",
    //             "trades": 22,
    //             "coin": "BTC",
    //             "pnl": -11052.08591100,
    //             "fees": -2575.43746700
    //         }
    //     ]
    // }
    //   }
    // }

    result.error = baseCheck(res, accountStore)
    this.discoverTradingStatisticsBusy = false

    if (result.error) return result

    // update
    const { data } = res.data
    const { decimalPlaces } = constants
    const bnPnl = new BN(data.totalPnl)
    const pnlStatus = formatUPnlStatus(bnPnl)
    const executedTrades = data.total
    const profitableTrades = data.winning

    result.data = {
      pnl: bnPnl.toFixed(decimalPlaces.__uPnl__), // 未实现盈亏
      pnlStatus,
      pnlStatusClassname: formatStatusClassName(pnlStatus),
      longPnl: new BN(data.longPnl).toFixed(decimalPlaces.__uPnl__),
      shortPnl: new BN(data.shortPnl).toFixed(decimalPlaces.__uPnl__),

      profitableTrades,
      executedTrades,
      losingTrades: executedTrades - profitableTrades, // 亏损交易数
      gross: new BN(data.gross).toFixed(decimalPlaces.__COMMON__),

      winRate: formatPer(data.winRate),
      longWinRate: formatPer(data.longWr || 0),
      shortWinRate: formatPer(data.shortWr || 0),
      // 都为0时，则没开过仓
      lossRate: !data.winRate && !data.shortWr && !data.longWr
        ? '0'
        : formatPer(1-data.winRate),

      fees: new BN(data.fees).toFixed(decimalPlaces.__COMMON__),
      tradeDuration: data.tradeDuration,
      minDuration: data.minDuration,
      maxDuration: data.maxDuration,

      bestTrades: (data.bestTrades || []).map((item: any, idx: number) => {
        const bnPnl = new BN(item.pnl)
        const pnlStatus = formatUPnlStatus(bnPnl)

        return {
          coin: item.coin,
          createTs: item.createAt,
          direction: item.direction,
          duration: item.duration / 1000, // 转为秒
          pnl: bnPnl.toFixed(decimalPlaces.__uPnl__), // 未实现盈亏
          pnlStatus,
          pnlStatusClassname: formatStatusClassName(pnlStatus),
        }
      }),
      performanceAssets: (data.performanceAssets || []).map((item: any, idx: number) => {
        const bnPnl = new BN(item.pnl)
        const pnlStatus = formatUPnlStatus(bnPnl)
        const bnFees = new BN(item.fees)
        const feesStatus = formatUPnlStatus(bnFees)

        return {
          address: item.address,
          coin: item.coin,
          fees: bnFees.toFixed(decimalPlaces.__COMMON__),
          feesStatus,
          feesStatusClassname: formatStatusClassName(feesStatus),
          pnl: bnPnl.toFixed(decimalPlaces.__uPnl__), // 未实现盈亏
          pnlStatus,
          pnlStatusClassname: formatStatusClassName(pnlStatus),
          netPnL: bnPnl.minus(item.fees).toFixed(decimalPlaces.__COMMON__),
          trades: item.trades
        }
      })
    }

    // update
    merge(discoverTradingStatisticsStore, result.data)

    return result
  },
  discoverTradingStatisticsBusy: false,
}