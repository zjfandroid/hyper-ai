import { useEffect, useRef, useState } from 'react'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import useScroll from '@/components/helpers/useScroll'
import './Base.scss'

interface TabBaseProps {
    data: Array<{ id: number | string, label: string, disabled?: boolean, className?: string }> // 可以根据需要定义具体类型
    curr?: number | string
    onClick?: (id: number | string) => void
    info?: (params: { height: number }) => void
}

const TabBase: React.FC<TabBaseProps> = ({ data = [], curr = 0, onClick = (id) => {}, info = ({ height }) => {} }) => {
  const refTab = useRef(null)
  const refContainer = useRef<HTMLDivElement | null>()
  const [placeholderHeight, setPlaceholderHeight] = useState(0)
  const [floatSwitch, setFloatSwitch] = useState(false)
  const { t, i18n } = useTranslation()

  useScroll((scrollY) => {
    if (!refTab.current || !refContainer.current) return

    const rect = refTab.current.getBoundingClientRect()

    if (rect.top < 0) {
      const refContainerHeight = refContainer.current.offsetHeight + 2

      setPlaceholderHeight(refContainerHeight)
      info({ height: refContainerHeight })

      setFloatSwitch(true)
    } else if (rect.top >= 0) {
      setFloatSwitch(false)
    }
  })

  useEffect(() => {
    if (!refContainer.current) return

    info({ height: refContainer.current.offsetHeight})
  }, [refContainer.current])

  return (
    <div ref={refTab} className="d-flex tabBase col-12">
      <div ref={refContainer} className={`d-flex align-items-center col z-index-1 ${ floatSwitch ? 'position-fixed px-3' : 'position-relative' }`}>
        {
          data.map(item => (
            <span key={`tab-${item.id}`} className={`py-2 py-md-3 px-3 px-md-4 fw-bold  flex-shrink-0 color-unimportant text-center pointer ${item.id === curr ? 'curr' : '' } ${ item.disabled ? 'opacity-50 no-drop' : ''} ${ item.className}`}  onClick={() => !item.disabled && onClick(item.id)}>
              { item.i18n ? t(item.i18n) : item.label }
            </span>
          ))
        }
      </div>
      {
        floatSwitch &&
          <div style={{ height: `${placeholderHeight}px` }}></div>
      }
    </div>
  )
}

export default TabBase