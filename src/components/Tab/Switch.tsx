import { Children, isValidElement, cloneElement, useEffect, useRef, useState } from 'react'
import { Button, Tooltip, Tabs, Progress, Dropdown } from 'antd'


import { IOutlineArrowUp1 } from '@/components/icon'
import { sleep } from '@/utils'
import useScroll from '@/components/helpers/useScroll'
import './Switch.scss'
import { t } from 'i18next'

interface TabSwitchProps {
  data: any[]
  currIdx?: number
  currId?: string
  labelSuffixes?: Array<string>
  className?: string
  listContent?: (item: any) => React.ReactNode
  listWrap?: boolean
  noMenu?: boolean
  tiling?: boolean
  onClick?: (item: any, idx: number) => void
  parentInfo?: () => { height: number }
}

const TabSwitch: React.FC<TabSwitchProps> = ({ data = [], labelSuffixes = [], currIdx = -1, currId = '', tiling = false, noMenu = false, className = '', listWrap = false, listContent, onClick = (item) => {}, parentInfo = () => ({ height: 0 }) }) => {
  const refTab = useRef(null)
  const refContainer = useRef<HTMLDivElement | null>()
  const refTabContent = useRef<HTMLDivElement | null>()
  const refListContent = useRef<HTMLUListElement | null>()
  const [placeholderHeight, setPlaceholderHeight] = useState(0)
  const [floatSwitch, setFloatSwitch] = useState(false)
  const [open, setOpen] = useState(false)
  const [multiTriggerLock, setMultiTriggerLock] = useState(false)
  const [parentTop, setParentTop] = useState(0)
  const elId = Date.now()

  const handleOpenSwitchNodeList = async (e, open: boolean = false) => {
    e.preventDefault()
    e.stopPropagation()

    if (multiTriggerLock) return

    setMultiTriggerLock(true)
    await sleep(100)

    setOpen(open)
    setMultiTriggerLock(false)
  }

  const handleClick = (item, idx, close = false) => {
    if (close) {
      setOpen(false)
    }
    !item.disabled && onClick(item, idx)
  }

  const handleScroll = () => {
    if (!refTab.current || !refContainer.current) return

    const rect = refTab.current.getBoundingClientRect()
    const top = parentInfo().height

    if (rect.top < top) {
      setParentTop(top)

      setPlaceholderHeight(refContainer.current.offsetHeight)

      setFloatSwitch(true)
    } else if (rect.top >= 0) {
      setParentTop(0)
      setFloatSwitch(false)
    }
  }

  useScroll((scrollY) => handleScroll())

  // init
  useEffect(() => {
    handleScroll()
  }, [])

  const dropdownRender = (menu) => (
    <ul ref={refListContent} className={`d-flex ${ listWrap ? 'flex-wrap' : 'flex-column' } bg-gray-3 p-2`}>
      {
        menu.props.items.map(({ label, key, disabled, id }, idx) => (
          <li key={`tab-switch-${elId}-${idx}-${key}`}
            onClick={() => {
              const child = refTabContent.current?.children[idx]

              child.scrollIntoView({ behavior: 'smooth' })

              handleClick(data[idx], idx, true)
            }}
            className={`d-flex fw-500 color-unimportant ${ floatSwitch ? 'px-3' : '' } ${(currIdx === idx || currId === id) ? 'curr' : '' } ${ disabled ? 'opacity-50 no-drop' : ''}`}>
            <span className='p-2 col ellipsis-line'>{ label }</span>
          </li>
        ))
      }
    </ul>
  )

  return (
    <div ref={refTab} className={`d-flex flex-column tabSwitch ${className}`}>
      <div ref={refContainer}
        className={`d-flex z-index-1 tabSwitchContainer ${ floatSwitch ? 'position-fixed px-3' : 'position-relative' }`}
        style={{ top: parentTop }}
        onMouseLeave={(e) => {handleOpenSwitchNodeList(e, false)}}>
        <Dropdown className='br-4' getPopupContainer={() => refContainer.current} placement='bottomRight' open={open}
          menu={{ items: data.map((item, idx) => ({
              label: listContent ? listContent(item) : <div onClick={() => handleClick(data[idx], idx, true) }>{ item.i18n ? t(item.i18n) : item.label }{ labelSuffixes[idx] ?? '' }</div>,
              key: item.id,
              disabled: !!item.disabled
            }))
          }}
          // dropdownRender={dropdownRender}
          >
          <div className='d-flex flex-column col-12'>
            {
              !!data.length &&
                <div className='d-flex col-12 justify-content-between'>
                  <div className={`d-flex tabSwitchSpace ${tiling ? 'col': ''}`} >
                    <div ref={refTabContent} className='d-flex align-items-center fw-bold col'>
                      {
                        data.map((item, idx) => (
                          <span className={`px-3 px-md-4 py-2 py-md-3 flex-shrink-0 color-unimportant text-center pointer ${tiling ? 'col': ''} ${currIdx === idx || currId === item.id ? 'curr' : '' } ${ item.disabled ? 'opacity-50 no-drop' : ''} ${ item.className}`}
                            key={`tab-node-${item.id}`}
                            onClick={() => {
                              if (refListContent.current) {
                                const child = refListContent.current.children[idx]
                                child.scrollIntoView({ behavior: 'smooth' })
                              }

                              handleClick(item, idx, true)
                            }}>
                            { item.i18n ? t(item.i18n) : (item.label || item.name) }
                            { labelSuffixes[idx] ?? '' }
                          </span>
                        ))
                      }
                    </div>
                  </div>
                  {
                    !noMenu &&
                      <div className={`d-flex align-items-center ps-2`}>
                        <div className={`d-flex align-items-center justify-content-center hover-gray br-2 w-32 ${open ? 'hover' : ''}`}
                          // onMouseEnter={(e) => handleOpenSwitchNodeList(e, true)}
                          // onBlur={(e) => handleOpenSwitchNodeList(e, false)}
                          onClick={(e) => handleOpenSwitchNodeList(e, !open)}
                          >
                          <IOutlineArrowUp1 className={`color-primary zoom-80 linker ${open ? '' : 'rotate-180'}`} />
                        </div>
                      </div>
                  }
                </div>
            }
          </div>
        </Dropdown>
      </div>
      {
        floatSwitch &&
          <div style={{ height: `${placeholderHeight}px` }}></div>
      }
    </div>
  )
}

export default TabSwitch