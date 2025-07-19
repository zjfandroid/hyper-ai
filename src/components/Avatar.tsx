import React, { HTMLProps } from 'react'

import Busy from '@/components/Busy'
import IDefaultAvatar from '@/assets/image/component/Avatar/default.png'

import './Avatar.scss'

interface AvatarProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  href?: string
  name?: string
  busy?: boolean
  size?: 'sm' | 'smd' | 'md' | 'lg' | 'xlg' | 'xxlg'
  overlayClassName?: string
}

interface SizeConfig {
  class: string
  len?: number
  style?: React.CSSProperties
}

const SIZES: Record<string, SizeConfig> = {
  sm: { class: 'sm', len: 0 },
  smd: { class: 'smd h6', len: 1 },
  md: { class: 'md h5', len: 1 },
  lg: { class: 'lg h5', len: 2 },
  xlg: { class: 'xlg h1', len: 2 },
  xxlg: { class: 'xxlg', style: { fontSize: '56px' }, len: 2 }
}

const Avatar: React.FC<AvatarProps> = ({
  href = '',
  name = '',
  busy = false,
  size = 'md',
  overlayClassName = '',
  className = '',
  ...rest
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = IDefaultAvatar;
    e.currentTarget.classList.add('bg-gray-4');
  };

  const sizeConfig = SIZES[size] || SIZES.md;

  return (
    <Busy spinning={busy}>
      <div className={`d-flex avatar flex-shrink-0 color-black fw-500 ${sizeConfig.class} ${className}`} {...rest}>
        {
          href
            ? <div className={`avatar-default img-full ${overlayClassName}`}>
                <img className={`full`} src={href} onError={handleImageError} alt={name} />
              </div>
            : name
              ? <span className='d-flex justify-content-center align-items-center bg-primary full' style={sizeConfig.style}>
                  {name.slice(0, sizeConfig.len || 1).toLocaleUpperCase()}
                </span>
              : <img className={`full bg-gray-4 ${overlayClassName}`} src={IDefaultAvatar} alt="default avatar" />
        }
      </div>
    </Busy>
  )
}

export default Avatar