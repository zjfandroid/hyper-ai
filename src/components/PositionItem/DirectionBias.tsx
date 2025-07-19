import { useEffect, useState } from 'react'

import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { IShort, ILong } from '@/components/icon'

const PositionItemDirectionBias = ({ item, className = '' }) => {
  const { t, i18n } = useTranslation()

  const [state, setState] = useState({ content: '', className: '', icon: <></> })

  useEffect(() => {
    switch(item.directionBias) {
      case 'long':
        setState({ content: 'common.actLong', className: 'color-success', icon: <ILong className='zoom-75' /> })
        break
      case 'short':
        setState({ content: 'common.actShort', className: 'color-error', icon: <IShort className='zoom-75' /> })
        break
      case 'neutral':
      default:
        setState({ content: 'common.actNeutral', className: '', icon: <></> })
    }
  }, [item.directionBias])

  return (
    <span className={`d-flex gap-2 align-items-center ${className ?? ''} ${state.className}`}>
      { state.icon }
      {t(state.content)}
    </span>
  )
}

export default PositionItemDirectionBias