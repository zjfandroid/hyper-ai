import { useEffect } from 'react'
import { Button, Progress, Popconfirm, Tooltip, Dropdown, message, Select, Input, Timeline } from 'antd'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { useNavigate } from 'react-router-dom';

import { IOutlineMoreSquare, IOutlineMonitor, IOutlineChart2, IOutlineCopy, IOutlineMedal, IOutlineExport1, IOutlineImport1, IOutlineAdd, IOutlineArrowUp1, IOutlineShare, ICyclical, IOutlineSearchNormal1 } from '@/components/icon'
import { formatNumber, merge } from '@/utils'
import { constants, useAccountStore, useCopyTradingStore, useNewsLatestStore, useDiscoverTradingStatisticsStore, useReqStore, useWhaleEventsStore, useWhalePositionsStore, useTrackingAddressPositionStore, useTrackingCreateStore } from '@/stores'
import ColumnTooltip from '@/components/Column/Tooltip'
import ColumnList from '@/components/Column/List'
import TabSwitch from '@/components/Tab/Switch'
import CandlestickSingle from '@/components/Candlestick/Single'
import InputSearch from '@/components/Input/Search'
import ModalCreateCopyTrading from '@/components/Modal/CreateCopyTrading'
import SideButtonIcon from '@/components/Side/ButtonIcon'
import NewsTimeline from '@/components/News/Timeline';
import PositionItemAddress from '@/components/PositionItem/Address'
import PositionItemDirectionLeverage from '@/components/PositionItem/DirectionLeverage'
import PositionItemPositionValue from '@/components/PositionItem/PositionValue'
import PositionItemDirectionAction from '@/components/PositionItem/DirectionAction'
import PositionItemUPnl from '@/components/PositionItem/UPnl'
import ToolbarAutoRefresh from '@/components/Toolbar/AutoRefresh'
import ToolbarAutoRefreshButton from '@/components/Toolbar/AutoRefreshButton'
import DropdownMenu from '@/components/Dropdown/Menu'
import PositionItemFundingFee from '@/components/PositionItem/FundingFee'
import ModalTrackingBatchExport from '@/components/Modal/TrackingBatchExport'
import ModalTrackingBatchImport from '@/components/Modal/TrackingBatchImport'
import TrackingCreateTrack from '@/components/Modal/TrackingCreateTrack'
import TrackingAddresses from '@/components/Tracking/Addresses'
import ModalTradingStatistics from '@/components/Modal/TradingStatistics'
import TimeAgo from '@/components/TimeAgo'
import PositionItemCoin from '@/components/PositionItem/Coin'

const TrackMonitor = () => {
  const accountStore = useAccountStore()
  const reqStore = useReqStore()
  const copyTradingStore = useCopyTradingStore()
  const whaleEventsStore = useWhaleEventsStore()
  const whalePositionsStore = useWhalePositionsStore()
  const newsLatestStore = useNewsLatestStore()
  const trackingCreateStore = useTrackingCreateStore()
  const discoverTradingStatisticsStore = useDiscoverTradingStatisticsStore()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate();

  const whalesEvent = [
    { id: 'address', label: t('common.address'), className: 'col-3 col-sm-2 col-md-2' },
    { id: 'symbol', label: t('common.symbol'), className: 'col-2 col-md-1' },
    { id: 'direction', label: t('common.direction'), className: 'col col-sm-3 col-md-2' },
    { id: 'positionValue', label: t('common.positionValue'), className: 'justify-content-end text-end d-none d-sm-flex col' },
    { id: 'openingPrice', label: t('common.openingPrice'), className: 'justify-content-end text-end d-none d-md-flex col-md-2' },
    { id: 'time', label: t('common.time'), className: 'justify-content-end text-end col-2 col-md-2' },
  ]

  const whalesPosition = [
    { id: 'address', label: t('common.address'), className: 'col-3 col-sm-2 col-md-2 col-lg-1 col-xl-1' },
    { id: 'symbol', label: t('common.symbol'), className: 'col-2 col-sm-1 col-md-1 col-xl-1' },
    { id: 'leverage', label: t('common.directionLeverage'), className: 'd-none d-sm-flex col-sm-2 col-md-2 col-lg-1' },
    { id: 'positionValue', label: t('common.positionValue'), className: 'justify-content-end text-end col-4 col-sm-2 col-md-2 col-xl-2' },
    { id: 'uPnl', sort: true, label: t('common.uPnl'), className: 'justify-content-end text-end d-none d-sm-flex col-3 col-sm-2 col-md-2 col-lg-1' },
    { id: 'margin', sort: true, label: t('common.margin'), className: 'justify-content-end text-end d-none d-lg-flex col-md-2 col-lg-2 col-xl-1' },
    { id: 'openingPrice', label: t('common.openingPrice'), className: 'justify-content-end text-end d-none d-xl-flex col-xl-1' },
    { id: 'liquidationPrice', label: t('common.liquidationPrice'), className: 'justify-content-end text-end d-none d-lg-flex col-md-1 col-xl-1' },
    { id: 'fundingFee', label: t('common.fundingFee'), className: 'justify-content-end text-end d-none d-lg-flex col-lg-1 col-xl-1 ' },
    { id: 'createTs', sort: true, label: t('common.createTime'), className: 'justify-content-end text-end d-none d-sm-flex col-3 col-sm-2 col-md-2 col-lg-1 col-xl-1' },
    { id: 'operator', label: '', className: 'justify-content-end col' },
  ]

  const renderWhalesEventItem = (item, columnIndex) => {
    switch (whalesEvent[columnIndex].id) {
      case 'address':
        return <PositionItemAddress item={item} prePlainLength={4} postPlainLength={2} />
      case 'symbol':
        return <PositionItemCoin link item={item} />
      case 'direction':
        return <PositionItemDirectionAction item={item} />
      case 'positionValue':
        return <PositionItemPositionValue item={item} />
      // case 'uPnl':
      //   return <PositionItemUPnl item={item} />
      case 'openingPrice':
        return <>$ {item.openPrice}</>
      case 'liquidationPrice':
        return item.liquidationPrice
          ? <>$ {item.liquidationPrice}</>
          : '-'
      case 'margin':
        return <>$ { formatNumber(item.marginUsed) }</>
      case 'markPrice':
        return <>$ { item.markPrice }</>
      case 'time':
        return <TimeAgo ts={item.createTs} />
      // case 'operator':
      //   return <div className='hover-primary br-4 px-2 py-1 fw-500' onClick={() => merge(copyTradingStore, { openClosePosition: true, operaPositionIdx: item.idx}) }>Close All</div>
      default:
        return null
    }
  }

  const renderWhalesPositionItem = (item, columnIndex: number) => {
    switch (whalesPosition[columnIndex].id) {
      case 'address':
        return <PositionItemAddress item={item} prePlainLength={4} postPlainLength={2} />
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
        return <>$ { item.markPrice }</>
      case 'fundingFee':
        return <PositionItemFundingFee item={item} />
      case 'createTs':
        return <TimeAgo ts={item.createTs} />
      case 'operator':
        return (
          <span className='d-flex gap-3 align-items-center justify-content-end'>
            {
              [
                { icon: <IOutlineChart2 className='zoom-85' />, title: t('common.tradingStatistics'), onClick: () => handleOpenTradingStatistics(item) },
                { icon: <IOutlineMonitor className='zoom-85' />, title: t('common.trackAddress'), logged: true, onClick: () => handleOpenCreateTrackAddress(item) },
                { icon: <IOutlineShare className='zoom-85' />, title: t('common.copyTrading'), logged: true, onClick: () => handleOpenQuickerCreateCopyTrade(item) },
              ].map((item, idx) => <SideButtonIcon key={idx} title={item.title} onClick={item.onClick} logged={item.logged} icon={item.icon} />)
            }
          </span>
        )
      default:
        return null
    }
  }

  // 快捷跟单
  const handleOpenQuickerCreateCopyTrade = (item?: any) => {
    copyTradingStore.quickerOpenPositionTargetAddress = item.address

    // NOTE: 同步完，最后打开弹窗
    copyTradingStore.openCopyTradingTarget = true
  }

  const handleOpenTradingStatistics = (item) => {
    discoverTradingStatisticsStore.address = item.address

    discoverTradingStatisticsStore.openModal = true
  }

  const handleRefreshNews = async () => {
    await reqStore.newsLatest(accountStore, newsLatestStore)
  }

  const handleWhalePositions = async () => {
    return await reqStore.whalePositions(accountStore, whalePositionsStore)
  }

  const handleWhalesPositionChangeSort = async (columnId: string) => {
    whalePositionsStore.sortColumnId = columnId

    await handleWhalePositions()
  }

  const handleOpenCreateTrackAddress = async (item) => {
    // sync quick
    trackingCreateStore.quickCreateTrackAddress = item.address

    trackingCreateStore.openCreateTracking = true
  }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      await handleWhalePositions()
      await reqStore.whaleEvents(accountStore, whaleEventsStore)
    }

    asyncFunc()

  }, [])

  // 语言切换的影响
  useEffect(() => {
    const asyncFunc = async () => {
      // NOTE: 新闻语言由这里控制，所以不用再单独缓存保存配置
      switch(i18n.resolvedLanguage) {
        case 'zh-Hans':
        case 'zh-Hant':
          newsLatestStore.selectedLanguage = 'zh'
          break
        case 'en':
        default:
          newsLatestStore.selectedLanguage = 'en'
      }

      await handleRefreshNews()
    }

    asyncFunc()
  }, [i18n.resolvedLanguage])

  return (
    <>
      {/* <div className='mt-4'></div> */}

      <div className="container-fluid px-0 d-flex flex-column my-5 pt-5">
        <div className="container-xl d-flex flex-column px-3 px-md-4 gap-3 gap-md-4 my-3 my-md-5 py-0">
          <TrackingAddresses />
        </div>

        <div className="container-xl d-flex flex-column px-3 px-md-4 gap-3 gap-md-4 my-3 my-md-5 py-0">
          <div className='d-flex flex-wrap gap-5 align-items-start'>
            <div className='d-flex flex-column gap-3 gap-md-4 col-12 col-xl'>
              <div className="d-flex gap-4 align-items-center justify-content-between col">
                <h4 className="fw-bold">{t('track.hyperliquidWhale')}</h4>
                <div className="d-flex align-items-center gap-2">
                  <ToolbarAutoRefreshButton
                    loading={reqStore.whaleEventsBusy}
                    onRefresh={async () => await reqStore.whaleEvents(accountStore, whaleEventsStore)}
                    storageSettingKey='hyperliquidWhaleEventAutoRefreshing' autoRefreshCD={60} />
                </div>
              </div>
              <ColumnList className='br-3' height={620}
                columns={whalesEvent}
                data={whaleEventsStore.list}
                busy={reqStore.whaleEventsBusy}
                onRowClick={(item) => navigate(`/trader/${item.address}`) }
                renderItem={renderWhalesEventItem} />
            </div>
            <NewsTimeline className='col-12 col-xl' maxHeight={620}
              title={t('track.industryNews')}
              autoRefreshCD={300}
              loading={reqStore.newsLatestBusy || reqStore.newsLatestInit} 
              dataSources={<small className='position-absolute position-rb color-unimportant px-2 pt-1 bg-black-thin br-tl-2'>Data sources from AI Coin</small>} 
              list={newsLatestStore.list}
              contentEllipsis={false}
              onRefresh={handleRefreshNews} />
          </div>
        </div>

        <div className="container-xl d-flex flex-column px-3 px-md-4 gap-3 gap-md-4 my-3 my-md-5 py-0">
          <div className="d-flex flex-wrap gap-4 align-items-center col">
            <h4 className="fw-bold">{t('track.moreWhalesPosition')}</h4>
            <div className="d-flex flex-wrap align-items-center gap-2 ms-auto justify-content-end">
              {[
                {
                  items: whalePositionsStore.selectCoin,
                  selectedValue: whalePositionsStore.selectedCoin,
                  storeKey: 'selectedCoin',
                },
                {
                  items: whalePositionsStore.selectDirection,
                  selectedValue: whalePositionsStore.selectedDirection,
                  storeKey: 'selectedDirection',
                },
                {
                  items: whalePositionsStore.selectUPnl,
                  selectedValue: whalePositionsStore.selectedUPnl,
                  storeKey: 'selectedUPnl',
                },
                {
                  items: whalePositionsStore.selectFundingFee,
                  selectedValue: whalePositionsStore.selectedFundingFee,
                  storeKey: 'selectedFundingFee',
                }
              ].map((config, index) => (
                <DropdownMenu key={index} buttonSize="small"
                  items={config.items}
                  selectedValue={config.selectedValue}
                  onSelect={(val) => { 
                    whalePositionsStore[config.storeKey] = val;
                    handleWhalePositions(); 
                  }}
                />
              ))}
            </div>
          </div>
          <ColumnList className='br-3'
            columns={whalesPosition}
            onlyDesc
            data={whalePositionsStore.list}
            busy={reqStore.whalePositionsBusy}
            sortColumnId={whalePositionsStore.sortColumnId}
            onChangeSort={handleWhalesPositionChangeSort}
            renderItem={renderWhalesPositionItem} />
        </div>
      </div>

      <ModalTradingStatistics />
      <TrackingCreateTrack />
      <ModalTrackingBatchImport />
      <ModalTrackingBatchExport />
      <ModalCreateCopyTrading />
    </>
  )
}

export default TrackMonitor