import { merge, defaults, localStorage } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore } from '@/stores'

type UserEvmLoginResult = {
  data: Record<string, any>,
  error: boolean
}

export type TUserEvmLogin = {
  userEvmLogin: (accountStore: TAccountStore) => Promise<UserEvmLoginResult>
  userEvmLoginBusy: boolean
}

export const userEvmLogin: TUserEvmLogin = {
  async userEvmLogin(accountStore) {
    const result: UserEvmLoginResult = { data: { accountStore: {} }, error: true }
    const { logged } = accountStore

    if (this.userEvmLoginBusy || logged) return result

    this.userEvmLoginBusy = true

    const res = await baseApi.post('/login/address', {
      address: accountStore.evmAddress,
      signContent: accountStore.evmSignMessage,
      signature: accountStore.evmSignedMessage
    })

    result.error = baseCheck(res, accountStore)
    this.userEvmLoginBusy = false

    if (result.error) {
      accountStore.reset()
      return result
    }

    // update
    const { data } = res.data

    const session = data.token
    const accountInfo = {
      id: data.userId,
      evmAddress: data.address
    }
    result.data = {
      session,
      logged: !!session,

      ...accountInfo
    }

    // storage
    localStorage.set(constants.storageKey.ACCOUNT, accountInfo)
    // update
    merge(accountStore, result.data)

    return result
  },
  userEvmLoginBusy: false,
}