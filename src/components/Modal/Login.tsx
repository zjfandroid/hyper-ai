import { Button, Modal, Alert, Tooltip, message } from 'antd';
import { useEffect } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { constants, useAccountStore, useReqStore } from '@/stores'
// import TelegramLoginWidget from '@/components/TelegramLoginWidget'
import TelegramLogin from '@/components/TelegramLogin'
import { formatNumber, merge } from '@/utils'
import { ITelegram } from '@/components/icon'
import BaseModal from './Base';
import Logo from '@/components/Logo';
import { useNotification } from '@/components/Notification'
import LoginEVMWallet from '@/components/Wallet/LoginEVMWallet'

const ModalLogin = () => {
  const accountStore = useAccountStore()
  const reqStore = useReqStore()
  const { t, i18n } = useTranslation()
  const notification = useNotification()

  const handleClose = () => {
    accountStore.openModalLogin = false
  }

  const handleTgLogin = async (user) => {
    // TEST:
  //   user = {"id":5626854422,
  // "first_name":"sunbeyond",
  // "username":"sunbeyondT",
  // "photo_url":"https://t.me/i/userpic/320/4BC8DspuSxhjLCO6Y8aD8T_q5eXYDiyxfZmd6G3Z9l8bTefheWe1DXGQSozY8YTT.jpg",
  // "auth_date":1747042748,
  // "hash":"caae5f8338521fcbe5cce15f6e97c766816783aba414e618666022f5e2c5bf08"}

    accountStore.tgAccountData = JSON.stringify(user)
    const { error } = await reqStore.userTgLogin(accountStore)

    if (error) return

    accountStore.openModalLogin = false
  }

  // 针对 bot 带来的登录态
  useEffect(() => {
    // NOTE: 已登录则不处理
    if (accountStore.logged) return

    const queryParams = new URLSearchParams(location.search)
    const value = queryParams.get(constants.paramKey.loginToken) || ''

    if (!value) return

    merge(accountStore, {
      session: value,
      logged: true
    })

    // NOTE: 清除此时 url 的 param，避免刷新后再次触发
    const url = new URL(location.href)
    url.searchParams.delete(constants.paramKey.loginToken)
    window.history.replaceState({}, document.title, url.toString());
  }, [])

  // account
  useEffect(() => {
    const asyncFunc = async () => {
      const { data, error } = await reqStore.userInfo(accountStore)

      if (error) return

      // 没绑定官方邀请
      if (!data.boundOfficialReferralCode) {
        notification.open({
          message: t('notification.bindOfficialReferralCodeTitle'),
          description: <span className='d-flex flex-column gap-1'>
            {t('notification.bindOfficialReferralCodeContent')}
            <Button size='small' ghost type='primary' href={'https://app.hyperliquid.xyz/join/HYPERAIBOT'} target='_blank' className='br-4 border-w-2 px-4 fw-500 mt-2'>{t('notification.bindOfficialReferralCodeSubmit')}</Button>
          </span>,
          duration: 10
        })
      }
    }

    if (accountStore.logged) {
      accountStore.openModalLogin = false
    } else {
      return
    }

    asyncFunc()
  }, [accountStore.logged])

  // sync
  useEffect(() => {
    if (!accountStore.openModalLogin) return
    // // evm 签名信息
    // reqStore.userEvmSignMessage(accountStore)

    // 获取 tg 客户端登录时的 code
    reqStore.userTgCode(accountStore)
  }, [accountStore.openModalLogin])

  return (
    <BaseModal
      width={500}
      title={<><Logo mark />{t('login.logInToHyperBot')}</>}
      open={accountStore.openModalLogin}
      onClose={handleClose}
    >
      {
        [
          { label: `${t('login.loginInBrowser')}`, content:
            <>
              {/* <LoginEVMWallet /> */}
              <TelegramLogin botId={constants.app.TG_BOT_ID} onAuth={handleTgLogin} />
            </>
          },
          { label: `${t('login.loginWithDesktopApp')}`, content:
            <Button type='primary' ghost className='br-4 border-w-2 px-4 fw-500 col'
              href={`${constants.app.TG_BOT_LOGIN_URL}${accountStore.tgCode}`} loading={reqStore.userTgCodeBusy} target='_blank'
              onClick={handleClose} 
              icon={<ITelegram />}>
              {t('login.telegramDesktopApp')}
            </Button>
          },
        ].map((item, idx) =>
        <div key={idx} className='d-flex flex-column gap-2 justify-content-between bg-gray-alpha-4 p-3 br-1' style={{ marginTop: '-2px' }}>
          <span className='d-flex gap-2 color-secondary pb-2'>{ item.label }</span>
          <span className='d-flex flex-wrap align-items-center gap-3 h6 fw-500'>{ item.content }</span>
        </div>)
      }
    </BaseModal>
  )
}

export default ModalLogin