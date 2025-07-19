import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

interface TItem {
}

export type TTraderDetailsPositionsStore = {
  sortColumnId: string

  list: Array<TItem>
  reset: () => void
}

const DEFAULT = {
  sortColumnId: 'positionValue',

  list: [],
}

const traderDetailsPositionsStore: TTraderDetailsPositionsStore = {
  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useTraderDetailsPositionsStore = createStore<TTraderDetailsPositionsStore>(traderDetailsPositionsStore)

