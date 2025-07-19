import { addressShortener } from '@/utils'

const PositionItemTx = ({ item, hyper = false }) => {
  const prefix = hyper
    ? 'https://app.hyperliquid.xyz/explorer/tx/'
    : 'https://arbiscan.io/tx/'

  return (
    <a href={`${prefix}${item.tx}`} className='linker-hover-secondary' target="_blank" rel="noreferrer">
      {addressShortener(item.tx)}
    </a>
  )
}

export default PositionItemTx