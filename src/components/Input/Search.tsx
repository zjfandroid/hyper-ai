import React, { forwardRef } from 'react';
import { Input, InputProps } from 'antd';
import { IOutlineSearchNormal1 } from '@/components/icon';

interface InputSearchProps extends Omit<InputProps, 'onChange'> {
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
  searchIcon?: React.ReactNode;
  searchIconClassName?: string;
  trim?: boolean;
}

const InputSearch = forwardRef<any, InputSearchProps>(({
  value,
  placeholder = '搜索',
  onChange,
  onSearch,
  className = '',
  readOnly = false,
  disabled = false,
  searchIcon,
  searchIconClassName = 'd-flex col bg-gray-3 m-1 br-2 px-3 py-2 linker',
  trim = true,
  ...rest
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(trim ? e.target.value.trim() : e.target.value);
    }
  };

  const handleSearch = () => {
    if (onSearch && !disabled && !readOnly) {
      onSearch();
    }
  };

  return (
    <div className={`d-flex position-relative ${className}`}>
      <Input 
        ref={ref}
        className='br-2' 
        value={value} 
        placeholder={placeholder}
        onChange={handleChange}
        onPressEnter={handleSearch}
        readOnly={readOnly}
        disabled={disabled}
        {...rest}
      />
      <div 
        className={`d-flex align-items-center color-primary position-absolute position-top-right h-100 ${disabled || readOnly ? 'opacity-50' : ''}`} 
        onClick={handleSearch}
      >
        <span className={searchIconClassName}>
          {searchIcon || <IOutlineSearchNormal1 className='w-20' />}
        </span>
      </div>
    </div>
  );
});

export default InputSearch;