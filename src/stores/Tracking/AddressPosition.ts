import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

export interface TTrackingAddressPosition {
  address: string
  note: string
  balance: string
  pnl: string
  pnlStatus: number
  pnlStatusClassname: string
  totalPositionValue: string
  marginUsedRatio: string
  positions: Array<{
    coin: string
    leverage: number
    direction: string
    type: string
    size: string
    positionValue: string
    openPrice: string
    markPrice: string
    uPnl: string
    uPnlRatio: string
    liquidationPrice: string
    marginUsed: string
  }>
}

export type TTrackingAddressPositionStore = {
  openBatchImportTracking: boolean
  openBatchExportTracking: boolean

  list: Array<TTrackingAddressPosition>

  // import
  batchImportInput: string // 原始值
  batchImportContent: string
  // NOTE: 数据格式对标接口需求
  batchImportAddresses: Array<{ wallet: string, remark: string }>
  resetImport: () => void

  // export
  batchExportContent: string
  resetExport: () => void

  // remove
  removeTrackAddress: string
  resetRemove: () => void

  reset: () => void
}

const DEFAULT_IMPORT = {
  batchImportInput: '',
  batchImportContent: '',
  batchImportAddresses: []
}

const DEFAULT_EXPORT = {
  batchExportContent: '',
}

const DEFAULT_REMOVE = {
  removeTrackAddress: '',
}

const DEFAULT = {
  list: [],

  ...DEFAULT_IMPORT,
  ...DEFAULT_EXPORT,
  ...DEFAULT_REMOVE,
}

const trackingAddressPositionStore: TTrackingAddressPositionStore = {
  openBatchImportTracking: false,
  openBatchExportTracking: false,

  ...DEFAULT,
  resetImport() {
    merge(this, DEFAULT_IMPORT)
  },
  resetExport() {
    merge(this, DEFAULT_EXPORT)
  },
  resetRemove() {
    merge(this, DEFAULT_REMOVE)
  },
  reset() {
    merge(this, DEFAULT)
  }
}

export const useTrackingAddressPositionStore = createStore<TTrackingAddressPositionStore>(trackingAddressPositionStore)
