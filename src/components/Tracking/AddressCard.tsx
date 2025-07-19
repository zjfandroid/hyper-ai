import { Button, Popconfirm, Progress } from 'antd'
import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { IOutlineTrash, IOutlineArrowRight1, IOutlineEye, IOutlineChart2, IQuestionCircle, IOutlineInfoCircle, IOutlineShare, IOutlineMonitor } from '@/components/icon'
import { constants, useReqStore, useAccountStore, useDiscoverTradingStatisticsStore, useTrackingAddressPositionStore, useCopyTradingStore, useTrackingCreateStore, useDiscoverStore } from '@/stores'
import PositionItemPnl from '@/components/PositionItem/Pnl'
import PositionItemMarginUsedRatio from '@/components/PositionItem/MarginUsedRatio'
import PositionItemAddress from '@/components/PositionItem/Address'
import { formatNumber, localStorage } from '@/utils'
import TrackingAddressPositionContent from '@/components/Tracking/AddressPositionContent'
import SideButtonIcon from '@/components/Side/ButtonIcon'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import ColumnTooltip from '@/components/Column/Tooltip'
import MUISparkLineChart from '@/components/MUI/SparkLineChart'
import MUIRadarChartMini from '@/components/MUI/RadarChartMini';
import MUIBasePieChart from '@/components/MUI/BasePieChart'
import VizTemplate from '@/components/Viz/Template'
import VizDirectionPnlPieChart from '@/components/Viz/DirectionPnlPieChart'
import TimeAgo from '@/components/TimeAgo'
import LightweightChart from '@/components/LightweightChart'
import MiniChartBaseline from '@/components/MiniChart/Baseline';
import PositionItemCommonPnl from '@/components/PositionItem/CommonPnl'

const TrackingAddressCard = ({ item }) => {
  const reqStore = useReqStore()
  const accountStore = useAccountStore()
  const copyTradingStore = useCopyTradingStore()
  const trackingCreateStore = useTrackingCreateStore()
  const discoverStore = useDiscoverStore()
  const discoverTradingStatisticsStore = useDiscoverTradingStatisticsStore()
  const { t, i18n } = useTranslation()


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

  const handleOpenCreateTrackAddress = async (item) => {
    // sync quick
    trackingCreateStore.quickCreateTrackAddress = item.address

    trackingCreateStore.openCreateTracking = true
  }

  // const renderRadarChart = (item) => {
  //   return <MUIRadarChartMini series={[
  //     {
  //       id: 'australia-id',
  //       data: [
  //         item.winRate,
  //         item.longWinRate,
  //         item.longPnl,
  //         0,
  //         item.shortPnl,
  //           item.shortWinRate,
  //       ],
  //       fillArea: true,
  //       hideMark: true,
  //     }]}
  //     radar={{
  //       // startAngle: 30, // 起始角度
  //       metrics: [
  //         { name: 'Win Rate', max: 100 },
  //         { name: 'Long Win Rate', max: 100 },
  //         { name: 'Long PnL Contribution', max: item.pnl },
  //         { name: 'Avg Leverage', max: 40 },
  //         { name: 'Short PnL Contribution', max: item.pnl },
  //         { name: 'Short Win Rate', max: 100 },
  //       ]
  //     }} />
  // }

  // const renderWinRateChart = () => {
  //   let data = []

  //   if ((+item.longWinRate === 0 && +item.shortWinRate === 0 && +item.lossRate === 0)) {
  //     data = [
  //       { value: 100, color: 'rgba(255, 255, 255, 0.05)', label: 'Unknow' },
  //     ]
  //   } else {
  //     data = [
  //       { value: item.longWinRate, color: '#03741b', label: 'Long Win Rate' },
  //       { value: item.shortWinRate, color: '#780909', label: 'Short Win Rate' },
  //       { value: item.lossRate, color: 'rgba(255, 255, 255, 0.1)', label: 'Loss Rate' },
  //     ]
  //   }

  //   return <MUIBasePieChart data={data} />
  // }

  // const renderROISparkLineChart = (item) => {
  //   return <SparkLineChart
  //     plotType="bar"
  //     area
  //     data={item.pnlList.map((_item) => _item[1])}
  //     showTooltip
  //     color='rgba(0, 184, 217, 0.7)'
  //     showHighlight
  //     xAxis={{
  //       scaleType: 'band',

  //       data: item.pnlList.map((_item) => _item[0]),
  //       valueFormatter: (value) => dayjs(value).format(constants.format.fullDate),
  //     }}
  //     yAxis={{ domainLimit: 'strict' }}
  //     {...{
  //       height: 69,
  //       width: 180,
  //       margin: { right: 0, top: 0, bottom: 0, left: 0  },
  //       hideLegend: true,
  //     }}
  //   />
  // }

  return (
    <>
      <dl className='d-flex flex-column br-2 overflow-hidden column-list'>

        {/* <dt className='d-flex flex-column fw-normal'>
          <div className='d-flex flex-wrap gap-2 px-3 pt-2 pb-1 bg-gray-alpha-3 align-items-center'>
            <div className='d-flex col-3'>
              <PositionItemAddress avatar item={item} />
            </div>
            <div className='d-flex flex-wrap gap-3 col-12 col-lg'>
              {
                [
                  { label: t('common.lastAction'), className: '', content: <TimeAgo ts={item.lastActionTs} />
                  },
                  { label: 'Avg Leverage', content: <>{item.avgLeverage}x</> },
                  { label: 'Avg Holding Period', content: <>{item.avgHoldingPeriod}</> },
                  { label: t('common.marginUsedRatio'), content: <PositionItemMarginUsedRatio wrap item={item} /> },
                  { label: <>{t('common.positions')}
                      <IOutlineArrowRight1 className='w-16 color-secondary' />
                    </>, className: 'col-2 linker', content: item.totalPositions },
                ].map((item, idx) =>
                  <div key={idx} className={`d-flex flex-column col-5 col-md-2 ${ item.className }`}>
                    <small className='color-unimportant'>{ item.label }</small>
                    <span className=''>{ item.content }</span>
                  </div>
                )
              }
            </div>
            <div className='d-flex gap-3 align-items-center justify-content-end ms-auto'>
              {
                [
                  { icon: <IOutlineChart2 className='zoom-85' />, title: t('common.tradingStatistics'), onClick: () => handleOpenTradingStatistics(item) },
                  { icon: <IOutlineMonitor className='zoom-85' />, title: t('common.trackAddress'), logged: true, onClick: () => handleOpenCreateTrackAddress(item) },
                  { icon: <IOutlineShare className='zoom-85' />, title: t('common.copyTrading'), logged: true, onClick: () => handleOpenQuickerCreateCopyTrade(item) },
                ].map((item, idx) => <SideButtonIcon key={idx} title={item.title} onClick={item.onClick} logged={item.logged} icon={item.icon} />)
              }
            </div>
          </div>
        </dt> */}
        <dd className='d-flex flex-wrap gap-2 px-2 bg-gray-alpha-31 align-items-center'>
          {/* <div className='col-auto'>
            { renderRadarChart(item) }
          </div> */}
          <div className='d-flex flex-column col gap-2'>
            <ul className='d-flex flex-wrap'>
              {
                [
                  {
                    label: <PositionItemAddress avatar className='h6 fw-500 mt-1' item={item} />, className: 'col-12 col-sm-6 col-md-4 col-xl-2',
                    subs: [
                      { label: t('common.lastAction'), content: <TimeAgo ts={item.lastActionTs} /> },
                      { label: t('common.marginUsedRatio'), content: <>{ new BN(item.marginUsedRatio).times(100).toFixed(constants.decimalPlaces.__PCT__) } %</> },
                      { label: t('common.positions'), content: item.totalPositions }
                    ]
                  },
                  { label: t('common.winRate'), className: 'col-12 col-sm-6 col-md-4 col-xl',
                    content: <>{ item.winRate } %</>,
                    subs: [
                      { label: t('common.actLong'), content: <span className='color-secondary'>{formatNumber(item.longWinRate)} %</span> },
                      { label: t('common.actShort'), content: <span className='color-secondary'>{formatNumber(item.shortWinRate)} %</span> }
                    ],
                    // cover: renderWinRateChart()
                  },
                  { label: t('common.tradesCount'), className: 'col-12 col-sm-6 col-md-4 col-xl',
                    content: <>{ formatNumber(item.executedTrades) } </>,
                    subs: [
                      { label: t('common.profit'), content: <span className='color-secondary'>{formatNumber(item.profitableTrades)}</span> },
                      { label: t('common.loss'), content: <span className='color-secondary'>{formatNumber(item.losingTrades)}</span> }
                    ],
                    // cover: <MUIBasePieChart data={[
                    //     { value: item.profitableTrades, color: '#00b8d9a0', label: 'Profit Count' },
                    //     { value: item.losingTrades, color: '#00b8d950', label: 'Loss Count' },
                    //   ]} />
                  },
                  { label: t('common.accountTotalValue'), className: 'col-12 col-sm-6 col-md-4 col-xl-2',
                    content: <PositionItemCommonPnl value={item.accountTotalValue} />,
                    subs: [
                      { label: t('common.perpetual'), content: <PositionItemCommonPnl value={item.perpValue} className='color-secondary' /> },
                      { label: t('common.spot'), content: <PositionItemCommonPnl value={item.spotValue} className='color-secondary' /> }
                    ],
                    // cover: <MUIBasePieChart data={[
                    //     { value: item.perpValue, color: '#5a9e5a', label: 'Perp Value' },
                    //     { value: item.spotValue, color: '#a65e5e', label: 'Spot Value' },
                    //   ]} />
                  },
                  { label: t('common.pnl'), className: 'col-12 col-sm-6 col-md-4 col-xl-2',
                    content: <PositionItemCommonPnl value={item.pnl} />,
                    subs: [
                      { label: t('common.actLong'), content: <PositionItemCommonPnl value={item.longPnl} className='color-secondary' /> },
                      { label: t('common.actShort'), content: <PositionItemCommonPnl value={item.shortPnl} className='color-secondary' /> }
                    ],
                    // cover: <VizDirectionPnlPieChart item={item} />
                  },
                  { label: <ColumnTooltip title={<>{t('common.pnl')} & {t('common.uPnl')}</>} className='d-flex gap-1 linker'>{t('common.netPnL')}<IQuestionCircle className='w-16'/></ColumnTooltip>, className: 'col', labelClassName: 'pb-0',
                    side: <div className='d-flex gap-3 align-items-center justify-content-end ms-auto'>
                      {
                        [
                          { icon: <IOutlineChart2 className='zoom-85' />, title: t('common.tradingStatistics'), onClick: () => handleOpenTradingStatistics(item) },
                          { icon: <IOutlineMonitor className='zoom-85' />, title: t('common.trackAddress'), logged: true, onClick: () => handleOpenCreateTrackAddress(item) },
                          { icon: <IOutlineShare className='zoom-85' />, title: t('common.copyTrading'), logged: true, onClick: () => handleOpenQuickerCreateCopyTrade(item) },
                        ].map((item, idx) => <SideButtonIcon key={idx} title={item.title} onClick={item.onClick} logged={item.logged} icon={item.icon} />)
                      }
                    </div>,
                    content: <>
                      <span className='position-absolute'>
                        <PositionItemCommonPnl className='h6 fw-500' value={ new BN(item.pnlList.length ? item.pnlList[item.pnlList.length -1].value : 0).toFixed(constants.decimalPlaces.__uPnl__) } />
                      </span>
                      <MiniChartBaseline data={item.pnlList} mini width={286} height={69} />
                    </>
                  }
                ].map((item, idx) => <VizTemplate key={idx} item={item} /> )
              }
            </ul>
          </div>
        </dd>
      </dl>
    </>
  )
}

export default TrackingAddressCard