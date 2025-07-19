import BN from 'bignumber.js'

import { merge, defaults, getDecimalLength } from '@/utils'
import { baseCheck, hyperApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardStore } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type THyperUserSpotClearinghouseStateResult = {
  data: Record<string, any>,
  error: boolean
}

export type THyperUserSpotClearinghouseState = {
  /**
   * 账户的现货
   */
  hyperUserSpotClearinghouseState: (address: string) => Promise<THyperUserSpotClearinghouseStateResult>
  hyperUserSpotClearinghouseStateBusy: boolean
}


export const hyperUserSpotClearinghouseState: THyperUserSpotClearinghouseState = {
  async hyperUserSpotClearinghouseState(address) {
    const result: THyperUserSpotClearinghouseStateResult = { data: {}, error: true }

    if (this.hyperUserSpotClearinghouseStateBusy) return result

    this.hyperUserSpotClearinghouseStateBusy = true

    const res = await hyperApi.post('/info', {
      'type': 'spotClearinghouseState',
      'user': address
    })

    result.error = false
    this.hyperUserSpotClearinghouseStateBusy = false

    if (result.error) return result

    const { decimalPlaces } = constants
    // update
    const data = res.data

    result.data = {
      assets: (data?.balances || []).map((item: any, idx: number) => {
        return {
          tokenIdx: item.token,
          coin: item.coin,
          amount: item.total,
          // "hold": "0.0",
          // "entryNtl": "0.0"
        }
      })
    }

    return result
  },
  hyperUserSpotClearinghouseStateBusy: false,
}