import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

export interface TDiscoverTradingStatisticsItem {

}

export type TDiscoverTradingStatisticsStore = {
  CYCLE_KEYS: Record<string, { value: string, label: string }>

  openModal: boolean

  cycles: Array<{
    value: string
    i18n?: string
    label: string
  }>
  selectedCycleValue: string
  readonly selectedCycleItem: {
    value: string
    i18n?: string
    label: string
  }

  address: string
  pnl: string;
  pnlStatus: number;
  pnlStatusClassname: string;
  longPnl: string;
  shortPnl: string;

  profitableTrades: number;
  executedTrades: number;
  losingTrades: number;
  gross: string;

  winRate: string;
  longWinRate: string;
  shortWinRate: string;
  lossRate: string;

  fees: string;
  tradeDuration: number;
  minDuration: number;
  maxDuration: number;

  bestTrades: Array<any>,
  performanceAssets: Array<any>,

  reset: () => void
}

const CYCLE_KEYS = {
  week: { value: '7', i18n: 'common.sevenD', label: '7D' },
  month: { value: '30', i18n: 'common.thirtyD', label: '30D' },
  allTime:  { value: '0', i18n: 'common.all', label: 'All' },
}

const DEFAULT = {
  address: '',
  pnl: '0',
  pnlStatus: 0,
  pnlStatusClassname: '',
  longPnl: '0',
  shortPnl: '0',

  profitableTrades: 0,
  executedTrades: 0,
  losingTrades: 0,
  gross: '0',

  winRate: '0',
  longWinRate: '0',
  shortWinRate: '0',
  lossRate: '0',

  fees: '0',
  tradeDuration: 0,
  minDuration: 0,
  maxDuration: 0,

  bestTrades: [],
  performanceAssets: []
}

const discoverTradingStatisticsStore: TDiscoverTradingStatisticsStore = {
  openModal: false,

  CYCLE_KEYS,

  cycles: [
    CYCLE_KEYS.week,
    CYCLE_KEYS.month,
    CYCLE_KEYS.allTime
  ],
  selectedCycleValue: CYCLE_KEYS.week.value,

  ...DEFAULT,

  get selectedCycleItem () {
    return this.cycles.find(item => item.value === this.selectedCycleValue);
  },

  reset() {
    merge(this, DEFAULT)
  }
}

export const useDiscoverTradingStatisticsStore = createStore<TDiscoverTradingStatisticsStore>(discoverTradingStatisticsStore)

