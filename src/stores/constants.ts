const NAME = import.meta.env.VITE_SITE_NAME
const PROJECT_KEY = NAME.toLocaleUpperCase()

type TConstants = {
  app: {
    NAME: string
    URL: string
    PUBLIC_PATH_BASE: string
    TITLE: string
    DOC: string
    KEYWORDS: string
    DESCRIPTION: string
    TWITTER: string
    TELEGRAM: string
    API_BASE: string
    isProd: boolean
    isLocalData: boolean
    TWITTER_SITE: string
    URL_INVITECODE_KEY: string // url 内带分享码的 key name
    URL_INVITEVENT_KEY: string // 邀请事件类型
    URL_JUMPTO_KEY: string
    URL_STATE_KEY: string // 后端状态码
    URL_TEAM_ID_KEY: string
    TG_BOT_USERNAME: string
    TG_BOT_ID: string
    TG_APPNAME: string
    TWITTER_HASHTAGS: Array<string>
    readonly TG_URL: string
    TG_BOT_LOGIN_URL: string
    SCROLL_BOTTOM_GAP: number // 距离底部缺口的滚动触发
    RWOWN_PROJECT_ID: string
    INIT_I18N: string
    I18NS: Array<{ label: string, key: string }>
  }
  storageKey: {
    ACCOUNT: string
    TWITTER_INFO_STATUS: string
    WALLET: string
    TON_PAYLOAD: string
    SIGN: string
    SESSION: string
    JUMP_ON: string
    SETTING: string
    I18N: string
    HYPER_PRICES: string
  }
  decimalPlaces: {
    __uPnl__: number
    TON: number
    USD: number
    __COMMON__: number
    __RATIO__: number
    __PCT__: number
    __FUNDING_PCT__: number
  }
  format: {
    fullDate: string
    date: string
  }
  paramKey: Record<string, string>
}

const isProd = import.meta.env.VITE_PROD === 'true'

export const constants: TConstants = {
  app: {
    NAME,
    URL: import.meta.env.VITE_URL,
    PUBLIC_PATH_BASE: import.meta.env.VITE_PUBLIC_PATH_BASE,
    TITLE: import.meta.env.VITE_DEFAULT_TITLE,
    DOC: import.meta.env.VITE_DOC,
    KEYWORDS: import.meta.env.VITE_KEYWORDS,
    DESCRIPTION: import.meta.env.VITE_DESCRIPTION,
    TWITTER: import.meta.env.VITE_OFFICIAL_TWITTER,
    TELEGRAM: import.meta.env.VITE_OFFICIAL_TELEGRAM,
    API_BASE: import.meta.env.VITE_API_PATH,
    isProd,
    isLocalData: location.hostname === 'localhost',
    TWITTER_SITE: import.meta.env.VITE_TWITTER_SITE,
    URL_INVITECODE_KEY: 'i',
    URL_INVITEVENT_KEY: 'e',
    URL_JUMPTO_KEY: 'to',
    URL_STATE_KEY: 's',
    URL_TEAM_ID_KEY: 'te',
    TG_BOT_USERNAME: import.meta.env.VITE_TG_BOT_USERNAME,
    TG_BOT_ID: import.meta.env.VITE_TG_BOT_ID,
    TG_APPNAME: import.meta.env.VITE_TG_APPNAME,
    TWITTER_HASHTAGS: ['Junlala'],
    get TG_URL () {
      return `https://t.me/${this.TG_BOT_USERNAME}/${this.TG_APPNAME}`
    },
    TG_BOT_LOGIN_URL: import.meta.env.VITE_TG_BOT_LOGIN_URL,
    SCROLL_BOTTOM_GAP: 120,
    RWOWN_PROJECT_ID: import.meta.env.VITE_RWOWN_ID,
    INIT_I18N: 'en',
    I18NS: [
      { label: 'English', key: 'en' },
      { label: '简体中文', key: 'zh-Hans' },
      { label: '繁體中文', key: 'zh-Hant' },
    ],
  },
  storageKey: {
    ACCOUNT: `__${ PROJECT_KEY }_GLOBAL_ACCOUNT__`,
    TWITTER_INFO_STATUS: `__${ PROJECT_KEY }_GLOBAL_REQ__getTwitterInfoByUsername_queue`,
    WALLET: `__${ PROJECT_KEY }_GLOBAL_WALLET__`,
    TON_PAYLOAD: `__${ PROJECT_KEY }_TON_PAYLOAD__`,
    SIGN: `__${ PROJECT_KEY }_SIGN__`,
    SESSION: `__${ PROJECT_KEY }_SESSION__`,
    JUMP_ON: `__${ PROJECT_KEY }_JUMP_ON__`,
    SETTING: `__${ PROJECT_KEY }_SETTING__`,
    I18N: `__${ PROJECT_KEY }_I18N__`,
    HYPER_PRICES: `__${ PROJECT_KEY }_HYPER_PRICES__`,
  },
  decimalPlaces: {
    __uPnl__: 2,
    TON: 4,
    USD: 6,
    __COMMON__: 2,
    __RATIO__: 8,
    __PCT__: 2,
    __FUNDING_PCT__: 4 // 资金费率百分比
  },
  format: {
    fullDate: 'MMM D, YYYY h:mm A',
    date: 'MMM D, YYYY'
  },
  paramKey: {
    copyTradingTargetAddress: 'ccta',
    senderInvitationsCode: 'ic',
    loginToken: 'lt'
  }
}