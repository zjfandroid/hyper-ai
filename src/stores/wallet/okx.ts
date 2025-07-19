import { OKXTonConnectUI, THEME, OKXConnectError, OKXUniversalConnectUI } from "@okxconnect/ui";
import { constants } from '@/stores'

// export const okxTonConnectUI = new OKXTonConnectUI({
//   dappMetaData: {
//     name: '',
//     icon: ''
//   },
//   // buttonRootId: 'okxwallet',
//   actionsConfiguration:{
//     returnStrategy:'none',
//     tmaReturnUrl:'back'
//   },
//   uiPreferences: {
//     theme: THEME.DARK
//   },
//   language: 'en_US',
//   restoreConnection: true
// })

export const okxUniversalUI = await OKXUniversalConnectUI.init({
  dappMetaData: {
    icon: '???/favicon.png',
    name: constants.app.NAME
  },
  actionsConfiguration: {
    returnStrategy: 'tg://resolve',
    modals:'all',
    tmaReturnUrl:'back'
  },
  language: "en_US",
  uiPreferences: {
    theme: THEME.DARK
  },
})