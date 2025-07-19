
import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TPrivateWalletStore } from '@/stores'

type UserDeletePrivateWalletResult = {
  data: Record<string, any>,
  error: boolean
}

export type TUserDeletePrivateWallet = {
  userDeletePrivateWallet: (accountStore: TAccountStore, privateWalletStore: TPrivateWalletStore) => Promise<UserDeletePrivateWalletResult>
  userDeletePrivateWalletBusy: boolean
}

export const userDeletePrivateWallet: TUserDeletePrivateWallet = {
  async userDeletePrivateWallet(accountStore, privateWalletStore) {
    const result: UserDeletePrivateWalletResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.userDeletePrivateWalletBusy || !logged) return result

    this.userDeletePrivateWalletBusy = true

    const res = await baseApi.delete('/account', {
      data: {
        passwd: privateWalletStore.removePW,
      }
    })

    result.error = baseCheck(res, accountStore)
    this.userDeletePrivateWalletBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {}

    return result
  },
  userDeletePrivateWalletBusy: false,
}