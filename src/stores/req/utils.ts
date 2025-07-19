import BN from 'bignumber.js'

import { getDecimalLength } from '@/utils'
import { constants } from '@/stores'

export const formatUPnlStatus = (bn) => {
  return bn.gt(0) && 1 || bn.lt(0) && -1 || 0
}

export const formatStatusClassName = (status) => {
  return status > 0 && 'color-success' || status < 0 && 'color-error' || ''
}

export const formatPositionByItem = (item: any, idx: number): Record<string, any> => {
  const bnUPnl = new BN(item.unrealizedPnl)
  const uPnlStatus = formatUPnlStatus(bnUPnl)
  const openPrice = item.entryPx
  const liquidationPrice = item.liquidationPx
  const priceDecimal = getDecimalLength(openPrice)

  return {
    idx,
    walletId: item.walletId, // 固定1
    coin: item.coin, // 
    leverage: item.leverage, // 
    direction: item.direction, // long，short
    type: item.type, // cross，isolated
    size: item.szi, // 仓位大小
    positionValue: new BN(item.positionValue).toFixed(constants.decimalPlaces.__COMMON__), // 
    openPrice, // 购买价
    markPrice: item.markPx, // 标记价格
    uPnl: bnUPnl.toFixed(constants.decimalPlaces.__uPnl__), //
    // NOTE: 过滤掉尾部百分比
    uPnlRatio: item.unrealizedPnlRatio.replace('%', ''), //
    uPnlStatus,
    uPnlStatusClassName: formatStatusClassName(uPnlStatus),
    liquidationPrice: liquidationPrice ? new BN(liquidationPrice).toFixed(priceDecimal) : '', // 强平价，可能为null
    marginUsed: new BN(item.marginUsed).toFixed(constants.decimalPlaces.__COMMON__), // 
  }
}

export const formatCopyTradingByItem = (item: any, idx: number): Record<string, any> => {
  const bnPnl = new BN(item.pnl)
  const pnlStatus = formatUPnlStatus(bnPnl)

  return {
    idx,
    balance: new BN(item.balance).toFixed(constants.decimalPlaces.__COMMON__), // 余额
    pnl: bnPnl.toFixed(constants.decimalPlaces.__uPnl__), // 未实现盈亏
    pnlStatus,
    pnlStatusClassname: formatStatusClassName(pnlStatus),
    // NOTE: 因为有进度条，所以去掉接受后的%
    marginUsedRatio: new BN(item.marginUsedRatio.replace('%', '')).toFixed(2), // 保证金利用率，直接显示即可

    // NOTE: 旧的写法，没问题可删除
    // leverage: item.copyTrading.leverage,
    // buyModel: item.copyTrading.buyModel,
    // buyModelValue: item.copyTrading.buyModelValue,
    // sellModel: item.copyTrading.sellModel,
    // sellModelValue: item.copyTrading.sellModelValue,
    ...formatOpenPositionByItem({
      wallet: item.wallet,
      remark: item.remark,
      ...item.copyTrading,
    })
  }
}

export const formatOpenPositionByItem = (item: any): Record<string, any> => {
  return {
    address: item.wallet,
    note: item.remark,
    leverage: item.leverage,
    buyModel: item.buyModel,
    buyModelValue: item.buyModelValue,
    sellModel: item.sellModel,
    sellModelValue: item.sellModelValue,
  }
}

export function timeToLocal(originalTime) {
    const d = new Date(originalTime);
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
}