import BN from 'bignumber.js'

import { constants, TAccountStore, TLeaderboardStore, THyperStore, TPriceItem } from '@/stores'

export const hyperRawBySpotMetaAssetCtx = (ctx) => {
  const { decimalPlaces } = constants

  const prevDayPrice = ctx.prevDayPx
  const midPrice = ctx.midPx
  const bnPriceChange24h = new BN(midPrice).minus(prevDayPrice)
  const bnDayBaseVlm = new BN(ctx.dayBaseVlm)

  return {
    prevDayPrice, // 前一天的收盘价格
    priceChange24h: bnPriceChange24h.toString(), // 24小时价格差
    priceChange24hPct: bnPriceChange24h.div(prevDayPrice).times(100).toFixed(decimalPlaces.__PCT__),
    dayNtlVolume: new BN(ctx.dayNtlVlm).toString(), // 当天的总体交易量
    dayBaseVlm: bnDayBaseVlm.toString(), // 当天的基础交易量(币)
    markPrice: ctx.markPx || '0', // 标记价格
    midPrice, // 中位价格
    totalSupply: ctx.totalSupply, // 总供应量
    circulatingSupply: ctx.circulatingSupply // 流通供应量
  }
}