import BN from 'bignumber.js'

import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TPrivateWalletStore } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type UserPrivateWalletResult = {
  data: Record<string, any>,
  error: boolean
}

export type TUserPrivateWallet = {
  userPrivateWallet: (accountStore: TAccountStore, privateWalletStore: TPrivateWalletStore) => Promise<UserPrivateWalletResult>
  userPrivateWalletBusy: boolean
}

export const userPrivateWallet: TUserPrivateWallet = {
  async userPrivateWallet(accountStore, privateWalletStore) {
    const result: UserPrivateWalletResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.userPrivateWalletBusy || !logged) return result

    this.userPrivateWalletBusy = true

    const res = await baseApi.get('/account/wallet', {
      params: {}
    })
    // TEST
    // const res = {
    //   data: {
    //     code: '0',
    //     data:  {
    //       balance: 1500.75,
    //       hasPriKey: true,
    //       nickname: "User123",
    //       passwdPrompt: "Enter your password hint!",
    //       registerTime: "2023-05-01T12:00:00Z",
    //       totalMarginUsed: 300.50,
    //       uPnl: 120.25,
    //       wallet: "0xA1B2C3D4E5F60718293A4B5C6D7E8F9G0H1I2J3K4",
    //       withdrawable: '100.00',
    //     }
    //   }
    // }

    result.error = baseCheck(res, accountStore)
    this.userPrivateWalletBusy = false

    if (result.error) return result

    // update
    const { data } = res.data
    // reset
    privateWalletStore.list = []
    privateWalletStore.addresses = []

    // XXX: 目前只有一个
    result.data = {
      addresses:  (data?.wallet ? [data] : []).map(item => item.wallet),
      list: (data?.wallet ? [data] : []).map((item, idx) => {
        const bnUPnl = new BN(item.upnl)
        const { decimalPlaces } = constants
        const uPnlStatus = formatUPnlStatus(bnUPnl)

        return {
          idx,
          // XXX: 目前只有1
          walletId: 1,
          balance: new BN(item.balance).toFixed(decimalPlaces.__COMMON__),
          hasPrivateKey: item.hasPriKey,
          nickname: item.nickname,
          pwPrompt: item.passwdPrompt,
          createTs: item.registerTime,
          totalMarginUsed: new BN(item.totalMarginUsed).toFixed(decimalPlaces.__COMMON__),
          uPnl: bnUPnl.toFixed(constants.decimalPlaces.__uPnl__),
          uPnlStatus,
          uPnlStatusClassName: formatStatusClassName(uPnlStatus),
          address: item.wallet,
          withdrawable: new BN(item.withdrawable).toFixed(decimalPlaces.__COMMON__)
        }
      })
    }

    // update
    merge(privateWalletStore, result.data)

    return result
  },
  userPrivateWalletBusy: false,
}