import { useEffect } from 'react'
import BN from 'bignumber.js'
import { useTranslation } from 'react-i18next'

import { formatNumber } from '@/utils'
import { useReqStore, useTrendingStore } from '@/stores'
import ColumnList from '@/components/Column/List'
import TabSwitch from '@/components/Tab/Switch'
import DropdownMenu from '@/components/Dropdown/Menu'
import { ICyclical } from '@/components/icon'

const DURATION_REQUIRED = ['net_flow', 'oi', 'price']

const formatTime = (ts: number) => {
  if (!ts) return '-'
  const d = new Date(ts)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const M = String(d.getMonth() + 1).padStart(2, '0')
  const D = String(d.getDate()).padStart(2, '0')
  return `${M}/${D} ${hh}:${mm}`
}

const Trending = () => {
  const reqStore = useReqStore()
  const trendingStore = useTrendingStore()
  const { t } = useTranslation()

  const tabId = trendingStore.tabId
  const durationRequired = DURATION_REQUIRED.includes(tabId)

  // init / tab 切换 / duration 切换时重新请求
  useEffect(() => {
    reqStore.trendingCrypto(trendingStore)
  }, [trendingStore.tabId, trendingStore.duration])

  // 各 tab 的列配置
  const NET_FLOW_COLUMNS = [
    { id: 'rank', label: '#', className: 'col-1 col-sm-1 text-center' },
    { id: 'symbol', label: t('common.symbol'), className: 'col-3 col-sm-3 col-md-2' },
    { id: 'amount', label: t('trending.netFlowAmount'), className: 'text-end justify-content-end col-5 col-sm-4 col-md-3' },
    { id: 'price', label: t('common.lastPrice'), className: 'text-end justify-content-end d-none d-sm-flex col-sm-3 col-md-2' },
    { id: 'priceDelta', label: t('common.twentyFourHChange'), className: 'text-end justify-content-end col' },
  ]

  const OI_COLUMNS = [
    { id: 'rank', label: '#', className: 'col-1 col-sm-1 text-center' },
    { id: 'symbol', label: t('common.symbol'), className: 'col-3 col-sm-3 col-md-2' },
    { id: 'oiDeltaValue', label: t('trending.oiChangeValue'), className: 'text-end justify-content-end col-5 col-sm-4 col-md-3' },
    { id: 'oiDeltaPercent', label: t('trending.oiChangePercent'), className: 'text-end justify-content-end d-none d-sm-flex col-sm-3 col-md-2' },
    { id: 'price', label: t('common.lastPrice'), className: 'text-end justify-content-end d-none d-md-flex col-md-2' },
    { id: 'priceDelta', label: t('common.twentyFourHChange'), className: 'text-end justify-content-end col' },
  ]

  const DEPTH_COLUMNS = [
    { id: 'rank', label: '#', className: 'col-1 col-sm-1 text-center' },
    { id: 'symbol', label: t('common.symbol'), className: 'col-3 col-sm-3 col-md-2' },
    { id: 'bidVolume', label: t('trending.bidVolume'), className: 'text-end justify-content-end d-none d-sm-flex col-sm-3 col-md-2' },
    { id: 'askVolume', label: t('trending.askVolume'), className: 'text-end justify-content-end d-none d-sm-flex col-sm-3 col-md-2' },
    { id: 'delta', label: t('trending.depthDelta'), className: 'text-end justify-content-end col-4 col-sm-3 col-md-2' },
    { id: 'price', label: t('common.lastPrice'), className: 'text-end justify-content-end d-none d-md-flex col-md-1' },
    { id: 'priceDelta', label: t('common.twentyFourHChange'), className: 'text-end justify-content-end col' },
  ]

  const RATES_COLUMNS = [
    { id: 'rank', label: '#', className: 'col-1 col-sm-1 text-center' },
    { id: 'symbol', label: t('common.symbol'), className: 'col-3 col-sm-3 col-md-2' },
    { id: 'fundingRate', label: t('common.fundingRate'), className: 'text-end justify-content-end col-4 col-sm-3 col-md-2' },
    { id: 'markPrice', label: t('trending.markPrice'), className: 'text-end justify-content-end d-none d-sm-flex col-sm-3 col-md-2' },
    { id: 'indexPrice', label: t('trending.indexPrice'), className: 'text-end justify-content-end d-none d-md-flex col-md-2' },
    { id: 'nextFunding', label: t('trending.nextFunding'), className: 'text-end justify-content-end d-none d-lg-flex col-lg-2' },
    { id: 'priceDelta', label: t('common.twentyFourHChange'), className: 'text-end justify-content-end col' },
  ]

  const PRICE_COLUMNS = [
    { id: 'rank', label: '#', className: 'col-1 col-sm-1 text-center' },
    { id: 'symbol', label: t('common.symbol'), className: 'col-3 col-sm-3 col-md-2' },
    { id: 'priceDelta', label: t('trending.priceChange'), className: 'text-end justify-content-end col-4 col-sm-3 col-md-2' },
    { id: 'price', label: t('common.lastPrice'), className: 'text-end justify-content-end d-none d-sm-flex col-sm-3 col-md-2' },
    { id: 'futureFlow', label: t('trending.futureFlow'), className: 'text-end justify-content-end d-none d-md-flex col-md-2' },
    { id: 'spotFlow', label: t('trending.spotFlow'), className: 'text-end justify-content-end d-none d-lg-flex col-lg-2' },
    { id: 'oi', label: t('common.openInterest'), className: 'text-end justify-content-end col' },
  ]

  const COLUMNS_MAP: Record<string, any[]> = {
    net_flow: NET_FLOW_COLUMNS,
    oi: OI_COLUMNS,
    depth: DEPTH_COLUMNS,
    rates: RATES_COLUMNS,
    price: PRICE_COLUMNS,
  }

  const renderRow = (item: any, columnIndex: number, column: any) => {
    switch (column.id) {
      case 'rank':
        return <span className="color-unimportant">{item.rank}</span>
      case 'symbol':
        return <span className="fw-bold">{item.symbol}</span>
      case 'amount':
        return (
          <span className={item.amountClassName}>
            {new BN(item.amountStatus).gt(0) && '+'}$ {formatNumber(item.amount)}
          </span>
        )
      case 'oiDeltaValue':
        return (
          <span className={item.oiDeltaClassName}>
            {new BN(item.oiDeltaStatus).gt(0) && '+'}$ {formatNumber(item.oiDeltaValue)}
          </span>
        )
      case 'oiDeltaPercent':
        return (
          <span className={item.oiDeltaPercentClassName}>
            {new BN(item.oiDeltaPercentStatus).gt(0) && '+'}{formatNumber(item.oiDeltaPercent)} %
          </span>
        )
      case 'bidVolume':
        return <span>$ {formatNumber(item.bidVolume)}</span>
      case 'askVolume':
        return <span>$ {formatNumber(item.askVolume)}</span>
      case 'delta':
        return (
          <span className={item.deltaClassName}>
            {new BN(item.deltaStatus).gt(0) && '+'}$ {formatNumber(item.delta)}
          </span>
        )
      case 'fundingRate':
        return (
          <span className={item.fundingRateClassName}>
            {new BN(item.fundingRateStatus).gt(0) && '+'}{formatNumber(item.fundingRate)} %
          </span>
        )
      case 'markPrice':
        return <span>$ {formatNumber(item.markPrice)}</span>
      case 'indexPrice':
        return <span>$ {formatNumber(item.indexPrice)}</span>
      case 'nextFunding':
        return <span>{formatTime(item.nextFundingTime)}</span>
      case 'price':
        return <span>$ {formatNumber(item.price)}</span>
      case 'priceDelta':
        return (
          <span className={item.priceDeltaPercentClassName}>
            {new BN(item.priceDeltaPercentStatus).gt(0) && '+'}{formatNumber(item.priceDeltaPercent)} %
          </span>
        )
      case 'futureFlow':
        return (
          <span className={item.futureFlowClassName}>
            {new BN(item.futureFlowStatus).gt(0) && '+'}$ {formatNumber(item.futureFlow)}
          </span>
        )
      case 'spotFlow':
        return (
          <span className={item.spotFlowClassName}>
            {new BN(item.spotFlowStatus).gt(0) && '+'}$ {formatNumber(item.spotFlow)}
          </span>
        )
      case 'oi':
        return <span>{formatNumber(item.oi)}</span>
      default:
        return null
    }
  }

  // top / low 标题
  const TOP_LABEL_MAP: Record<string, string> = {
    net_flow: t('trending.topInflow'),
    oi: t('trending.oiIncrease'),
    depth: t('trending.futures'),
    rates: t('trending.topRates'),
    price: t('trending.topGainers'),
  }
  const LOW_LABEL_MAP: Record<string, string> = {
    net_flow: t('trending.topOutflow'),
    oi: t('trending.oiDecrease'),
    depth: t('trending.spot'),
    rates: t('trending.lowRates'),
    price: t('trending.topLosers'),
  }

  const columns = COLUMNS_MAP[tabId] || []

  return (
    <div className="container-fluid px-0 d-flex flex-column my-5 pt-5">
      <div className="container-xl d-flex flex-column px-3 px-md-4 gap-3 gap-md-4 mb-3 mb-md-5 py-0">
        {/* 标题 */}
        <div className="d-flex flex-column text-center text-md-start gap-3 my-4 my-md-5">
          <h2 className="fw-bold">{t('trending.headline')}</h2>
          <span className="h5 color-secondary col-12 col-md-8">{t('trending.subheadline')}</span>
        </div>

        {/* Tab + Duration */}
        <div className="d-flex flex-column br-3 overflow-hidden">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <TabSwitch
              className="flex-grow-1"
              data={trendingStore.tabs}
              currId={trendingStore.tabId}
              onClick={(item) => { trendingStore.tabId = item.id }}
            />
            {
              durationRequired &&
                <DropdownMenu
                  buttonSize="small"
                  items={trendingStore.durations}
                  selectedValue={trendingStore.duration}
                  onSelect={(v) => { trendingStore.duration = v }}
                  icon={<ICyclical className="w-18" />}
                />
            }
          </div>

          {/* Top 榜 */}
          <div className="d-flex flex-column gap-2 mt-3">
            <span className="fw-bold ps-1">{TOP_LABEL_MAP[tabId]}</span>
            <ColumnList
              busy={reqStore.trendingCryptoBusy}
              columns={columns}
              data={trendingStore.topList}
              renderItem={renderRow}
            />
          </div>

          {/* Low 榜 */}
          <div className="d-flex flex-column gap-2 mt-3">
            <span className="fw-bold ps-1">{LOW_LABEL_MAP[tabId]}</span>
            <ColumnList
              busy={reqStore.trendingCryptoBusy}
              columns={columns}
              data={trendingStore.lowList}
              renderItem={renderRow}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Trending
