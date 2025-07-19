import React, { ReactNode, HTMLProps } from 'react'
import BN from 'bignumber.js'
import { Button } from 'antd'

import { TMemeUnit, constants } from '@/stores'
import CardboxBase from './Base'
import {
  IOutlineArrowRight1
} from '@/components/icon'

interface CardboxMenuProps extends HTMLProps<HTMLDivElement> {
  items: Array<{ label: string, to?: string, href?: string}>
}

const CardboxMenu: React.FC<CardboxMenuProps> = ({ items, ...rest }) => {
  return (
    <div className={`d-flex flex-column bg-gray-alpha-4 col`}>
      <div className='d-flex flex-column'>
        {
          items.map((item, idx) => (
            <div key={idx} className='d-flex align-items-center justify-content-between ps-4 pe-3 py-3 hover-gray br-1'>
              <span className='fw-500 h5'>{ item.label }</span>
              <IOutlineArrowRight1 className="w-20 color-secondary" />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default CardboxMenu