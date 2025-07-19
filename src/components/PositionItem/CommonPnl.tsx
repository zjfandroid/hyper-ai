import BN from 'bignumber.js'
import React, { ReactNode, HTMLProps } from 'react'

import { formatNumber } from '@/utils'
import { formatUPnlStatus, formatStatusClassName } from '@/stores'


interface PositionItemCommonPnlProps extends Omit<HTMLProps<HTMLDivElement>, 'prefix'> {
  value: number | string
  statusValue?: number | string
  prefix?: string | ReactNode
  suffix?: string | ReactNode
  className?: string
}

// 用于单纯显示需要盈亏表现的值
const PositionItemCommonPnl: React.FC<PositionItemCommonPnlProps> = ({ value, statusValue = undefined, prefix = '$ ', suffix = '', className = '', ...rest }) => {
  const status = formatUPnlStatus(new BN(statusValue ?? value))
  const statusClassName = formatStatusClassName(status)

  return (
    <span className={`d-flex flex-column justify-content-end ${ statusClassName } ${className}`} >
      {prefix}{formatNumber(value ?? '-')}{suffix}
    </span>
  )
}

export default PositionItemCommonPnl