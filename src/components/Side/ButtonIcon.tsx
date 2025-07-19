import React,  { Children, useEffect, useRef, useState } from 'react';
import { Button, message } from 'antd'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { useAccountStore } from '@/stores';
import ColumnTooltip from '@/components/Column/Tooltip'

interface SideButtonIconProps {
  icon?: React.ReactNode;
  onClick: () => void;
  logged?: boolean; // 是否需要登录态
  className?: string;
  disabled?: boolean;
  title?: string;
  children?: React.ReactNode
}

const SideButtonIcon: React.FC<SideButtonIconProps> = ({
  icon = <></>,
  onClick,
  className = '',
  logged = false,
  disabled = false,
  title = '',
  children = <></>
}) => {
  const accountStore = useAccountStore()

  const { t, i18n } = useTranslation()

  const handleClick = () => {
    if (logged && !accountStore.logged) {
      message.open({ content: t('message.loginRequired') })
      return
    }

    if (disabled) {
      return
    }

    onClick && onClick()
  }

  return (
    <ColumnTooltip title={title}>
      <div className={`hover-gray br-4 color-secondary ${className} ${disabled ? 'opacity-50 not-allowed' : 'pointer'}`} onClick={handleClick}>
        {icon}
        {children}
      </div>
    </ColumnTooltip>
  );
};

export default SideButtonIcon;