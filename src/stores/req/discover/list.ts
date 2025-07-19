import BN from 'bignumber.js'

import { merge, defaults, formatPer } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TDiscoverStore } from '@/stores'

import { formatPositionByItem, formatUPnlStatus, formatStatusClassName, timeToLocal } from '../utils'

type DiscoverListResult = {
  data: Record<string, any>,
  error: boolean
}

export type TDiscoverList = {
  discoverList: (accountStore: TAccountStore, discoverStore: TDiscoverStore) => Promise<DiscoverListResult>
  discoverListBusy: boolean
}

export const discoverList: TDiscoverList = {
  async discoverList(accountStore, discoverStore) {
    const result: DiscoverListResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.discoverListBusy) return result

    this.discoverListBusy = true

    const params: Record<string, any> = {
      pageNum: discoverStore.current,
      pageSize: discoverStore.size,
      period: +discoverStore.selectedCycleValue,
      sort: discoverStore.SORT_KEYS[discoverStore.sortByKey].value,
    }

    if (discoverStore.searchAddress) {
      params.address = discoverStore.searchAddress
    }
    const res = await baseApi.get('/leaderboard/smart', {
      params
    })
    // TEST
    // 生成假数据
    // const res = {
    //   data: {
    //     code: 0,
    //     data: [
    //   {
    //     "address": "0x0136d72136d999ed072bc462a18fb343b89f21d5",
    //     "avgHoldingPeriod": 5,
    //     "winRate": 0.7,
    //     "executedOrders": 10,
    //     "profitableTrades": 9,
    //     "longWr": 0.4,
    //     "shortWr": 0.3,
    //     "realizedPnl": 844.96,
    //     "longPnl": 844.96,
    //     "shortPnl": -120.00,
    //     "accountTotalValue": 183316.59,
    //     "perp": 12211,
    //     "spot": 29389,
    //     "marginUsage": 0.20,
    //     "marginUsageRate": 23.22,
    //     "lastOperationAt": 1670000000000,
    //     "leverage": 5,
    //     "currentPosition": 0,
    //     "roiHistory": [
    //             [
    //                 1748427600041,
    //                 "0.0"
    //             ],
    //             [
    //                 1748434800099,
    //                 "1513366.2300179999"
    //             ],
    //             [
    //                 1748440492317,
    //                 "363884.116164"
    //             ],
    //             [
    //                 1748444400044,
    //                 "-1787347.0687530001"
    //             ],
    //             [
    //                 1748446156591,
    //                 "-2760647.099554"
    //             ],
    //             [
    //                 1748447351233,
    //                 "-2808270.760514"
    //             ],
    //             [
    //                 1748448633548,
    //                 "-2781103.8567550001"
    //             ],
    //             [
    //                 1748450942428,
    //                 "-2608004.2526329998"
    //             ],
    //             [
    //                 1748452017186,
    //                 "-1579687.61158"
    //             ],
    //             [
    //                 1748460000008,
    //                 "-1614395.188175"
    //             ],
    //             [
    //                 1748461200010,
    //                 "-3522028.2483529998"
    //             ],
    //             [
    //                 1748462400096,
    //                 "-5356355.2363149999"
    //             ],
    //             [
    //                 1748464800017,
    //                 "-3183148.4255050002"
    //             ],
    //             [
    //                 1748473200054,
    //                 "-3012216.9611289999"
    //             ],
    //             [
    //                 1748474400011,
    //                 "-17071.768361"
    //             ],
    //             [
    //                 1748482800062,
    //                 "-517996.588793"
    //             ],
    //             [
    //                 1748485512065,
    //                 "-416682.917349"
    //             ],
    //             [
    //                 1748487600067,
    //                 "2981928.5943689998"
    //             ],
    //             [
    //                 1748490000024,
    //                 "-293799.575538"
    //             ],
    //             [
    //                 1748491027578,
    //                 "-144020.009247"
    //             ],
    //             [
    //                 1748493600044,
    //                 "-3646445.2843380002"
    //             ],
    //             [
    //                 1748494577876,
    //                 "-4874814.6824270003"
    //             ],
    //             [
    //                 1748502000047,
    //                 "-3175602.4196210001"
    //             ],
    //             [
    //                 1748509200005,
    //                 "-379813.170394"
    //             ],
    //             [
    //                 1748510506775,
    //                 "-60843.755832"
    //             ],
    //             [
    //                 1748513111849,
    //                 "-518779.654342"
    //             ],
    //             [
    //                 1748514205795,
    //                 "-2198.43515"
    //             ]
    //         ],
    //   },
    //   {
    //     "address": "0x00d34ab64e794f8b1f2b88654f0d550a792b1e53",
    //     "avgHoldingPeriod": 3,
    //     "winRate": 0.90,
    //     "executedOrders": 1,
    //     "profitableTrades": 1,
    //     "longWr": 0.85,
    //     "shortWr": 0.15,
    //     "realizedPnl": 8641.11,
    //     "longPnl": 8641.11,
    //     "shortPnl": 0.00,
    //     "accountTotalValue": 102970.53,
    //     "perp": null,
    //     "spot": null,
    //     "marginUsage": 0.15,
    //     "lastOperationAt": 1670000000000,
    //     "leverage": 3,
    //     "currentPosition": 0
    //   },
    //   {
    //     "address": "0x0151ab3e652dfc67d6dc693e1f50ce546f07291d",
    //     "avgHoldingPeriod": 2,
    //     "winRate": 0.75,
    //     "executedOrders": 2,
    //     "profitableTrades": 2,
    //     "longWr": 0.0,
    //     "shortWr": 1.0,
    //     "realizedPnl": 27589.08,
    //     "longPnl": 0.00,
    //     "shortPnl": 27589.08,
    //     "accountTotalValue": 50000.00,
    //     "perp": null,
    //     "spot": null,
    //     "marginUsage": 0.10,
    //     "lastOperationAt": 1670000000000,
    //     "leverage": 4,
    //     "currentPosition": 0
    //   },
    //   {
    //     "address": "0x020ca66c30bec2c4fe3861a94e4db4a498a35872",
    //     "avgHoldingPeriod": 1,
    //     "winRate": 0.95,
    //     "executedOrders": 15,
    //     "profitableTrades": 15,
    //     "longWr": 1.0,
    //     "shortWr": 0.0,
    //     "realizedPnl": 1648225.88,
    //     "longPnl": 1648225.88,
    //     "shortPnl": 0.00,
    //     "accountTotalValue": 10769735.51,
    //     "perp": null,
    //     "spot": null,
    //     "marginUsage": 0.05,
    //     "lastOperationAt": 1670000000000,
    //     "leverage": 10,
    //     "currentPosition": 0
    //   },
    //   {
    //     "address": "0x007617b1cb9219c790d97c6b8dd323d3be89abb0",
    //     "avgHoldingPeriod": 4,
    //     "winRate": 0.80,
    //     "executedOrders": 1,
    //     "profitableTrades": 1,
    //     "longWr": 0.0,
    //     "shortWr": 1.0,
    //     "realizedPnl": 8478.07,
    //     "longPnl": 0.00,
    //     "shortPnl": 8478.07,
    //     "accountTotalValue": 30000.00,
    //     "perp": null,
    //     "spot": null,
    //     "marginUsage": 0.12,
    //     "lastOperationAt": 1670000000000,
    //     "leverage": 2,
    //     "currentPosition": 0
    //   },
    //   {
    //     "address": "0x01f2635dcc24dd41e3a9c4a5073587b3d9d56051",
    //     "avgHoldingPeriod": 6,
    //     "winRate": 0.90,
    //     "executedOrders": 5,
    //     "profitableTrades": 5,
    //     "longWr": 1.0,
    //     "shortWr": 0.0,
    //     "realizedPnl": 22177.37,
    //     "longPnl": 22177.37,
    //     "shortPnl": 0.00,
    //     "accountTotalValue": 322653.39,
    //     "perp": null,
    //     "spot": null,
    //     "marginUsage": 0.08,
    //     "lastOperationAt": 1670000000000,
    //     "leverage": 3,
    //     "currentPosition": 0
    //   },
    //   {
    //     "address": "0x01b0d1dd8302374403b5f6697bb4f5992f1c75a3",
    //     "avgHoldingPeriod": 3,
    //     "winRate": 0.85,
    //     "executedOrders": 3,
    //     "profitableTrades": 3,
    //     "longWr": 1.0,
    //     "shortWr": 1.0,
    //     "realizedPnl": 60294.72,
    //     "longPnl": 687.16,
    //     "shortPnl": 59607.56,
    //     "accountTotalValue": 45000.00,
    //     "perp": null,
    //     "spot": null,
    //     "marginUsage": 0.09,
    //     "lastOperationAt": 1670000000000,
    //     "leverage": 5,
    //     "currentPosition": 1
    //   },
    //   {
    //     "address": "0x01250799618bb3e1a818fc1e6a9ddf26161b5c40",
    //     "avgHoldingPeriod": 2,
    //     "winRate": 0.70,
    //     "executedOrders": 3,
    //     "profitableTrades": 3,
    //     "longWr": 0.0,
    //     "shortWr": 1.0,
    //     "realizedPnl": 1476.53,
    //     "longPnl": 0.00,
    //     "shortPnl": 1476.53,
    //     "accountTotalValue": 0.14,
    //     "perp": null,
    //     "spot": null,
    //     "marginUsage": 0.06,
    //     "lastOperationAt": 1670000000000,
    //     "leverage": 1,
    //     "currentPosition": 0
    //   },
    //   {
    //     "address": "0x03e161499870b0a37549b16a5d33e0582fe1255e",
    //     "avgHoldingPeriod": 5,
    //     "winRate": 0.88,
    //     "executedOrders": 7,
    //     "profitableTrades": 7,
    //     "longWr": 1.0,
    //     "shortWr": 0.0,
    //     "realizedPnl": 34563.66,
    //     "longPnl": 34563.66,
    //     "shortPnl": 0.00,
    //     "accountTotalValue": 567677.25,
    //     "perp": null,
    //     "spot": null,
    //     "marginUsage": 0.07,
    //     "lastOperationAt": 1670000000000,
    //     "leverage": 4,
    //     "currentPosition": 0
    //   },
    //   {
    //     "address": "0x02a250b4f8479ae742415307a23bc9440e67f737",
    //     "avgHoldingPeriod": 4,
    //     "winRate": 0.80,
    //     "executedOrders": 7,
    //     "profitableTrades": 7,
    //     "longWr": 1.0,
    //     "shortWr": 0.0,
    //     "realizedPnl": 3448.26,
    //     "longPnl": 3448.26,
    //     "shortPnl": 0.00,
    //     "accountTotalValue": 43017.86,
    //     "perp": null,
    //     "spot": null,
    //     "marginUsage": 0.05,
    //     "lastOperationAt": 1670000000000,
    //     "leverage": 2,
    //     "currentPosition": 8
    //   }
    // ]
    //   }
    // }

    result.error = baseCheck(res, accountStore)
    this.discoverListBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      last: (data || []).map((item: any, idx: number) => {
        const bnPnl = new BN(item.realizedPnl)
        const pnlStatus = formatUPnlStatus(bnPnl)
        const executedTrades = item.executedOrders

        return {
          address: item.address,

          winRate: formatPer(item.winRate),
          pnl: bnPnl.toFixed(constants.decimalPlaces.__uPnl__), // 未实现盈亏
          pnlStatus,
          pnlStatusClassname: formatStatusClassName(pnlStatus),
          longWinRate: formatPer(item.longWr),
          longPnl: new BN(item.longPnl).toFixed(constants.decimalPlaces.__uPnl__),
          shortWinRate: formatPer(item.shortWr),
          shortPnl: new BN(item.shortPnl).toFixed(constants.decimalPlaces.__uPnl__),
          // 都为0时，则没开过仓
          lossRate: !item.winRate && !item.shortWr && !item.longWr
            ? '0'
            : formatPer(1-item.winRate),

          accountTotalValue: new BN(item.accountTotalValue).toFixed(constants.decimalPlaces.__COMMON__),
          totalPositions: item.currentPosition, // 持仓数量
          perpValue: new BN(item.perp).toFixed(constants.decimalPlaces.__COMMON__), // 永续合约价值
          spotValue: new BN(item.spot).toFixed(constants.decimalPlaces.__COMMON__), // 现货价值

          marginUsed: new BN(item.marginUsage).toFixed(constants.decimalPlaces.__COMMON__), // 
          marginUsedRatio: formatPer(item.marginUsageRate, true),

          executedTrades, // 已经成功执行的订单
          profitableTrades: item.profitableTrades, // 盈利交易数
          losingTrades: executedTrades - item.profitableTrades, // 亏损交易数
          avgLeverage: item.leverage, // 平均杠杆

          lastActionTs: item.lastOperationAt,
          avgHoldingPeriod: item.avgHoldingPeriod,

          pnlList: (item.pnlList || []).map((_item) => ({
            time: ~~(timeToLocal(_item.timestamp) / 1000),
            value: +_item.value
          }))
        }
      }),
      isEnd: (data || []).length < discoverStore.size
    }

    // update
    merge(discoverStore, result.data)

    return result
  },
  discoverListBusy: false,
}