
import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TPrivateWalletStore } from '@/stores'

type UserCreatePrivateWalletResult = {
  data: Record<string, any>,
  error: boolean
}

export type TUserCreatePrivateWallet = {
  userCreatePrivateWallet: (accountStore: TAccountStore, privateWalletStore: TPrivateWalletStore) => Promise<UserCreatePrivateWalletResult>
  userCreatePrivateWalletBusy: boolean
}

export const userCreatePrivateWallet: TUserCreatePrivateWallet = {
  async userCreatePrivateWallet(accountStore, privateWalletStore) {
    const result: UserCreatePrivateWalletResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.userCreatePrivateWalletBusy || !logged) return result

    this.userCreatePrivateWalletBusy = true

    const res = await baseApi.post('/account/create-wallet', {
      passwd: privateWalletStore.createPW,
      passwdPrompt: privateWalletStore.createPWPrompt,
      nickname: privateWalletStore.createNickname
    })

    result.error = baseCheck(res, accountStore)
    this.userCreatePrivateWalletBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    // NOTE: 目前只有一个
    result.data = {
      list: [{
        balance: data.balance,
        hasPrivateKey: data.hasPriKey,
        nickname: data.nickname,
        pwPrompt: data.passwdPrompt,
        createTs: data.registerTime,
        totalMarginUsed: data.totalMarginUsed,
        uPnl: data.uPnl,
        address: data.wallet,
        withdrawable: data.withdrawable,
      }]
    }

    // update
    merge(privateWalletStore, result.data)

    return result
  },
  userCreatePrivateWalletBusy: false,
}