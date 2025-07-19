import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import { constants } from '@/stores'

import zhHansLocale from "./modules/zhHans.json"
import zhHantLocale from "./modules/zhHant.json"
import enUSLocale from "./modules/enUS.json"

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
      'zh-Hans': { translation: zhHansLocale },
			'zh-Hant': { translation: zhHantLocale },
			en: { translation: enUSLocale },
		},
		fallbackLng: constants.app.INIT_I18N,
		preload: constants.app.I18NS.map((item) => item.key),
    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'em', 'span', 'i', 'strong'],
    },
		// debug: !constants.app.isProd,
		interpolation: {
			escapeValue: false,
		},
		detection: {
      order: ['localStorage', 'sessionStorage', 'cookie'],
      lookupLocalStorage: constants.storageKey.I18N,
    }
	})

export default i18n
