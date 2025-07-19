import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

export * from './detailed-list'

export type TReferralRecordItem = {
  amount: number // 奖励
  status: number // 等级，1、直接邀请 2、tier2 3、tier3
  createTs: number // 时间
  username: string; // 用户名
}

export interface TLVSItem {
  lv: string
  bonus: number
  minTradingVolume: number
  maxTradingVolume: number
}

export type TRewardStore = {
  openReferralFriends: boolean

  lvs: Array<TLVSItem> // 等级

  copyTrade3Times: boolean // 当天跟单交易次数
  currentBonus: string // 当前加成
  currentLevel: string // 当前等级
  directInvite: number // 直接邀请
  invite3Friends: boolean // 邀请任务
  nextBonus: string // 下一等级加成
  nextLevelTradingVolume: string // 下一等级所需交易量
  pointsBalance: string // 积分
  tier2: number // 2级
  tier3: number // 3级
  totalReferral: number // 总邀请
  totalTradingVolume: string // 总交易量
  trade1000Today: boolean // 当天交易量超1000
  trade5Times: boolean // 当天交易次数超5次

  referralRecords: Array<TReferralRecordItem> // 邀请记录
  referralRecordCurrent: number
  referralRecordPageSize: number

  reset: () => void
}

const DEFAULT = {
  openReferralFriends: false,

  lvs: [],

  copyTrade3Times: false,
  currentBonus: '-',
  currentLevel: '-',
  directInvite: 0,
  invite3Friends: false,
  nextBonus: '-',
  nextLevelTradingVolume: '-',
  pointsBalance: '-',
  tier2: 0,
  tier3: 0,
  totalReferral: 0,
  totalTradingVolume: '-',
  trade1000Today: false,
  trade5Times: false,

  referralRecords: [],
  referralRecordCurrent: 1,
  referralRecordPageSize: 5
}

const rewardStore: TRewardStore = {
  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useRewardStore = createStore<TRewardStore>(rewardStore)

