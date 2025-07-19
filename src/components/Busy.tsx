import { Spin } from 'antd'
import React, { ReactNode, HTMLProps } from 'react'

import { ILoading } from '@/components/icon'
import './Busy.scss'

export type SizeType = 'small' | 'middle' | 'large' | undefined;

interface BusyProps extends HTMLProps<HTMLDivElement> {
  spinning?: boolean
  size?: SizeType
  children: ReactNode
  wrapperClassName?: string
}

const Busy: React.FC<BusyProps> = ({ spinning, children, size = 'middle', wrapperClassName = '', ...rest }) => {
  const sizeClass = {
    small: 'zoom-70',
    middle: '',
    large: 'zoom-130'
  }
  return (
    <Spin spinning={!!spinning} wrapperClassName={wrapperClassName} indicator={<ILoading />} >
      { children }
    </Spin>
  )
}

export default Busy