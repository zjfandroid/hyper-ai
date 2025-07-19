import BN from 'bignumber.js'

import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TCopyTradingStore } from '@/stores'

import { formatPositionByItem, formatUPnlStatus, formatStatusClassName } from '../utils'

type CopyTradingTargetPositionResult = {
  data: Record<string, any>,
  error: boolean
}

export type TCopyTradingTargetPosition = {
  copyTradingTargetPosition: (accountStore: TAccountStore, copyTradingStore: TCopyTradingStore) => Promise<CopyTradingTargetPositionResult>
  copyTradingTargetPositionBusy: boolean
}

export const copyTradingTargetPosition: TCopyTradingTargetPosition = {
  async copyTradingTargetPosition(accountStore, copyTradingStore) {
    const result: CopyTradingTargetPositionResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.copyTradingTargetPositionBusy || !logged) return result

    this.copyTradingTargetPositionBusy = true

    const res = await baseApi.post('/copy-trading/wallet-position', {
      wallet: copyTradingStore.copyTradingSearchTargetAddress
    })

    result.error = baseCheck(res, accountStore)
    this.copyTradingTargetPositionBusy = false

    if (result.error) return result

    // update
    const { data } = res.data
    const bnTotalUPnl = new BN(data.totalUPnl || 0)
    const copyTradingTargetTotalUPnlStatus = formatUPnlStatus(bnTotalUPnl)

    result.data = {
      // wallet
      copyTradingTargetAddress: copyTradingStore.copyTradingSearchTargetAddress,
      copyTradingTargetTotalPositionValue: data.totalPositionValue || '0', // 总仓位价值
      copyTradingTargetTotalUPnl: bnTotalUPnl.toFixed(constants.decimalPlaces.__uPnl__), // 总未实现盈亏
      copyTradingTargetTotalUPnlStatus,
      copyTradingTargetTotalUPnlStatusClassName: formatStatusClassName(copyTradingTargetTotalUPnlStatus),
      copyTradingTargetPositionList: (data.recodes || []).map((item: any, idx: number) => formatPositionByItem(item, idx))
    }

    // update
    merge(copyTradingStore, result.data)

    return result
  },
  copyTradingTargetPositionBusy: false,
}