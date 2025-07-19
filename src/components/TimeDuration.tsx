import { useTranslation, withTranslation, Trans } from 'react-i18next'

const TimeDuration = ({ ts }) => {
  const { t, i18n } = useTranslation()

  // 秒值
  const formatDuration = (duration: number) => {
    const seconds = Math.floor((duration % 60));
    const minutes = Math.floor((duration / 60) % 60);
    const hours = Math.floor((duration / 3600) % 24);
    const days = Math.floor(duration / 86400);

    const parts = [];
    if (days > 0) parts.push(t('formatTime.d', { days }));
    if (hours > 0) parts.push(t('formatTime.h', { hours }));
    if (minutes > 0) parts.push(t('formatTime.m', { minutes }));
    if (seconds > 0) parts.push(t('formatTime.s', { seconds }));

    return parts.join(' ') || t('formatTime.s', { seconds: 0 });
  }

  return formatDuration(ts)
}

export default TimeDuration