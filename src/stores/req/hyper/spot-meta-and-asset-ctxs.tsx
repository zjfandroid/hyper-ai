import BN from 'bignumber.js'

import { merge, defaults, getDecimalLength, forEach } from '@/utils'
import { baseCheck, hyperApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardStore, THyperStore, TPriceItem, hyperRawBySpotMetaAssetCtx } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type THyperSpotMetaAndAssetCtxsResult = {
  data: Record<string, any>,
  error: boolean
}

export type THyperSpotMetaAndAssetCtxs = {
  /**
   * 现货数据
   */
  hyperSpotMetaAndAssetCtxs: (hyperStore: THyperStore) => Promise<THyperSpotMetaAndAssetCtxsResult>
  hyperSpotMetaAndAssetCtxsBusy: boolean
}


export const hyperSpotMetaAndAssetCtxs: THyperSpotMetaAndAssetCtxs = {
  async hyperSpotMetaAndAssetCtxs(hyperStore) {
    const result: THyperSpotMetaAndAssetCtxsResult = { data: {}, error: true }

    if (this.hyperSpotMetaAndAssetCtxsBusy) return result

    this.hyperSpotMetaAndAssetCtxsBusy = true

    const res = await hyperApi.post('/info', {
      'type': 'spotMetaAndAssetCtxs'
    })

    result.error = false
    this.hyperSpotMetaAndAssetCtxsBusy = false

    if (result.error) return result

    // update
    const data = res.data || []
    const rawCoins = data[0]?.tokens || []
    const rawUniverse = data[0]?.universe || []
    const rawPrices = data[1] || []
    const spotMeta: Record<string, any> = {}
    const spotMarket: Record<string, any> = {}

    rawUniverse.forEach((item, idx) => {
      // 对应 rawCoin index
      const coinIndex = item.tokens[0]
      const rawCoin = rawCoins[coinIndex]
      // 对应 rawPrices
      const rawPriceIdx = item.index

      if (rawCoin) {
        const name = rawCoin.name

        spotMeta[name] = {
          sizeDecimals: rawCoin.szDecimals,
          weiDecimals: rawCoin.weiDecimals
        }
        spotMarket[name] = hyperRawBySpotMetaAssetCtx(rawPrices[rawPriceIdx])

        // console.log(rawPriceIdx, rawPrices[rawPriceIdx].markPx, prices[name])
      } else {
        // console.log('coin not found', item)
      }
    })

    // FIX: 没有USDC价格，这里弥补
    spotMarket.USDC = {
      markPrice: '1'
    }

    result.data = {
      spotMeta,
      spotMarket
    }

    // update
    hyperStore.spotMeta = result.data.spotMeta
    hyperStore.spotMarket = result.data.spotMarket

    return result
  },
  hyperSpotMetaAndAssetCtxsBusy: false,
}