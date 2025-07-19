import BN from 'bignumber.js'

import { merge, defaults, getDecimalLength } from '@/utils'
import { baseCheck, hyperApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardStore, formatSideByRaw } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type THyperUserHistoricalOrdersResult = {
  data: Record<string, any>,
  error: boolean
}
 
export type THyperUserHistoricalOrders = {
  /**
   * 正在挂的单
   */
  hyperUserHistoricalOrders: (address: string) => Promise<THyperUserHistoricalOrdersResult>
  hyperUserHistoricalOrdersBusy: boolean
  hyperUserHistoricalOrdersInit: boolean
}


export const hyperUserHistoricalOrders: THyperUserHistoricalOrders = {
  async hyperUserHistoricalOrders(address) {
    const result: THyperUserHistoricalOrdersResult = { data: {}, error: true }

    if (this.hyperUserHistoricalOrdersBusy || !address) return result

    this.hyperUserHistoricalOrdersBusy = true

    const res = await hyperApi.post('/info', {
      'type': 'historicalOrders',
      'user': address,
    })

    result.error = false
    this.hyperUserHistoricalOrdersBusy = false
    this.hyperUserHistoricalOrdersInit = false

    if (result.error) return result

    // update
    const data = res.data

    result.data = {
      list: data.map((item: any, idx: number) => {
        const { order, status } = item

        return {
          idx,
          orderId: order.oid,
          side: formatSideByRaw(order.side),
          coin: order.coin,
          size: order.sz,
          isTrigger: order.isTrigger,
          triggerPrice: order.triggerPx,
          isTPSL: order.isPositionTpsl,
          createTs: order.timestamp,
          limitPrice: order.limitPx,
          orderType: (order.orderType || '').toLowerCase(),
          reduceOnly: order.reduceOnly,

          executionStatus: status.toLowerCase() // filled、open、perpmarginrejected、canceled

          // "triggerCondition": "Price below 104275",
          // "children": [],
          // "origSz": "0.0",
          // "tif": “LiquidationMarket”,
          // "cloid": null
        }
      })
    }

    return result
  },
  hyperUserHistoricalOrdersBusy: false,
  hyperUserHistoricalOrdersInit: true,
}