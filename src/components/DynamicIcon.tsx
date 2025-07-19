import { Spin } from 'antd'
import React, { ReactNode, HTMLProps, useState } from 'react'

import ICoinTON from '@/assets/image/coin/ton.png'
import ICoinUSDT from '@/assets/image/coin/usdt.png'
import IWalletOKX from '@/assets/image/common/wallet/okx.png'
import IWalletTON from '@/assets/image/common/wallet/ton.png'

interface DynamicIconProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  icon?: ReactNode
  name?: string
  size?: 'sm' | undefined
  overlayClassName?: string
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ icon = <></>, name = '', size = 'middle', overlayClassName = '', className = '', ...rest }) => {
  const ICON_NAMES = {
    TON: ICoinTON,
    USDT: ICoinUSDT,
    WALLET_OKX: IWalletOKX,
    WALLET_TON: IWalletTON
  }

  return (
    <div className={`d-flex avatar flex-shrink-0 color-black align-items-center justify-content-center ${size} ${className}`} { ...rest }>
      {
        ICON_NAMES[name]
          ? <img src={ICON_NAMES[name]} />
          : icon
      }
    </div>
  )
}

export default DynamicIcon