import BN from 'bignumber.js'

import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TTrackingAddressPositionStore } from '@/stores'

import { formatPositionByItem, formatUPnlStatus, formatStatusClassName } from '../utils'

type TrackingRemoveResult = {
  data: Record<string, any>,
  error: boolean
}

export type TTrackingRemove = {
  trackingRemove: (accountStore: TAccountStore, trackingAddressPositionStore: TTrackingAddressPositionStore) => Promise<TrackingRemoveResult>
  trackingRemoveBusy: boolean
}

export const trackingRemove: TTrackingRemove = {
  async trackingRemove(accountStore, trackingAddressPositionStore) {
    const result: TrackingRemoveResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.trackingRemoveBusy || !logged) return result

    this.trackingRemoveBusy = true

    const res = await baseApi.post('/copy-trading/del-track-wallet', {
      wallet: trackingAddressPositionStore.removeTrackAddress
    })

    result.error = baseCheck(res, accountStore)
    this.trackingRemoveBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {}

    return result
  },
  trackingRemoveBusy: false,
}