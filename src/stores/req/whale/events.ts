import BN from 'bignumber.js'

import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TWhaleEventsStore } from '@/stores'

import { formatPositionByItem } from '../utils'

type WhaleEventsResult = {
  data: Record<string, any>,
  error: boolean
}

export type TWhaleEvents = {
  whaleEvents: (accountStore: TAccountStore, whaleEventsStore: TWhaleEventsStore) => Promise<WhaleEventsResult>
  whaleEventsBusy: boolean
}

export const whaleEvents: TWhaleEvents = {
  async whaleEvents(accountStore, whaleEventsStore) {
    const result: WhaleEventsResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.whaleEventsBusy) return result

    this.whaleEventsBusy = true

    const res = await baseApi.get('/whales/latest-events', {
      params: {
        take: whaleEventsStore.pageSize,
      }
    })

    result.error = baseCheck(res, accountStore)
    this.whaleEventsBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      list: (data || []).map((item: any, idx: number) => {
        const bnSize = new BN(item.positionSize)
        const action = item.positionAction // 1：开仓；2：平仓
        return {
          id: item.id,
          coin: item.symbol,
          address: item.user,
          liquidationPrice: new BN(item.liqPrice).toString(), // 爆仓价格
          type: item.marginMode, // cross
          action,
          direction: bnSize.gt(0) ? 'long' : 'short',
          isPositionOpened: action === 1,
          isPositionClosed: action === 2,
          size: bnSize.toString(), // 正数为long，负数为short
          positionValue: new BN(item.positionValueUsd).toFixed(constants.decimalPlaces.__COMMON__), // 仓位价值
          openPrice: new BN(item.entryPrice).toString(), // 开仓价格
          createTs: new Date(item.createTime + 'Z').getTime()
        }
      })
    }

    // update
    merge(whaleEventsStore, result.data)

    return result
  },
  whaleEventsBusy: false,
}