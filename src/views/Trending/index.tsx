import { useEffect } from 'react'
import BN from 'bignumber.js'
import { useTranslation } from 'react-i18next'

import { formatNumber } from '@/utils'
import { useReqStore, useTrendingStore } from '@/stores'
import ColumnList from '@/components/Column/List'
import TabSwitch from '@/components/Tab/Switch'
import DropdownMenu from '@/components/Dropdown/Menu'
import { ICyclical } from '@/components/icon'

import './index.scss'

// 需要 duration 参数的 tab
const DURATION_REQUIRED = ['net_flow', 'oi', 'price']
// 牛熊雷达 tab（双榜卡片式展示）
const RADAR_TABS = ['bias_radar']
// 需要展示 top/low 双榜的 tab
const TOP_LOW_TABS = ['net_flow', 'oi', 'depth', 'rates', 'price']
// trending-category 类型的 tab（单列表）
const CATEGORY_TABS = ['ai500', 'prediction']
// HyperLiquid 类型的 tab（单列表）
const HL_TABS = ['hl_perp', 'hl_spot']

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
  const isRadarTab = RADAR_TABS.includes(tabId)
  const isTopLowTab = TOP_LOW_TABS.includes(tabId)
  const isCategoryTab = CATEGORY_TABS.includes(tabId)
  const isHlTab = HL_TABS.includes(tabId)

  // init / tab 切换 / duration 切换时重新请求
  useEffect(() => {
    if (isRadarTab) {
      reqStore.trendingRadar(trendingStore)
    } else if (isTopLowTab) {
      reqStore.trendingCrypto(trendingStore)
    } else if (isCategoryTab) {
      reqStore.trendingCategory(trendingStore, tabId)
    } else if (isHlTab) {
      reqStore.trendingHl(trendingStore, tabId === 'hl_perp' ? 'perp' : 'spot')
    }
  }, [trendingStore.tabId, trendingStore.duration])

  // 原 5 个 tab 的列配置
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

  // 牛熊雷达列配置
  const BIAS_RADAR_COLUMNS = [
    { id: 'rank', label: '#', className: 'col-1 col-sm-1 text-center' },
    { id: 'symbol', label: t('common.symbol'), className: 'col-3 col-sm-3 col-md-2' },
    { id: 'bias', label: t('trending.bias'), className: 'col-2 col-sm-1' },
    { id: 'directionScore', label: t('trending.directionScore'), className: 'text-end justify-content-end col-2 col-sm-1' },
    { id: 'changePct', label: t('common.twentyFourHChange'), className: 'text-end justify-content-end d-none d-sm-flex col-sm-2' },
    { id: 'funding', label: t('common.fundingRate'), className: 'text-end justify-content-end d-none d-md-flex col-md-2' },
    { id: 'markPrice', label: t('trending.markPrice'), className: 'text-end justify-content-end d-none d-lg-flex col-lg-1' },
    { id: 'factors', label: t('trending.factors'), className: 'text-end justify-content-end col-3 col-sm-2' },
  ]

  // AI500 列配置
  const AI500_COLUMNS = [
    { id: 'rank', label: '#', className: 'col-1 col-sm-1 text-center' },
    { id: 'symbol', label: t('common.symbol'), className: 'col-3 col-sm-3 col-md-2' },
    { id: 'score', label: t('trending.ai500Score'), className: 'text-end justify-content-end col-3 col-sm-2' },
    { id: 'price', label: t('trending.ai500Price'), className: 'text-end justify-content-end col-3 col-sm-3 col-md-2' },
    { id: 'changePct', label: t('common.twentyFourHChange'), className: 'text-end justify-content-end col' },
    { id: 'signal', label: t('trending.ai500Signal'), className: 'text-end justify-content-end d-none d-md-flex col-md-2' },
  ]

  // 预测市场列配置
  const PREDICTION_COLUMNS = [
    { id: 'rank', label: '#', className: 'col-1 col-sm-1 text-center' },
    { id: 'symbol', label: t('trending.predictionMarket'), className: 'col-5 col-sm-4 col-md-3' },
    { id: 'price', label: t('trending.predictionYesPrice'), className: 'text-end justify-content-end col-3 col-sm-2' },
    { id: 'volume24h', label: t('trending.predictionVolume24h'), className: 'text-end justify-content-end d-none d-sm-flex col-sm-3 col-md-2' },
    { id: 'totalVolume', label: t('trending.predictionTotalVolume'), className: 'text-end justify-content-end d-none d-md-flex col-md-2' },
    { id: 'change', label: t('trending.predictionChange'), className: 'text-end justify-content-end col' },
  ]

  // HyperLiquid 合约列配置
  const HL_PERP_COLUMNS = [
    { id: 'rank', label: '#', className: 'col-1 col-sm-1 text-center' },
    { id: 'name', label: t('common.symbol'), className: 'col-3 col-sm-3 col-md-2' },
    { id: 'markPrice', label: t('trending.hlMarkPrice'), className: 'text-end justify-content-end col-3 col-sm-2' },
    { id: 'changePct', label: t('common.twentyFourHChange'), className: 'text-end justify-content-end col-3 col-sm-2' },
    { id: 'funding', label: t('common.fundingRate'), className: 'text-end justify-content-end d-none d-sm-flex col-sm-2' },
    { id: 'openInterest', label: t('common.openInterest'), className: 'text-end justify-content-end d-none d-md-flex col-md-2' },
    { id: 'dayNtlVolume', label: t('trending.hlVolume24h'), className: 'text-end justify-content-end d-none d-lg-flex col-lg-2' },
  ]

  // HyperLiquid 现货列配置
  const HL_SPOT_COLUMNS = [
    { id: 'rank', label: '#', className: 'col-1 col-sm-1 text-center' },
    { id: 'name', label: t('common.symbol'), className: 'col-4 col-sm-4 col-md-3' },
    { id: 'markPx', label: t('trending.hlMarkPrice'), className: 'text-end justify-content-end col-3 col-sm-3 col-md-2' },
    { id: 'changePct', label: t('common.twentyFourHChange'), className: 'text-end justify-content-end col-3 col-sm-2' },
    { id: 'dayNtlVolume', label: t('trending.hlVolume24h'), className: 'text-end justify-content-end d-none d-md-flex col-md-2' },
    { id: 'midPx', label: t('trending.hlMidPrice'), className: 'text-end justify-content-end d-none d-lg-flex col-lg-2' },
  ]

  const COLUMNS_MAP: Record<string, any[]> = {
    bias_radar: BIAS_RADAR_COLUMNS,
    net_flow: NET_FLOW_COLUMNS,
    oi: OI_COLUMNS,
    depth: DEPTH_COLUMNS,
    rates: RATES_COLUMNS,
    price: PRICE_COLUMNS,
    ai500: AI500_COLUMNS,
    prediction: PREDICTION_COLUMNS,
    hl_perp: HL_PERP_COLUMNS,
    hl_spot: HL_SPOT_COLUMNS,
  }

  // 渲染牛熊雷达行
  const renderRadarRow = (item: any, columnIndex: number, column: any) => {
    switch (column.id) {
      case 'rank':
        return <span className="color-unimportant">{item.rank}</span>
      case 'symbol':
        return <span className="fw-bold text-truncate">{item.symbol}</span>
      case 'bias':
        return (
          <span className={`trending-radar-bias-tag ${item.biasClassName}`}>
            {t(`trending.${item.bias}`)}
          </span>
        )
      case 'directionScore':
        return (
          <span className={`fw-bold ${item.directionScoreClassName}`}>
            {item.directionScoreDisplay}
          </span>
        )
      case 'changePct':
        // vergex 模式无此字段，显示为 -
        if (!item.changePct) return <span className="color-unimportant">-</span>
        return (
          <span className={item.directionScore > 0 ? 'color-success' : item.directionScore < 0 ? 'color-error' : 'color-secondary'}>
            {new BN(item.changePct).gt(0) && '+'}{formatNumber(item.changePct)} %
          </span>
        )
      case 'funding':
        // vergex 模式无此字段，显示为 -
        if (!item.funding) return <span className="color-unimportant">-</span>
        return (
          <span className={new BN(item.funding).gt(0) ? 'color-success' : new BN(item.funding).lt(0) ? 'color-error' : 'color-secondary'}>
            {new BN(item.funding).gt(0) && '+'}{formatNumber(item.funding)} %
          </span>
        )
      case 'markPrice':
        return <span>$ {formatNumber(item.markPrice)}</span>
      case 'factors':
        return (
          <span className="d-flex align-items-center gap-1 justify-content-end">
            {(item.factorList || []).map(f => (
              <span key={f.key} className={`trending-radar-factor-dot ${f.className}`} title={f.key.toUpperCase()} />
            ))}
          </span>
        )
      default:
        return null
    }
  }

  // 渲染原 5 个 tab 的行
  const renderTopLowRow = (item: any, columnIndex: number, column: any) => {
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

  // 渲染 AI500 行
  const renderAi500Row = (item: any, columnIndex: number, column: any) => {
    switch (column.id) {
      case 'rank':
        return <span className="color-unimportant">{item.rank}</span>
      case 'symbol':
        return <span className="fw-bold">{item.symbol}</span>
      case 'score':
        return <span className="color-primary fw-bold">{item.score?.toFixed(1)}</span>
      case 'price':
        return <span>{item.price}</span>
      case 'changePct':
        return (
          <span className={item.changePctValueClassName}>
            {new BN(item.changePctValueStatus).gt(0) && '+'}{formatNumber(item.changePctValue)} %
          </span>
        )
      case 'signal':
        return <span className="color-secondary">{item.signal}</span>
      default:
        return null
    }
  }

  // 渲染预测市场行
  const renderPredictionRow = (item: any, columnIndex: number, column: any) => {
    switch (column.id) {
      case 'rank':
        return <span className="color-unimportant">{item.rank}</span>
      case 'symbol':
        return <span className="fw-bold text-truncate">{item.symbol}</span>
      case 'price':
        return <span className={item.yesPriceValueClassName}>{item.price}</span>
      case 'volume24h':
        return <span>$ {formatNumber(item.volume24hrValue)}</span>
      case 'totalVolume':
        return <span>$ {formatNumber(item.totalVolumeValue)}</span>
      case 'change':
        return <span className="color-secondary">{item.change}</span>
      default:
        return null
    }
  }

  // 渲染 HyperLiquid 合约行
  const renderHlPerpRow = (item: any, columnIndex: number, column: any) => {
    switch (column.id) {
      case 'rank':
        return <span className="color-unimportant">{item.rank}</span>
      case 'name':
        return <span className="fw-bold">{item.name}</span>
      case 'markPrice':
        return <span>$ {formatNumber(item.markPrice)}</span>
      case 'changePct':
        return (
          <span className={item.changePctClassName}>
            {new BN(item.changePctStatus).gt(0) && '+'}{formatNumber(item.changePct)} %
          </span>
        )
      case 'funding':
        return (
          <span className={item.fundingClassName}>
            {new BN(item.fundingStatus).gt(0) && '+'}{formatNumber(item.funding)} %
          </span>
        )
      case 'openInterest':
        return <span>{formatNumber(item.openInterest)}</span>
      case 'dayNtlVolume':
        return <span>$ {formatNumber(item.dayNtlVolume)}</span>
      default:
        return null
    }
  }

  // 渲染 HyperLiquid 现货行
  const renderHlSpotRow = (item: any, columnIndex: number, column: any) => {
    switch (column.id) {
      case 'rank':
        return <span className="color-unimportant">{item.rank}</span>
      case 'name':
        return <span className="fw-bold">{item.name}</span>
      case 'markPx':
        return <span>$ {formatNumber(item.markPx)}</span>
      case 'changePct':
        return (
          <span className={item.changePctClassName}>
            {new BN(item.changePctStatus).gt(0) && '+'}{formatNumber(item.changePct)} %
          </span>
        )
      case 'dayNtlVolume':
        return <span>$ {formatNumber(item.dayNtlVolume)}</span>
      case 'midPx':
        return <span>$ {formatNumber(item.midPx)}</span>
      default:
        return null
    }
  }

  const RENDER_MAP: Record<string, any> = {
    bias_radar: renderRadarRow,
    net_flow: renderTopLowRow,
    oi: renderTopLowRow,
    depth: renderTopLowRow,
    rates: renderTopLowRow,
    price: renderTopLowRow,
    ai500: renderAi500Row,
    prediction: renderPredictionRow,
    hl_perp: renderHlPerpRow,
    hl_spot: renderHlSpotRow,
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
  const renderRow = RENDER_MAP[tabId] || renderTopLowRow

  // 当前 tab 的 loading 状态
  const busy = isRadarTab ? reqStore.trendingRadarBusy
    : isTopLowTab ? reqStore.trendingCryptoBusy
    : isCategoryTab ? reqStore.trendingCategoryBusy
    : isHlTab ? reqStore.trendingHlBusy
    : false

  // 牛熊雷达：统一列表展示（已按 directionScore 降序排列）
  const radarList = trendingStore.radarList || []

  return (
    <div className="container-fluid px-0 d-flex flex-column my-5 pt-5">
      <div className="container-xl d-flex flex-column align-items-center px-3 px-md-4 gap-3 gap-md-4 mb-3 mb-md-5 py-0">
        <div className="d-flex flex-column w-100 trending-content-wrap">
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

          {/* 牛熊雷达（统一列表，优先重点展示） */}
          {isRadarTab && (
            <div className="d-flex flex-column gap-2 mt-3">
              <ColumnList
                busy={busy}
                columns={columns}
                data={radarList}
                renderItem={renderRow}
              />
            </div>
          )}

          {/* top/low 双榜 */}
          {isTopLowTab && (
            <>
              <div className="d-flex flex-column gap-2 mt-3">
                <span className="fw-bold ps-1">{TOP_LABEL_MAP[tabId]}</span>
                <ColumnList
                  busy={busy}
                  columns={columns}
                  data={trendingStore.topList}
                  renderItem={renderRow}
                />
              </div>
              <div className="d-flex flex-column gap-2 mt-3">
                <span className="fw-bold ps-1">{LOW_LABEL_MAP[tabId]}</span>
                <ColumnList
                  busy={busy}
                  columns={columns}
                  data={trendingStore.lowList}
                  renderItem={renderRow}
                />
              </div>
            </>
          )}

          {/* 单列表（AI500 / 预测市场） */}
          {isCategoryTab && (
            <div className="d-flex flex-column gap-2 mt-3">
              <ColumnList
                busy={busy}
                columns={columns}
                data={trendingStore.categoryList}
                renderItem={renderRow}
              />
            </div>
          )}

          {/* 单列表（HyperLiquid 合约/现货） */}
          {isHlTab && (
            <div className="d-flex flex-column gap-2 mt-3">
              <ColumnList
                busy={busy}
                columns={columns}
                data={trendingStore.hlList}
                renderItem={renderRow}
              />
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Trending
