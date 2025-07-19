import dayjs from 'dayjs'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber, defaults } from '@/utils'
import { constants } from '@/stores'
import ColumnTooltip from '@/components/Column/Tooltip'

const TimeAgo = ({ ts, justNowMin = 5, miniUnit = false, uppercase = false, fullDateFormat = '', dateFormat = '' }) => {
  const { t, i18n } = useTranslation()

  const formatTimeLabel = (timestamp: number, options: { justNowMin: number, dateFormat: string, miniUnit: boolean }) => {
    const now = dayjs();
    const date = dayjs(timestamp);
    const diffMinutes = now.diff(date, 'minute');

    if (diffMinutes < options.justNowMin) {
      return t('formatTime.justNow');
    }

    // 1小时内
    if (diffMinutes < 60) {
      return t(options.miniUnit ? 'formatTime.mAgo' : 'formatTime.minutesAgo', { diffMinutes });
    }

    if (diffMinutes < 1440) {
      const hours = ~~(diffMinutes / 60);
      return t(options.miniUnit ? 'formatTime.hAgo' : 'formatTime.hoursAgo', { hours });
    }

    // 添加新规则：1天到1周之间
    if (diffMinutes < 10080) { // 7天 * 24小时 * 60分钟 = 10080分钟
      const days = ~~(diffMinutes / 1440);
      return t(options.miniUnit ? 'formatTime.dAgo' : 'formatTime.daysAgo', { days });
    }

    // Different year
    return date.format(options.dateFormat);
  };

  // NOTE: 这里使用 i18n 来控制
  return (
    <ColumnTooltip title={dayjs(ts).format(fullDateFormat || t('formatTime.fullDate'))}>
      <small className={`color-secondary opacity-70 fw-bold linker ${ uppercase ? 'text-uppercase' : ''}`}>
        { formatTimeLabel(ts, { justNowMin, miniUnit, dateFormat: dateFormat || t('formatTime.date') }) }
      </small>
    </ColumnTooltip>
  )
}

export default TimeAgo


