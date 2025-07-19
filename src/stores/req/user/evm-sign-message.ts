
import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TPrivateWalletStore } from '@/stores'

type UserEvmSignMessageResult = {
  data: Record<string, any>,
  error: boolean
}

export type TUserEvmSignMessage = {
  userEvmSignMessage: (accountStore: TAccountStore) => Promise<UserEvmSignMessageResult>
  userEvmSignMessageBusy: boolean
}

export const userEvmSignMessage: TUserEvmSignMessage = {
  async userEvmSignMessage(accountStore) {
    const result: UserEvmSignMessageResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.userEvmSignMessageBusy) return result

    this.userEvmSignMessageBusy = true

    const res = await baseApi.get('/login/sign')

    result.error = baseCheck(res, accountStore)
    this.userEvmSignMessageBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      evmSignMessage: data
    }

    // udpate
    merge(accountStore, result.data)

    return result
  },
  userEvmSignMessageBusy: false,
}