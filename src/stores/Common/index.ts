import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

export * from './types'

export type TCommonStore = {
  nav: Array<{i18n?: string, name: string, to?: string, href?: string, disabled?: boolean, target?: string}>
  reset: () => void
}

const DEFAULT = {
  nav: [
    { i18n: 'header.discover', name: '', to: '/discover' },
    { i18n: 'header.news', name: '', to: '/news' },
    // { i18n: 'header.vaults', name: '', to: '/vaults' },
    { i18n: 'header.trackNMonitor', name: '', to: '/track-monitor' },
    { i18n: 'header.copyTrading', name: '', to: '/copy-trading' },
    // { i18n: 'header.points', name: '', to: '/rewards', disabled: false },
    { i18n: 'header.leaderboard', name: '', to: '/leaderboard' },
    // { i18n: 'header.docs', name: '', href: constants.app.DOC, target: '_blank' },
  ]
}

const commonStore: TCommonStore = {
  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useCommonStore = createStore<TCommonStore>(commonStore)

