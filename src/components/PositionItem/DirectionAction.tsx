import { useTranslation, withTranslation, Trans } from 'react-i18next'

const PositionItemDirectionAction = ({ item }) => {
  const { t, i18n } = useTranslation()

  const buy = item.isPositionOpened && item.direction === 'long' || item.isPositionClosed && item.direction === 'short'
  const sell = item.isPositionOpened && item.direction === 'short' || item.isPositionClosed && item.direction === 'long'

  return (
    <span className={`px-1 br-1 text-capitalize ${ buy && 'bg-success-1' || sell && 'bg-error-1 ' || '' }`}>
      {/* { item.isPositionOpened ? 'Open' : 'Close' } { item.direction } */}
      {t(`common.${item.isPositionOpened ? (buy ? 'openLong' : 'openShort') : (buy ? 'closeLong' : 'closeShort')}`)}
    </span>
  )
}

export default PositionItemDirectionAction