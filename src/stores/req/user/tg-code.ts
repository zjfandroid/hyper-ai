
import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TPrivateWalletStore } from '@/stores'

type UserTgCodeResult = {
  data: Record<string, any>,
  error: boolean
}

export type TUserTgCode = {
  userTgCode: (accountStore: TAccountStore) => Promise<UserTgCodeResult>
  userTgCodeBusy: boolean
}

export const userTgCode: TUserTgCode = {
  async userTgCode(accountStore) {
    const result: UserTgCodeResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.userTgCodeBusy) return result

    this.userTgCodeBusy = true

    const res = await baseApi.get('/login/code')

    result.error = baseCheck(res, accountStore)
    this.userTgCodeBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      tgCode: data.loginCode
    }

    // update
    merge(accountStore, result.data)

    return result
  },
  userTgCodeBusy: false,
}