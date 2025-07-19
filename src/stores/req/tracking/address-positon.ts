import BN from 'bignumber.js'

import { merge, defaults, formatPer } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TTrackingAddressPositionStore } from '@/stores'

import { formatPositionByItem, formatUPnlStatus, formatStatusClassName } from '../utils'

type TrackingAddressPositionResult = {
  data: Record<string, any>,
  error: boolean
}

export type TTrackingAddressPosition = {
  trackingAddressPosition: (accountStore: TAccountStore, trackingAddressPositionStore: TTrackingAddressPositionStore) => Promise<TrackingAddressPositionResult>
  trackingAddressPositionBusy: boolean
}

export const trackingAddressPosition: TTrackingAddressPosition = {
  async trackingAddressPosition(accountStore, trackingAddressPositionStore) {
    const result: TrackingAddressPositionResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.trackingAddressPositionBusy || !logged) return result

    this.trackingAddressPositionBusy = true

    const res = await baseApi.get('/copy-trading/my-track-wallet')
    // TEST
    // const res = {
    //   data: {
    //     code: 0,
    //     data: [
    //       {

    //             "wallet": "0x3d8fe1bdad418b26381d832de158c4d6a52c71f8",
    //             "remark": "1111",
    //             "balance": "0.0",
    //             "pnl": "686242.3302",
    //             "marginUsedRatio": "84.0700%",
    //             "totalPositionValue": "12163666.9990",
    //             "positions": [
    //                 {
    //                     "coin": "BTC",
    //                     "leverage": 40,
    //                     "direction": "long",
    //                     "type": "cross",
    //                     "szi": "8.73389",
    //                     "positionValue": "951697.05774",
    //                     "entryPx": "74829.7",
    //                     "markPx": "108978.5",
    //                     "unrealizedPnl": "298141.976826",
    //                     "unrealizedPnlRatio": "1253.1000%",
    //                     "liquidationPx": "59738.8957105271",
    //                     "marginUsed": "23792.426443"
    //                 },
    //                 {
    //                     "coin": "SOL",
    //                     "leverage": 20,
    //                     "direction": "long",
    //                     "type": "cross",
    //                     "szi": "60881.6",
    //                     "positionValue": "10583048.5280000009",
    //                     "entryPx": "173.3921",
    //                     "markPx": "173.865",
    //                     "unrealizedPnl": "26656.3947",
    //                     "unrealizedPnlRatio": "5.0400%",
    //                     "liquidationPx": "166.6774905734",
    //                     "marginUsed": "529152.4264"
    //                 },
    //                 {
    //                     "coin": "kPEPE",
    //                     "leverage": 10,
    //                     "direction": "long",
    //                     "type": "cross",
    //                     "szi": "45583925.0",
    //                     "positionValue": "628921.413225",
    //                     "entryPx": "0.005867",
    //                     "markPx": "0.013799",
    //                     "unrealizedPnl": "361443.958641",
    //                     "unrealizedPnlRatio": "574.7000%",
    //                     "liquidationPx": "0.0039927633",
    //                     "marginUsed": "62892.141322"
    //                 }
    //             ]
    //         }
   
    //     ]

    //   }
    // }

    result.error = baseCheck(res, accountStore)
    this.trackingAddressPositionBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      list: (data.recodes || []).map((item: any, idx: number) => {
        const bnPnl = new BN(item.pnl)
        const pnlStatus = formatUPnlStatus(bnPnl)

        return {
          address: item.wallet,
          note: item.remark,
          balance: new BN(item.balance).toFixed(constants.decimalPlaces.__COMMON__),
          pnl: bnPnl.toFixed(constants.decimalPlaces.__uPnl__), // 未实现盈亏
          pnlStatus,
          pnlStatusClassname: formatStatusClassName(pnlStatus),
          totalPositionValue: new BN(item.totalPositionValue).toFixed(constants.decimalPlaces.__COMMON__),
          marginUsedRatio: formatPer(item.marginUsedRatio.replace('%', ''), true), // 保证金利用率，直接显示即可
          positions: item.positions.map((positionItem: any, _idx: number) => formatPositionByItem(positionItem, _idx)),

          // 通知
          notificationOn: item.enableNotify,
          notificationSelectedLanguage: item.lang,
          // NOTE: 缺省时自动全选
          notificationSelectedEventTypes: item.notifyAction ? item.notifyAction.split(',') : ['1', '2', '3', '4'],
        }
      })
    }

    // update
    merge(trackingAddressPositionStore, result.data)

    return result
  },
  trackingAddressPositionBusy: false,
}