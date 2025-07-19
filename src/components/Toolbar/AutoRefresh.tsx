import { Timeline, Spin, Empty, Button, Switch } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { defaults, localStorage } from '@/utils'
import ColumnTooltip from '@/components/Column/Tooltip'
import { constants } from '@/stores'

interface ToolbarAutoRefreshProps {
  onRefresh?: () => Promise<any>;
  storageSettingKey: string;
  loading?: boolean;
  autoRefreshCD?: number;
  className?: string;
}

const ToolbarAutoRefresh: React.FC<ToolbarAutoRefreshProps> = ({ 
  storageSettingKey, 
  onRefresh, 
  loading = false, 
  autoRefreshCD = 300,
  className = ''
}) => {
  const { t, i18n } = useTranslation()

  const STORAGE_KEY = `${constants.storageKey.SETTING}${storageSettingKey}`

  const [isAutoRefreshing, setIsAutoRefreshing] = useState(localStorage.get(STORAGE_KEY) ?? !!autoRefreshCD);
  const [countdown, setCountdown] = useState(autoRefreshCD);

  const refreshData = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
      // Reset countdown
      setCountdown(autoRefreshCD);
    }
  }, [onRefresh]);

  // Auto refresh countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isAutoRefreshing && !loading) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // When countdown ends, refresh data
            refreshData();
            return autoRefreshCD;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isAutoRefreshing, loading, refreshData]);
return (
  <div className={`d-flex align-items-center gap-2 ${className}`}>
    {isAutoRefreshing && (
      <span className="color-secondary">
        <Trans>{t('common.updatedInSeconds', { seconds: countdown })}</Trans>
      </span>
    )}
    <ColumnTooltip title={isAutoRefreshing ? t('toolTip.turnOffAutoRefresh') : t('toolTip.turnOnAutoRefresh')}>
      <Switch checkedChildren={t('common.auto')} unCheckedChildren={t('common.off')} defaultChecked={isAutoRefreshing} onChange={(checked) => {
        setIsAutoRefreshing(checked)
        // storage
        localStorage.set(STORAGE_KEY, checked)
      }} />
    </ColumnTooltip>
  </div>
)
}

export default ToolbarAutoRefresh