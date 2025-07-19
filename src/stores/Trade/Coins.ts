import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'
import { IPerpMetaItem, IPerpMarketItem } from '../Hyper'

type IPerpListItem = IPerpMetaItem & IPerpMarketItem & {
  coin: string
}

export type TTradeCoinsStore = {
  init: boolean

  sortColumnId: string
  sortAscending: boolean

  searchCoinInput: string
  searchCoin: string
  resetSearch: () => void

  perpList: Array<IPerpListItem>

  reset: () => void
}

const DEFAULT_SEARCH = {
  searchCoinInput: '',
  searchCoin: '',
}

const DEFAULT = {
  init: true,

  sortColumnId: 'dayNtlVolume',
  sortAscending: false,

  ...DEFAULT_SEARCH,

  perpList: []
}

const tradeCoinsStore: TTradeCoinsStore = {
  ...DEFAULT,

  resetSearch() {
    merge(this, DEFAULT_SEARCH)
  },

  reset() {
    merge(this, DEFAULT)
  }
}

export const useTradeCoinsStore = createStore<TTradeCoinsStore>(tradeCoinsStore)

