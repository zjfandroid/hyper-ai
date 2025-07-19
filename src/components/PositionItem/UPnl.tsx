import BN from 'bignumber.js'

import { formatNumber } from '@/utils'

const PositionItemUPnl = ({ item }) => {
  
  return (
    <span className={`d-flex flex-column justify-content-end ${ item.uPnlStatusClassName }`} >
      <span>$ {new BN(item.uPnl).gt(0) && '+'}{formatNumber(item.uPnl)}</span>
      { item.uPnlRatio && <small>{new BN(item.uPnl).gt(0) && '+'}{ item.uPnlRatio } %</small>}
    </span>
  )
}

export default PositionItemUPnl