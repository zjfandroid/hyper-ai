import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Pagination, Button } from 'antd'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { IOutlineSort, IFilter, IFilterFill } from '@/components/icon'
import { isNumber, isString } from '@/utils'
import Loading from '@/components/Loading'
import ColumnNoData from '@/components/Column/NoData'

import './List.scss'

interface ColumnItem {
  id: string
  label: string
  className?: string
  sort?: boolean
  sortByKey?: string // 与 sort 对应，排序时所对应的 item 内的 key
  filter?: string // 过滤值
  cycle?: boolean // 是否显示周期
}

interface ColumnListProps {
  columns: ColumnItem[]
  className?: string
  style?: Record<string, string>
  data: any[]
  busy?: boolean
  noMoreNote?: string | React.ReactNode
  cycleLabel?: string
  sortColumnId?: string
  height?: number | string
  logged?: boolean
  // FIX: 只设置maxHeight时，无法出现滚动条
  maxHeight?: number
  filterCoin?: string // 过滤的 coin
  pageCurrent?: number | undefined // 有值时，显示页码，起始是1
  pageSize?: number
  onlyDesc?: boolean
  headClassName?: string
  rowClassName?: string
  noDataSize?: "small" | "middle" | "large" | undefined
  onPageChange?: (page: number) => void
  onChangeSort?: (columnId: string, sortByKey: string, ascending: boolean) => Promise<void> | void
  renderItem: (item: any, columnIndex: number, column: ColumnItem) => ReactNode
  onRowClick?: (item: any) => void
}

const ColumnList: React.FC<ColumnListProps> = ({
  columns,
  data,
  sortColumnId,
  height,
  onRowClick = null,
  headClassName = 'ps-3 pe-3 py-3',
  rowClassName = 'ps-3 pe-3 py-3',
  filterCoin = '',
  onlyDesc = false,
  logged = false,
  pageCurrent = undefined,
  pageSize = 10,
  onPageChange = (pageNumber) => {},
  style = {},
  onChangeSort = (columnId) => {},
  cycleLabel = '',
  maxHeight,
  className = '',
  busy = false,
  noMoreNote = '',
  noDataSize = 'middle',
  renderItem }) => {
  const [ascendings, setAscendings] = React.useState(Array(columns.length).fill(false))
  const { t, i18n } = useTranslation()
  const refDT = useRef(null)
  const refUL = useRef(null)
  const refContents = useRef<Array<any>>([])
  const [list, setList] = useState([])
  const [switchFilterCoin, setSwitchFilterCoin] = useState(!filterCoin)

  const handleClickSort = async (item, idx) => {
    setAscendings(prev => {
      const newAscending = [...prev];

      // NOTE: 当前的 sortColumnId 会排序变更，触发非当前 sortColumnId 时则不会先切换排序变更
      if (sortColumnId === item.id && !onlyDesc) {
        newAscending[idx] = !newAscending[idx]
      }
      onChangeSort(item.id, item.sortByKey, newAscending[idx])

      return newAscending
    })
  }

  const handleSyncScroll = (sourceRef, targetRef) => {
    if (targetRef.current) {
      targetRef.current.scrollLeft = sourceRef.current.scrollLeft;
    }
  };

  const handleSwitchFilterCoin = (_switchFilterCoin) => {
    setList((filterCoin && _switchFilterCoin) ? data.filter(item => item.coin === filterCoin) : data)
  }

  // const handleScroll = (index, scrollLeft) => {
  //   refContents.current.forEach((ref, i) => {
  //     if (i !== index && ref) {
  //       ref.scrollLeft = scrollLeft
  //     }
  //   })
  //   if (refDT.current) {
  //     refDT.current.scrollLeft = scrollLeft
  //   }
  // }

  // 处理数据
  useEffect(() => {
    handleSwitchFilterCoin(switchFilterCoin)
  }, [data])

  return (
    <dl className={`d-flex flex-column bg-gray-alpha-4 overflow-hidden column-list position-relative ${className}`} style={{ height: isNumber(height) && `${height}px` || isString(height) && height || undefined, maxHeight: maxHeight ? `${maxHeight}px` : undefined, ...style }}>
      <dt ref={refDT} className={`d-flex bg-gray-alpha-4 align-items-center fw-500 overflow-x-auto ${headClassName}`}>
        {
          columns.map((item, idx) => (
            <small key={idx} className={`d-flex align-items-center gap-1 color-unimportant ${item.className ?? ''} ${(item.sort || item.filter) ? 'linker' : ''} ${ sortColumnId === item.id ? 'color-white fw-bold' : '' }`}
              onClick={() => {
                if (item.sort) {
                  handleClickSort(item, idx)
                }
                if (item.filter) {
                  setSwitchFilterCoin(prev => {
                    const result = !prev
                    handleSwitchFilterCoin(result)
                    return result
                  })
                }
              }}>
              {item.label}
              { item.cycle ? ` (${cycleLabel})` : '' }
              { item.sort && <IOutlineSort className={`w-16 ${ ascendings[idx] ? 'rotate-180' : '' }`} /> }
              { item.filter && (switchFilterCoin ? <IFilterFill className='w-16' /> : <IFilter className='w-16' />)}
            </small>
          ))
        }
      </dt>
      <dd className='d-flex flex-column col overflow-y-auto'>
        {
          list.length
            ? <>
                <ul ref={refUL} onScroll={() => handleSyncScroll(refUL, refDT)} className={`d-flex flex-column col overflow-x-auto`}>
                  {
                    (pageCurrent ? list.slice(0, pageCurrent * pageSize) : list).map((item, idx) => (
                      <li key={idx} className={`d-flex align-items-center position-relative ${rowClassName} ${ onRowClick ? 'linker' : ''}`} onClick={() => onRowClick && onRowClick(item)}>
                        {
                          columns.map((column, columnIndex) => (
                            <span key={columnIndex} className={`d-flex align-items-center fw-500 color-secondary line-feed ${column.className}`}>
                              {renderItem(item, columnIndex, column)}
                            </span>
                            // {/* <span key={columnIndex}
                            //   className={`d-flex align-items-center py-3 fw-500 color-secondary line-feed ${column.className} ${columnIndex === 0 ? 'z-index-1 position-tb ps-3 position-absolute bg-gray-5' : ''}`}
                            //   >
                            //   {renderItem(item, columnIndex, column)}
                            // </span>
                            // { columnIndex === 0 && <span className={`ps-3 ${column.className} `}></span>} */}
                          ))
                        }
                      </li>
                    ))
                  }
                </ul>
                {
                  pageCurrent &&
                    <div className='d-flex flex-column justify-content-center'>
                      {
                        pageCurrent * pageSize > list.length
                          ? <small className='color-unimportant text-center py-2 my-1'>
                              {t('common.noMoreResults')}
                              {noMoreNote && <small className='color-unimportant'>{noMoreNote}</small>}
                            </small>
                          : <Button type='text' className='px-5' size='small' onClick={() => onPageChange(pageCurrent+1)}><span className='color-secondary'>{t('common.loadMore')}</span></Button>
                      }
                    </div>
                }
              </>
            : <ColumnNoData size={noDataSize} logged={logged} />
        }
      </dd>
      <Loading loading={busy} />
    </dl>
  )
}

export default ColumnList