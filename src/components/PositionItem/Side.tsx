import { useEffect, useState } from 'react'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

interface PositionItemSideProps {
  item: {
    side: string
  }
  size?: 'small' | 'middle' | 'large'
}

const PositionItemSide: React.FC<PositionItemSideProps> = ({ item, size = 'middle' }) => {
  const [i18nText, setI18nText] = useState('unknown')
  const [sideClassName, setSideClassName] = useState('')
  const { t, i18n } = useTranslation()

  const SIZES_CLASSNAME = {
    'small': 'px-1',
    'middle': 'px-2 py-1',
    // XXX: 目前没需求
    'large': ''
  }

  useEffect(() => {
    switch(item.side) {
      case 'buy':
        setI18nText('buy')
        setSideClassName('bg-success-1')
        break
      case 'sell':
        setI18nText('sell')
        setSideClassName('bg-error-1')
        break
      default:
        setI18nText('unknown')
        setSideClassName('')
    }
  }, [item.side])

  return (
    <span className={`br-1 text-capitalize ${SIZES_CLASSNAME[size]} ${sideClassName}`}>
      {t(`common.${i18nText}`)}
    </span>
  )
}

export default PositionItemSide