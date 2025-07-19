import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

type TSelectItem = {
  label: string,
  i18n?: string,
  value: string
}

export type TWhalePositionsStore = {
  FILTER_KEYS: Record<string, { label: string, value: string }> ,

  selectCoin: Array<TSelectItem>
  selectedCoin: string,

  selectDirection: Array<TSelectItem>
  selectedDirection: string // long/short

  selectUPnl: Array<TSelectItem>
  selectedUPnl: string,
  // 资金费
  selectFundingFee: Array<TSelectItem>
  selectedFundingFee: string,
  // create-time/margin-balance/profit(unrealizedPnL)/loss ，默认 create-time

  pageSize: number,
  sortColumnId: string
  list: Array<{
    idx: number
    id: string
    address: string
    liquidationPrice: string
    leverage: number
    direction: string
    coin: string
    size: string
    openPrice: string
    markPrice: string
    marginUsed: string
    positionValue: string
    uPnl: string
    uPnlStatus: number
    uPnlStatusClassName: string
    uPnlRatio: string
    fundingFee: string
    fundingFeeStatus: number
    fundingFeeStatusClassName: string
    type: string
    createTs: number
    updateTs: number
  }>
  reset: () => void
}

const DEFAULT_SELECTED = 'all'
const FILTER_KEYS = {
  all: { i18n: 'common.all', label: 'All', value: 'all' },

  long: { i18n: 'common.long', label: 'Long', value: 'long' },
  short: { i18n: 'common.short', label: 'Short', value:'short' },

  profit: { i18n: 'common.profit', label: 'Profit', value:'profit' },
  loss: { i18n: 'common.loss', label: 'Loss', value:'loss' },
}

const DEFAULT = {
  selectCoin: [
    { i18n: 'common.allSymbol', label: 'All Symbol', value: 'all' },
    { "label": "BTC", "value": "BTC" },
    { "label": "ETH", "value": "ETH" },
    { "label": "SOL", "value": "SOL" },
    // { "label": "FARTCOIN", "value": "FARTCOIN" },
    { "label": "XRP", "value": "XRP" },
    // { "label": "kPEPE", "value": "kPEPE" },
    { "label": "SUI", "value": "SUI" },
    { "label": "DOGE", "value": "DOGE" },
    { "label": "TRUMP", "value": "TRUMP" },
    { "label": "ENA", "value": "ENA" },
    // { "label": "POPCAT", "value": "POPCAT" },
    // { "label": "LTC", "value": "LTC" },
    // { "label": "kBONK", "value": "kBONK" },
    // { "label": "WIF", "value": "WIF" },
    // { "label": "PAXG", "value": "PAXG" },
    { "label": "CRV", "value": "CRV" },
    { "label": "AAVE", "value": "AAVE" },
    // { "label": "LAUNCHCOIN", "value": "LAUNCHCOIN" },
    { "label": "LINK", "value": "LINK" },
    // { "label": "INIT", "value": "INIT" },
    // { "label": "WLD", "value": "WLD" },
    // { "label": "VIRTUAL", "value": "VIRTUAL" },
    { "label": "ADA", "value": "ADA" },
    { "label": "TON", "value": "TON" },
    { "label": "AVAX", "value": "AVAX" },
    { "label": "ONDO", "value": "ONDO" },
    // { "label": "LDO", "value": "LDO" },
    // { "label": "BERA", "value": "BERA" },
    // { "label": "ENS", "value": "ENS" },
    // { "label": "MOODENG", "value": "MOODENG" },
    // { "label": "BNB", "value": "BNB" },
    // { "label": "MKR", "value": "MKR" },
    // { "label": "PENGU", "value": "PENGU" },
    // { "label": "TAO", "value": "TAO" },
    // { "label": "ETHFI", "value": "ETHFI" },
    // { "label": "GRASS", "value": "GRASS" },
    // { "label": "UNI", "value": "UNI" },
    // { "label": "KAITO", "value": "KAITO" },
    // { "label": "S", "value": "S" },
    // { "label": "NIL", "value": "NIL" },
    // { "label": "PNUT", "value": "PNUT" },
    // { "label": "TRX", "value": "TRX" },
    // { "label": "RUNE", "value": "RUNE" },
    // { "label": "AI16Z", "value": "AI16Z" },
    // { "label": "HBAR", "value": "HBAR" },
    // { "label": "VVV", "value": "VVV" },
    // { "label": "ARB", "value": "ARB" },
    // { "label": "JUP", "value": "JUP" },
    // { "label": "NEAR", "value": "NEAR" },
    // { "label": "TIA", "value": "TIA" }
  ],
  selectedCoin: DEFAULT_SELECTED,

  selectDirection: [
    { i18n: 'common.allDirection', label: 'All Direction', value: 'all' },
    FILTER_KEYS.long,
    FILTER_KEYS.short,
  ],
  selectedDirection: DEFAULT_SELECTED,

  selectUPnl: [
    { i18n: 'common.allUpnl', label: 'All uPnL', value: 'all' },
    FILTER_KEYS.profit,
    FILTER_KEYS.loss,
  ],
  selectedUPnl: DEFAULT_SELECTED,

  selectFundingFee: [
    { i18n: 'common.allFundingFee', label: 'All Funding Fee', value: 'all' },
    FILTER_KEYS.profit,
    FILTER_KEYS.loss,
  ],
  selectedFundingFee: DEFAULT_SELECTED,

  pageSize: 20,
  sortColumnId: 'createTs',
  list: []
}

const whalePositionsStore: TWhalePositionsStore = {
  FILTER_KEYS,

  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useWhalePositionsStore = createStore<TWhalePositionsStore>(whalePositionsStore)

