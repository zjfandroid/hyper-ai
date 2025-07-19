import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

export type TTrackingCreateStore = {
  openCreateTracking: boolean

  createTrackAddress: string
  createTrackNote: string
  checkCreateTrackAddress: boolean

  // quick
  quickCreateTrackAddress: string // 非标准打开时的传参

  // edit
  isEdit: boolean

  // 通知
  notificationOn: boolean, // 开启通知
  notificationLanguages: Array<{ i18n?: string, label?: string, value: string }>
  notificationSelectedLanguage: string
  notificationEventTypes: Array<{ value: string, i18n?: string, label?: string }>
  notificationSelectedEventTypes: Array<string>

  reset: () => void
}

const DEFAULT = {
  createTrackAddress: '',
  createTrackNote: '',
  checkCreateTrackAddress: false,

  quickCreateTrackAddress: '',

  isEdit: false,

  // 通知
  notificationOn: false, // 开启通知
  notificationLanguages: [
    { i18n: 'common.english', value: 'en' },
    { i18n: 'common.chinese', value: 'zh' },
  ],
  notificationSelectedLanguage: 'en',
  notificationEventTypes: [
    { value: '1', i18n: 'common.openPosition' },
    { value: '2', i18n: 'common.closePosition' },
    { value: '3', i18n: 'common.addPosition' },
    { value: '4', i18n: 'common.reducePosition' },
  ],
  notificationSelectedEventTypes: ['1', '2', '3', '4']
}

const trackingCreateStore: TTrackingCreateStore = {
  openCreateTracking: false,

  ...DEFAULT,

  reset() {
    merge(this, DEFAULT)
  }
}

export const useTrackingCreateStore = createStore<TTrackingCreateStore>(trackingCreateStore)
