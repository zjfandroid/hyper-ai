
import { merge, defaults, localStorage } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TPrivateWalletStore } from '@/stores'

type UserInfoResult = {
  data: Record<string, any>,
  error: boolean
}

export type TUserInfo = {
  userInfo: (accountStore: TAccountStore) => Promise<UserInfoResult>
  userInfoBusy: boolean
}

export const userInfo: TUserInfo = {
  async userInfo(accountStore) {
    const result: UserInfoResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.userInfoBusy || !logged) return result

    this.userInfoBusy = true

    const res = await baseApi.get('/account')

    result.error = baseCheck(res, accountStore)
    this.userInfoBusy = false

    if (result.error) return result

    // update
    const { data } = res.data
    const accountInfo = {
      tgFirstName: data.firstName ?? '',
      tgLastName: data.lastName ?? '',
      tgUsername: data.username ?? '',
      id: data.userId,
      tgHeadIco: data.userPhoto || '',
      boundOfficialReferralCode: data.isBound ?? false,
      evmAddress: data.address ?? ''
    }
    result.data = {
      ...accountInfo
    }

    // storage
    localStorage.set(constants.storageKey.ACCOUNT, accountInfo)
    // update
    merge(accountStore, result.data)

    return result
  },
  userInfoBusy: false,
}