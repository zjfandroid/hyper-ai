import BN from 'bignumber.js'

import { formatNumber } from '@/utils'

const PositionItemFees = ({ item, className = '' }) => {

  return (
    <span className={`d-flex flex-column justify-content-end ${ item.feesStatusClassname } ${className}`} >
      <span>$ {new BN(item.fees).gt(0) && '+'}{formatNumber(item.fees)}</span>
      { item.uPnlRatio && <small>{new BN(item.fees).gt(0) && '+'}{ item.feesStatus } %</small>}
    </span>
  )
}

export default PositionItemFees