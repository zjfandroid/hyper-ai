import { merge, defaults, localStorage } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore } from '@/stores'

type UserTgLoginResult = {
  data: Record<string, any>,
  error: boolean
}

export type TUserTgLogin = {
  userTgLogin: (accountStore: TAccountStore) => Promise<UserTgLoginResult>
  userTgLoginBusy: boolean
}

export const userTgLogin: TUserTgLogin = {
  async userTgLogin(accountStore) {
    const result: UserTgLoginResult = { data: { accountStore: {} }, error: true }
    const { logged } = accountStore

    if (this.userTgLoginBusy || logged) return result

    this.userTgLoginBusy = true
    const params = defaults(JSON.parse(accountStore.tgAccountData), {
      id: -1,
      auth_date: -1,
      first_name:'',
      hash: '',
      last_name: '',
      photo_url: '',
      username: ''
    })
    // console.log(accountStore.senderInvitationsCode)
    const res = await baseApi.post('/login', {
      authDate: params.auth_date,
      firstName: params.first_name,
      hash: params.hash,
      id: params.id,
      lastName: params.last_name,
      photoUrl: params.photo_url,
      username: params.username,
      inviter: accountStore.senderInvitationsCode
    })

    result.error = baseCheck(res, accountStore)
    this.userTgLoginBusy = false

    if (result.error) {
      accountStore.reset()
      return result
    }

    // update
    const { data } = res.data

    const session = data.token
    const accountInfo = {
      tgFirstName: data.firstName,
      tgLastName: data.lastName,
      tgUsername: data.username,
      id: data.userId,
      tgHeadIco: params.photo_url
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
  userTgLoginBusy: false,
}