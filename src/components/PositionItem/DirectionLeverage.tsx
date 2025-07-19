import { useTranslation, withTranslation, Trans } from 'react-i18next'

const PositionItemDirectionLeverage = ({ item }) => {
  const { t, i18n } = useTranslation()

  const buy = item.direction === 'long'
  const sell = item.direction === 'short'

  return (
    <span className='d-flex flex-wrap gap-1 align-items-center'>
      <span className={`text-capitalize px-1 br-1 fw-500 ${ buy && 'bg-success-1' || sell && 'bg-error-1' || ''}`}>
        { t(`common.${item.direction}`) }
      </span>
      { item.leverage && <span className="fw-500">{ item.leverage }x</span> }
    </span>
  )
}

export default PositionItemDirectionLeverage