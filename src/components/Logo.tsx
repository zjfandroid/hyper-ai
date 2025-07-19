import React, { ReactNode, useState, HTMLProps, useEffect } from 'react'
import { Link } from "react-router-dom"

import { constants } from '@/stores'
import ILogoStandardWhite from '@/assets/image/component/Logo/standard-white.svg?react'
import ILogoStandardWhitePng from '@/assets/image/component/Logo/standard-white.png'
import ILogoMarkWhite from '@/assets/image/component/Logo/mark-white.svg?react'
import ILogoMarkWhitePng from '@/assets/image/component/Logo/mark-white.png'

type SizeType = 'small' | 'middle' | 'large';
interface LogoProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  size?: SizeType
  mark?: boolean
}

const Logo: React.FC<LogoProps> = ({ size = 'middle', mark, className = '', ...rest }) => {
  const SIZES: Record<SizeType, { height: number }> = {
    small: { height: 32 },
    middle: { height: 40 },
    large: { height: 120 }
  }
  const norm = SIZES[size]

  return (
    <Link to='/' className={`d-flex align-items-center linker flex-shrink-0 ${className}`}>
      {
        mark
          ? <img src={ILogoMarkWhitePng} height={norm.height} />
          : <img src={ILogoStandardWhitePng} height={norm.height} />
      }
    </Link>
  );
}

export default Logo