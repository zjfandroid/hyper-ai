import BN from 'bignumber.js'

import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TTrackingCreateStore, TTrackingAddressPositionStore } from '@/stores'

import { formatPositionByItem, formatUPnlStatus, formatStatusClassName } from '../utils'

type TrackingCreateResult = {
  data: Record<string, any>,
  error: boolean
}

export type TTrackingCreate = {
  trackingCreate: (accountStore: TAccountStore, trackingCreateStore: TTrackingCreateStore, trackingAddressPositionStore: TTrackingAddressPositionStore) => Promise<TrackingCreateResult>
  trackingCreateBusy: boolean
}

export const trackingCreate: TTrackingCreate = {
  async trackingCreate(accountStore, trackingCreateStore, trackingAddressPositionStore) {
    const result: TrackingCreateResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.trackingCreateBusy || !logged) return result

    this.trackingCreateBusy = true

    const res = await baseApi.post('/copy-trading/create-track-wallet', {
      recodes: trackingAddressPositionStore.batchImportAddresses.length
        ? trackingAddressPositionStore.batchImportAddresses
        : [
            {
              wallet: trackingCreateStore.createTrackAddress,
              remark: trackingCreateStore.createTrackNote,
              enableNotify: trackingCreateStore.notificationOn ? 1 : 0,
              notifyAction: trackingCreateStore.notificationSelectedEventTypes.join(','),
              lang: trackingCreateStore.notificationSelectedLanguage
            }
          ]
    })

    result.error = baseCheck(res, accountStore)
    this.trackingCreateBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      // data 返回成功几个，但用户已存在的address也会表示成功
    }

    return result
  },
  trackingCreateBusy: false,
}