import BN from 'bignumber.js'

import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TCopyTradingStore } from '@/stores'
import { formatUPnlStatus, formatStatusClassName, formatOpenPositionByItem } from '../utils'

type CopyTradingFindByAddressResult = {
  data: Record<string, any>,
  error: boolean
}

export type TCopyTradingFindByAddress = {
  copyTradingFindByAddress: (accountStore: TAccountStore, copyTradingStore: TCopyTradingStore) => Promise<CopyTradingFindByAddressResult>
  copyTradingFindByAddressBusy: boolean
}

export const copyTradingFindByAddress: TCopyTradingFindByAddress = {
  async copyTradingFindByAddress(accountStore, copyTradingStore) {
    const result: CopyTradingFindByAddressResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.copyTradingFindByAddressBusy || !logged) return result

    this.copyTradingFindByAddressBusy = true
    // reset
    copyTradingStore.resetQuickerOpenPosition()

    const res = await baseApi.post('/copy-trading/my-copy-trading-of-wallet', {
      wallet: copyTradingStore.copyTradingSearchTargetAddress
    })

    result.error = baseCheck(res, accountStore)
    this.copyTradingFindByAddressBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      quickerOpenPositionItem: data ? formatOpenPositionByItem(data) : null
    }

    // update
    merge(copyTradingStore, result.data)

    return result
  },
  copyTradingFindByAddressBusy: false,
}