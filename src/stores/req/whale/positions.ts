import BN from 'bignumber.js'

import { merge, getDecimalLength } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TWhalePositionsStore } from '@/stores'

import { formatPositionByItem, formatUPnlStatus, formatStatusClassName } from '../utils'

type WhalePositionsResult = {
  data: Record<string, any>,
  error: boolean
}

export type TWhalePositions = {
  whalePositions: (accountStore: TAccountStore, whalePositionsStore: TWhalePositionsStore) => Promise<WhalePositionsResult>
  whalePositionsBusy: boolean
}

export const whalePositions: TWhalePositions = {
  async whalePositions(accountStore, whalePositionsStore) {
    const result: WhalePositionsResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.whalePositionsBusy) return result

    this.whalePositionsBusy = true

    const sortItems: Record<string, string> = {
      createTs: 'create-time',
      uPnl: 'profit',
      margin: 'margin-balance'
    }

    const res = await baseApi.get('/whales/open-positions', {
      params: {
        take: whalePositionsStore.pageSize,
        coin: whalePositionsStore.selectedCoin,
        dir: whalePositionsStore.selectedDirection,
        'npnl-side': whalePositionsStore.selectedUPnl,
        'fr-side': whalePositionsStore.selectedFundingFee,
        'top-by': sortItems[whalePositionsStore.sortColumnId],
      }
    })

    result.error = baseCheck(res, accountStore)
    this.whalePositionsBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      list: (data || []).map((item: any, idx: number) => {
        const bnUPnl = new BN(item.unrealizedPnL)
        const bnSize = new BN(item.positionSize)
        const uPnlStatus = formatUPnlStatus(bnUPnl)
        const bnFundingFee = new BN(item.fundingFee)
        const fundingFeeStatus = formatUPnlStatus(bnFundingFee)
        const openPrice = item.entryPrice
        const liquidationPrice = item.liqPrice
        const priceDecimal = getDecimalLength(openPrice)

        return {
          idx,
          id: String(item.id),
          address: item.user,
          liquidationPrice: liquidationPrice ? new BN(liquidationPrice).toFixed(priceDecimal) : '',
          leverage: item.leverage,
          direction: bnSize.gt(0) ? 'long' : 'short',
          coin: item.symbol,
          size: bnSize.toFixed(constants.decimalPlaces.__COMMON__), // 仓位大小
          openPrice: new BN(openPrice).toString(), // 开仓价格
          markPrice: new BN(item.markPrice).toString(), // 标记价格
          marginUsed: new BN(item.marginBalance).toFixed(constants.decimalPlaces.__COMMON__), // 保证金
          positionValue: new BN(item.positionValueUsd).toString(),
          uPnl: bnUPnl.toFixed(constants.decimalPlaces.__uPnl__),
          uPnlStatus,
          uPnlStatusClassName: formatStatusClassName(uPnlStatus),
          uPnlRatio: bnUPnl.dividedBy(item.marginBalance).times(100).toFixed(2), 
          fundingFee: bnFundingFee.toFixed(constants.decimalPlaces.__COMMON__), // 资金费
          fundingFeeStatus,
          fundingFeeStatusClassName: formatStatusClassName(fundingFeeStatus),
          type: item.marginMode, // cross/isolated
          createTs: item.createTime,
          updateTs: item.updateTime
        }
      })
    }

    // update
    merge(whalePositionsStore, result.data)

    return result
  },
  whalePositionsBusy: false,
}