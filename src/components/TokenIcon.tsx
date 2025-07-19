import { Spin } from 'antd'
import React, { ReactNode, HTMLProps } from 'react'

import { TAvatarSize } from '@/stores'
import ICyber from '@/assets/token/cyber.png'
import IEth from '@/assets/token/eth.png'
import IUsdt from '@/assets/token/usdt.png'
import IUsdc from '@/assets/token/usdc.png'
import IGem from '@/assets/token/gem.png'
import IBsc from '@/assets/token/bsc.png'
import ISnakePoints from '@/assets/token/snake-points.png'

import IChainArbitrum from '@/assets/token/chain/arbitrum.png'
import IChainBase from '@/assets/token/chain/base.png'
import IChainEthereum from '@/assets/token/chain/ethereum.png'
import IChainOptimism from '@/assets/token/chain/optimism.png'
import IChainCyber from '@/assets/token/chain/cyber.png'

type TId = string | number
interface TTokenProps extends Omit<HTMLProps<HTMLDivElement>, 'size' | 'id'> {
  id: TId
  size?: TAvatarSize
  className?: string
}

const CHAINS: Record<TId, any> = {
  1: IChainEthereum,
  11_155_111: IChainEthereum,
  7_560: IChainCyber,
  111_557_560: IChainCyber,
  10: IChainOptimism,
  11_155_420: IChainOptimism,
  42_161: IChainArbitrum,
  421_614: IChainArbitrum,
  8_453: IChainBase,
  84_532: IChainBase,
}

const ICONS: Record<TId, any> = {
  ...CHAINS,
  cyber: ICyber,
  eth: IEth,
  gem: IGem,
  bsc: IBsc,
  usdt: IUsdt,
  usdc: IUsdc,
  snakePoints: ISnakePoints,
}

const TokenIcon: React.FC<TTokenProps> = ({ id, size = 'md', className = '' }) => {
  return (
    <span className={`d-flex avatar flex-shrink-0 ${size} ${className}`}>
      <img src={ICONS[id]} alt='' />
    </span>
  )
}

export default TokenIcon