import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TCopyTradingStore } from '@/stores'

import { formatPositionByItem } from '../utils'

type CopyTryTradingClosePositionResult = {
  data: Record<string, any>,
  error: boolean
}

export type TCopyTryTradingClosePosition = {
  copyTryTradingClosePosition: (accountStore: TAccountStore, copyTradingStore: TCopyTradingStore) => Promise<CopyTryTradingClosePositionResult>
  copyTryTradingClosePositionBusy: boolean
}

export const copyTryTradingClosePosition: TCopyTryTradingClosePosition = {
  async copyTryTradingClosePosition(accountStore, copyTradingStore) {
    const result: CopyTryTradingClosePositionResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.copyTryTradingClosePositionBusy || !logged || !(copyTradingStore.operaPositionIdx >= 0)) return result

    this.copyTryTradingClosePositionBusy = true

    const targetPosition = copyTradingStore.positionList[copyTradingStore.operaPositionIdx]
    const res = await baseApi.post('/copy-trading/close-position', {
      coin: targetPosition.coin,
      type: copyTradingStore.closePositionTabId, // market=市价，limit=限价
      px: copyTradingStore.closePositionTabId === 'limit' ? copyTradingStore.closePositionPrice : '' // 当限价时，此值必填
    })

    result.error = baseCheck(res, accountStore)
    this.copyTryTradingClosePositionBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
    }

    // update

    return result
  },
  copyTryTradingClosePositionBusy: false,
}