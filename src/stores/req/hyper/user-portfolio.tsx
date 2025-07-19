import BN from 'bignumber.js'

import { merge, defaults, getDecimalLength } from '@/utils'
import { baseCheck, hyperApi } from '@/stores/req/helper'
import { constants, TAccountStore, TLeaderboardStore } from '@/stores'

import { formatUPnlStatus, formatStatusClassName, timeToLocal } from '../utils'
import dayjs from 'dayjs'

type THyperUserPortfolioResult = {
  data: Record<string, any>,
  error: boolean
}

export type THyperUserPortfolio = {
  /**
   * 账户的投资组合kline
   */
  hyperUserPortfolio: (address: string) => Promise<THyperUserPortfolioResult>
  hyperUserPortfolioBusy: boolean
}


export const hyperUserPortfolio: THyperUserPortfolio = {
  async hyperUserPortfolio(address) {
    const result: THyperUserPortfolioResult = { data: {}, error: true }

    if (this.hyperUserPortfolioBusy) return result

    this.hyperUserPortfolioBusy = true

    const res = await hyperApi.post('/info', {
      'type': 'portfolio',
      'user': address
    })

    result.error = false
    this.hyperUserPortfolioBusy = false

    if (result.error) return result

    // update
    const data = res.data
    const combined = {
      accountValue: {
        day: [],
        week: [],
        month: [],
        all: [],
      },
      pnl: {
        day: [],
        week: [],
        month: [],
        all: [],
      }
    }
    const perp = {
      accountValue: {
        day: [],
        week: [],
        month: [],
        all: [],
      },
      pnl: {
        day: [],
        week: [],
        month: [],
        all: [],
      }
    }

    data.forEach((item: any) => {
      const accountValue = item[1].accountValueHistory.map((_item) => ({ time: ~~(timeToLocal(_item[0]) / 1000), value: +_item[1]}))
      const pnl = item[1].pnlHistory.map((_item) => ({ time: ~~(timeToLocal(_item[0]) / 1000), value: +_item[1]}))

      switch(item[0]) {
        case 'day':
          combined.accountValue.day = accountValue
          combined.pnl.day = pnl
          break
        case 'week':
          combined.accountValue.week = accountValue
          combined.pnl.week = pnl
          break
        case 'month':
          combined.accountValue.month = accountValue
          combined.pnl.month = pnl
          break
        case 'allTime':
          combined.accountValue.all = accountValue
          combined.pnl.all = pnl
          break
        case 'perpDay':
          perp.accountValue.day = accountValue
          perp.pnl.day = pnl
          break
        case 'perpWeek':
          perp.accountValue.week = accountValue
          perp.pnl.week = pnl
          break
        case 'perpMonth':
          perp.accountValue.month = accountValue
          perp.pnl.month = pnl
          break
        case 'perpAllTime':
          perp.accountValue.all = accountValue
          perp.pnl.all = pnl
          break
        default:
          break
      }

    })

    result.data = {
      combined,
      perp
      // assets: (data?.balances || []).map((item: any, idx: number) => {
      //   return {
      //     tokenIdx: item.token,
      //     coin: item.coin,
      //     amount: item.total,
      //     // "hold": "0.0",
      //     // "entryNtl": "0.0"
      //   }
      // })
    }

    return result
  },
  hyperUserPortfolioBusy: false,
}