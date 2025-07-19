import BN from 'bignumber.js'

import { merge, defaults, getDecimalLength } from '@/utils'
import { baseCheck, hyperApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardStore } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type THyperUserNonFundingResult = {
  data: Record<string, any>,
  error: boolean
}

export type THyperUserNonFunding = {
  /**
   * 出入金记录
   */
  hyperUserNonFunding: (address: string) => Promise<THyperUserNonFundingResult>
  hyperUserNonFundingBusy: boolean
}


export const hyperUserNonFunding: THyperUserNonFunding = {
  async hyperUserNonFunding(address) {
    const result: THyperUserNonFundingResult = { data: {}, error: true }

    if (this.hyperUserNonFundingBusy) return result

    this.hyperUserNonFundingBusy = true

    const res = await hyperApi.post('/info', {
      'type': 'userNonFundingLedgerUpdates',
      'user': address,
    })

    result.error = false
    this.hyperUserNonFundingBusy = false

    if (result.error) return result

    const { decimalPlaces } = constants
    // update
    const data = res.data

    result.data = {
      list: data.map((item: any, idx: number) => {
        const delta = item.delta

        // XXX: 可以按照 type 进行结构赋值
        return {
          idx,
          type: delta.type,
          amount: delta.amount ?? Math.abs(delta.usdc) ?? Math.abs(delta.usdcValue),
          amountToken: delta.token ?? 'USDC',
          usdcValue: delta.usdcValue ?? Math.abs(delta.usdc),
          usdc: delta.usdc,
          destinationAddress: delta.destination,
          fee: delta.fee,
          tx: item.hash,
          createTs: item.time,
        }
      })
    }

    return result
  },
  hyperUserNonFundingBusy: false,
}