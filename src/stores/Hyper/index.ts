import { createStore } from '@/stores/helpers'

import { merge, localStorage } from '@/utils'
import { constants } from '@/stores'

export * from './raw-by-ws-active-asset-ctx'
export * from './raw-by-spot-meta-asset-ctx'

// 针对原生 side 的转换
export const formatSideByRaw = (side: string) => {
  return side === 'B' && 'buy' || side === 'A' && 'sell' || side
}

export interface TPriceItem {
  index?: number
  name?: string
  sizeDecimals?: number
  weiDecimals?: number
  perpMid?: string
  markPrice?: string
}

export interface ISpotMarketItem {
  prevDayPrice: string
  priceChange24h: string
  priceChange24hPct: string
  dayNtlVolume: string
  dayBaseVlm: string
  markPrice: string
  midPrice: string
  totalSupply: string
  circulatingSupply: string
}

export interface ISpotMetaItem {
  sizeDecimals: number
  weiDecimals: number
}
export interface IPerpMetaItem {
  sizeDecimals: number
  maxLeverage: number
  isDelisted?: boolean
}

export interface IPerpMarketItem {
  funding: string
  fundingPct: string
  openInterest: string
  prevDayPrice: string
  priceChange24h: string
  priceChange24hPct: string
  dayNtlVolume: string
  dayBaseVlm: string
  dayTradingActivity: string
  dayTradingActivityPct: string
  premium: string
  oraclePrice: string
  markPrice: string
  midPrice: string | null
  bidPrice: string
  askPrice: string
}

export type THyperStore = {
  socket: any

  // 合约
  DEFAULT_PERP_META: IPerpMetaItem // 缺省的，用于接口没更新前的配置
  perpMeta: Record<string, IPerpMetaItem>
  perpMarket: Record<string, IPerpMarketItem>

  // 现货
  DEFAULT_SPOT_META: ISpotMetaItem
  spotMeta: Record<string, ISpotMetaItem>
  spotMarket: Record<string, ISpotMarketItem>

  loopPerpMetaAndMarket: boolean // 是否在循环perpMeta和perpMarket

  reset: () => void
}

const DEFAULT = {
  DEFAULT_PERP_META: {
    sizeDecimals: 1,
    maxLeverage: 40,
    isDelisted: false
  },
  perpMeta: {},
  perpMarket: {},

  DEFAULT_SPOT_META: {
    sizeDecimals: 1,
    weiDecimals: 8
  },
  spotMeta: {},
  spotMarket: {},

  socket: null,

  loopPerpMetaAndMarket: false
}

const hyperStore: THyperStore = {
  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useHyperStore = createStore<THyperStore>(hyperStore)
