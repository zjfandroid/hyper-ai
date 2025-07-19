import BN from 'bignumber.js'
import { AuthenticationStatus } from '@rainbow-me/rainbowkit'

import { createStore } from '@/stores/helpers'
import { merge, formatNumber, localStorage, urlSafeBase58EncodeByJSON } from '@/utils'
import { constants } from '@/stores/constants'

export * from './private-wallet'

export type TAccountStore = {
  openModalLogin: boolean

  init: boolean
  id: number | string
  _session: string // 原始值
  session: string
  logged: boolean
  nickname: string
  email: string
  tgCode: string // 跳转到 tg 客户端进行登录时，需要带的code

  senderInvitationsCode: string
  readonly inviteUrl: string

  tgAccountData: string
  tgInitData: string
  tgFirstName: string
  tgHeadIco: string
  tgLastName: string
  tgUsername: string

  // Evm 登录
  evmAddress: string
  evmSignMessage: string
  evmSignedMessage: string
  evmChainId: number
  evmAuthStatus: AuthenticationStatus
  reset: () => void
}

const DEFAULT_EVM = {
  evmAddress: '',
  evmSignMessage: '',
  evmSignedMessage: '',
  evmChainId: 0,
  evmAuthStatus: 'unauthenticated' as AuthenticationStatus
}

const DEFAULT = {
  init: false,
  id: -1,
  _session: '',
  logged: false,
  nickname: '',
  email: '',
  tgCode: '',

  senderInvitationsCode: '',

  tgAccountData: '',
  tgInitData: '',
  tgFirstName: '',
  tgAuthDate: -1,
  tgHeadIco: '',
  tgLastName: '',
  tgUsername: '',

  ...DEFAULT_EVM,
}

const accountStore: TAccountStore = {
  openModalLogin: false,

  ...DEFAULT,

  get session () {
    return this._session
  },
  set session (val) {
    this._session = val
    // sync
    localStorage.set(constants.storageKey.SESSION, val)
  },

  get inviteUrl () {
    const { id } = this
    const fullUrl = window.location.href;
    const baseUrl = new URL(fullUrl).origin;

    return `${constants.app.URL || baseUrl}?${constants.paramKey.senderInvitationsCode}=${id}`
  },

  reset() {
    merge(this, DEFAULT)
    // storage
    localStorage.remove(constants.storageKey.ACCOUNT)
    localStorage.remove(constants.storageKey.SESSION)
  }
}

// init
const _account = localStorage.get(constants.storageKey.ACCOUNT) || {}
const _session = localStorage.get(constants.storageKey.SESSION) || ''
merge(accountStore, {
  _session,
  logged: !!_session,
  ..._account
})

export const useAccountStore = createStore<TAccountStore>(accountStore)

