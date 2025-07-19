import React, { useEffect, useRef, useState } from 'react';
import { message, Button } from 'antd';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { ITelegram } from '@/components/icon';

type TTelegramUser = { first_name: string, last_name: string, id: string, username: string, photo_url: string, auth_date: number, hash: string }
interface TelegramLoginProps {
  botId: string
  size?: 'large' | 'middle' | 'small'
  loading?: boolean
  onAuth: (user: TTelegramUser) => Promise<any> | any
}
// https://core.telegram.org/widgets/login
const TelegramLogin = ({ botId, loading = false, size='middle', onAuth = (data) => {} }: TelegramLoginProps) => {
  const [loadingScript, setLoadingScript] = useState<boolean>(true);
  const { t, i18n } = useTranslation()

  const handleLogin = () => {
    window.Telegram.Login.auth(
      { bot_id: botId, request_access: true },
      (data) => {
        if (!data) {
          message.error(t('message.telegramAuthorizationFailed'))
          return
        }

        onAuth(data)
      }
    )
  }

  useEffect(() => {
    const script = document.createElement('script')

    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true

    script.onload = () => {
      setLoadingScript(false)
    }

    script.onerror = () => {
      console.error(`Error loading script: ${script.src}`)
      setLoadingScript(false)
    }

    document.head.appendChild(script)
  }, [])

  return (
    <Button size={size} type='primary' ghost className='br-4 border-w-2 px-4 fw-500 col'
      loading={loading || loadingScript}
      icon={<ITelegram />}
      onClick={handleLogin}>
      {t('login.telegramWeb')}
    </Button>
  )
}

export default TelegramLogin
