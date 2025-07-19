import { useEffect, useState } from 'react'
import { Button, Drawer, Progress } from 'antd'
import BN from 'bignumber.js'
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { useNavigate } from 'react-router-dom';

import { constants, useHyperStore, useTradeStore, useTradeCoinsStore, useReqStore, IPerpMarketItem, IPerpMetaItem } from '@/stores'
import { forEach, formatNumber, sortArrayByKey, merge, infiniteLoop } from '@/utils'
import InputSearch from '@/components/Input/Search'
import CoinIcon from '@/components/CoinIcon'
import ColumnList from '@/components/Column/List'
import PositionItemCommonPnl from '@/components/PositionItem/CommonPnl'
import PositionItemActivity from '@/components/PositionItem/Activity'
import HyperAutoUpdatePerpMetaAndMarket from '@/components/Hyper/AutoUpdatePerpMetaAndMarket'

const AreaDrawerCoins = ({ onClose = (item) => {} }) => {
  const hyperStore = useHyperStore()
  const tradeStore = useTradeStore()
  const tradeCoinsStore = useTradeCoinsStore()
  const reqStore = useReqStore()

  // const navigator = useNavigate()
  const { t, i18n } = useTranslation()
  const autoRefreshCD = 5000

  const handleClose = () => {
    tradeStore.openSelectCoins = false
  }

  const column = [
    { id: 'symbol', label: t('common.symbol'), className: 'col-6 col-sm-3' },
    { id: 'midPrice', sort: true, sortByKey: 'midPrice', label: t('common.lastPrice'), className: 'justify-content-end text-end col-3 col-sm-2' },
    { id: 'priceChange24h', sort: true, sortByKey: 'priceChange24hPct', label: t('common.pct24h'), className: 'justify-content-end text-end col-3 col-sm' },
    { id: 'funding', sort: true, sortByKey: 'fundingPct', label: t('common.eightHFunding'), className: 'justify-content-end text-end col-3 col-sm' },
    { id: 'dayNtlVolume', sort: true, sortByKey: 'dayNtlVolume', label: t('common.volume'), className: 'justify-content-end text-end col-5 col-sm-3' },
    { id: 'dayTradingActivity', sort: true, sortByKey: 'dayTradingActivityPct', label: t('common.activity'), className: 'justify-content-end text-end col-2 col-sm-1' },
  ]

  const renderItem = (item, columnIndex) => {
    const coin = item.coin
    // NOTE: 为了能 sort
    // const market = hyperStore.perpMarket[coin]
    // const meta = hyperStore.perpMeta[coin]

    switch (column[columnIndex].id) {
      case 'symbol':
        return <span className='d-flex flex-wrap'>
          <CoinIcon size='sm' id={coin} className='me-2' />
          <span className='color-white'>{coin}-USD</span>
          <span className='br-1 px-1'>{item.maxLeverage}x</span>
        </span>
      case 'midPrice':
        return <span className='color-white'>{item.midPrice ?? '-'}</span>
      case 'priceChange24h':
        return <span className='d-flex gap-1'>
          {/* <PositionItemCommonPnl prefix='' value={item.priceChange24h} />/ */}
          <PositionItemCommonPnl prefix='' value={item.priceChange24hPct} suffix=' %' />
        </span>
      case 'funding':
        return <>{item.fundingPct} %</>
      case 'dayNtlVolume':
        {/* { market.openInterest} <br/>
        { market.dayBaseVlm} */}
        return <>$ {formatNumber(new BN(item.dayNtlVolume).toFixed(constants.decimalPlaces.__COMMON__))}</>
      case 'dayTradingActivity':
        return <PositionItemActivity value={item.dayTradingActivityPct} />
      default:
        return null
    }
  }

  const handleLoopMarket = () => {
    infiniteLoop(async () => {
      // 关闭时，退出 loop
      if (!tradeStore.openSelectCoins) return true

      const _perpList = []

      if (tradeCoinsStore.init) {
        tradeCoinsStore.init = false
      }

      // NOTE: 必须要有 midPrice 和 meta
      forEach(hyperStore.perpMeta, (item, key) => {
        const market = hyperStore.perpMarket[key]

        if (market && market.midPrice) {
          // NOTE: 其他数值用于排序
          _perpList.push({
            coin: key,
            ...item,
            ...market
          })
        }
      })

      // NOTE: 不使用 merge，优化性能
      tradeCoinsStore.perpList = _perpList
      handleChangeSort()
    }, autoRefreshCD)
  }

  const handleChangeSort = (columnId: string = tradeCoinsStore.sortColumnId, sortByKey: string = '', ascending: boolean = tradeCoinsStore.sortAscending) => {
    if (!sortByKey) {
      sortByKey = column.find(item => item.id === columnId).sortByKey ?? ''
    }
    // update
    merge(tradeCoinsStore, {
      sortColumnId: columnId,
      sortAscending: ascending,
      perpList: sortArrayByKey(tradeCoinsStore.perpList, sortByKey, ascending)
    })
  }

  const handleSearchFilterCoin = (value: string) => {
    const content = (value ?? '').trim()
    tradeCoinsStore.searchCoinInput = content
    tradeCoinsStore.searchCoin = content.toLocaleUpperCase()
  }

  // init
  useEffect(() => {
    if (!tradeStore.openSelectCoins) return

    handleLoopMarket()

    return () => {
      if (!tradeStore.openSelectCoins) {
        // NOTE: 不做整体 reset，因为数据是一直在完整覆盖更新，清掉后，再 open，会有先加载再显示的闪效果
        // tradeCoinsStore.reset()
        tradeCoinsStore.resetSearch()
      }
    }
  }, [tradeStore.openSelectCoins])

  return (
    <>
      <Drawer
        placement='left'
        width={760}
        destroyOnHidden
        closable={{ 'aria-label': 'Close Button' }}
        onClose={handleClose}
        extra={null}
        open={tradeStore.openSelectCoins}
        drawerRender={() => (
          <div className='d-flex flex-column bg-gray-6 h-100vh pointer-events-auto'>
            <div>
              <InputSearch size='small'
                className='col position-relative z-index-9 m-1'
                value={tradeCoinsStore.searchCoinInput}
                placeholder={t('common.searchSymbol')}
                onChange={handleSearchFilterCoin} />
            </div>
            <ColumnList
              columns={column}
              className='col'
              headClassName='ps-2 pe-1 py-2'
              rowClassName='ps-2 pe-1 py-2'
              data={!tradeCoinsStore.searchCoin ? tradeCoinsStore.perpList : tradeCoinsStore.perpList.filter(item => (new RegExp(tradeCoinsStore.searchCoin)).test(item.coin))}
              busy={tradeCoinsStore.init}
              sortColumnId={tradeCoinsStore.sortColumnId}
              renderItem={renderItem}
              onRowClick={(item)=> {
                handleClose()
                onClose(item)
              }}
              onChangeSort={handleChangeSort} />
          </div>
        )}>
      </Drawer>
      <HyperAutoUpdatePerpMetaAndMarket />
    </>
  )
}

export default AreaDrawerCoins