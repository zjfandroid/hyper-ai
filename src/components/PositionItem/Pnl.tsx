import BN from 'bignumber.js'

import { formatNumber } from '@/utils'

const PositionItemPnl = ({ item, className = '' }) => {

  return (
    <span className={`d-flex flex-column justify-content-end ${ item.pnlStatusClassname } ${className}`} >
      <span>$ {new BN(item.pnl).gt(0) && '+'}{formatNumber(item.pnl)}</span>
      { item.uPnlRatio && <small>{new BN(item.pnl).gt(0) && '+'}{ item.pnlStatus } %</small>}
    </span>
  )
}

export default PositionItemPnl