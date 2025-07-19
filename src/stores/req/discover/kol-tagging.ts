import BN from 'bignumber.js'

import { merge, defaults, formatPer } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TDiscoverStore, TDiscoverKolStore } from '@/stores'

import { formatPositionByItem, formatUPnlStatus, formatStatusClassName, timeToLocal } from '../utils'

type DiscoverKolTaggingResult = {
  data: Record<string, any>,
  error: boolean
}

export type TDiscoverKolTagging = {
  discoverKolTagging: (accountStore: TAccountStore, discoverKolStore: TDiscoverKolStore) => Promise<DiscoverKolTaggingResult>
  discoverKolTaggingBusy: boolean
}

export const discoverKolTagging: TDiscoverKolTagging = {
  async discoverKolTagging(accountStore, discoverKolStore) {
    const result: DiscoverKolTaggingResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.discoverKolTaggingBusy) return result

    this.discoverKolTaggingBusy = true


    const res = await baseApi.post('/leaderboard/kol', {
      username: discoverKolStore.assistTaggingKolUsername,
      address: discoverKolStore.assistTaggingKolAddress
    })

    result.error = baseCheck(res, accountStore)
    this.discoverKolTaggingBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
    }


    return result
  },
  discoverKolTaggingBusy: false,
}