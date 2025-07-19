import { formatNumber } from '@/utils'

const PositionItemSize = ({ item }) => {
  return (
    <span className='d-flex flex-column'>
      <span>
        {formatNumber(item.size) }
        <small className='color-unimportant ms-1'>{ item.coin }</small>
      </span>
    </span>
  )
}

export default PositionItemSize