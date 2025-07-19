import dayjs from 'dayjs'
import React, { ReactNode, useEffect } from 'react'
import { Pagination, Button, Progress } from 'antd'
import BN from 'bignumber.js'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { createStore } from '@/stores/helpers'
import { TDepthItem, TOrderBookSigFigItem, TTradeTradeItem } from '@/stores'
import { formatNumber, merge } from '@/utils'
import { IOutlineExport3 } from '@/components/icon'
import ColumnNoData from '@/components/Column/NoData'
import ProgressBar from '@/components/ProgressBar'
import DropdownMenu from '@/components/Dropdown/Menu'
import PositionItemSide from '@/components/PositionItem/Side'

import './Trades.scss'

interface TAreaTrades {
  record: Array<TTradeTradeItem>
  maxSize: string
  maxSizeSide: string
  maxRecordItems: Array<{label: string, value: string}>
  selectedMaxRecordItemValue: string
}

const useAreaTrades = createStore<TAreaTrades>({
  record: [],
  maxSize: '0',
  maxSizeSide: '',
  maxRecordItems: [
    { label: '50', value: '50' },
    { label: '100', value: '100' },
    { label: '500', value: '500' },
    { label: '1000', value: '1000' },
  ],
  selectedMaxRecordItemValue: '100'
})

interface ColumnItem {
  id: string
  label: string | ReactNode
  className?: string
}

interface AreaTradesProps {
  className?: string
  style?: Record<string, string>
  coin?: string
  lastRecord: Array<TTradeTradeItem> | null
  height?: number
  sizeDecimals?: number
  logged?: boolean
  // FIX: 只设置maxHeight时，无法出现滚动条
  maxHeight?: number
}

const AreaTrades: React.FC<AreaTradesProps> = ({
  lastRecord = null,
  coin = '',
  height,
  logged = false,
  sizeDecimals = 2,
  style = {},
  maxHeight,
  className = '',
}) => {
  const areaTrades = useAreaTrades()

  // const DEFAULT_DEPTH_ITEM = { price: '-', size: '-', totalSize: '-', orders: '-', totalOrders: '-', sizeUSD: '-', totalSizeUSD: '-', noData: true }

  const { t, i18n } = useTranslation()

  // default

  const columns = [
    { id: 'price', label: t('common.price'), className: 'col-3' },
    { id: 'size', label: <>{t('common.tradesSize')} ({coin})</>, className: 'justify-content-end text-end col' },
    { id: 'blockTime', label: t('common.time'), className: 'justify-content-end text-end col' },
  ]

  const renderItem = (item, columnIndex, type = '') => {
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
        return formatNumber(new BN(item.size).toFixed(sizeDecimals))
      case 'blockTime':
        return <span className='color-secondary'>{dayjs(item.blockTime).format('HH:mm:ss')}</span>
      default:
        return null
    }
  }

  const onSelectMaxRecordItem = (value: string) => {
    areaTrades.selectedMaxRecordItemValue = value
  }

  const renderRowItem = (item, idx, type) => {
    let barClassName = ''

    switch(type) {
      case 'buy':
        barClassName = 'bg-buy-weak'
        break
      case 'sell':
        barClassName = 'bg-sell-weak'
        break
      default:
    }

    return (
      <li key={idx} className={`d-flex flex-column position-relative overflow-hidden`}>
        <a className='' href={`https://app.hyperliquid.xyz/explorer/tx/${item.hash}`} target='_blank'>
          {
            !item.noData &&
              <ProgressBar bgColor='transparent'
                percent={+new BN(item.size || 0).div(areaTrades.maxSize).times(100).toFixed(2)}
                className='position-absolute position-full'
                barClassName={barClassName}
                />
          }
          <div className={`d-flex col align-items-center position-relative ps-3 pe-2 col content`}>
            {
              columns.map((column, columnIndex) => (
                <span key={columnIndex} className={`fw-500 color-secondary line-feed ${column.className}`}>
                  {renderItem(item, columnIndex, type)}
                </span>
              ))
            }
          </div>
        </a>
        <div className='d-flex align-items-center position-absolute link-hash bg-gray-4 ps-1'>
          <IOutlineExport3 className='w-16 color-secondary ms-1' />
        </div>
      </li>
    )
  }

  // handle
  useEffect(() => {
    let maxSize = '0'

    if (lastRecord && lastRecord.length) {
      areaTrades.record = lastRecord.concat(areaTrades.record).slice(0, areaTrades.selectedMaxRecordItemValue)

      maxSize = areaTrades.record.reduce((max, item) => {
        const bool = +item.size > +max

        if (bool) {
          areaTrades.maxSizeSide = item.side
        }

        return bool ? item.size : max
      }, maxSize)
    }

    merge(areaTrades, {
      maxSize
    })
  }, [lastRecord])

  return (
    <>
      <div className='d-flex py-1'>
        <span className='d-flex gap-1 align-items-center col'>
          <span className='color-secondary'>{t('common.maxOrder')}</span>
          <PositionItemSide size='small' item={{ side: areaTrades.maxSizeSide }} />
          <span className='fw-500'>{new BN(areaTrades.maxSize).toFixed(sizeDecimals)}</span>
          <span className='color-secondary'>{coin}</span>
        </span>
        <DropdownMenu buttonSize='small'
          className='ms-auto'
          items={areaTrades.maxRecordItems}
          suffix={<> {t('common.orderItemsUnit')}</>}
          selectedValue={areaTrades.selectedMaxRecordItemValue}
          onSelect={onSelectMaxRecordItem} />
      </div>

      <dl className={`d-flex flex-column bg-gray-alpha-4 overflow-hidden column-list area-trades ${className} `} style={{ height: height ? `${height}px` : undefined, maxHeight: maxHeight ? `${maxHeight}px` : undefined, ...style }}>
        <dt className='d-flex flex-column bg-gray-alpha-? fw-500'>
          <div className='d-flex col ps-3 pe-2'>
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
              areaTrades.record.map((item, idx) => renderRowItem(item, idx, 'buy'))
            }
          </ul>
        </dd>
      </dl>
    </>
  )
}

export default AreaTrades