import { useEffect, useRef } from 'react'
import { Button, Progress, Popconfirm, Tooltip, Dropdown, message, Select, Input } from 'antd'
import BN from 'bignumber.js'
import { isAddress } from 'viem'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { useParams } from 'react-router-dom';

import { addressShortener, formatNumber, merge, sleep, localStorage, forEach } from '@/utils'
import { IOutlineMoreSquare, IOutlineArrowRight1, IOutlineCopy, IOutlineChart2, IOutlineMonitor, IOutlineMedal, IOutlineAdd, IOutlineArrowUp1, IOutlineShare, ICyclical, IOutlineSearchNormal1 } from '@/components/icon'
import { constants, useAccountStore, usePrivateWalletStore, useTraderDetailsPortfolioKlineStore, useHyperStore, useTrackingCreateStore, useDiscoverTradingStatisticsStore, useTraderDetailsOpenOrdersAdditionalStore, useTraderDetailsPositionsStore, useTraderDetailsStore, useReqStore, useCopyTradingStore, useLeaderboardStore } from '@/stores'
import ColumnTooltip from '@/components/Column/Tooltip'
import TabSwitch from '@/components/Tab/Switch'
import CandlestickSingle from '@/components/Candlestick/Single'
import InputSearch from '@/components/Input/Search'
import ModalCreateCopyTrading from '@/components/Modal/CreateCopyTrading'
import SideButtonIcon from '@/components/Side/ButtonIcon'
import PositionItemAddress from '@/components/PositionItem/Address'
import DropdownMenu from '@/components/Dropdown/Menu'
import ModalTradingStatistics from '@/components/Modal/TradingStatistics'
import TrackingCreateTrack from '@/components/Modal/TrackingCreateTrack'
import ButtonIcon from '@/components/ButtonIcon'
import ToolbarAutoRefresh from '@/components/Toolbar/AutoRefresh'
import PositionItemDirectionBias from '@/components/PositionItem/DirectionBias'
import AnimateCountUp from '@/components/Animate/CountUp'
import PositionItemCommonPnl from '@/components/PositionItem/CommonPnl'
import MUIBasePieChart from '@/components/MUI/BasePieChart'
import DotColor from '@/components/DotColor'
import Busy from '@/components/Busy'
import ToolbarAutoRefreshButton from '@/components/Toolbar/AutoRefreshButton'
import ModalSpotAssets from '@/components/Modal/SpotAssets'
import { useHyperWSContext, ReadyState } from '@/components/Hyper/WSContext';

import TraderDetailsPositions from './Positions'
import TraderDetailsRecentFills from './RecentFills'
import TraderDetailsTWAP from './TWAP'
import TraderDetailsNonFunding from './NonFunding'
import { TraderDetailsOpenOrdersAdditional } from './OpenOrdersAdditional'
import TraderDetailsKline from './Kline'
import TraderDetailsHistoricalOrders from './HistoricalOrders'

const TraderDetails = () => {
  const traderDetailsStore = useTraderDetailsStore()
  const traderDetailsPositionsStore = useTraderDetailsPositionsStore()
  const traderDetailsOpenOrdersAdditionalStore = useTraderDetailsOpenOrdersAdditionalStore()
  const reqStore = useReqStore()
  const discoverTradingStatisticsStore = useDiscoverTradingStatisticsStore()
  const trackingCreateStore = useTrackingCreateStore()
  const copyTradingStore = useCopyTradingStore()
  const hyperStore = useHyperStore()
  const traderDetailsPortfolioKlineStore = useTraderDetailsPortfolioKlineStore()

  const { sendMessage, lastMessage, readyState } = useHyperWSContext()
  const { t, i18n } = useTranslation()
  const { address } = useParams()

  const handleOpenTradingStatistics = (item) => {
    discoverTradingStatisticsStore.address = item.address

    discoverTradingStatisticsStore.openModal = true
  }

  const handleOpenCreateTrackAddress = async (item) => {
    // sync quick
    trackingCreateStore.quickCreateTrackAddress = item.address

    trackingCreateStore.openCreateTracking = true
  }

  // 快捷跟单
  const handleOpenQuickerCreateCopyTrade = (item?: any) => {
    copyTradingStore.quickerOpenPositionTargetAddress = item.address

    // NOTE: 同步完，最后打开弹窗
    copyTradingStore.openCopyTradingTarget = true
  }

  const handlePortfolioKline = async () => {
    const { data, error } = await reqStore.hyperUserPortfolio(traderDetailsStore.address)

    if (error) return

    // update
    merge(traderDetailsPortfolioKlineStore, data)
  }

  const handleAutoRefresh = async () => {
    // Update Tab Suffix
    await handleHyperClearinghouseState()
    // NOTE: 由 <TraderDetailsOpenOrdersAdditional> 维护挂单

    await handlePortfolioKline()
    await handleAccountSpotState()
  }

  const handleAccountSpotState = async () => {
    // // NOTE: 要从全局 price 请求中获取spot 价格，所以这里先错位
    // await sleep(500)
    const { data, error } = await reqStore.hyperUserSpotClearinghouseState(traderDetailsStore.address)

    if (error) return

    // update
    traderDetailsStore.spotAssets = data.assets
  }

  const handleHyperClearinghouseState = async () => {
    const { data, error } = await reqStore.hyperClearinghouseState(traderDetailsStore.address)

    if (error) return

    // update
    traderDetailsPositionsStore.list = data.positions
    merge(traderDetailsStore, data.summary)
  }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      if (!(address && isAddress(address))) return

      // update
      traderDetailsStore.address = address

      // 目前只在初始时调整状态
      traderDetailsStore.busy = true
      // 初始请求
      await handleAutoRefresh()
      traderDetailsStore.busy = false
    }

    asyncFunc()

    return () => {
      traderDetailsStore.reset()
      traderDetailsPortfolioKlineStore.reset()
    }
  }, [])

  // Price -> Value
  useEffect(() => {
    let bnTotalSpotValue = new BN(0)
    let totalSpotPricedAssetsNum = 0

    forEach(traderDetailsStore.spotAssets, (item) => {
      const coinMarket = hyperStore.spotMarket[item.coin]

      if (coinMarket) {
        // NOTE: 忽略不存在价格的 coin
        const markPrice = coinMarket.markPrice || 0
        const bnPositionValue = new BN(item.amount).times(markPrice)

        // update
        bnTotalSpotValue = bnTotalSpotValue.plus(bnPositionValue)
        if (markPrice) {
          totalSpotPricedAssetsNum++
        }
        item.value = bnPositionValue.toString()
        // console.log(`${item.coin}   ${item.amount} ${coinMarket.markPrice || 0}  -> ${new BN(item.amount).times(coinMarket.markPrice || 0)}    ---- ${bnTotalSpotValue.toString()}`)
      } else {
        item.value = '0'
        // console.log(item.coin, item.amount, `------不存在价格`)
      }
    })

    // update
    traderDetailsStore.totalSpotValue = bnTotalSpotValue.toFixed(constants.decimalPlaces.__COMMON__)
    traderDetailsStore.totalSpotPricedAssetsNum = totalSpotPricedAssetsNum
  }, [hyperStore.spotMarket, traderDetailsStore.spotAssets])

  return (
    <>
      {/* <div className='mt-4'></div> */}

      <div className="container-fluid px-0 d-flex flex-column my-5 pt-5">
        <div className="container-xl d-flex flex-column px-3 px-md-4 gap-3 gap-md-4 my-3 my-md-5 py-0">
          <div className="d-flex flex-wrap gap-4 align-items-center justify-content-between col">
            <PositionItemAddress avatarSize={24} link={false} avatar item={traderDetailsStore} className='h5 fw-bold' />
            <div className='d-flex flex-wrap gap-2 gap-md-3 ms-auto'>
              <ToolbarAutoRefreshButton
                loading={traderDetailsStore.busy}
                content={t('common.updating')}
                onRefresh={handleAutoRefresh}
                onSyncStatus={(isAutoRefreshing) => traderDetailsStore.isAutoRefreshing = isAutoRefreshing}
                storageSettingKey='traderDetailsAutoRefreshing'
                autoRefreshCD={5} />
              <ButtonIcon icon={<IOutlineChart2 />} onClick={() => handleOpenTradingStatistics(traderDetailsStore)}>{t('common.tradingStatistics')}</ButtonIcon>
              <ButtonIcon logged icon={<IOutlineMonitor />} onClick={() => handleOpenCreateTrackAddress(traderDetailsStore)}>{t('common.trackAddress')}</ButtonIcon>
              <ButtonIcon logged icon={<IOutlineShare />} onClick={() => handleOpenQuickerCreateCopyTrade(traderDetailsStore)}>{t('common.copyTrading')}</ButtonIcon>
            </div>
          </div>

          <Busy spinning={traderDetailsStore.busy}>
            <div className='d-flex flex-column br-3 overflow-hidden'>
              <div className='d-flex flex-wrap'>
                {
                  [
                    { label: t('common.accountTotalValue'),
                      cover: <MUIBasePieChart data={[
                        { value: +traderDetailsStore.perpEquity, color: 'rgba(96, 122, 250, 0.8)', label: t('common.perpetual') },
                        { value: +traderDetailsStore.totalSpotValue, color: 'rgba(96, 165, 250, .8)', label: t('common.spot') },
                      ]} />,
                      content: <>
                        <span className="color-white h5 fw-bold pb-1">
                          $ { formatNumber(new BN(traderDetailsStore.perpEquity).plus(traderDetailsStore.totalSpotValue).toFixed(constants.decimalPlaces.__COMMON__)) }
                        </span>
                        <small className='d-flex align-items-center'>
                          <DotColor id='perpetual' label={t('common.perpetual')} />
                          <span className='fw-500 color-white ms-auto'>$ { formatNumber(traderDetailsStore.perpEquity) }</span>
                        </small>
                        <small className='d-flex align-items-center'>
                          <span className='d-flex align-items-center linker' onClick={() => traderDetailsStore.openSpotAssets = true}>
                            <DotColor id='spot' label={t('common.spot')} />
                            <IOutlineArrowRight1 className='w-14' />
                          </span>
                          <span className='fw-500 color-white ms-auto'>$ { formatNumber(traderDetailsStore.totalSpotValue) }</span>
                        </small>
                      </>
                    },
                    { label: t('common.freeMarginAvailable'),
                      cover: <MUIBasePieChart data={[
                        { value: +traderDetailsStore.withdrawablePct, color: 'rgba(250, 211, 96, 0.8)', label: t('common.withdrawable') },
                        { value: 100- +traderDetailsStore.withdrawablePct, color: 'rgba(250, 211, 96, 0.1)', label: t('common.nonWithdrawable') },
                      ]} />,
                      content: <>
                        <span className="color-white h5 fw-bold pb-1">
                          $ { formatNumber(traderDetailsStore.withdrawable) }
                        </span>
                        <small className='d-flex align-items-center'>
                          <DotColor id='withdrawable' label={t('common.withdrawable')} />
                          <span className='fw-500 color-white ms-auto'>{ formatNumber(traderDetailsStore.withdrawablePct) } %</span>
                        </small>
                      </>
                    },
                    { label: t('common.totalPositionValue'),
                      cover: <MUIBasePieChart data={[
                        { value: +traderDetailsStore.leverageRatio, color: 'rgba(250, 211, 96, 0.8)', label: t('common.leverageRatio') },
                        { value: traderDetailsStore.MAX_LEVERAGE - +traderDetailsStore.leverageRatio, color: 'rgba(250, 211, 96, 0.1)' },
                      ]} />,
                      content: <>
                        <span className="color-white h5 fw-bold pb-1">
                          $ { formatNumber(traderDetailsStore.totalPositionValue) }
                        </span>
                        <small className='d-flex align-items-center'>
                          <DotColor id='leverage' label={t('common.leverageRatio')} />
                          <span className='fw-500 color-white ms-auto'>{ formatNumber(traderDetailsStore.leverageRatio) }x</span>
                        </small>
                      </>
                    }
                  ].map((item, idx) =>
                    <div key={idx} className={`d-flex ${item.className ?? 'col-12 col-sm-6 col-lg-4 col-xl-3'}`}>
                      <div className='d-flex px-3 py-3 br-3 bg-gray-alpha-4 gap-4 mx-1 mb-2 col'>
                        <div className='d-flex flex-column col'>
                          <span className="d-flex align-items-center justify-content-between color-unimportant pb-1">
                            { item.label }
                          </span>
                          <span className="d-flex flex-column color-secondary gap-1">
                            { item.content }
                          </span>
                        </div>
                        <div className='d-flex align-items-end'>
                          { item.cover }
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>

              <div className='d-flex flex-wrap gap-2'>
                <div className='d-flex flex-column col-12 col-md-5 col-lg-4 col-xl-3 gap-4 br-3 ps-3 pe-3 py-3 bg-gray-alpha-4'>
                  {
                    [
                      { label: t('common.perpTotalValue'),
                        sub: <span className='bg-gray-alpha-1 px-2 br-1'>{t('common.currentPosition')}</span>,
                        content: <>
                          <span className="color-white h5 fw-bold pb-1">$ { formatNumber(traderDetailsStore.totalPositionValue) }</span>
                          <small className='d-flex align-items-center justify-content-between'>
                            {t('common.marginUsage')}
                            <span className='fw-500'>{ traderDetailsStore.totalMarginUsagePct } %</span>
                          </small>
                          <Progress showInfo={false} percent={+traderDetailsStore.totalMarginUsagePct} className='br-4 overflow-hidden mt-1' size={{ height: 8 }} strokeColor={'#29BDCC'} />
                        </>
                      },
                      { label: t('common.directionBias'), sub: <PositionItemDirectionBias className='fw-bold' item={traderDetailsStore} />, content: <>
                          <small className='d-flex align-items-center justify-content-between'>
                            {t('common.longExposure')}
                            <span className='color-success fw-500'>{ traderDetailsStore.totalLongPositionValuePct } %</span>
                          </small>
                          <Progress showInfo={false} percent={+traderDetailsStore.totalLongPositionValuePct} className='br-4 overflow-hidden mt-1' size={{ height: 8 }} strokeColor={'#14c362'} />
                          <small className='d-flex align-items-center justify-content-between pt-2'>
                            {t('common.shortExposure')}
                            <span className='color-error fw-500'>{ traderDetailsStore.totalShortPositionValuePct } %</span>
                          </small>
                          <Progress showInfo={false} percent={+traderDetailsStore.totalShortPositionValuePct} className='br-4 overflow-hidden mt-1' size={{ height: 8 }} strokeColor={'#d01515'} />
                        </>
                      },
                      {
                        label: t('common.positionDistribution'), content: <>
                          <span className='d-flex align-items-center justify-content-between'>
                            <small className='small d-flex flex-column gap-1'>
                              {t('common.longValue')}
                              <span className='fw-bold h6 color-white'>$ { formatNumber(traderDetailsStore.totalLongPositionValue) }</span>
                            </small>
                            <small className='d-flex flex-column text-end gap-1'>
                              {t('common.shortValue')}
                              <span className='fw-bold h6 color-white'>$ { formatNumber(traderDetailsStore.totalShortPositionValue) }</span>
                            </small>
                          </span>
                          <div className='d-flex gap-1 bg-gray-alpha-1 br-4 overflow-hidden' style={{ background: 'rgba(255,255,255,0.12)', height: '8px' }}>
                            { new BN(traderDetailsStore.totalLongPositionValuePct).gt(0) && <Progress rootClassName='position-distribution transition' style={{ width: `${traderDetailsStore.totalLongPositionValuePct}%` }} showInfo={false} percent={100} size={{ height: 8 }} strokeColor={'#14c362'} /> }
                            { new BN(traderDetailsStore.totalShortPositionValuePct).gt(0) && <Progress rootClassName='position-distribution transition' style={{ width: `${traderDetailsStore.totalShortPositionValuePct}%` }} showInfo={false} percent={100} size={{ height: 8 }} strokeColor={'#d01515'} /> }
                          </div>
                        </>
                      },
                      {
                        label: t('common.roe'), sub: <PositionItemCommonPnl prefix='' suffix=' %' value={traderDetailsStore.totalROEPct } />, content: 
                          <span className="d-flex align-items-center justify-content-between color-unimportant pb-1">
                            {t('common.uPnl')}
                            <span className='d-flex gap-2 ms-auto'><PositionItemCommonPnl className='fw-500' value={traderDetailsStore.totalUPnl} /></span>
                          </span>
                      }
                    ].map((item, idx) => {
                      return (
                        <div key={idx} className='d-flex flex-column'>
                          <span className="d-flex align-items-center justify-content-between color-unimportant pb-1">
                            { item.label }
                            <span className='d-flex gap-2 ms-auto'>{ item.sub }</span>
                          </span>
                          { item.content && <span className="d-flex flex-column color-secondary gap-1">
                              { item.content }
                            </span>
                          }
                        </div>
                      )
                    })
                  }
                </div>

                <TraderDetailsKline className='br-3 ps-3 pe-3 py-3 bg-gray-alpha-4' />
              </div>
            </div>
          </Busy>

          <div className='d-flex flex-column br-3 overflow-hidden'>
            <TabSwitch
              labelSuffixes={[` (${traderDetailsPositionsStore.list.length})`, ` (${traderDetailsOpenOrdersAdditionalStore.list.length})`]}
              data={traderDetailsStore.tabs}
              currId={traderDetailsStore.tabId}
              onClick={(item) => traderDetailsStore.tabId = item.id} />
            {
              traderDetailsStore.tabId === 'positions' &&
                <TraderDetailsPositions unReset unUpdate={traderDetailsStore.isAutoRefreshing} address={traderDetailsStore.address} />
            }
            <TraderDetailsOpenOrdersAdditional
              autoRefreshing={traderDetailsStore.isAutoRefreshing}
              address={traderDetailsStore.address}
              className={`col ${traderDetailsStore.tabId === 'openOrders' ? '' : 'd-none'}`} />
            {
              traderDetailsStore.tabId === 'historicalOrders' &&
                <TraderDetailsHistoricalOrders address={traderDetailsStore.address} />
            }
            {
              traderDetailsStore.tabId === 'recentFills' &&
                <TraderDetailsRecentFills address={traderDetailsStore.address} />
            }
            {
              traderDetailsStore.tabId === 'completedTrades' &&
                <>completedTrades</>
            }
            {
              traderDetailsStore.tabId === 'twap' &&
                <TraderDetailsTWAP address={traderDetailsStore.address} />
            }
            {
              traderDetailsStore.tabId === 'depositsAndWithdrawals' &&
                <TraderDetailsNonFunding address={traderDetailsStore.address} />
            }
          </div>
        </div>
      </div>

      <ModalTradingStatistics />
      <TrackingCreateTrack />
      <ModalCreateCopyTrading />
      <ModalSpotAssets />
    </>
  )
}

export default TraderDetails


