import BN from 'bignumber.js'

import { merge } from '@/utils'
import { vergexApi } from '@/stores/req/helper'
import { constants, TTrendingStore } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type TrendingCryptoResult = {
  data: Record<string, any>,
  error: boolean
}

export type TTrendingCrypto = {
  trendingCrypto: (trendingStore: TTrendingStore) => Promise<TrendingCryptoResult>
  trendingCryptoBusy: boolean
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
}
