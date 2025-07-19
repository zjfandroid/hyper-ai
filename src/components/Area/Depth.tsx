import React, { ReactNode, useEffect } from 'react'
import { Pagination, Button, Progress } from 'antd'
import BN from 'bignumber.js'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { createStore } from '@/stores/helpers'
import { TDepthItem, TOrderBookSigFigItem } from '@/stores'
import { formatNumber, merge } from '@/utils'
import { IOutlineSort } from '@/components/icon'
import ColumnNoData from '@/components/Column/NoData'
import ProgressBar from '@/components/ProgressBar'
import DropdownMenu from '@/components/Dropdown/Menu'

import './Depth.scss'

interface TAreaDepth {
  sellDepth: Array<TDepthItem>
  buyDepth: Array<TDepthItem>
  maxTotalSize: string
  bidAskSpread: string
  sizeSymbolItems: Array<{label: string, value: string}>
  selectedSizeSymbolValue: string
  isUSDSizeSymbol: boolean
  buyOrderPrices: Set<string>
  sellOrderPrices: Set<string>
}

const useAreaDepth = createStore<TAreaDepth>({
  sellDepth: [],
  buyDepth: [],
  maxTotalSize: '0',
  bidAskSpread: '0',
  sizeSymbolItems: [
    { label: '', value: '' },
    { label: 'USD', value: 'USD' },
  ],
  selectedSizeSymbolValue: 'USD',
  isUSDSizeSymbol: true,
  buyOrderPrices: new Set(),
  sellOrderPrices: new Set(),
})

interface ColumnItem {
  id: string
  label: string | ReactNode
  className?: string
}

interface AreaDepthProps {
  className?: string
  style?: Record<string, string>
  coin?: string
  buyDepth?: Array<TDepthItem> | null
  sellDepth?: Array<TDepthItem> | null
  levels?: number // 深度数量
  height?: number
  sizeDecimals?: number
  logged?: boolean
  orders?: Array<{ limitPrice: string, side: 'buy' | 'sell', locked?: boolean }> | null
  // FIX: 只设置maxHeight时，无法出现滚动条
  maxHeight?: number
  sigFigItems?: Array<TOrderBookSigFigItem>
  selectedSigFigValue?: string
  onSelectSigFigs?: (selected: string) => void
  onClickPrice?: (price: string) => void | null
  onClickSize?: (size: string) => void | null
  onClickTotalSize?: (totalSize: string) => void | null
}

const AreaDepth: React.FC<AreaDepthProps> = ({
  buyDepth = null,
  sellDepth = null,
  coin = '',
  height,
  logged = false,
  sizeDecimals = 2,
  levels = 10,
  style = {},
  maxHeight,
  className = '',
  sigFigItems = [],
  orders = null,
  selectedSigFigValue = '',
  onSelectSigFigs = (selected) => {},
  onClickPrice = null,
  onClickSize = null,
  onClickTotalSize = null,
}) => {
  const areaDepth = useAreaDepth()

  const DEFAULT_DEPTH_ITEM = { price: '-', size: '-', totalSize: '-', orders: '-', totalOrders: '-', sizeUSD: '-', totalSizeUSD: '-', noData: true }

  const { t, i18n } = useTranslation()

  // default

  const columns = [
    { id: 'price', label: t('common.price'), className: 'col-3' },
    { id: 'size', label: <>{t('common.depthSize')} {areaDepth.isUSDSizeSymbol ? '(USD)' : `(${coin})`}</>, className: 'justify-content-end text-end col' },
    { id: 'totalSize', label: <>{t('common.depthTotalSize')} {areaDepth.isUSDSizeSymbol ? '(USD)' : `(${coin})`}</>, className: 'justify-content-end text-end col' },
  ]

  const renderItem = (item, columnIndex, type = '') => {
    switch (columns[columnIndex].id) {
      case 'price':
        return (
          <span className={`${!item.noData && onClickPrice ? 'linker-highlight' : ''} ${type === 'buy' && 'color-buy-weak' || type === 'sell' && 'color-sell-weak' || ''}`} onClick={() => !item.noData && onClickPrice && onClickPrice(item.price)}>
            { item.price }
          </span>
        )
      case 'size':
        const bnSize = new BN(item.size)

        return (
          <span className={`${!item.noData && onClickSize ? 'linker-highlight' : ''}`}
            onClick={() => !item.noData && onClickSize && onClickSize(areaDepth.isUSDSizeSymbol ? item.sizeUSD : item.size)}>
            {
              !item.noData
                ? formatNumber(areaDepth.isUSDSizeSymbol ? item.sizeUSD : new BN(item.size).toFixed(sizeDecimals))
                : '-'
            }
          </span>
        )
      case 'totalSize':
        return (
          <span className={`${!item.noData && onClickTotalSize ? 'linker-highlight' : ''}`}
            onClick={() => !item.noData && onClickTotalSize && onClickTotalSize(areaDepth.isUSDSizeSymbol ? item.totalSizeUSD : item.totalSize)}>
            {
              !item.noData
                ? formatNumber(areaDepth.isUSDSizeSymbol ? item.totalSizeUSD : new BN(item.totalSize).toFixed(sizeDecimals))
                : '-'
            }
          </span>
        )
      default:
        return null
    }
  }

  const onSelectSizeSymbol = (value: string) => {
    const isUSDSizeSymbol = value === 'USD'

    merge(areaDepth, {
      selectedSizeSymbolValue: value,
      isUSDSizeSymbol
    })
  }

  const renderDepthItem = (item, idx, type) => {
    let barClassName = ''
    let isExistingOrder = false

    switch(type) {
      case 'buy':
        barClassName = 'bg-buy-weak'

        for (const price of areaDepth.buyOrderPrices) {
          if (new BN(price).gte(item.price)) {
            areaDepth.buyOrderPrices.delete(price)
            isExistingOrder = true
            break
          }
        }
        break
      case 'sell':
        barClassName = 'bg-sell-weak'

        for (const price of areaDepth.sellOrderPrices) {
          if (new BN(price).gte(item.price)) {
            areaDepth.sellOrderPrices.delete(price)
            isExistingOrder = true
            break
          }
        }
        break
      default:
    }

    return (
      <li key={idx} className={`d-flex flex-column position-relative`}>
        {
          !item.noData &&
            <ProgressBar bgColor='transparent'
              percent={+new BN(item.totalSize || 0).div(areaDepth.maxTotalSize).times(100).toFixed(2)}
              className='position-absolute position-full'
              barClassName={barClassName} />
        }
        <div className={`d-flex col align-items-center position-relative ps-3 pe-3 col ${isExistingOrder ? 'existing-order' : ''}`}>
          {
            columns.map((column, columnIndex) => (
              <span key={columnIndex} className={`fw-500 color-secondary line-feed ${column.className}`}>
                {renderItem(item, columnIndex, type)}
              </span>
            ))
          }
        </div>
      </li>
    )
  }

  // handle
  useEffect(() => {
    let buyDepthTotalSize = '0'
    let sellDepthTotalSize = '0'
    let buyLevel1Price = '0'
    let sellLevel1Price = '0';

    (orders || []).forEach((order) => {
      switch(order.side) {
        case 'buy':
          areaDepth.buyOrderPrices.add(order.limitPrice)
          break
        case'sell':
          areaDepth.sellOrderPrices.add(order.limitPrice)
          break
        default:
      }
    })

    if (sellDepth && sellDepth.length) {
      areaDepth.sellDepth = sellDepth.slice(0, levels)
      sellDepthTotalSize = areaDepth.sellDepth[areaDepth.sellDepth.length - 1].totalSize ?? '0'
      sellLevel1Price = sellDepth[0].price

      const fillLen = levels - areaDepth.sellDepth.length
      if (fillLen > 0) {
        areaDepth.sellDepth = areaDepth.sellDepth.concat(Array(fillLen).fill({ ...DEFAULT_DEPTH_ITEM }))
      }
    } else {
      areaDepth.sellDepth = Array(levels).fill({ ...DEFAULT_DEPTH_ITEM })
    }

    if (buyDepth && buyDepth.length) {
      areaDepth.buyDepth = buyDepth.slice(0, levels)
      buyDepthTotalSize = areaDepth.buyDepth[areaDepth.buyDepth.length - 1].totalSize ?? '0'
      buyLevel1Price = buyDepth[0].price

      const fillLen = levels - areaDepth.buyDepth.length
      if (fillLen > 0) {
        areaDepth.buyDepth = areaDepth.buyDepth.concat(Array(fillLen).fill({ ...DEFAULT_DEPTH_ITEM }))
      }
    } else {
      areaDepth.buyDepth = Array(levels).fill({ ...DEFAULT_DEPTH_ITEM })
    }

    merge(areaDepth, {
      maxTotalSize: BN.max(buyDepthTotalSize, sellDepthTotalSize).toString(),
      bidAskSpread: new BN(sellLevel1Price).minus(buyLevel1Price).toString()
    })
  }, [buyDepth, sellDepth])

  useEffect(() => {
    areaDepth.sizeSymbolItems[0] = {
      label: coin,
      value: coin
    }
    // NOTE: 默认用币本位
    onSelectSizeSymbol(coin)
  }, [coin])

  return (
    <>
      <div className='d-flex py-1'>
        {
          sigFigItems.length
            ? <DropdownMenu buttonSize='small' placement='bottomLeft'
                items={sigFigItems}
                selectedValue={selectedSigFigValue}
                onSelect={onSelectSigFigs} />
            : <></>
        }
        <DropdownMenu buttonSize='small'
          className='ms-auto'
          items={areaDepth.sizeSymbolItems}
          selectedValue={areaDepth.selectedSizeSymbolValue}
          onSelect={onSelectSizeSymbol} />
      </div>
      <dl className={`d-flex flex-column bg-gray-alpha-4 overflow-hidden column-list area-depth ${className} `} style={{ height: height ? `${height}px` : undefined, maxHeight: maxHeight ? `${maxHeight}px` : undefined, ...style }}>
        <dt className='d-flex flex-column bg-gray-alpha-? fw-500'>

          <div className='d-flex col ps-3 pe-3'>
            {
              columns.map((item, idx) => (
                <small key={idx} className={`d-flex align-items-center gap-1 py-2 color-unimportant ${item.className ?? ''}`}>
                  {item.label}
                </small>
              ))
            }
          </div>
        </dt>
        <dd className='d-flex flex-column col overflow-y-auto'>
          <ul className={`d-flex flex-column col`}>
            {
              [...areaDepth.sellDepth].reverse().map((item, idx) => renderDepthItem(item, idx, 'sell'))
            }
          </ul>
          <div className='d-flex align-items-center px-3 py-1 gap-2'>
            <small className='color-secondary'>{t('common.depthSpread')}</small>
            { areaDepth.bidAskSpread }
          </div>
          <ul className={`d-flex flex-column col`}>
            {
              areaDepth.buyDepth.map((item, idx) => renderDepthItem(item, idx, 'buy'))
            }
          </ul>
        </dd>
      </dl>
    </>
  )
}

export default AreaDepth