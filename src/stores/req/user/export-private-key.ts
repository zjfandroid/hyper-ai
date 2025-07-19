
import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TPrivateWalletStore } from '@/stores'

type UserExportPrivateKeyResult = {
  data: Record<string, any>,
  error: boolean
}

export type TUserExportPrivateKey = {
  userExportPrivateKey: (accountStore: TAccountStore, privateWalletStore: TPrivateWalletStore) => Promise<UserExportPrivateKeyResult>
  userExportPrivateKeyBusy: boolean
}

// 导出私钥
export const userExportPrivateKey: TUserExportPrivateKey = {
  async userExportPrivateKey(accountStore, privateWalletStore) {
    const result: UserExportPrivateKeyResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.userExportPrivateKeyBusy || !logged) return result

    this.userExportPrivateKeyBusy = true

    const res = await baseApi.get('/account/pri-key', {
      params: {
        passwd: privateWalletStore.exportPrivateKeyPW
      }
    })

    result.error = baseCheck(res, accountStore)
    this.userExportPrivateKeyBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      exportPrivateKeyContent: data.priKey
    }

    // update
    merge(privateWalletStore, result.data)

    return result
  },
  userExportPrivateKeyBusy: false,
}