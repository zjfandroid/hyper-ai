import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { useTradeTradesStore, formatSideByRaw, useHyperStore } from '@/stores'
import { formatNumber, merge } from '@/utils'
import { useHyperWSContext, ReadyState } from '@/components/Hyper/WSContext';
import AreaTrades from '@/components/Area/Trades'

const TradeTrades = ({ coin, unReset = false }) => {
  const tradeTradesStore = useTradeTradesStore()
  const { t, i18n } = useTranslation()
  const { sendMessage, lastMessage, readyState } = useHyperWSContext()
  const hyperStore = useHyperStore()

  const columns = [
    { id: 'price', label: t('common.price'), className: 'col-3' },
    { id: 'size', label: <>{t('common.tradesSize')} ({tradeTradesStore.coin})</>, className: 'justify-content-end text-end col-4' },
    { id: 'blockTime', label: t('common.time'), className: 'justify-content-end text-end col' },
  ]

  const renderItem = (item, columnIndex) => {
    switch (columns[columnIndex].id) {
      case 'price':
        let className = ''

        switch(item.side) {
          case 'buy':
            className = 'color-success'
            break
          case 'sell':
            className = 'color-error'
            break
          default:
        }
        return <>
        <span className={className}>{item.price}</span>
        </>
      case 'size':
        return formatNumber(item.size)
      case 'blockTime':
        return dayjs(item.blockTime).format('HH:mm:ss')
      // case 'time':
      //   return <TimeAgo ts={item.createTs} />
      default:
        return null
    }
  }

  const handleSendMessage = (unsubscribe: boolean = false) => {
    if (!coin) return

    sendMessage(`{ "method": "${unsubscribe? 'unsubscribe' : 'subscribe'}", "subscription": { "type": "trades", "coin": "${coin}" } }`)
  }

  // init
  useEffect(() => {
    // sync
    if (coin && tradeTradesStore.coin !== coin) {
      if (tradeTradesStore.coin) {
        // unsubscribe 旧的
        handleSendMessage(true)
      }
      tradeTradesStore.coin = coin
    }

    if (readyState !== ReadyState.OPEN) return

    handleSendMessage()

    return () => {
      handleSendMessage(true)
      if (!unReset) {
        tradeTradesStore.reset()
      }
    }
  }, [readyState, coin])

  useEffect(() => {
    if (lastMessage == null) return

    try {
      const res = JSON.parse(lastMessage.data)

      switch(res.channel) {
        case 'trades':
          tradeTradesStore.lastRecord = res.data.map((item) => {
            return {
              coin: item.coin,
              side: formatSideByRaw(item.side),
              price: item.px,
              size: item.sz,
              blockTime: item.time,
              hash: item.hash,
              users: item.users
            }
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

  return (
    <AreaTrades className='' height={598}
      coin={tradeTradesStore.coin}
      sizeDecimals={hyperStore.perpMeta[coin]?.sizeDecimals ?? hyperStore.DEFAULT_PERP_META.sizeDecimals}
      lastRecord={tradeTradesStore.lastRecord} />
  )
}

export default TradeTrades