import { merge } from '@/utils'

import { createStore } from '../helpers'

export interface TRewardDetailedListUnit {
  amount: number
  sourceId: string
  createTime: number
}

type TSelectItem = {
  label: string,
  i18n?: string,
  value: string
}

export type TRewardDetailedListStore = {
  SOURCE_ID_KEYS: Record<string, TSelectItem>

  list: Array<TRewardDetailedListUnit>
  _last: Array<TRewardDetailedListUnit>
  last: Array<TRewardDetailedListUnit>

  selectDay: Array<TSelectItem>
  selectedDayValue: string
  selectSourceIds: Array<TSelectItem>
  selectedSourceIdValue: string

  // pagination
  size: number
  current: number
  total: number
  isEnd: boolean
  isFirst: boolean
  isLast: boolean
  count: number
  prev: () => void
  next: () => void

  reset: () => void
}

const CYCLE_KEYS = {
  day: { value: '1', i18n: 'common.oneD', label: '1D' },
  week: { value: '7', i18n: 'common.sevenD', label: '7D' },
  month: { value: '30', i18n: 'common.thirtyD', label: '30D' },
  allTime:  { value: '0', i18n: 'common.all', label: 'All' },
}

const SOURCE_ID_KEYS = {
  '0': { value: '0', i18n: 'rewards.inviteUser', label: '邀请用户' },
  '1': { value: '1', i18n: 'rewards.dailyTradeVolumeGreaterThan1000', label: '单日交易量>1000' },
  '2': { value: '2', i18n: 'rewards.dailyTradesGreaterThan5', label: '单日交易大于5笔' },
  '3': { value: '3', i18n: 'rewards.dailySuccessfulCopyTrades', label: '单日跟单成功3次' },
  '4': { value: '4', i18n: 'rewards.rebatePointsFriendTradeReward', label: '返佣积分-好友交易奖励' },
  '5': { value: '5', i18n: 'rewards.tradeReward', label: '交易奖励' },
  '6': { value: '6', i18n: 'rewards.dailyInviteTask', label: '每日邀请任务' },
}

const DEFAULT = {

  list: [],
  _last: [],

  selectedDayValue: CYCLE_KEYS.month.value,

  selectedSourceIdValue: '0',

  // pagination
  size: 10,
  current: 1,
  total: 0,
  isEnd: false,
}

const rewardDetailedListStore: TRewardDetailedListStore = {
  SOURCE_ID_KEYS,

  selectDay: [
    CYCLE_KEYS.month,
    CYCLE_KEYS.allTime
  ],

  selectSourceIds: [
    SOURCE_ID_KEYS['0'],
    SOURCE_ID_KEYS['1'],
    SOURCE_ID_KEYS['2'],
    SOURCE_ID_KEYS['3'],
    SOURCE_ID_KEYS['4'],
    SOURCE_ID_KEYS['5'],
    SOURCE_ID_KEYS['6'],
  ],

  ...DEFAULT,

  // 最后请求的
  get last() {
    return this._last
  },
  set last(val) {
    const result = this._last = val

    // update
    this.list = this.list.concat(result)
  },

  get isFirst() {
    return this.current <= 1
  },
  get isLast() {
    return this.current >= this.count
  },
  get count() {
    const { total, size } = this

    return Math.ceil(total / size || 1)
  },
  prev() {
    if (this.isFirst) return
    this.current--
  },
  next() {
    // if (this.isLast) return
    this.current++
  },
  reset() {
    merge(this, DEFAULT)
  }
}


export const useRewardDetailedListStore = createStore<TRewardDetailedListStore>(rewardDetailedListStore)