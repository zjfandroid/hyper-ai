import React, { ReactNode, HTMLProps } from 'react'
import { Link } from "react-router-dom"
import { Button } from 'antd'

import {
  IOutlineArrowRight1
} from '@/components/icon'

interface ColumnTitleProps extends HTMLProps<HTMLDivElement> {
  title: string
  to?: string
}

const ColumnTitle: React.FC<ColumnTitleProps> = ({ title, to, ...rest }) => {
  return (
    <div { ...rest }>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-bold py-1">{ title }</h2>
      </div>
    </div>
  )
}

export default ColumnTitle

