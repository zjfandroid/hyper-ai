import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

export type TWhaleEventsStore = {
  pageSize: number,
  list: Array<{
    id: number
    coin: string
    address: string
    liquidationPrice: string
    type: string
    direction: string
    action: number
    isPositionOpened: string
    isPositionClosed: string
    size: string
    positionValue: string
    openPrice: string
    createTs: number
  }>
  reset: () => void
}

const DEFAULT_SELECTED = 'all'

const DEFAULT = {
  pageSize: 20,
  list: []
}

const whaleEventsStore: TWhaleEventsStore = {
  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useWhaleEventsStore = createStore<TWhaleEventsStore>(whaleEventsStore)

