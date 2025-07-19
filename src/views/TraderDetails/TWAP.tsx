import { useEffect } from 'react'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber, sortArrayByKey, merge } from '@/utils'
import { constants, useTraderDetailsTWAPStore, useReqStore } from '@/stores'
import ColumnList from '@/components/Column/List'
import TimeAgo from '@/components/TimeAgo'
import PositionItemSide from '@/components/PositionItem/Side'
import PositionItemCommonPnl from '@/components/PositionItem/CommonPnL'

const TraderDetailsTWAP = ({ address, filterCoin = '', displayedRecordsMessage = 2000, className = '' }) => {
  const traderDetailsTWAPStore = useTraderDetailsTWAPStore()
  const reqStore = useReqStore()

  const { t, i18n } = useTranslation()

  const tabPosition = [
    { id: 'time', sort: true, sortByKey: 'createTs', label: t('common.time'), className: 'col-4 col-sm-3 col-md-2 col-xl-1' },
    { id: 'symbol', filter: filterCoin, label: t('common.symbol'), className: 'col-2 col-sm-2 col-md-1 col-xl-1' },
    { id: 'side', label: t('common.direction'), className: 'd-none d-sm-flex col-sm-2 col-md-2 col-lg-1' },
    { id: 'size', sort: true, sortByKey: 'size', label: t('common.orderSize'), className: 'justify-content-end text-end col-6 col-sm-5 col-md-2 col-xl-2' },
    { id: 'startPosition', sort: true, sortByKey: 'startPosition', label: t('common.startPosition'), className: 'justify-content-end text-end d-none d-xl-flex col-xl-2' },
    { id: 'price', sort: true, sortByKey: 'price', label: t('common.price'), className: 'justify-content-end text-end d-none d-md-flex col-md-3 col-lg-2 col-xl-1' },
    { id: 'closedPnl', sort: true, sortByKey: 'closedPnl', label: t('common.closedPnl'), className: 'justify-content-end text-end d-none d-lg-flex col-lg-1 col-xl-1 ' },
    { id: 'fee', sort: true, sortByKey: 'fee', label: t('common.fee'), className: 'justify-content-end text-end d-none d-md-flex col-md-2 col-lg-1' },
    { id: 'twapId', label: t('common.twapId'), className: 'justify-content-end text-end d-none d-lg-flex col-lg-2 col-xl-2' },
  ]

  const renderPositionItem = (item, columnIndex) => {
    switch (tabPosition[columnIndex].id) {
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
        return <span className='d-flex align-items-center gap-1'><PositionItemCommonPnl value={item.startPosition} prefix='' /><small>{item.coin}</small></span>
      case 'fee':
        return <span className='d-flex align-items-center gap-1'>{ formatNumber(item.fee) } <small>{ item.feeToken }</small></span>
      case 'twapId':
        return <># {item.twapId}</>
      default:
        return null
    }
  }

  const handleChangeSort = (columnId: string, sortByKey: string = '', ascending: boolean = false) => {
    if (!sortByKey) {
      sortByKey = tabPosition.find(item => item.id === columnId).sortByKey
    }

    // update
    merge(traderDetailsTWAPStore, {
      sortColumnId: columnId,
      list: sortArrayByKey(traderDetailsTWAPStore.list, sortByKey, ascending)
    })
  }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      if (!( address)) {
        traderDetailsTWAPStore.reset()
        return
      }

      const { data, error } = await reqStore.hyperUserTWAP(address)

      if (error) return

      // update
      traderDetailsTWAPStore.list = data.list
      handleChangeSort(traderDetailsTWAPStore.sortColumnId)
    }

    asyncFunc()
    return () => {
      traderDetailsTWAPStore.reset()
    }
  }, [address])

  return (
    <ColumnList
      columns={tabPosition}
      className={className}
      data={traderDetailsTWAPStore.list}
      busy={reqStore.hyperUserTWAPBusy}
      sortColumnId={traderDetailsTWAPStore.sortColumnId}
      renderItem={renderPositionItem}
      pageCurrent={traderDetailsTWAPStore.current}
      onPageChange={(pageNumber) => { traderDetailsTWAPStore.current = pageNumber }}
      pageSize={traderDetailsTWAPStore.size}
      onChangeSort={handleChangeSort}
      filterCoin={filterCoin}
      noMoreNote={displayedRecordsMessage ? t('common.displayedRecordsMessage', { num: displayedRecordsMessage }) : ''} />
  )
}

export default TraderDetailsTWAP