import React, { useEffect, useRef, useState } from 'react';
import BN from 'bignumber.js'
import { Progress } from 'antd';
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { useParams } from 'react-router-dom';

import { useTradeOrderBookStore, useTradeStore, useHyperStore } from '@/stores'
import { merge, formatNumber } from '@/utils'
import { useHyperWSContext, ReadyState } from '@/components/Hyper/WSContext';
import AreaDepth from '@/components/Area/Depth'

const TradeOrderBook = ({ coin, unReset = false }) => {
  const tradeStore = useTradeStore()
  const hyperStore = useHyperStore()
  const tradeOrderBookStore = useTradeOrderBookStore()

  const { t, i18n } = useTranslation()
  const { sendMessage, lastMessage, readyState } = useHyperWSContext()

  const handleDepthByRaw = (raw: Array<any>) => {
    let bnTotalSize = new BN(0)
    let bnTotalOrders = new BN(0)

    return raw.map((item: any) => {
      // NOTE: 可以再这里统一调整 size 精度
      const bnSize = new BN(item.sz)
      const bnOrders = new BN(item.n)
      const bnPrice = new BN(item.px)
      bnTotalSize = bnTotalSize.plus(bnSize)
      bnTotalOrders = bnTotalOrders.plus(bnOrders)

      return {
        price: bnPrice.toString(),
        size: bnSize.toString(),
        orders: bnOrders.toString(),
        totalSize: bnTotalSize.toString(),
        totalOrders: bnTotalOrders.toString(),
        sizeUSD: bnPrice.times(bnSize).toString(),
        totalSizeUSD: bnPrice.times(bnTotalSize).toFixed(0)
      }
    })
  }

  const handleSendMessage = (unsubscribe: boolean = false) => {
    const coin = tradeOrderBookStore.coin
    let mantissa = tradeOrderBookStore.mantissa
    let selectedSigFigValue = tradeOrderBookStore.selectedSigFigValue

    if (tradeOrderBookStore.selectedSigFigValue.includes('_')) {
      tradeOrderBookStore.selectedSigFigValue.split('_').forEach((item, idx) => {
        switch(idx) {
          case 0:
            selectedSigFigValue = item
            break
          case 1:
            mantissa = item
            break
          default:
        }
      })
    }

    if (!coin) return

    sendMessage(`{ "method": "${unsubscribe? 'unsubscribe' : 'subscribe'}", "subscription": { "type": "l2Book", "coin": "${coin}", "nSigFigs": ${selectedSigFigValue}, "mantissa": ${mantissa} } }`)
  }

  const handleSelectSigFigs = (selected: any) => {
    // NOTE: 先退订
    handleSendMessage(true)
    tradeOrderBookStore.selectedSigFigValue = selected
    handleSendMessage()
  }

  // init
  useEffect(() => {
    // sync
    if (coin && tradeOrderBookStore.coin !== coin) {
      if (tradeOrderBookStore.coin) {
        // unsubscribe 旧的
        handleSendMessage(true)
      }
      tradeOrderBookStore.coin = coin
    }

    if (readyState !== ReadyState.OPEN) return

    handleSendMessage()

    return () => {
      handleSendMessage(true)
      if (!unReset) {
        // NOTE: 设置 reset 的话，同页面切换组件会闪
        tradeOrderBookStore.reset()
      }
    }
  }, [readyState, coin])

  // 处理原始数据
  useEffect(() => {
    if (lastMessage == null) return

    try {
      const res = JSON.parse(lastMessage.data)

      switch(res.channel) {
        case 'l2Book':
          merge(tradeOrderBookStore, {
            buyDepth: handleDepthByRaw(res.data.levels[0]),
            sellDepth: handleDepthByRaw(res.data.levels[1])
          })

          break
        case 'subscriptionResponse':
          break
        default:
      }
    } catch(e) {
      console.error(e)
    }
  }, [lastMessage])

  // meta
  useEffect(() => {
    if (!(hyperStore.perpMeta[coin] && hyperStore.perpMeta[coin].sizeDecimals >= 0)) {
      return
    }

    // NOTE: 有些币种会有额外值
    const COINS_PLUS: Record<string, number> = {
      // 'BTC': 1,
      'ETH': 0,
      'HYPE': 0,
      'FARTCOIN': 0,
      'SUI': 0,
      'ARB': -1,
      'kPEPE': -2,
      'PENGU': -2
    }
    const sizeDecimals = hyperStore.perpMeta[coin].sizeDecimals + (COINS_PLUS[coin] ?? 1)

    tradeOrderBookStore.sigFigItems = tradeOrderBookStore.DEFAULT_SIG_FIG_ITEMS.map(item => ({
      ...item,
      label: new BN(item.label).times(Math.pow(10, sizeDecimals)).toFixed()
    }))
  }, [hyperStore.perpMeta[coin]])

  return (
    <AreaDepth className='col'
      sigFigItems={tradeOrderBookStore.sigFigItems}
      selectedSigFigValue={tradeOrderBookStore.selectedSigFigValue}
      onSelectSigFigs={handleSelectSigFigs}
      coin={tradeOrderBookStore.coin}
      levels={tradeOrderBookStore.levels}
      sizeDecimals={hyperStore.perpMeta[coin]?.sizeDecimals ?? hyperStore.DEFAULT_PERP_META.sizeDecimals}
      orders={[
        { limitPrice: '104610', side: 'buy' },
        { limitPrice: '102001', side: 'buy' },
        { limitPrice: '105640', side: 'sell' },
      ]}
      buyDepth={tradeOrderBookStore.buyDepth}
      onClickPrice={(price) => console.log(price)}
      onClickSize={(size) => console.log(size)}
      onClickTotalSize={(totalSize) => console.log(totalSize)}
      sellDepth={tradeOrderBookStore.sellDepth} />
  )
}

export default TradeOrderBook