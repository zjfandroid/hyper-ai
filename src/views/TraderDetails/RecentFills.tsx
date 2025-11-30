import { useEffect } from 'react'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber, sortArrayByKey, merge } from '@/utils'
import { constants, useTraderDetailsRecentFillsStore, useReqStore } from '@/stores'
import ColumnList from '@/components/Column/List'
import TimeAgo from '@/components/TimeAgo'
import PositionItemTx from '@/components/PositionItem/Tx'
import PositionItemSide from '@/components/PositionItem/Side'
import PositionItemCommonPnl from '@/components/PositionItem/CommonPnl'

const TraderDetailsRecentFills = ({ address, filterCoin = '', displayedRecordsMessage = 2000, className = '' }) => {
  const traderDetailsRecentFillsStore = useTraderDetailsRecentFillsStore()
  const reqStore = useReqStore()

  const { t, i18n } = useTranslation()

  const column = [
    { id: 'time', sort: true, sortByKey: 'createTs', label: t('common.time'), className: 'col-5 col-sm-3 col-md-2 col-xl-1' },
    { id: 'symbol', filter: filterCoin, label: t('common.symbol'), className: 'col-4 col-sm-2 col-md-2 col-lg-1' },
    { id: 'side', label: t('common.direction'), className: 'col-3 col-sm-2 col-md-1' },
    { id: 'size', sort: true, sortByKey: 'size', label: t('common.orderSize'), className: 'justify-content-end text-end col-6 col-sm-5 col-md-3 col-xl' },
    { id: 'startPosition', sort: true, sortByKey: 'startPosition', label: t('common.startPosition'), className: 'justify-content-end text-end  col-6 col-sm-5 col-md-3 col-xl-2' },
    { id: 'price', sort: true, sortByKey: 'price', label: t('common.price'), className: 'justify-content-end text-end col-6 col-sm-5 col-md-3 col-xl-2' },
    { id: 'closedPnl', sort: true, sortByKey: 'closedPnl', label: t('common.closedPnl'), className: 'justify-content-end text-end col-2 col-lg-1 col-xl-1 ' },
    { id: 'fee', sort: true, sortByKey: 'fee', label: t('common.fee'), className: 'justify-content-end text-end col-4 col-md-3 col-lg-1' },
    { id: 'transaction', label: t('common.transaction'), className: 'justify-content-end text-end col-4 col-sm-3 col-md-2 col-xl' },
  ]

  const renderItem = (item, columnIndex) => {
    switch (column[columnIndex].id) {
      case 'time':
        return <TimeAgo ts={item.createTs} />
      case 'symbol':
        return item.coin
      case 'side':
        return <PositionItemSide size='small' item={item} />
      case 'size':
        return <span className='d-flex align-items-center gap-1'>{formatNumber(item.size)}<small>{item.coin}</small></span>
      case 'closedPnl':
        return <PositionItemCommonPnl value={item.closedPnl} />
      case 'price':
        return <>$ {item.price}</>
      case 'startPosition':
        return <span className='d-flex align-items-center gap-1'>
          <PositionItemCommonPnl value={item.startPosition} prefix='' />
          <small>{item.coin}</small>
        </span>
      case 'fee':
        return <span className='d-flex align-items-center gap-1'>
          { formatNumber(item.fee) }
          <small>{ item.feeToken }</small>
        </span>
      case 'transaction':
        return <PositionItemTx hyper item={item} />
      default:
        return null
    }
  }

  const handleChangeSort = (columnId: string, sortByKey: string = '', ascending: boolean = false) => {
    if (!sortByKey) {
      sortByKey = column.find(item => item.id === columnId).sortByKey
    }

    // update
    merge(traderDetailsRecentFillsStore, {
      sortColumnId: columnId,
      list: sortArrayByKey(traderDetailsRecentFillsStore.list, sortByKey, ascending)
    })
  }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      if (!(address)) {
        traderDetailsRecentFillsStore.reset()
        return
      }

      const { data, error } = await reqStore.hyperUserFills(address)

      if (error) return

      // update
      traderDetailsRecentFillsStore.list = data.list
      handleChangeSort(traderDetailsRecentFillsStore.sortColumnId)
    }

    asyncFunc()

    return () => {
      traderDetailsRecentFillsStore.reset()
    }
  }, [address])

  return (
    <ColumnList
      columns={column}
      className={className}
      data={traderDetailsRecentFillsStore.list}
      busy={reqStore.hyperUserFillsBusy}
      sortColumnId={traderDetailsRecentFillsStore.sortColumnId}
      renderItem={renderItem}
      pageCurrent={traderDetailsRecentFillsStore.current}
      onPageChange={pageNumber => traderDetailsRecentFillsStore.current = pageNumber }
      pageSize={traderDetailsRecentFillsStore.size}
      onChangeSort={handleChangeSort}
      filterCoin={filterCoin}
      noMoreNote={displayedRecordsMessage ? t('common.displayedRecordsMessage', { num: displayedRecordsMessage }) : ''} />
  )
}

export default TraderDetailsRecentFills