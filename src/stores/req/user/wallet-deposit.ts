
import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TPrivateWalletStore } from '@/stores'

type UserWalletDepositResult = {
  data: Record<string, any>,
  error: boolean
}

export type TUserWalletDeposit = {
  userWalletDeposit: (accountStore: TAccountStore, privateWalletStore: TPrivateWalletStore) => Promise<UserWalletDepositResult>
  userWalletDepositBusy: boolean
}

export const userWalletDeposit: TUserWalletDeposit = {
  async userWalletDeposit(accountStore, privateWalletStore) {
    const result: UserWalletDepositResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.userWalletDepositBusy || !logged) return result

    this.userWalletDepositBusy = true

    const res = await baseApi.put('/account/deposit', {
      deposit: privateWalletStore.depositNumber
    })

    result.error = baseCheck(res, accountStore)
    this.userWalletDepositBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {}

    return result
  },
  userWalletDepositBusy: false,
}