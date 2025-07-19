import React, { ReactNode, HTMLProps } from 'react'
import { Pagination } from 'antd'
import { Link } from "react-router-dom"

import Busy from '@/components/Busy'
import {
  IOutlineWarning2
} from '@/components/icon'
import ColumnNoData from '@/components/Column/NoData'

interface ColumnTableProps extends HTMLProps<HTMLDivElement> {
  labels: Array<{ id: string, label: string, class?: string }>
  busy?: boolean
  records: Array<Record<string, any>>
}

const ColumnTable: React.FC<ColumnTableProps> = ({ labels, busy, records, ...rest }) => {
  return (
    <dl className={`d-flex flex-column bg-gray-alpha-4 ${rest.className}`}>
      <dt className="d-flex color-secondary fw-500 px-3 py-2 gap-3">
        {
          labels.map((item, idx) => (<span key={idx} className={`d-flex align-items-center col ${ item.class }`}>{ item.label }</span>))
        }
      </dt>
      <dd>
        <Busy spinning={!!busy}>
          { records.length
              ? <>
                  <ul className="d-flex flex-column">
                    {
                      records.map((item, idx) => (
                        <li className={`d-flex align-items-center px-3 py-2 gap-3 ${!(idx % 2) ? 'bg-gray-alpha-3' : ''}`} key={idx}>
                          {
                            labels.map((_item, _idx) => (
                              <span className={`d-flex align-items-center col fw-500 ellipsis-line py-1 ${ _item.class }`} key={_idx}>
                                { item[_item.id] }
                              </span>
                            ))
                          }
                        </li>
                      ))
                    }
                  </ul>
                  {/* <div className="d-flex my-2 my-md-5 justify-content-center">
                    <Pagination size="small" show-less-items defaultCurrent={viewEarnInviteRecordStore.current} pageSize={viewEarnInviteRecordStore.size} total={viewEarnInviteRecordStore.total}
                      onChange={(page) => {
                        viewEarnInviteRecordStore.current = page
                        reqStore.userInvitations(accountStore, viewEarnInviteRecordStore)
                      }} />
                  </div> */}
                </>
              : <ColumnNoData />
          }
        </Busy>
      </dd>
    </dl>
  )
}

export default ColumnTable