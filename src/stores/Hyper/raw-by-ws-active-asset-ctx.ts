import BN from 'bignumber.js'

import { constants, TAccountStore, TLeaderboardStore, THyperStore, TPriceItem } from '@/stores'

export const hyperRawByWsActiveAssetCtx = (ctx) => {
  const { decimalPlaces } = constants

  const impactPxs = ctx.impactPxs || ['0', '0']
  const prevDayPrice = ctx.prevDayPx
  const midPrice = ctx.midPx
  const bnPriceChange24h = new BN(midPrice).minus(prevDayPrice)
  const bnFunding = new BN(ctx.funding)
  const bnDayBaseVlm = new BN(ctx.dayBaseVlm)
  const bnOpenInterest = new BN(ctx.openInterest)
  const bnDayTradingActivity = bnDayBaseVlm.div(bnOpenInterest)

  return {
    funding: bnFunding.toString(), // 资金费率
    fundingPct: bnFunding.times(100).toFixed(decimalPlaces.__FUNDING_PCT__),
    openInterest: bnOpenInterest.toString(), // 当前未平仓合约的总数量，表示市场中尚未了结的交易量
    prevDayPrice, // 前一天的收盘价格
    priceChange24h: bnPriceChange24h.toString(), // 24小时价格差
    priceChange24hPct: bnPriceChange24h.div(prevDayPrice).times(100).toFixed(decimalPlaces.__PCT__),
    dayNtlVolume: new BN(ctx.dayNtlVlm).toString(), // 当天的总体交易量
    dayBaseVlm: bnDayBaseVlm.toString(), // 当天的基础交易量(币)
    dayTradingActivity: bnDayTradingActivity.toString(), // 当天交易量活跃度值
    dayTradingActivityPct: bnDayTradingActivity.times(100).toFixed(decimalPlaces.__PCT__), // 当天交易量活跃度值
    premium: ctx.premium, // 合约的溢价
    oraclePrice: ctx.oraclePx, // 基于预言机数据计算出的参考价格
    markPrice: ctx.markPx, // 标记价格
    midPrice, // 中位价格
    bidPrice: impactPxs[0], // 买一价
    askPrice: impactPxs[1], // 卖一价
  }
}