import React from 'react';
import { Button, Dropdown } from 'antd';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { IOutlineArrowUp1 } from '@/components/icon';

interface DropdownMenuItem {
  label: string;
  i18n?: string;
  value?: string;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[]
  selectedValue: string
  onSelect: (value: string) => void
  className?: string
  suffix?: string | React.ReactNode
  buttonSize?: 'small' | 'middle' | 'large'
  btnClassName?: string
  placement?: 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight'
  icon?: React.ReactNode // 添加图标支持
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  selectedValue,
  onSelect,
  suffix = '',
  className = '',
  buttonSize = 'middle',
  btnClassName = '',
  placement = 'bottomRight',
  icon
}) => {
  const selectedItem = items.find(item => item.value === selectedValue);
  const { t, i18n } = useTranslation()

  return (
    <div className={`d-flex bg-gray-alpha-4 br-2 ${className}`}>
      <Dropdown placement={placement}
        menu={{
          items: items.map((item) => ({ 
            key: item.value,
            label: (
              <div onClick={() => onSelect(item.value)}>
                { item.i18n ? t(item.i18n) : item.label}{suffix}
              </div>
            )
          })) 
        }}
      >
        <Button size={buttonSize} className='br-2 px-3 py-1 gap-2 fw-bold' type='text'>
          {icon && <span className="me-1">{icon}</span>}
          {selectedItem?.i18n ? t(selectedItem?.i18n) : selectedItem?.label}{suffix}
          <IOutlineArrowUp1 className='w-16 rotate-180 color-secondary ms-2' />
        </Button>
      </Dropdown>
    </div>
  );
};

export default DropdownMenu;