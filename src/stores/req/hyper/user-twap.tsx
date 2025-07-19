import BN from 'bignumber.js'

import { merge, defaults, getDecimalLength } from '@/utils'
import { baseCheck, hyperApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardStore } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type THyperUserTWAPResult = {
  data: Record<string, any>,
  error: boolean
}

export type THyperUserTWAP = {
  /**
   * TWAP 时间加权均价订单
   */
  hyperUserTWAP: (address: string) => Promise<THyperUserTWAPResult>
  hyperUserTWAPBusy: boolean
}


export const hyperUserTWAP: THyperUserTWAP = {
  async hyperUserTWAP(address) {
    const result: THyperUserTWAPResult = { data: {}, error: true }

    if (this.hyperUserTWAPBusy) return result

    this.hyperUserTWAPBusy = true

    const res = await hyperApi.post('/info', {
      'type': 'userTwapSliceFills',
      'user': address,
    })

    result.error = false
    this.hyperUserTWAPBusy = false

    if (result.error) return result

    const { decimalPlaces } = constants
    // update
    const data = res.data

    result.data = {
      list: data.map((item: any, idx: number) => {
        const fill = item.fill

        return {
          idx,
          coin: fill.coin,
          price: fill.px,
          side: fill.side === 'B' && 'buy' || fill.side === 'A' && 'sell' || fill.side,
          startPosition: new BN(fill.startPosition).toFixed(decimalPlaces.__COMMON__),
          closedPnl: new BN(fill.closedPnl).toFixed(decimalPlaces.__uPnl__),
          tx: fill.hash,
          fee: new BN(fill.fee).toFixed(decimalPlaces.__COMMON__),
          size: fill.sz,
          // crossed
          // dir
          twapId: item.twapId,
          feeToken: fill.feeToken,
          createTs: fill.time,
        }
      })
    }

    return result
  },
  hyperUserTWAPBusy: false,
}