
import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TCopyTradingStore } from '@/stores'

import { formatPositionByItem } from '../utils'

type CopyTradingRemoveMyCopyTradingResult = {
  data: Record<string, any>,
  error: boolean
}

export type TCopyTradingRemoveMyCopyTrading = {
  copyTradingRemoveMyCopyTrading: (accountStore: TAccountStore, copyTradingStore: TCopyTradingStore) => Promise<CopyTradingRemoveMyCopyTradingResult>
  copyTradingRemoveMyCopyTradingBusy: boolean
}

export const copyTradingRemoveMyCopyTrading: TCopyTradingRemoveMyCopyTrading = {
  async copyTradingRemoveMyCopyTrading(accountStore, copyTradingStore) {
    const result: CopyTradingRemoveMyCopyTradingResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.copyTradingRemoveMyCopyTradingBusy || !logged || !copyTradingStore.operaCopyTradingTargetItem) return result

    this.copyTradingRemoveMyCopyTradingBusy = true

    const res = await baseApi.post('/copy-trading/del-copy-trading', {
      wallet: copyTradingStore.operaCopyTradingTargetItem.address
    })

    result.error = baseCheck(res, accountStore)
    this.copyTradingRemoveMyCopyTradingBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {}

    // update

    return result
  },
  copyTradingRemoveMyCopyTradingBusy: false,
}