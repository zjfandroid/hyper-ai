import BN from 'bignumber.js'

import { merge } from '@/utils'
import { vergexApi, hyperApi, vergexProxyApi } from '@/stores/req/helper'
import { constants, TTrendingStore } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type TrendingCryptoResult = {
  data: Record<string, any>,
  error: boolean
}

export type TTrendingCrypto = {
  trendingCrypto: (trendingStore: TTrendingStore) => Promise<TrendingCryptoResult>
  trendingCryptoBusy: boolean
  trendingCategory: (trendingStore: TTrendingStore, key: string) => Promise<TrendingCryptoResult>
  trendingCategoryBusy: boolean
  trendingHl: (trendingStore: TTrendingStore, type: 'perp' | 'spot') => Promise<TrendingCryptoResult>
  trendingHlBusy: boolean
  trendingRadar: (trendingStore: TTrendingStore) => Promise<TrendingCryptoResult>
  trendingRadarBusy: boolean
}

// 需要 duration 参数的 tab
const DURATION_REQUIRED = ['net_flow', 'oi', 'price']

const { __COMMON__, __PCT__, __FUNDING_PCT__ } = constants.decimalPlaces

// 格式化 net_flow（资金净流向）
const formatNetFlow = (raw: any[]) => (raw || []).map((item, idx) => {
  const bnAmount = new BN(item.amount)
  const bnPriceDeltaPct = new BN(item.price_delta_percent)
  return {
    idx,
    rank: item.rank,
    symbol: item.symbol,
    amount: bnAmount.toFixed(__COMMON__),
    amountStatus: formatUPnlStatus(bnAmount),
    amountClassName: formatStatusClassName(formatUPnlStatus(bnAmount)),
    price: new BN(item.price).toFixed(),
    priceDeltaPercent: bnPriceDeltaPct.toFixed(__PCT__),
    priceDeltaPercentStatus: formatUPnlStatus(bnPriceDeltaPct),
    priceDeltaPercentClassName: formatStatusClassName(formatUPnlStatus(bnPriceDeltaPct)),
  }
})

// 格式化 oi（未平仓量变化）
const formatOi = (raw: any[]) => (raw || []).map((item, idx) => {
  const bnOiDelta = new BN(item.oi_delta)
  const bnOiDeltaPct = new BN(item.oi_delta_percent)
  const bnPriceDeltaPct = new BN(item.price_delta_percent)
  const bnNetLong = new BN(item.net_long)
  const bnNetShort = new BN(item.net_short)
  return {
    idx,
    rank: item.rank,
    symbol: item.symbol,
    currentOi: new BN(item.current_oi).toFixed(__COMMON__),
    oiDelta: bnOiDelta.toFixed(__COMMON__),
    oiDeltaStatus: formatUPnlStatus(bnOiDelta),
    oiDeltaClassName: formatStatusClassName(formatUPnlStatus(bnOiDelta)),
    oiDeltaPercent: bnOiDeltaPct.toFixed(__PCT__),
    oiDeltaPercentStatus: formatUPnlStatus(bnOiDeltaPct),
    oiDeltaPercentClassName: formatStatusClassName(formatUPnlStatus(bnOiDeltaPct)),
    oiDeltaValue: new BN(item.oi_delta_value).toFixed(__COMMON__),
    netLong: bnNetLong.toFixed(__COMMON__),
    netLongStatus: formatUPnlStatus(bnNetLong),
    netLongClassName: formatStatusClassName(formatUPnlStatus(bnNetLong)),
    netShort: bnNetShort.toFixed(__COMMON__),
    netShortStatus: formatUPnlStatus(bnNetShort),
    netShortClassName: formatStatusClassName(formatUPnlStatus(bnNetShort)),
    price: new BN(item.price).toFixed(),
    priceDeltaPercent: bnPriceDeltaPct.toFixed(__PCT__),
    priceDeltaPercentStatus: formatUPnlStatus(bnPriceDeltaPct),
    priceDeltaPercentClassName: formatStatusClassName(formatUPnlStatus(bnPriceDeltaPct)),
  }
})

// 格式化 depth（买卖盘深度）
const formatDepth = (raw: any[]) => (raw || []).map((item, idx) => {
  const bnDelta = new BN(item.delta)
  const bnPriceDeltaPct = new BN(item.price_delta_percent)
  return {
    idx,
    rank: item.rank,
    symbol: item.symbol,
    bidVolume: new BN(item.bid_volume).toFixed(__COMMON__),
    askVolume: new BN(item.ask_volume).toFixed(__COMMON__),
    delta: bnDelta.toFixed(__COMMON__),
    deltaStatus: formatUPnlStatus(bnDelta),
    deltaClassName: formatStatusClassName(formatUPnlStatus(bnDelta)),
    price: new BN(item.price).toFixed(),
    priceDeltaPercent: bnPriceDeltaPct.toFixed(__PCT__),
    priceDeltaPercentStatus: formatUPnlStatus(bnPriceDeltaPct),
    priceDeltaPercentClassName: formatStatusClassName(formatUPnlStatus(bnPriceDeltaPct)),
  }
})

// 格式化 rates（资金费率）
const formatRates = (raw: any[]) => (raw || []).map((item, idx) => {
  const bnFundingRate = new BN(item.funding_rate)
  const bnPriceDeltaPct = new BN(item.price_delta_percent)
  return {
    idx,
    rank: item.rank,
    symbol: item.symbol,
    fundingRate: bnFundingRate.times(100).toFixed(__FUNDING_PCT__),
    fundingRateStatus: formatUPnlStatus(bnFundingRate),
    fundingRateClassName: formatStatusClassName(formatUPnlStatus(bnFundingRate)),
    markPrice: new BN(item.mark_price).toFixed(),
    indexPrice: new BN(item.index_price).toFixed(),
    nextFundingTime: item.next_funding_time,
    priceDeltaPercent: bnPriceDeltaPct.toFixed(__PCT__),
    priceDeltaPercentStatus: formatUPnlStatus(bnPriceDeltaPct),
    priceDeltaPercentClassName: formatStatusClassName(formatUPnlStatus(bnPriceDeltaPct)),
  }
})

// 格式化 price（价格涨跌）
const formatPrice = (raw: any[]) => (raw || []).map((item, idx) => {
  const bnPriceDelta = new BN(item.price_delta)
  const bnFutureFlow = new BN(item.future_flow)
  const bnSpotFlow = new BN(item.spot_flow)
  const bnOiDelta = new BN(item.oi_delta)
  return {
    idx,
    rank: idx + 1,
    pair: item.pair,
    symbol: item.symbol,
    priceDelta: bnPriceDelta.times(100).toFixed(__PCT__),
    priceDeltaStatus: formatUPnlStatus(bnPriceDelta),
    priceDeltaClassName: formatStatusClassName(formatUPnlStatus(bnPriceDelta)),
    price: new BN(item.price).toFixed(),
    futureFlow: bnFutureFlow.toFixed(__COMMON__),
    futureFlowStatus: formatUPnlStatus(bnFutureFlow),
    futureFlowClassName: formatStatusClassName(formatUPnlStatus(bnFutureFlow)),
    spotFlow: bnSpotFlow.toFixed(__COMMON__),
    spotFlowStatus: formatUPnlStatus(bnSpotFlow),
    spotFlowClassName: formatStatusClassName(formatUPnlStatus(bnSpotFlow)),
    oi: new BN(item.oi).toFixed(__COMMON__),
    oiDelta: bnOiDelta.toFixed(__COMMON__),
    oiDeltaValue: new BN(item.oi_delta_value).toFixed(__COMMON__),
  }
})

const FORMAT_MAP: Record<string, (raw: any[]) => any[]> = {
  net_flow: formatNetFlow,
  oi: formatOi,
  depth: formatDepth,
  rates: formatRates,
  price: formatPrice,
}

export const trendingCrypto: TTrendingCrypto = {
  async trendingCrypto(trendingStore) {
    const result: TrendingCryptoResult = { data: {}, error: true }
    const { tabId, duration, limit } = trendingStore

    if (this.trendingCryptoBusy || !FORMAT_MAP[tabId]) return result

    this.trendingCryptoBusy = true

    const params: Record<string, string> = { tab: tabId, limit: String(limit) }
    if (DURATION_REQUIRED.includes(tabId)) {
      params.duration = duration
    }

    try {
      const res = await vergexApi.get('/trending-crypto', { params })
      result.error = false

      const formatter = FORMAT_MAP[tabId]
      const raw = res.data

      if (tabId === 'depth') {
        result.data = {
          topList: formatter(raw.future),
          lowList: formatter(raw.spot),
        }
      } else {
        result.data = {
          topList: formatter(raw.top),
          lowList: formatter(raw.low),
        }
      }

      merge(trendingStore, result.data)
    } catch (e) {
      result.error = true
    } finally {
      this.trendingCryptoBusy = false
    }

    return result
  },
  trendingCryptoBusy: false,

  async trendingCategory(trendingStore, key) {
    const result: TrendingCryptoResult = { data: {}, error: true }

    if (this.trendingCategoryBusy) return result

    this.trendingCategoryBusy = true

    try {
      const res = await vergexApi.get('/trending-category', { params: { lang: 'en', key } })
      result.error = false

      const rawAssets = res.data?.category?.assets || []
      const formatter = key === 'ai500' ? formatAi500 : formatPrediction
      result.data = { categoryList: formatter(rawAssets) }

      merge(trendingStore, result.data)
    } catch (e) {
      result.error = true
    } finally {
      this.trendingCategoryBusy = false
    }

    return result
  },
  trendingCategoryBusy: false,

  async trendingHl(trendingStore, type) {
    const result: TrendingCryptoResult = { data: {}, error: true }

    if (this.trendingHlBusy) return result

    this.trendingHlBusy = true

    try {
      const reqType = type === 'perp' ? 'metaAndAssetCtxs' : 'spotMetaAndAssetCtxs'
      const res = await hyperApi.post('/info', { type: reqType })
      result.error = false

      const universe = res.data?.[0]?.universe || []
      const ctxs = res.data?.[1] || []
      const formatter = type === 'perp' ? formatHlPerp : formatHlSpot
      result.data = { hlList: formatter(universe, ctxs) }

      merge(trendingStore, result.data)
    } catch (e) {
      result.error = true
    } finally {
      this.trendingHlBusy = false
    }

    return result
  },
  trendingHlBusy: false,

  async trendingRadar(trendingStore) {
    const result: TrendingCryptoResult = { data: {}, error: true }

    if (this.trendingRadarBusy) return result

    this.trendingRadarBusy = true

    try {
      // 优先使用 Cloudflare Worker 代理调用 vergex 真实 biasRadar API
      // 未配置代理时回退到基于 HyperLiquid API 的客户端计算模式
      if (vergexProxyApi) {
        const res = await vergexProxyApi.get('/api/v1/data-intelligence/markets/cross-section/directional', {
          params: { chain: 'mainnet', liqBand: 15 }
        })
        result.error = false

        const rawItems = res.data?.data?.items || res.data?.items || []
        result.data = { radarList: formatRadar(rawItems) }
      } else {
        // 回退方案：基于 HyperLiquid 公开 API 数据客户端计算
        const res = await hyperApi.post('/info', { type: 'metaAndAssetCtxs' })
        result.error = false

        const universe = res.data?.[0]?.universe || []
        const ctxs = res.data?.[1] || []
        result.data = { radarList: formatRadar(universe, ctxs) }
      }

      merge(trendingStore, result.data)
    } catch (e) {
      result.error = true
    } finally {
      this.trendingRadarBusy = false
    }

    return result
  },
  trendingRadarBusy: false,
}

// 格式化 AI500 资产
const formatAi500 = (raw: any[]) => (raw || []).map((item, idx) => {
  const bnChangePct = new BN(item.changePctValue || 0)
  return {
    idx,
    rank: idx + 1,
    symbol: item.symbol,
    pair: item.pair,
    price: item.price,
    change: item.change,
    score: item.score,
    signal: item.signal,
    changePctValue: bnChangePct.toFixed(__PCT__),
    changePctValueStatus: formatUPnlStatus(bnChangePct),
    changePctValueClassName: formatStatusClassName(formatUPnlStatus(bnChangePct)),
    startPrice: new BN(item.startPrice || 0).toFixed(),
  }
})

// 格式化预测市场资产
const formatPrediction = (raw: any[]) => (raw || []).map((item, idx) => {
  const bnYesPrice = new BN(item.yesPriceValue || 0)
  return {
    idx,
    rank: idx + 1,
    symbol: item.title || item.symbol,
    price: item.price,
    change: item.change,
    volume: item.volume,
    yesPriceValue: bnYesPrice.toFixed(__PCT__),
    yesPriceValueStatus: formatUPnlStatus(bnYesPrice.minus(50)),
    yesPriceValueClassName: formatStatusClassName(formatUPnlStatus(bnYesPrice.minus(50))),
    volume24hrValue: new BN(item.volume24hrValue || 0).toFixed(__COMMON__),
    totalVolumeValue: new BN(item.totalVolumeValue || 0).toFixed(__COMMON__),
    icon: item.icon,
  }
})

// 格式化 HyperLiquid 合约
const formatHlPerp = (universe: any[], ctxs: any[]) => {
  return (universe || []).map((item, idx) => {
    const ctx = ctxs[idx] || {}
    const bnFunding = new BN(ctx.funding || 0)
    const bnMarkPrice = new BN(ctx.markPrice || 0)
    const bnOpenInterest = new BN(ctx.openInterest || 0)
    const bnDayNtlVolume = new BN(ctx.dayNtlVolume || 0)
    const bnPrevDayPx = new BN(ctx.prevDayPx || 0)
    const bnMidPrice = new BN(ctx.midPrice || 0)

    let changePct: BN = new BN(0)
    if (bnPrevDayPx.gt(0) && bnMarkPrice.gt(0)) {
      changePct = bnMarkPrice.minus(bnPrevDayPx).div(bnPrevDayPx)
    }

    return {
      idx,
      rank: idx + 1,
      name: item.name,
      szDecimals: item.szDecimals,
      maxLeverage: item.maxLeverage,
      funding: bnFunding.times(100).toFixed(__FUNDING_PCT__),
      fundingStatus: formatUPnlStatus(bnFunding),
      fundingClassName: formatStatusClassName(formatUPnlStatus(bnFunding)),
      openInterest: bnOpenInterest.toFixed(__COMMON__),
      markPrice: bnMarkPrice.toFixed(),
      midPrice: bnMidPrice.toFixed(),
      dayNtlVolume: bnDayNtlVolume.toFixed(__COMMON__),
      prevDayPx: bnPrevDayPx.toFixed(),
      changePct: changePct.times(100).toFixed(__PCT__),
      changePctStatus: formatUPnlStatus(changePct),
      changePctClassName: formatStatusClassName(formatUPnlStatus(changePct)),
    }
  })
}

// 格式化 HyperLiquid 现货
const formatHlSpot = (universe: any[], ctxs: any[]) => {
  return (universe || []).map((item, idx) => {
    const ctx = ctxs[idx] || {}
    const bnMarkPx = new BN(ctx.markPx || 0)
    const bnMidPx = new BN(ctx.midPx || 0)
    const bnDayNtlVolume = new BN(ctx.dayNtlVolume || 0)
    const bnPrevDayPx = new BN(ctx.prevDayPx || 0)

    let changePct: BN = new BN(0)
    if (bnPrevDayPx.gt(0) && bnMarkPx.gt(0)) {
      changePct = bnMarkPx.minus(bnPrevDayPx).div(bnPrevDayPx)
    }

    return {
      idx,
      rank: idx + 1,
      name: item.name,
      index: item.index,
      isCanonical: item.isCanonical,
      markPx: bnMarkPx.toFixed(),
      midPx: bnMidPx.toFixed(),
      dayNtlVolume: bnDayNtlVolume.toFixed(__COMMON__),
      prevDayPx: bnPrevDayPx.toFixed(),
      changePct: changePct.times(100).toFixed(__PCT__),
      changePctStatus: formatUPnlStatus(changePct),
      changePctClassName: formatStatusClassName(formatUPnlStatus(changePct)),
    }
  })
}

// 格式化牛熊雷达（biasRadar）数据
// 支持两种入参：
//   1. vergex API 返回的 items 数组（单参数）：直接映射，使用服务端计算的 bias/4 因子
//   2. HyperLiquid universe + ctxs（双参数）：客户端计算，3 因子（mom/fnd/vol）
const formatRadar = (arg1: any[], arg2?: any[]) => {
  // 模式 1：vergex API 真实数据（服务端计算 4 因子 cgo/vap/lfa/wp）
  if (!arg2) {
    return formatRadarFromVergex(arg1)
  }
  // 模式 2：客户端基于 HyperLiquid 数据计算
  return formatRadarFromHl(arg1, arg2)
}

// vergex API 数据格式化（真实 biasRadar，4 因子）
const formatRadarFromVergex = (raw: any[]) => (raw || []).map((item, idx) => {
  const bnMarkPrice = new BN(item.markPrice ?? 0)
  const bnCompositeZ = new BN(item.compositeZ ?? 0)
  const bnCgoPct = new BN(item.cgoPct ?? 0)
  const bnLfaPct = new BN(item.lfaPct ?? 0)
  const bnCascadeVuln = new BN(item.cascadeVuln ?? 0)

  // conflict 等非 bullish/bearish 值统一归为 neutral
  const rawBias = item.bias || 'neutral'
  const bias = (rawBias === 'bullish' || rawBias === 'bearish') ? rawBias : 'neutral'
  const biasClassName = bias === 'bullish' ? 'color-success'
    : bias === 'bearish' ? 'color-error'
    : 'color-secondary'

  const score = Number(item.directionScore ?? 0)
  const directionScoreDisplay = score > 0 ? `+${score}` : `${score}`
  const directionScoreClassName = score > 0 ? 'color-success'
    : score < 0 ? 'color-error'
    : 'color-secondary'

  const factors = item.factorDirections || {}
  const factorList = ['cgo', 'vap', 'lfa', 'wp'].map(key => ({
    key,
    direction: factors[key] || 'neutral',
    className: factors[key] === 'bullish' ? 'color-success'
      : factors[key] === 'bearish' ? 'color-error'
      : 'color-secondary',
  }))

  return {
    idx,
    rank: item.rank ?? idx + 1,
    symbol: item.symbol,
    marketType: item.market?.marketType ?? '',
    marketId: item.market?.marketId ?? '',
    bias,
    biasClassName,
    directionScore: score,
    directionScoreDisplay,
    directionScoreClassName,
    bullishCount: item.bullishCount ?? 0,
    bearishCount: item.bearishCount ?? 0,
    neutralCount: item.neutralCount ?? 0,
    factorDirections: factors,
    factorList,
    compositeZ: bnCompositeZ.toFixed(2),
    cgoPct: bnCgoPct.toFixed(1),
    lfaPct: bnLfaPct.toFixed(1),
    cascadeVuln: bnCascadeVuln.times(100).toFixed(1),
    markPrice: bnMarkPrice.toFixed(),
    // vergex 返回数据无以下字段，留空以保持结构一致
    changePct: '',
    funding: '',
    openInterest: '',
    dayNtlVolume: '',
    turnoverRatio: '',
  }
})

// HyperLiquid 数据客户端计算（回退方案，3 因子 mom/fnd/vol）
// directionScore 范围 -3 ~ +3
const formatRadarFromHl = (universe: any[], ctxs: any[]) => {
  const items = (universe || []).map((item, idx) => {
    const ctx = ctxs[idx] || {}
    const bnMarkPrice = new BN(ctx.markPrice || 0)
    const bnPrevDayPx = new BN(ctx.prevDayPx || 0)
    const bnFunding = new BN(ctx.funding || 0)
    const bnOpenInterest = new BN(ctx.openInterest || 0)
    const bnDayNtlVolume = new BN(ctx.dayNtlVolume || 0)

    // 24h 价格变化百分比
    let changePct: BN = new BN(0)
    if (bnPrevDayPx.gt(0) && bnMarkPrice.gt(0)) {
      changePct = bnMarkPrice.minus(bnPrevDayPx).div(bnPrevDayPx)
    }

    // 因子 1：价格动量（mom）
    const momDirection = changePct.gt(0.02) ? 'bullish'
      : changePct.lt(-0.02) ? 'bearish'
      : 'neutral'
    const momScore = momDirection === 'bullish' ? 1 : momDirection === 'bearish' ? -1 : 0

    // 因子 2：资金费率（fnd）
    const fndDirection = bnFunding.gt(0.0001) ? 'bullish'
      : bnFunding.lt(-0.0001) ? 'bearish'
      : 'neutral'
    const fndScore = fndDirection === 'bullish' ? 1 : fndDirection === 'bearish' ? -1 : 0

    // 因子 3：量价确认（vol）
    const turnoverRatio = bnOpenInterest.gt(0) ? bnDayNtlVolume.div(bnOpenInterest) : new BN(0)
    const volDirection = turnoverRatio.gt(1) && momDirection !== 'neutral' ? momDirection
      : 'neutral'
    const volScore = volDirection === 'bullish' ? 1 : volDirection === 'bearish' ? -1 : 0

    const score = momScore + fndScore + volScore
    const bias = score > 0 ? 'bullish' : score < 0 ? 'bearish' : 'neutral'
    const biasClassName = bias === 'bullish' ? 'color-success'
      : bias === 'bearish' ? 'color-error'
      : 'color-secondary'

    const directionScoreDisplay = score > 0 ? `+${score}` : `${score}`
    const directionScoreClassName = score > 0 ? 'color-success'
      : score < 0 ? 'color-error'
      : 'color-secondary'

    const factorList = [
      { key: 'mom', direction: momDirection, className: momDirection === 'bullish' ? 'color-success' : momDirection === 'bearish' ? 'color-error' : 'color-secondary' },
      { key: 'fnd', direction: fndDirection, className: fndDirection === 'bullish' ? 'color-success' : fndDirection === 'bearish' ? 'color-error' : 'color-secondary' },
      { key: 'vol', direction: volDirection, className: volDirection === 'bullish' ? 'color-success' : volDirection === 'bearish' ? 'color-error' : 'color-secondary' },
    ]

    return {
      idx,
      rank: idx + 1,
      symbol: item.name,
      bias,
      biasClassName,
      directionScore: score,
      directionScoreDisplay,
      directionScoreClassName,
      bullishCount: factorList.filter(f => f.direction === 'bullish').length,
      bearishCount: factorList.filter(f => f.direction === 'bearish').length,
      neutralCount: factorList.filter(f => f.direction === 'neutral').length,
      factorList,
      changePct: changePct.times(100).toFixed(__PCT__),
      funding: bnFunding.times(100).toFixed(__FUNDING_PCT__),
      openInterest: bnOpenInterest.toFixed(__COMMON__),
      dayNtlVolume: bnDayNtlVolume.toFixed(__COMMON__),
      markPrice: bnMarkPrice.toFixed(),
      turnoverRatio: turnoverRatio.toFixed(2),
      // 客户端计算无 vergex 专属字段
      compositeZ: '',
      cgoPct: '',
      lfaPct: '',
      cascadeVuln: '',
      marketType: '',
      marketId: '',
    }
  })

  return items.sort((a, b) => b.directionScore - a.directionScore)
}
