import { Button } from 'antd'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import TelegramLogin from '@/components/TelegramLogin'
import { ITelegram, IOutlineLogin } from '@/components/icon'

import { constants, useAccountStore, useReqStore } from '@/stores'
import Logo from '@/components/Logo'

const LoginBtn = () => {
  const accountStore = useAccountStore()
  const reqStore = useReqStore()
  const { t, i18n } = useTranslation()

  // const handleTgLogin = async (user) => {
  //   accountStore.tgAccountData = JSON.stringify(user)
  //   const { error } = await reqStore.userTgLogin(accountStore)

  //   if (error) return
  // }
  const handleOpenLogin = () => {
    accountStore.openModalLogin = true
  }

  return (
    // <TelegramLogin botId={constants.app.TG_BOT_ID} onAuth={handleTgLogin} />
    <Button size='small' icon={<IOutlineLogin />} type='primary' ghost onClick={handleOpenLogin} className='br-4 border-w-2 px-4 fw-500'>
      {t('common.logIn')}
    </Button>
  )
}

export default LoginBtn