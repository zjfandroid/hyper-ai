import BN from 'bignumber.js'

import { merge, defaults, getDecimalLength } from '@/utils'
import { baseCheck, hyperApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardStore, formatSideByRaw } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type THyperUserFillsResult = {
  data: Record<string, any>,
  error: boolean
}

export type THyperUserFills = {
  /**
   * 获取账号的最近完成订单
   * （最多2000条，aggregateByTime为true会把同一时刻的订单合为一条）
   *  userFillsByTime接口（一次最多2000条，最多可查10000条（可能略高））
   */
  hyperUserFills: (address: string) => Promise<THyperUserFillsResult>
  hyperUserFillsBusy: boolean
}


export const hyperUserFills: THyperUserFills = {
  async hyperUserFills(address) {
    const result: THyperUserFillsResult = { data: {}, error: true }

    if (this.hyperUserFillsBusy) return result

    this.hyperUserFillsBusy = true

    const res = await hyperApi.post('/info', {
      'type': 'userFills',
      'user': address,
      'aggregateByTime': true
    })

    result.error = false
    this.hyperUserFillsBusy = false

    if (result.error) return result

    const { decimalPlaces } = constants
    // update
    const data = res.data

    result.data = {
      list: data.map((item: any, idx: number) => {
        return {
          idx,
          coin: item.coin,
          price: item.px,
          side: formatSideByRaw(item.side),
          startPosition: new BN(item.startPosition).toFixed(decimalPlaces.__COMMON__),
          closedPnl: new BN(item.closedPnl).toFixed(decimalPlaces.__uPnl__),
          tx: item.hash,
          fee: new BN(item.fee).toFixed(decimalPlaces.__COMMON__),
          size: item.sz,
          // crossed
          // dir
          feeToken: item.feeToken,
          createTs: item.time,
        }
      })
    }

    return result
  },
  hyperUserFillsBusy: false,
}