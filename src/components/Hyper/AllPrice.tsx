
import { useEffect } from 'react'

import { constants, useHyperStore, useReqStore } from '@/stores'
import { localStorage, forEach, merge } from '@/utils'
import { useHyperWSContext, ReadyState } from '@/components/Hyper/WSContext';

const HyperAllPrice = () => {
  const hyperStore = useHyperStore()
  const reqStore = useReqStore()

  const { sendMessage, lastMessage, readyState } = useHyperWSContext()

  const handleSendMessage = (unsubscribe: boolean = false) => {
    // NOTE: 针对 Prep 的 midPrice
    // NOTE: 目前没有功能区会单独需要现实，所以目前注释掉
    // sendMessage(`{ "method": "${unsubscribe? 'unsubscribe' : 'subscribe'}", "subscription": { "type": "allMids" } }`)
  }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      await reqStore.hyperSpotMetaAndAssetCtxs(hyperStore)
      // NOTE: 改用 ws
      // await reqStore.hyperAllMids(hyperStore)
    }

    asyncFunc()
  }, [])

  // ws
  useEffect(() => {
    if (readyState !== ReadyState.OPEN) return

    handleSendMessage()

    return () => {
      handleSendMessage(true)
    }
  }, [readyState])

  // ws 处理数据
  useEffect(() => {
    if (lastMessage == null) return

    try {
      const res = JSON.parse(lastMessage.data)

      switch(res.channel) {
        case 'allMids':
          const prices = {}

          forEach(res.data?.mids ?? {}, (item, key) => {
            prices[key] = {
              midPrice: item
            }
          })

          merge(hyperStore.perpMarket, prices)
          break
        default:
      }
    } catch(e) {
      console.error(e)
    }
  }, [lastMessage])

  return null
}

export default HyperAllPrice