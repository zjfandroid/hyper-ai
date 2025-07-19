import { useChainId } from 'wagmi'

import TokenIcon from '@/components/TokenIcon'
import { TAvatarSize } from '@/stores'

// 自动显示当前链
const WalletChainIcon = ({ id, size }: { id?: number, size: TAvatarSize } ) => {
  const chainId = useChainId()

  return <TokenIcon id={id || chainId} size={size} />
}

export default WalletChainIcon