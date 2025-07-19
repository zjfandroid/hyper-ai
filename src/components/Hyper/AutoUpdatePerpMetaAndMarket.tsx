import { useEffect, useState } from 'react'

import { constants, useHyperStore, useTradeStore, useTradeCoinsStore, useReqStore, IPerpMarketItem, IPerpMetaItem } from '@/stores'
import { forEach, formatNumber, sortArrayByKey, merge, infiniteLoop } from '@/utils'

const HyperAutoUpdatePerpMetaAndMarket = () => {
  const hyperStore = useHyperStore()
  const reqStore = useReqStore()

  const autoRefreshCD = 5000

  const handleLoopMarket = () => {
    infiniteLoop(async () => {
      await reqStore.hyperPerpMetaAndAssetCtxs(hyperStore)
    }, autoRefreshCD)
  }

  // init
  useEffect(() => {
    // 多次调用，避免重复请求
    if (hyperStore.loopPerpMetaAndMarket) return

    hyperStore.loopPerpMetaAndMarket = true
    handleLoopMarket()

    return () => {
      hyperStore.loopPerpMetaAndMarket = false
    }
  }, [])

  return null
}

export default HyperAutoUpdatePerpMetaAndMarket