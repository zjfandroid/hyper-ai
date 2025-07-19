import { useEffect } from 'react'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber, sortArrayByKey, merge } from '@/utils'
import { constants, useTraderDetailsPositionsStore, useReqStore } from '@/stores'
import ColumnList from '@/components/Column/List'
import PositionItemUPnl from '@/components/PositionItem/UPnl'
import PositionItemDirectionLeverage from '@/components/PositionItem/DirectionLeverage'
import PositionItemPositionValue from '@/components/PositionItem/PositionValue'
import PositionItemFunding from '@/components/PositionItem/Funding'
import PositionItemMarkPrice from '@/components/PositionItem/MarkPrice'
import HyperAutoUpdatePerpMetaAndMarket from '@/components/Hyper/AutoUpdatePerpMetaAndMarket'

const TraderDetailsPositions = ({ address, unUpdate = false, unReset = false, className = '' }) => {
  const traderDetailsPositionsStore = useTraderDetailsPositionsStore()
  const reqStore = useReqStore()

  const { t, i18n } = useTranslation()

  const tabPosition = [
    { id: 'symbol', label: t('common.symbol'), className: 'col-3 col-sm-2 col-md-2 col-lg-1' },
    { id: 'leverage', label: t('common.directionLeverage'), className: 'col-3 col-sm-2 col-md-2 col-lg-1' },
    { id: 'positionValue', sort: true, sortByKey: 'positionValue', label: t('common.positionValue'), className: 'justify-content-end text-end col-5 col-sm-3 col-md-2 col-xl-2' },
    { id: 'uPnl', sort: true, sortByKey: 'uPnl', label: t('common.uPnl'), className: 'justify-content-end text-end col-5 col-sm-3 col-md-3 col-lg-2' },
    { id: 'margin', sort: true, sortByKey: 'marginUsed', label: t('common.margin'), className: 'justify-content-end text-end col-4 col-sm-3 col-lg-2 col-xl-2' },
    { id: 'openingPrice', sort: true, sortByKey: 'openPrice', label: t('common.openingPrice'), className: 'justify-content-end text-end col-4 col-sm-3 col-md-2 col-xl-1' },
    { id: 'markPrice', sort: true, sortByKey: 'markPrice', label: t('common.markPrice'), className: 'justify-content-end text-end col-4 col-sm-3 col-md-2 col-xl-1' },
    { id: 'liquidationPrice', sort: true, sortByKey: 'liquidationPrice', label: t('common.liquidationPrice'), className: 'justify-content-end text-end col-4 col-sm-3 col-md-2 col-xl-1' },
    { id: 'funding', sort: true, sortByKey: 'funding', label: t('common.funding'), className: 'justify-content-end text-end col-4 col-sm-3 col-md-2 col-xl-1' },
  ]

  const renderPositionItem = (item, columnIndex) => {
    switch (tabPosition[columnIndex].id) {
      case 'walletId':
        return item.walletId
      case 'symbol':
        return item.coin
      case 'leverage':
        return <PositionItemDirectionLeverage item={item} />
      case 'positionValue':
        return <PositionItemPositionValue item={item} />
      case 'uPnl':
        return <PositionItemUPnl item={item} />
      case 'openingPrice':
        return <>$ {item.openPrice}</>
      case 'liquidationPrice':
        return item.liquidationPrice
          ? <>$ {item.liquidationPrice}</>
          : '-'
      case 'margin':
        return <>$ { formatNumber(item.marginUsed) }</>
      case 'markPrice':
        return <PositionItemMarkPrice item={item} />
      case 'funding':
        return <PositionItemFunding item={item} />
      default:
        return null
    }
  }

  const handleChangeSort = (columnId: string, sortByKey: string = '', ascending: boolean = false) => {
    if (!sortByKey) {
      sortByKey = tabPosition.find(item => item.id === columnId).sortByKey
    }

    // update
    merge(traderDetailsPositionsStore, {
      sortColumnId: columnId,
      list: sortArrayByKey(traderDetailsPositionsStore.list, sortByKey, ascending)
    })
  }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      if (!(address)) {
        traderDetailsPositionsStore.reset()
        return
      }

      if (!unUpdate) {
        const { data, error } = await reqStore.hyperClearinghouseState(address)

        if (error) return

        // update
        traderDetailsPositionsStore.list = data.positions
      }
      handleChangeSort(traderDetailsPositionsStore.sortColumnId)
    }

    asyncFunc()

    return () => {
      if (!unReset) {
        traderDetailsPositionsStore.reset()
      }
    }
  }, [address])

  return (
    <>
      <ColumnList
        columns={tabPosition}
        className={className}
        data={traderDetailsPositionsStore.list}
        busy={reqStore.hyperClearinghouseStateInit || !unUpdate && reqStore.hyperClearinghouseStateBusy}
        sortColumnId={traderDetailsPositionsStore.sortColumnId}
        renderItem={renderPositionItem}
        onChangeSort={handleChangeSort} />
      <HyperAutoUpdatePerpMetaAndMarket />
    </>
  )
}

export default TraderDetailsPositions