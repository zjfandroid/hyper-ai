import BN from 'bignumber.js'

import { merge, defaults, getDecimalLength } from '@/utils'
import { baseCheck, hyperApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardStore, formatSideByRaw } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type THyperUserOpenOrdersAdditionalResult = {
  data: Record<string, any>,
  error: boolean
}
 
export type THyperUserOpenOrdersAdditional = {
  /**
   * 正在挂的单
   */
  hyperUserOpenOrdersAdditional: (address: string) => Promise<THyperUserOpenOrdersAdditionalResult>
  hyperUserOpenOrdersAdditionalBusy: boolean
  hyperUserOpenOrdersAdditionalInit: boolean
}


export const hyperUserOpenOrdersAdditional: THyperUserOpenOrdersAdditional = {
  async hyperUserOpenOrdersAdditional(address) {
    const result: THyperUserOpenOrdersAdditionalResult = { data: {}, error: true }

    if (this.hyperUserOpenOrdersAdditionalBusy || !address) return result

    this.hyperUserOpenOrdersAdditionalBusy = true

    const res = await hyperApi.post('/info', {
      'type': 'frontendOpenOrders',
      'user': address,
    })

    result.error = false
    this.hyperUserOpenOrdersAdditionalBusy = false
    this.hyperUserOpenOrdersAdditionalInit = false

    if (result.error) return result

    // update
    const data = res.data

    result.data = {
      list: data.map((item: any, idx: number) => {

        return {
          idx,
          orderId: item.oid,
          side: formatSideByRaw(item.side),
          coin: item.coin,
          size: item.sz,
          isTrigger: item.isTrigger,
          triggerPrice: item.triggerPx,
          isTPSL: item.isPositionTpsl,
          createTs: item.timestamp,
          limitPrice: item.limitPx,
          orderType: (item.orderType || '').toLowerCase(),
          reduceOnly: item.reduceOnly,

          // "triggerCondition": "Price below 104275",
          // "children": [],
          // "origSz": "0.0",
          // "tif": null,
          // "cloid": null
        }
      })
    }

    return result
  },
  hyperUserOpenOrdersAdditionalBusy: false,
  hyperUserOpenOrdersAdditionalInit: true,
}