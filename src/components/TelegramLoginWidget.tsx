import React, { useEffect, useRef, useState } from 'react';

type TTelegramUser = { first_name: string, last_name: string, id: string, username: string, photo_url: string, auth_date: number, hash: string }
interface TelegramLoginWidgetProps {
  botUsername: string
  redirectUrl?: string
  onAuth: (user: TTelegramUser) => Promise<any> | any
  size?: "large" | "medium" | "small"
  cornerRadius?: number
  requestWrite?: 'write' | null
  userPhoto?: boolean
}
// https://core.telegram.org/widgets/login
const TelegramLoginWidget = ({ botUsername, redirectUrl = '', onAuth = () => {}, size = 'medium', cornerRadius = 20, requestWrite = 'write', userPhoto = false }: TelegramLoginWidgetProps) => {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const script = document.createElement('script')

    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', botUsername)
    script.setAttribute('data-size', size)
    script.setAttribute('data-radius', cornerRadius.toString())
    script.setAttribute('data-onauth', redirectUrl ? 'null' : 'onTelegramAuth(user)')
    script.setAttribute('data-userpic', userPhoto + '')
    script.setAttribute('data-request-access', requestWrite + '')
    script.setAttribute('data-auth-url', redirectUrl)

    script.onload = () => {
      setLoading(false)
    }

    script.onerror = () => {
      console.error(`Error loading script: ${script.src}`)
      setLoading(false)
    }

    // 将脚本插入到组件的 ref 指向的元素中
    if (widgetRef.current) {
      widgetRef.current.appendChild(script)
    }

    window.onTelegramAuth = onAuth

    return () => {
      if (widgetRef.current) {
        widgetRef.current.removeChild(script)
      }
    }
  }, [botUsername, redirectUrl, ])

  return (
    <div ref={widgetRef}></div>
  )
}

export default TelegramLoginWidget
