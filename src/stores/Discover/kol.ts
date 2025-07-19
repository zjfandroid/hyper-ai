import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'
import i18n from '@/i18n'

export * from './trading-statistics'
export * from './recommend'

interface TDiscoverKolItem {
  id: number
  address: string
  avatar: string
  xUsername: string
  xNickname: string
  identityType: number

  trustCount: string
  trustCountPer: string
  doubtCount: string
  doubtCountPer: string
  voteCount: string

  winRate: string
  accountTotalValue: string
  pnl: string
  tradesCount: number
  createTs: number

  busy?: boolean
  voted: boolean
}
interface TIdentityItem {
  value: string
  i18n?: string
  label?: string
}


export type TDiscoverKolStore = {
  openAssistTaggingKol: boolean
  assistTaggingKolUsername: string
  checkAssistTaggingKolUsername: boolean
  assistTaggingKolAddress: string
  checkAssistTaggingKolAddress: boolean
  resetAssistTaggingKol: () => void

  identities: Array<TIdentityItem>
  selectedIdentityValue: string
  selectedIdentityItem: TIdentityItem

  list: Array<TDiscoverKolItem>
  last: Array<TDiscoverKolItem>
  _last: Array<TDiscoverKolItem>
  size: number
  current: number
  total: number
  isEnd: boolean
  isFirst: boolean
  isLast: boolean
  count: number
  next(): void
  resetList: () => void

  searchKolInput: string
  searchKol: string
  resetSearch: () => void

  voteId: number
  voteType: number // 1、赞成 -1、反对

  reset: () => void
}

const IDENTITY_KEYS = {
  officialCertification: { value: '1', i18n: 'discover.officialCertification' },
  uncertified: { value: '7', i18n: 'discover.uncertified' },
}

const DEFAULT_SEARCH = {
  searchKolInput: '',
  searchKol: '',
}

const DEFAULT_ASSIST_TAGGING_KOL = {
  assistTaggingKolUsername: '',
  checkAssistTaggingKolUsername: false,
  assistTaggingKolAddress: '',
  checkAssistTaggingKolAddress: false,
}

const DEFAULT_LIST = {
  list: [],
  _last: [],

  // pagination
  size: 12,
  current: 1,
  total: 0,
  isEnd: false,
}

const DEFAULT = {
  openAssistTaggingKol: false,

  voteId: 0,
  voteType: 0,

  ...DEFAULT_ASSIST_TAGGING_KOL,
  ...DEFAULT_LIST,
  ...DEFAULT_SEARCH,
}

const discoverKolStore: TDiscoverKolStore = {
  identities: [
    IDENTITY_KEYS.officialCertification,
    IDENTITY_KEYS.uncertified,
  ],
  selectedIdentityValue: IDENTITY_KEYS.officialCertification.value,

  ...DEFAULT,

  get selectedIdentityItem () {
    return this.identities.find(item => item.value === this.selectedIdentityValue)
  },

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
  next() {
    this.current += 1
  },
  resetList() {
    merge(this, DEFAULT_LIST)
  },
  resetSearch() {
    merge(this, DEFAULT_SEARCH)
  },
  resetAssistTaggingKol () {
    merge(this, DEFAULT_ASSIST_TAGGING_KOL)
  },
  reset() {
    merge(this, DEFAULT)
  }
}

export const useDiscoverKolStore = createStore<TDiscoverKolStore>(discoverKolStore)

