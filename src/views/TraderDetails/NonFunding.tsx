import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { formatNumber, sortArrayByKey, merge } from '@/utils'
import { constants, useTraderDetailsNonFundingStore, useReqStore } from '@/stores'
import ColumnList from '@/components/Column/List'
import TimeAgo from '@/components/TimeAgo'
import PositionItemTx from '@/components/PositionItem/Tx'
import PositionItemType from '@/components/PositionItem/Type'

const TraderDetailsNonFunding = ({ address, displayedRecordsMessage = 2000, className = '' }) => {
  const traderDetailsNonFundingStore = useTraderDetailsNonFundingStore()
  const reqStore = useReqStore()

  const { t, i18n } = useTranslation()

  const tabPosition = [
    { id: 'time', sort: true, sortByKey: 'createTs', label: t('common.time'), className: 'col-4 col-sm-3 col-md-2 col-xl-2' },
    { id: 'type', label: t('common.type'), className: 'col-6 col-sm-4 col-md-4 col-lg-2' },
    { id: 'value', sort: true, sortByKey: 'usdcValue', label: t('common.value'), className: 'justify-content-end text-end d-none d-sm-flex col-sm-3 col-md-4 col-lg-3' },
    { id: 'amount', sort: true, sortByKey: 'amount', label: t('common.amount'), className: 'justify-content-end text-end col-6 col-sm-4 col-lg-3' },
    { id: 'transaction', label: t('common.transaction'), className: 'justify-content-end text-end d-none d-lg-flex col-lg-2 col-xl-2 ' },
  ]

  const renderPositionItem = (item, columnIndex) => {
    switch (tabPosition[columnIndex].id) {
      case 'time':
        return <TimeAgo ts={item.createTs} />
      case 'type':
        return <PositionItemType item={item} />
      case 'value':
        return !Number.isNaN(item.usdcValue) ? <>$ {formatNumber(item.usdcValue)}</> : '-'
      case 'amount':
        return !Number.isNaN(item.amount) ? <>{formatNumber(item.amount)} {item.amountToken}</> : '-'
      case 'transaction':
        return <PositionItemTx item={item} />
      default:
        return null
    }
  }

  const handleChangeSort = (columnId: string, sortByKey: string = '', ascending: boolean = false) => {
    if (!sortByKey) {
      sortByKey = tabPosition.find(item => item.id === columnId).sortByKey
    }

    // update
    merge(traderDetailsNonFundingStore, {
      sortColumnId: columnId,
      list: sortArrayByKey(traderDetailsNonFundingStore.list, sortByKey, ascending)
    })
  }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      if (!(address)) {
        traderDetailsNonFundingStore.reset()
        return
      }

      const { data, error } = await reqStore.hyperUserNonFunding(address)

      if (error) return

      // update
      traderDetailsNonFundingStore.list = data.list
      handleChangeSort(traderDetailsNonFundingStore.sortColumnId)
    }

    asyncFunc()

    return () => {
      traderDetailsNonFundingStore.reset()
    }
  }, [address])

  return (
    <ColumnList
      columns={tabPosition}
      className={className}
      data={traderDetailsNonFundingStore.list}
      busy={reqStore.hyperUserNonFundingBusy}
      sortColumnId={traderDetailsNonFundingStore.sortColumnId}
      renderItem={renderPositionItem}
      pageCurrent={traderDetailsNonFundingStore.current}
      onPageChange={pageNumber => traderDetailsNonFundingStore.current = pageNumber }
      pageSize={traderDetailsNonFundingStore.size}
      onChangeSort={handleChangeSort}
      noMoreNote={displayedRecordsMessage ? t('common.displayedRecordsMessage', { num: displayedRecordsMessage }) : ''} />
  )
}

export default TraderDetailsNonFunding