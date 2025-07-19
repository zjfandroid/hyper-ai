import { Tooltip } from "antd"
import type { TooltipPlacement } from "antd/es/tooltip"
import React, { ReactNode, HTMLProps } from 'react'

import { luminous } from '@/themes'

interface ColumnTooltipProps {
  children: ReactNode
  title: string | React.ReactNode
  placement?: TooltipPlacement
  className?: string
}

const ColumnTooltip = ({ children, title, placement, className }: ColumnTooltipProps) => {
  return (
    <Tooltip arrow={false} trigger={['click', 'hover']} className={className} placement={placement || 'top'} color={luminous.tooltipColor} title={title}>
      { children }
    </Tooltip>
  )
}

export default ColumnTooltip