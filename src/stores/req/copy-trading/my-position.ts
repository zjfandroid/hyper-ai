
import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TCopyTradingStore } from '@/stores'

import { formatPositionByItem } from '../utils'

type CopyTradingMyPositionResult = {
  data: Record<string, any>,
  error: boolean
}

export type TCopyTradingMyPosition = {
  copyTradingMyPosition: (accountStore: TAccountStore, copyTradingStore: TCopyTradingStore) => Promise<CopyTradingMyPositionResult>
  copyTradingMyPositionBusy: boolean
}

export const copyTradingMyPosition: TCopyTradingMyPosition = {
  async copyTradingMyPosition(accountStore, copyTradingStore) {
    const result: CopyTradingMyPositionResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.copyTradingMyPositionBusy || !logged) return result

    this.copyTradingMyPositionBusy = true

    const res = await baseApi.get('/copy-trading/my-position')
    // const res = {
    //   data: {
    //     code: 0,
    //     data: {
    //       totalPositionValue: '123456',
    //       totalUPnl: '123456',
    //       recodes: [
    //         {
    //           walletId: '1',
    //           coin: 'USDC',
    //           leverage: 10,
    //           direction: 'long',
    //           type: 'isolated',
    //           szi: 1000,
    //           positionValue: 10000,
    //           entryPx: 1.00,
    //           markPx: 1.05,
    //           unrealizedPnl: 50,
    //           unrealizedPnlRatio: '0.5',
    //           liquidationPx: 0.90,
    //           marginUsed: 1000,
    //         },
    //         {
    //           walletId: '2',
    //           coin: 'ETH',
    //           leverage: 5,
    //           direction: 'short',
    //           type: 'cross',
    //           szi: 2,
    //           positionValue: 4000,
    //           entryPx: 2000,
    //           markPx: '0.000000000001',
    //           unrealizedPnl: -100,
    //           unrealizedPnlRatio: '-0.025',
    //           liquidationPx: null,
    //           marginUsed: 400,
    //         }
    //       ]
    //     }

    //   }
    // }

    result.error = baseCheck(res, accountStore)
    this.copyTradingMyPositionBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      // wallet
      totalPositionValue: data.totalPositionValue || '0', // 总仓位价值
      totalUPnl: data.totalUPnl || '0', // 总未实现盈亏
      positionList: (data.recodes || []).map((item: any, idx: number) => formatPositionByItem(item, idx))
    }

    // update
    merge(copyTradingStore, result.data)

    return result
  },
  copyTradingMyPositionBusy: false,
}