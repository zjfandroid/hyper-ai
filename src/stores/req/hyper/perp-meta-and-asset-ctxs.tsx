import BN from 'bignumber.js'

import { merge, defaults, getDecimalLength, forEach } from '@/utils'
import { baseCheck, hyperApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardStore, THyperStore, TPriceItem } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'
import { hyperRawByWsActiveAssetCtx } from '@/stores'

type THyperPerpMetaAndAssetCtxsResult = {
  data: Record<string, any>,
  error: boolean
}

export type THyperPerpMetaAndAssetCtxs = {
  /**
   * 合约数据
   */
  hyperPerpMetaAndAssetCtxs: (hyperStore: THyperStore) => Promise<THyperPerpMetaAndAssetCtxsResult>
  hyperPerpMetaAndAssetCtxsBusy: boolean
  hyperPerpMetaAndAssetCtxsInit: boolean
}

export const hyperPerpMetaAndAssetCtxs: THyperPerpMetaAndAssetCtxs = {
  async hyperPerpMetaAndAssetCtxs(hyperStore) {
    const result: THyperPerpMetaAndAssetCtxsResult = { data: {}, error: true }

    if (this.hyperPerpMetaAndAssetCtxsBusy) return result

    this.hyperPerpMetaAndAssetCtxsBusy = true

    const res = await hyperApi.post('/info', {
      'type': 'metaAndAssetCtxs'
    })

    result.error = false
    this.hyperPerpMetaAndAssetCtxsBusy = false
    this.hyperPerpMetaAndAssetCtxsInit = false

    if (result.error) return result

    // update
    const data = res.data || []
    const perpMeta: Record<string, any> = {}
    const perpMarket: Record<string, any> = {}

    data[0].universe.forEach((item, idx) => {
      perpMeta[item.name] = {
        sizeDecimals: item.szDecimals,
        maxLeverage: item.maxLeverage,
        isDelisted: item.isDelisted || false
      }

      // NOTE: 2个数组idx对应
      perpMarket[item.name] = hyperRawByWsActiveAssetCtx(data[1][idx])
    })

    result.data = {
      perpMeta,
      perpMarket
    }

    // update
    // NOTE: 为了提升性能不使用merge，这2个目前都由这个接口更新
    hyperStore.perpMeta = result.data.perpMeta
    hyperStore.perpMarket = result.data.perpMarket

    return result
  },
  hyperPerpMetaAndAssetCtxsBusy: false,
  hyperPerpMetaAndAssetCtxsInit: true
}