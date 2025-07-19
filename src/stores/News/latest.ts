import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'
import { TBaseNewsItem } from '../type'

export type TNewsLatestStore = {
  pageSize: number,
  selectedLanguage: string,
  list: Array<TBaseNewsItem>,

  reset: () => void
}

const DEFAULT = {
  pageSize: 20,
  selectedLanguage: 'en',

  list: [],
}

const newsLatestStore: TNewsLatestStore = {
  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useNewsLatestStore = createStore<TNewsLatestStore>(newsLatestStore)

