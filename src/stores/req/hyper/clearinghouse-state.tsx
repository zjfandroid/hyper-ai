import BN from 'bignumber.js'

import { merge, defaults, getDecimalLength } from '@/utils'
import { baseCheck, hyperApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardStore } from '@/stores'

import { formatUPnlStatus, formatStatusClassName } from '../utils'

type THyperClearinghouseStateResult = {
  data: Record<string, any>,
  error: boolean
}

export type THyperClearinghouseState = {
  /**
   * 获取账号的合约摘要
   */
  hyperClearinghouseState: (address: string) => Promise<THyperClearinghouseStateResult>
  hyperClearinghouseStateBusy: boolean
  hyperClearinghouseStateInit: boolean
}


export const hyperClearinghouseState: THyperClearinghouseState = {
  async hyperClearinghouseState(address) {
    const result: THyperClearinghouseStateResult = { data: {}, error: true }

    if (this.hyperClearinghouseStateBusy) return result

    this.hyperClearinghouseStateBusy = true

    const res = await hyperApi.post('/info', {
      'type': 'clearinghouseState',
      'user': address
    })

    result.error = false
    this.hyperClearinghouseStateBusy = false
    this.hyperClearinghouseStateInit = false

    if (result.error) return result

    const { decimalPlaces } = constants
    // update
    const data = res.data
    let bnTotalUPnl = new BN(0)
    const positions = []
    let bnTotalLongPositionValue = new BN(0)
    let bnTotalShortPositionValue = new BN(0)

    // 遍历
    data.assetPositions.forEach((item, idx) => {
      const position = item.position
      const bnSize = new BN(position.szi)
      const bnPositionValue = new BN(position.positionValue)
      const bnUPnl = new BN(position.unrealizedPnl)
      const uPnlStatus = formatUPnlStatus(bnUPnl)
      const bnMarginUsed = new BN(position.marginUsed)
      const liquidationPrice = position.liquidationPx
      const openPrice = position.entryPx
      const priceDecimal = getDecimalLength(openPrice)
      const isLong = bnSize.gte(0)

      if (isLong) {
        bnTotalLongPositionValue = bnTotalLongPositionValue.plus(bnPositionValue)
      } else {
        bnTotalShortPositionValue = bnTotalShortPositionValue.plus(bnPositionValue)
      }

      bnTotalUPnl = bnTotalUPnl.plus(bnUPnl)

      positions.push({
        coin: position.coin,
        leverage: position.leverage.value,
        direction: isLong ? 'long' : 'short' ,
        type: position.leverage.type,
        size: bnSize.toFixed(decimalPlaces.__COMMON__),
        positionValue: bnPositionValue.toFixed(decimalPlaces.__COMMON__),
        openPrice,
        // markPrice: 
        uPnl: bnUPnl.toFixed(decimalPlaces.__uPnl__),
        uPnlRatio: bnUPnl.div(bnMarginUsed).times(100).toFixed(2),
        uPnlStatus,
        uPnlStatusClassName: formatStatusClassName(uPnlStatus),
        liquidationPrice: liquidationPrice ? new BN(liquidationPrice).toFixed(priceDecimal) : '',
        marginUsed: bnMarginUsed.toFixed(decimalPlaces.__COMMON__),
        // NOTE: hyperClearinghouseState 的 funding 值与hyperdash显示的相反，测试后 hyperdash 是对的
        funding: new BN(position.cumFunding.sinceOpen).times(-1).toFixed(decimalPlaces.__COMMON__)
      })
    })

    const bnTotalPositionValue = new BN(data.marginSummary.totalNtlPos)
    const bnPerpEquity = new BN(data.marginSummary.accountValue)
    const zeroPerpEquity = bnPerpEquity.isEqualTo(0)
    const bnTotalMarginUsed = new BN(data.marginSummary.totalMarginUsed)
    const hasPosition = bnTotalPositionValue.gt(0)
    const bnTotalMarginUsageRatio = zeroPerpEquity ? new BN(0) : bnTotalMarginUsed.div(bnPerpEquity)
    const bnTotalLongPositionValueRatio = new BN(hasPosition ? bnTotalLongPositionValue.div(bnTotalPositionValue) : '0')
    const bnTotalShortPositionValueRatio = new BN(hasPosition ? bnTotalShortPositionValue.div(bnTotalPositionValue) : '0')
    const bnTotalROERatio = new BN(hasPosition ? bnTotalUPnl.div(bnTotalMarginUsed) : '0')
    const bnWithdrawable = new BN(data.withdrawable)

    result.data = {
      summary: {
        hasPosition,
        totalPositionValue: bnTotalPositionValue.toFixed(decimalPlaces.__COMMON__),
        totalLongPositionValue: bnTotalLongPositionValue.toFixed(decimalPlaces.__COMMON__),
        totalLongPositionValueRatio: bnTotalLongPositionValueRatio.toFixed(decimalPlaces.__RATIO__),
        totalLongPositionValuePct: bnTotalLongPositionValueRatio.times(100).toFixed(decimalPlaces.__PCT__),
        totalShortPositionValue: bnTotalShortPositionValue.toFixed(decimalPlaces.__COMMON__),
        totalShortPositionValueRatio: bnTotalShortPositionValueRatio.toFixed(decimalPlaces.__RATIO__),
        totalShortPositionValuePct: bnTotalShortPositionValueRatio.times(100).toFixed(decimalPlaces.__PCT__),
        directionBias: bnTotalLongPositionValue.gt(bnTotalShortPositionValue) && 'long'
          || bnTotalShortPositionValue.gt(bnTotalLongPositionValue) && 'short'
          || 'neutral',
        // 也等于可用保证金
        withdrawable: bnWithdrawable.toFixed(decimalPlaces.__COMMON__),
        // Withdrawable比例：marginSummary.withdrawable/marginSummary.accountValue
        withdrawableRatio: zeroPerpEquity ? 0 : bnWithdrawable.div(bnPerpEquity).toFixed(decimalPlaces.__RATIO__),
        withdrawablePct: zeroPerpEquity ? 0 : bnWithdrawable.div(bnPerpEquity).times(100).toFixed(decimalPlaces.__PCT__),
        // 合约权益
        perpEquity: bnPerpEquity.toFixed(decimalPlaces.__COMMON__),
        // Margin Usage:  marginSummary.totalMarginUsed/marginSummary.accountValue
        totalMarginUsageRatio: bnTotalMarginUsageRatio.toFixed(decimalPlaces.__RATIO__),
        totalMarginUsagePct: bnTotalMarginUsageRatio.times(100).toFixed(decimalPlaces.__PCT__),
        totalMarginUsed: bnTotalMarginUsed.toFixed(decimalPlaces.__COMMON__),
        // Leverage: marginSummary.totalNtlPos/marginSummary.accountValue
        leverageRatio: zeroPerpEquity ? 0 : bnTotalPositionValue.div(bnPerpEquity).toFixed(2),
        // Unrealized PnL：position的unrealizedPnl累加
        totalUPnl: bnTotalUPnl.toFixed(decimalPlaces.__uPnl__),
        // ROE 百分比：Unrealized PnL/marginSummary.totalMarginUsed
        totalROERatio: bnTotalROERatio.toFixed(decimalPlaces.__RATIO__),
        totalROEPct: bnTotalROERatio.times(100).toFixed(decimalPlaces.__PCT__)
      },
      positions
    }

    return result
  },
  hyperClearinghouseStateBusy: false,
  hyperClearinghouseStateInit: true,
}