import { useTranslation, withTranslation, Trans } from 'react-i18next'

const PositionItemType = ({ item }) => {
  const { t, i18n } = useTranslation()

  return (
    <span className='d-flex flex-wrap gap-1 align-items-center'>
      <span className=''>
        { t(`type.${item.type}`) }
      </span>
    </span>
  )
}

export default PositionItemType