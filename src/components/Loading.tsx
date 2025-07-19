import { Spin } from 'antd'
import React, { ReactNode, HTMLProps } from 'react'

import { ILoading } from '@/components/icon'
import './Loading.scss'

export type SizeType = 'small' | 'middle' | 'large' | undefined;

interface LoadingProps extends HTMLProps<HTMLDivElement> {
  loading?: boolean
}

const Loading: React.FC<LoadingProps> = ({ loading, ...rest }) => {
  return (
    <>
      {
        loading &&
          <div className='loading position-absolute position-full'>
          <ILoading className='loader zoom-300' />
        </div>
      }
    </>
  )
}

export default Loading