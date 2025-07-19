
import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TCopyTradingStore } from '@/stores'

import { formatPositionByItem } from '../utils'

type CopyTradingCreateCopyTradingResult = {
  data: Record<string, any>,
  error: boolean
}

export type TCopyTradingCreateCopyTrading = {
  copyTradingCreateCopyTrading: (accountStore: TAccountStore, copyTradingStore: TCopyTradingStore) => Promise<CopyTradingCreateCopyTradingResult>
  copyTradingCreateCopyTradingBusy: boolean
}

export const copyTradingCreateCopyTrading: TCopyTradingCreateCopyTrading = {
  async copyTradingCreateCopyTrading(accountStore, copyTradingStore) {
    const result: CopyTradingCreateCopyTradingResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.copyTradingCreateCopyTradingBusy || !logged) return result

    this.copyTradingCreateCopyTradingBusy = true

    const res = await baseApi.post('/copy-trading/create-copy-trading', {
      wallet: copyTradingStore.copyTradingTargetAddress,
      remark: copyTradingStore.openPositionTargeNote,
      leverage: copyTradingStore.openPositionLeverage, // 1-40
      buyModel: copyTradingStore.openPositionBuyModel, // 1=固定跟买，2=等比跟买，3=最大跟买
      buyModelValue: +copyTradingStore.openPositionBuyModelValue, // 当buyModel为1，3最此值必填
      sellModel: copyTradingStore.openPositionSellModel, // 1=翻本卖出，2=等比跟卖，3=止盈止损，4=不跟卖
      /*
      格式：止盈比例|止损比例
      例如：
      涨100%止盈, 跌50%止损：100|50
      涨100%止盈：100|
      跌50%止损：|50
      */
      sellModelValue: copyTradingStore.openPositionSellModelValue, // 当sellModel=3时，为必填，格式为 30|40
      direction: copyTradingStore.openPositionTradeStrategyValue // 0=正常，1=跟反向
    })

    result.error = baseCheck(res, accountStore)
    this.copyTradingCreateCopyTradingBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      positionList: (data.recodes || []).map((item: any, idx: number) => formatPositionByItem(item, idx))
    }

    // update
    merge(copyTradingStore, result.data)

    return result
  },
  copyTradingCreateCopyTradingBusy: false,
}