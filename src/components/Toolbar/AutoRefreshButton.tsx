import { Timeline, Spin, Empty, Button, Switch } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { defaults, localStorage } from '@/utils'
import { IRefresh } from '@/components/icon'
import ColumnTooltip from '@/components/Column/Tooltip'
import { constants } from '@/stores'
import ButtonIcon from '@/components/ButtonIcon'

import './AutoRefreshButton.scss'

interface ToolbarAutoRefreshButtonProps {
  onRefresh: () => Promise<any> | any
  storageSettingKey: string;
  loading?: boolean // 目标加载完毕后，才会开始新一轮倒计时
  autoRefreshCD?: number;
  content?: string | React.ReactNode
  className?: string
  onSyncStatus?: (isAutoRefreshing: boolean) => void // 初始化、变更时都会同步状态
}

const ToolbarAutoRefreshButton: React.FC<ToolbarAutoRefreshButtonProps> = ({ 
  storageSettingKey, 
  onRefresh = () => {}, 
  loading = false,
  content = '',
  autoRefreshCD = 300,
  className = '',
  onSyncStatus = (isAutoRefreshing) => {}
}) => {
  const { t, i18n } = useTranslation()

  const STORAGE_KEY = `${constants.storageKey.SETTING}${storageSettingKey}`

  const [isAutoRefreshing, setIsAutoRefreshing] = useState(localStorage.get(STORAGE_KEY) ?? !!autoRefreshCD);
  const [countdown, setCountdown] = useState(autoRefreshCD);

  const handleSwitch = () => {
    setIsAutoRefreshing((prev) => {
      const checked = !prev;
      // storage
      localStorage.set(STORAGE_KEY, checked)

      return checked
    })
  }

  // Auto refresh countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;

    // sync
    onSyncStatus(isAutoRefreshing)

    // 已开启自动
    if (isAutoRefreshing) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            onRefresh()
            return autoRefreshCD;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    };
  }, [isAutoRefreshing])

  useEffect(() => {

  }, [])


return (
  <>
    <ButtonIcon className={`toolbar-auto-refresh-button ${className}`} icon={<IRefresh className={isAutoRefreshing ? 'refresh' : ''} />}
      onClick={() => handleSwitch()}>
        <ColumnTooltip title={isAutoRefreshing ? t('toolTip.pauseAutomaticUpdates') : t('toolTip.startAutomaticUpdates')}>
          {
            isAutoRefreshing
              ?
              <span className="color-secondary">
                {
                  content
                    || <Trans>{t('common.updatedInSeconds', { seconds: countdown })}</Trans>
                }
              </span>
              : t('common.paused')
          }
      </ColumnTooltip>
    </ButtonIcon>
  </>
)
}

export default ToolbarAutoRefreshButton