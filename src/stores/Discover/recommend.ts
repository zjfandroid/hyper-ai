import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

interface TListItem {
  address: string
  perpValue: string
  spotValue: string
  winRate: string
  accountTotalValue: string
  marginUsed: string
  marginUsedRatio: string
  note: string
  pnl: string
  tradesCount: number
  tags: Array<string>
  lastActionTs: string
}

export type TDiscoverRecommendStore = {
  pageSize: number,
  selectedLanguage: string,
  list: Array<TListItem>,

  reset: () => void
}

const DEFAULT = {
  selectedLanguage: 'en',

  list: [],
}

const discoverRecommendStore: TDiscoverRecommendStore = {
  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useDiscoverRecommendStore = createStore<TDiscoverRecommendStore>(discoverRecommendStore)

