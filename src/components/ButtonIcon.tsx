import React, { ReactNode, HTMLProps, useState, useEffect } from 'react'
import { Button, message } from 'antd';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { useAccountStore } from '@/stores';

interface ButtonIconProps extends HTMLProps<HTMLDivElement> {
  logged?: boolean
  disabled?: boolean
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text'
  icon?: ReactNode
  children?: ReactNode | null
  onClick?: () => any | null
  className?: string
}


const ButtonIcon: React.FC<ButtonIconProps> = ({ type='default', logged, disabled = false, icon, onClick = null, children = null, className = '', ...rest }) => {
  const accountStore = useAccountStore()
    const { t, i18n } = useTranslation()

  const handleClick = () => {
    if (logged && !accountStore.logged) {
      message.warning(t('message.loginRequired'))
      return
    }

    if (disabled) {
      return
    }

    onClick && onClick()
  }

  return (
    <Button type={type} disabled={disabled} className={`br-4 px-2 px-sm-3 ${className}`} ghost size='small' icon={icon} onClick={handleClick}>
      <span className='d-none d-sm-flex'>{children}</span>
    </Button>
  )
}

export default ButtonIcon