import React, { useState, useEffect } from 'react';

import ColumnTooltip from '@/components/Column/Tooltip';

import ButtonIcon from '@/components/ButtonIcon'

// XXX: 这个组件在click 触发时会报错，暂时不使用

interface ToolbarIconButtonProps {
  icon: React.ReactNode
  title?: string
  logged?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}

const ToolbarIconButton: React.FC<ToolbarIconButtonProps> = ({ icon, logged = false, title = '', disabled = false, onClick = () => null }) => {
  return (
    <ColumnTooltip title={title}>
      <ButtonIcon disabled={disabled} logged icon={icon} onClick={onClick} />
    </ColumnTooltip>
  );
}

export default ToolbarIconButton;