import { formatNumber } from '@/utils'

const PositionItemPositionValue = ({ item }) => {
  return (
    <span className='d-flex flex-column'>
      <span className='color-white'>$ {formatNumber(item.positionValue) }</span>
      <small>{ formatNumber(item.size) } { item.coin }</small>
    </span>
  )
}

export default PositionItemPositionValue