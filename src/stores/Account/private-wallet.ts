import { createStore } from '@/stores/helpers'

import { merge } from '@/utils'
import { constants } from '@/stores'

export type TPrivateWalletStore = {
  MIN_PW_LENGTH: number
  MIN_DEPOSIT_USDC_AMOUNT: number

  openCreatePrivateWallet: boolean
  openExportPrivateKey: boolean
  openDeposit: boolean
  openWithdraw: boolean
  openRemove: boolean
  operaWalletIdx: number

  addresses: Array<string>

  list: Array<{
    idx: number
    walletId: string // 钱包id
    balance: string // 余额
    hasPrivateKey: boolean // 是否有私钥
    nickname: string // 昵称
    pwPrompt: string // 密码提示
    createTs: number // 注册时间
    totalMarginUsed: string // 保证金
    uPnl: string // uPnl
    uPnlStatus: number // uPnl 状态 -1 为亏 1 为赚 0 为 不亏不赚
    address: string // 钱包地址
    withdrawable: string // 可提现余额
  }>

  // create
  createPW: string
  createPWPrompt: string
  createNickname: string
  resetCreate: () => void

  // ExportPrivateKey
  exportPrivateKeyPW: string
  exportPrivateKeyContent: string
  resetExportPrivateKey(): void

  // deposit
  depositNumber: string
  resetDeposit: () => void

  // remove
  removePW: string
  resetRemove: () => void

  reset: () => void
}

const DEFAULT_CREATE = {
  createPW: '',
  createPWPrompt: '',
  createNickname: ''
}

const DEFAULT_EXPORT_PRIVATE_KEY = {
  exportPrivateKeyPW: '',
  exportPrivateKeyContent: ''
}

const DEFAULT_DEPOSIT = {
  depositNumber: ''
}

const DEFAULT_REMOVE = {
  removePW: ''
}

const DEFAULT = {
  operaWalletIdx: -1,

  addresses: [],

  list: [],
  ...DEFAULT_CREATE,
  ...DEFAULT_EXPORT_PRIVATE_KEY,
  ...DEFAULT_DEPOSIT,
  ...DEFAULT_REMOVE
}

const privateWalletStore: TPrivateWalletStore = {
  MIN_PW_LENGTH: 6,
  MIN_DEPOSIT_USDC_AMOUNT: 15,

  openCreatePrivateWallet: false,
  openExportPrivateKey: false,
  openDeposit: false,
  openWithdraw: false,
  openRemove: false,

  ...DEFAULT,

  resetCreate() {
    merge(this, DEFAULT_CREATE)
  },

  resetExportPrivateKey() {
    merge(this, DEFAULT_EXPORT_PRIVATE_KEY)
  },

  resetDeposit() {
    merge(this, DEFAULT_DEPOSIT)
  },

  resetRemove() {
    merge(this, DEFAULT_REMOVE)
  },

  reset() {
    merge(this, DEFAULT)
  }
}

export const usePrivateWalletStore = createStore<TPrivateWalletStore>(privateWalletStore)

