import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

export type TPositionItem = {
  idx: number
  walletId: string
  coin: string
  leverage: number
  direction: string
  type: string
  size: string
  positionValue: string
  openPrice: string
  markPrice: string
  uPnl: string
  uPnlRatio: string
  uPnlStatus: number
  liquidationPrice: string
  marginUsed: string
}

export type TCopyTradingTargetItem = {
  idx: number
  address: string
  note: string
  balance: string
  uPnl: string
  marginUsedRatio: string

  leverage: number,
  buyModel: number,
  buyModelValue: string,
  sellModel: number,
  sellModelValue: string,
}

export type TCopyTradingStore = {

  copyTradingList: Array<TCopyTradingTargetItem>
  operaCopyTradingTargetItemIdx: number // 当前操作的跟单索引
  readonly operaCopyTradingTargetItem: TCopyTradingTargetItem | null

  // 跟单创建时的目标仓位
  openCopyTradingTarget: boolean
  copyTradingSearchTargetAddress: string // input搜索的目标地址
  copyTradingTargetAddress: string
  copyTradingTargetTotalPositionValue: string
  copyTradingTargetTotalUPnl: string
  copyTradingTargetTotalUPnlStatus: number
  copyTradingTargetTotalUPnlStatusClassName: string
  copyTradingTargetPositionList: Array<TPositionItem>
  resetCopyTradingTarget: () => void
  resetCopyTradingTargetInfo: () => void

  // 我的仓位
  totalPositionValue: string
  totalUPnl: string
  positionList: Array<TPositionItem>
  operaPositionIdx: number // 当前操作的仓位索引
  readonly operaPositionItem: TPositionItem | null

  // 跟单开仓
  openPositionTargeNote: string
  openPositionLeverage: number
  openPositionLeverageMin: number
  openPositionLeverageMax: number
  openPositionBuyModel: number
  openPositionBuyModelRadios: Array<{
    id: string
    i18n?: string
    label: string
    value: number
  }>
  openPositionBuyModelValue: string
  openPositionSellModel: number
  openPositionSellModelRadios: Array<{
    id: string
    i18n?: string
    label: string
    value: number
  }>
  openPositionTradeStrategyRadios: Array<{
    id?: string
    i18n?: string
    label?: string
    value: string
  }>
  openPositionTradeStrategyValue: string
  openPositionSellModelValue: string
  openPositionSellModelTakeProfitRatioValue: number // 止盈比例 0-100
  openPositionSellModelStopLossRatioValue: number // 止损比例 0-100
  isOpenPositionTargetEdit: boolean // 进入编辑模式
  resetOpenPosition: () => void

  // 快速开仓
  quickerOpenPositionTargetAddress: string // 进入快捷模式（快捷添加，只需提供target Address）
  quickerOpenPositionItem: TCopyTradingTargetItem | null // 快捷跟单下的跟单信息
  resetQuickerOpenPosition: () => void

  // 平仓
  openClosePosition: boolean // 弹窗
  closePositionPrice: string
  closePositionTabId: string
  closePositionTabs: Array<{
    id: string
    i18n?: string
    label: string
    disabled?: boolean
  }>
  resetClosePosition: () => void

  openShareCopyTrade: boolean
  shareCopyTradeAddress: string
  shareCopyTradeLink: string
  resetShareCopyTrade: () => void

  tabId: string
  tabs: Array<{
    id: string
    i18n?: string
    disabled?: boolean
  }>

  reset: () => void
}

const DEFAULT_SHARE_COPY_TRADE = {
  shareCopyTradeAddress: '',
  shareCopyTradeLink: '',
}

const DEFAULT_COPY_TRADING_TARGE_INFO = {
  copyTradingTargetAddress: '',
  copyTradingTargetTotalPositionValue: '',
  copyTradingTargetTotalUPnl: '',
  copyTradingTargetTotalUPnlStatus: 0,
  copyTradingTargetTotalUPnlStatusClassName: '',
  copyTradingTargetPositionList: [],
}

const DEFAULT_COPY_TRADING_TARGE = {
  copyTradingSearchTargetAddress: '',
  ...DEFAULT_COPY_TRADING_TARGE_INFO
}

const DEFAULT_OPEN_POSITION = {
  openPositionTargeNote: '',
  openPositionLeverage: 1,
  openPositionBuyModel: 2,
  openPositionBuyModelValue: '',
  openPositionTradeStrategyValue: '0',
  openPositionSellModel: 2,
  openPositionSellModelValue: '|', // TR|SL 为 0 0 时写成 |
  openPositionSellModelTakeProfitRatioValue: 0,
  openPositionSellModelStopLossRatioValue: 0,
}

const DEFAULT_QUICKER_OPEN_POSITION = {
  quickerOpenPositionTargetAddress: '',
  quickerOpenPositionItem: null
}

const DEFAULT_CLOSE_POSITION = {
  closePositionPrice: '',
  closePositionTabId: 'limit',
  closePositionTabs: [
    { id: 'limit', i18n: 'common.limitPrice', label: 'Limit Price', className: 'col' },
    { id: 'market', i18n: 'common.marketPrice', label: 'Market Price', className: 'col' },
  ]
}

const DEFAULT = {
  copyTradingList: [],
  operaCopyTradingTargetItemIdx: -1,

  isOpenPositionTargetEdit: false,

  ...DEFAULT_COPY_TRADING_TARGE,
  ...DEFAULT_OPEN_POSITION,
  ...DEFAULT_QUICKER_OPEN_POSITION,
  ...DEFAULT_CLOSE_POSITION,
  ...DEFAULT_SHARE_COPY_TRADE,

  totalPositionValue: '0',
  totalUPnl: '0',
  positionList: [],
  operaPositionIdx: -1,

  tabId: 'positions',
}

const copyTradingStore: TCopyTradingStore = {
  tabs: [
    { id: 'positions', i18n: 'common.perpPositions' },
    { id: 'openOrders', i18n: 'common.openOrders' },
    { id: 'recentFills', i18n: 'common.recentFills' },
    { id: 'historicalOrders', i18n: 'common.historicalOrders' },
    // { id: 'completedTrades', i18n: 'common.completedTrades' },
    { id: 'twap', i18n: 'common.twap' },
    { id: 'depositsAndWithdrawals', i18n: 'common.depositsAndWithdrawals' },
  ],

  ...DEFAULT,

  openCopyTradingTarget: false,
  openShareCopyTrade: false,

  openPositionLeverageMin: 1,
  openPositionLeverageMax: 40,
  openPositionBuyModelRadios: [
    { id: '', i18n: 'common.fixed', label: 'Fixed', value: 1 },
    { id: '', i18n: 'common.proportional', label: 'Proportional', value: 2 },
    { id: '', i18n: 'common.maximum', label: 'Maximum', value: 3 },
  ],
  openPositionSellModelRadios: [
    { id: '', i18n: 'common.notToSell', label: 'Not to Sell', value: 4 },
    { id: '',  i18n: 'common.twoXPrincipalExit', label: '2x Principal Exit', value: 1 },
    { id: '',  i18n: 'common.proportional', label: 'Proportional', value: 2 },
    { id: '',  i18n: 'common.tpSl', label: 'TP/SL', value: 3 },
  ],
  openPositionTradeStrategyRadios: [
    { i18n: 'common.trendFollowing', value: '0' },
    { i18n: 'common.hedging', value: '1' },
  ],

  get operaPositionItem () {
    const { operaPositionIdx, positionList } = this

    return positionList[operaPositionIdx]
  },

  get operaCopyTradingTargetItem () {
    const { operaCopyTradingTargetItemIdx, copyTradingList } = this

    return copyTradingList[operaCopyTradingTargetItemIdx]
  },

  openClosePosition: false,

  resetShareCopyTrade() {
    merge(this, DEFAULT_SHARE_COPY_TRADE)
  },

  resetOpenPosition() {
    merge(this, DEFAULT_OPEN_POSITION)
  },

  resetQuickerOpenPosition() {
    merge(this, DEFAULT_QUICKER_OPEN_POSITION)
  },

  resetClosePosition() {
    merge(this, DEFAULT_CLOSE_POSITION)
  },

  resetCopyTradingTarget() {
    merge(this, DEFAULT_COPY_TRADING_TARGE)
  },
  resetCopyTradingTargetInfo() {
    merge(this, DEFAULT_COPY_TRADING_TARGE_INFO)
  },

  reset() {
    merge(this, DEFAULT)
  }
}

export const useCopyTradingStore = createStore<TCopyTradingStore>(copyTradingStore)

