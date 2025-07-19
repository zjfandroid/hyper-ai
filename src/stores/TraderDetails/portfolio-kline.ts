import BN from 'bignumber.js'

import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

interface TDataPoint {
  time: string | number
  value: number
}

interface TCycleItem {
  value: string
  i18n?: string
  label: string
}

interface TCycles {
  day: Array<TDataPoint>
  week: Array<TDataPoint>
  month: Array<TDataPoint>
  all: Array<TDataPoint>
}

export type TTraderDetailsPortfolioKlineStore = {
  cycles: Array<TCycleItem>
  selectedCycleValue: string
  selectedCycleItem: TCycleItem
  tradeTypes: Array<TCycleItem>
  selectedTradeTypeValue: string
  selectedTradeTypeItem: TCycleItem
  dataFields: Array<TCycleItem>
  selectedDataFieldValue: string
  selectedDataFieldItem: TCycleItem

  selectedKlineData: Array<TDataPoint>
  selectedKlineDataLastValue: string

  combined: { accountValue: TCycles, pnl: TCycles }
  perp: { accountValue: TCycles, pnl: TCycles }

  reset: () => void
}


const CYCLE_KEYS = {
  day: { value: 'day', i18n: 'common.oneD', label: '1D' },
  week: { value: 'week', i18n: 'common.sevenD', label: '7D' },
  month: { value: 'month', i18n: 'common.thirtyD', label: '30D' },
  allTime:  { value: 'all', i18n: 'common.all', label: 'All' },
}

const TRADE_TYPE_KEYS = {
  combined: { value: 'combined', i18n: 'common.perpAndSpot', label: 'Account Total Value' },
  perpOnly: { value: 'perp', i18n: 'common.perpOnly', label: 'Perp Only' },
}

const DATA_FIELD_KEYS = {
  accountValue: { value: 'accountValue', i18n: 'common.accountValue', label: 'Account Value' },
  pnl: { value: 'pnl', i18n: 'common.pnl', label: 'PnL' },
}

const DEFAULT = {
  combined: {
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
  },
  perp: {
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
  },

  selectedCycleValue: CYCLE_KEYS.week.value,
  selectedTradeTypeValue: TRADE_TYPE_KEYS.perpOnly.value,
  selectedDataFieldValue: DATA_FIELD_KEYS.pnl.value,

}

const traderDetailsPortfolioKlineStore: TTraderDetailsPortfolioKlineStore = {
  cycles: [
    CYCLE_KEYS.day,
    CYCLE_KEYS.week,
    CYCLE_KEYS.month,
    CYCLE_KEYS.allTime
  ],
  get selectedCycleItem () {
    return this.cycles.find(item => item.value === this.selectedCycleValue)
  },

  tradeTypes: [
    TRADE_TYPE_KEYS.combined,
    TRADE_TYPE_KEYS.perpOnly,
  ],
  get selectedTradeTypeItem () {
    return this.tradeTypes.find(item => item.value === this.selectedTradeTypeValue)
  },

  dataFields: [
    DATA_FIELD_KEYS.accountValue,
    DATA_FIELD_KEYS.pnl,
  ],
  get selectedDataFieldItem () {
    return this.dataFields.find(item => item.value === this.selectedDataFieldValue)
  },

  get selectedKlineData () {
    const { selectedTradeTypeValue, selectedDataFieldValue, selectedCycleValue } = this

    return this[selectedTradeTypeValue][selectedDataFieldValue][selectedCycleValue]
  },
  get selectedKlineDataLastValue () {
    const { selectedKlineData } = this

    let result = '0'

    if (selectedKlineData && selectedKlineData.length) {
      result = new BN(selectedKlineData[selectedKlineData.length - 1].value).toFixed(constants.decimalPlaces.__COMMON__)
    }

    return result
  },

  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useTraderDetailsPortfolioKlineStore = createStore<TTraderDetailsPortfolioKlineStore>(traderDetailsPortfolioKlineStore)

