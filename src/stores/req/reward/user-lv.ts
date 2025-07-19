
import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TRewardStore } from '@/stores'

type RewardUserLvResult = {
  data: Record<string, any>,
  error: boolean
}

export type TRewardUserLv = {
  rewardUserLv: (accountStore: TAccountStore, rewardStore: TRewardStore) => Promise<RewardUserLvResult>
  rewardUserLvBusy: boolean
}

export const rewardUserLv: TRewardUserLv = {
  async rewardUserLv(accountStore, rewardStore) {
    const result: RewardUserLvResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.rewardUserLvBusy) return result

    this.rewardUserLvBusy = true

    const res = await baseApi.get('/rewards/transaction-point-rule', {
      params: {}
    })

    result.error = baseCheck(res, accountStore)
    this.rewardUserLvBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      lvs: data.map((item: any) => ({
        lv: item.level, // 等级
        bonus: item.bonus, // 等级加成
        minTradingVolume: item.minUsdc, // 最小交易量
        maxTradingVolume: item.maxUsdc, // 最大交易量`
      }))
    }

    // update
    merge(rewardStore, result.data)

    return result
  },
  rewardUserLvBusy: false,
}