import BN from 'bignumber.js'

import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TCopyTradingStore } from '@/stores'
import { formatUPnlStatus, formatStatusClassName, formatCopyTradingByItem } from '../utils'

type CopyTradingMyCopyTradingResult = {
  data: Record<string, any>,
  error: boolean
}

export type TCopyTradingMyCopyTrading = {
  copyTradingMyCopyTrading: (accountStore: TAccountStore, copyTradingStore: TCopyTradingStore) => Promise<CopyTradingMyCopyTradingResult>
  copyTradingMyCopyTradingBusy: boolean
}

export const copyTradingMyCopyTrading: TCopyTradingMyCopyTrading = {
  async copyTradingMyCopyTrading(accountStore, copyTradingStore) {
    const result: CopyTradingMyCopyTradingResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.copyTradingMyCopyTradingBusy || !logged) return result

    this.copyTradingMyCopyTradingBusy = true

    const res = await baseApi.get('/copy-trading/my-copy-trading')
    // const res = {
    //   data: {
    //     code: 0,
    //     data: {
    //       recodes: [
    //          {
    //             wallet: '0x1234567890abcdef1234567890abcdef12345678',
    //             remark: 'Main Wallet',
    //             balance: '1500.50',
    //             pnl: '250.00',
    //             marginUsedRatio: 0.75,
    //           },
    //           {
    //             wallet: '0xfedcba0987654321fedcba0987654321fedcba09',
    //             remark: 'Trading Wallet',
    //             balance: '2500.00',
    //             pnl: '-500.00',
    //             marginUsedRatio: 0.50,
    //           }
    //       ]
    //     }
    //   }
    // }

    result.error = baseCheck(res, accountStore)
    this.copyTradingMyCopyTradingBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      copyTradingList: (data.recodes || []).map(formatCopyTradingByItem)
    }

    // update
    merge(copyTradingStore, result.data)

    return result
  },
  copyTradingMyCopyTradingBusy: false,
}