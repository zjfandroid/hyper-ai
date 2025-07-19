import { useEffect, FC, HTMLProps, useImperativeHandle, forwardRef } from 'react'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber, sortArrayByKey, merge } from '@/utils'
import { constants, useTraderDetailsHistoricalOrdersStore, useReqStore, formatSideByRaw } from '@/stores'
import ColumnList from '@/components/Column/List'
import PositionItemUPnl from '@/components/PositionItem/UPnl'
import PositionItemDirectionLeverage from '@/components/PositionItem/DirectionLeverage'
import PositionItemPositionValue from '@/components/PositionItem/PositionValue'
import PositionItemFunding from '@/components/PositionItem/Funding'
import PositionItemMarkPrice from '@/components/PositionItem/MarkPrice'
import TimeAgo from '@/components/TimeAgo'
import PositionItemSize from '@/components/PositionItem/Size'
import { useHyperWSContext, ReadyState } from '@/components/Hyper/WSContext';
import CoinIcon from '@/components/CoinIcon'
import PositionItemSide from '@/components/PositionItem/Side'

// export interface TraderDetailsHistoricalOrdersRef {
//   onInitUpdate: () => Promise<void>
//   onCleanUp: () => void
// }

interface TraderDetailsHistoricalOrdersProps extends HTMLProps<HTMLDivElement> {
  address: string
  filterCoin?: string
  autoRefreshing?: boolean
  unReset?: boolean // 组件销毁时不触发原本针对数据源的清理流程
  className?: string
  displayedRecordsMessage?: number
}

const TraderDetailsHistoricalOrders: FC<TraderDetailsHistoricalOrdersProps> = ({
  address,
  filterCoin = '',
  autoRefreshing = true,
  unReset = false,
  className = '',
  displayedRecordsMessage = 2000
}) => {
  const traderDetailsHistoricalOrdersStore = useTraderDetailsHistoricalOrdersStore()
  const reqStore = useReqStore()

  const { sendMessage, lastMessage, readyState } = useHyperWSContext()
  const { t, i18n } = useTranslation()

  const column = [
    { id: 'time', sort: true, sortByKey: 'createTs', label: t('common.time'), className: 'col-5 col-sm-3 col-md-2 col-xl-1' },
    { id: 'symbol', filter: filterCoin, label: t('common.symbol'), className: 'col-4 col-sm-2 col-md-2 col-lg-1' },
    { id: 'orderType', label: t('common.type'), className: 'col-2 col-md-2 col-lg-1' },
    { id: 'side', label: t('common.side'), className: 'col-2 col-sm-2 col-md-2 col-lg-1' },
    { id: 'size', sort: true, sortByKey: 'size', label: t('common.orderSize'), className: 'justify-content-end text-end col-4 col-sm-3 col-md-3 col-lg-2' },
    { id: 'price', sort: true, sortByKey: 'limitPrice', label: t('common.price'), className: 'justify-content-end text-end col-6 col-sm-5 col-md-3 col-xl-2' },
    { id: 'trigger', label: t('common.trigger'), className: 'justify-content-end text-end col-3 col-lg-2 col-xl-1' },
    { id: 'executionStatus', label: t('common.executionStatus'), className: 'justify-content-end text-end col-4 col-sm-3 col-md-2 col-lg-1' },
    { id: 'orderId', label: t('common.orderId'), className: 'justify-content-end text-end col-5 col-sm-4 col-md-3 col-lg-2' },
  ]

  const renderItem = (item, columnIndex) => {
    switch (column[columnIndex].id) {
      case 'time':
        return <TimeAgo ts={item.createTs} />
      case 'symbol':
        return item.coin
      case 'orderType':
        return item.isTrigger && t('orderType.trigger')
          || t(`orderType.${item.orderType}`)
      case 'side':
        return <PositionItemSide size='small' item={item} />
      case 'size':
        return <PositionItemSize item={item} />
      case 'price':
        return <>$ {item.limitPrice}</>
      case 'trigger':
        return item.isTrigger ? `$ ${item.triggerPrice}` : '-'
      case 'executionStatus':
        return item.executionStatus === 'open' && t('common.orderExecutionOpen')
          || item.executionStatus === 'filled' && t('common.orderExecutionFilled')
          || item.executionStatus === 'perpmarginrejected' && t('common.orderExecutionMarginRejected')
          || item.executionStatus === 'canceled' && t('common.orderExecutionCanceled')
          // XXX: 不知道是否还有其他状态
          || item.executionStatus
      case 'orderId':
        return <># {item.orderId}</>
      default:
        return null
    }
  }

  const handleChangeSort = (columnId: string, sortByKey: string = '', ascending: boolean = false) => {
    if (!sortByKey) {
      sortByKey = column.find(item => item.id === columnId).sortByKey
    }

    // update
    merge(traderDetailsHistoricalOrdersStore, {
      sortColumnId: columnId,
      list: sortArrayByKey(traderDetailsHistoricalOrdersStore.list, sortByKey, ascending)
    })
  }

  const handleSendMessage = (unsubscribe: boolean = false) => {
    const _address = traderDetailsHistoricalOrdersStore.address
    const methodContent = unsubscribe? 'unsubscribe' : 'subscribe'
// console.log('handleSendMessage', readyState, ReadyState.OPEN, _address)

    if (readyState !== ReadyState.OPEN || !_address) return

    // sendMessage(`{ "method": "${methodContent}", "subscription": { "type": "orderUpdates", "user": "${_address}" } }`)
  }

  const handleOrderUpdatesByRaw = (raw: Array<any>, list: Array<any>) => {
    /* status
      open: 订单已创建但尚未执行，仍在市场中等待成交。
      filled: 订单已完全成交，所有指定的资产已成功买入或卖出。
      canceled: 订单已被用户或系统取消，不再有效。
      triggered: 订单条件已满足，已被激活但尚未完全成交。
      rejected: 订单未被接受，可能由于参数错误或市场条件不符合。
      marginCanceled: 边际订单因保证金不足而被取消。
    */

    const openOrders: Array<any> = []
    const wsRemovedOrders: Record<string, any> = {}

    raw.forEach((item: any) => {
      const { order, status } = item
      const orderId = order.oid

      // 其他情况则会删除
      switch(status) {
        case 'open':
          openOrders.push({
            orderId,
            side: formatSideByRaw(order.side),
            coin: order.coin,
            size: order.sz,
            createTs: order.timestamp,
            limitPrice: order.limitPx,
            orderType: 'limit',
          })
          break
        // case 'triggered':
        //   console.log('--')
        //   break
        default:
          wsRemovedOrders[orderId] = true
      }
    })

    return list.filter(item => !wsRemovedOrders[item.orderId]).concat(openOrders)
  }

  const handleOpenOrdersByApi = async () => {
    const { data, error } = await reqStore.hyperUserHistoricalOrders(traderDetailsHistoricalOrdersStore.address)

    if (error) return

    // update
    traderDetailsHistoricalOrdersStore.list = data.list
  }

  const onInitUpdate = async () => {
    // 地址
    if (address !== traderDetailsHistoricalOrdersStore.address) {
      if (traderDetailsHistoricalOrdersStore.address) {
        // unsubscribe
        handleSendMessage(true)
      }
      traderDetailsHistoricalOrdersStore.address = address
    }

    await handleOpenOrdersByApi()
    handleSendMessage()
    handleChangeSort(traderDetailsHistoricalOrdersStore.sortColumnId)
  }

  const onCleanUp = () => {
    handleSendMessage(true)

    if (!unReset) {
      traderDetailsHistoricalOrdersStore.reset()
    }
  }

  // useImperativeHandle(ref, () => ({
  //   onInitUpdate,
  //   onCleanUp
  // }))

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      if (!address) {
        traderDetailsHistoricalOrdersStore.reset()
        return
      }

      if (!autoRefreshing) return

      await onInitUpdate()
    }
console.log('-his', address)
    asyncFunc()

    return onCleanUp
  }, [readyState, address, autoRefreshing])

  // 处理原始数据
  useEffect(() => {
    if (lastMessage == null) return

    try {
      const res = JSON.parse(lastMessage.data)

      switch(res.channel) {
        case 'orderUpdates':
          // XXX:
          // traderDetailsHistoricalOrdersStore.list = handleOrderUpdatesByRaw(res.data, traderDetailsHistoricalOrdersStore.list)
          handleChangeSort(traderDetailsHistoricalOrdersStore.sortColumnId)

          break
        default:
      }
    } catch(e) {
      console.error(e)
    }
  }, [lastMessage])

  return (
    <ColumnList
      columns={column}
      className={className}
      data={traderDetailsHistoricalOrdersStore.list}
      busy={reqStore.hyperUserHistoricalOrdersInit || reqStore.hyperUserHistoricalOrdersBusy}
      sortColumnId={traderDetailsHistoricalOrdersStore.sortColumnId}
      pageCurrent={traderDetailsHistoricalOrdersStore.current}
      onPageChange={pageNumber => traderDetailsHistoricalOrdersStore.current = pageNumber }
      pageSize={traderDetailsHistoricalOrdersStore.size}
      renderItem={renderItem}
      onChangeSort={handleChangeSort}
      filterCoin={filterCoin}
      noMoreNote={displayedRecordsMessage ? t('common.displayedRecordsMessage', { num: displayedRecordsMessage }) : ''} />
  )
}

export default TraderDetailsHistoricalOrders