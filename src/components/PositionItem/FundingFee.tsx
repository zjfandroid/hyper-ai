import BN from 'bignumber.js'

import { formatNumber } from '@/utils'

const PositionItemFundingFee = ({ item }) => {

  return (
    <span className={`d-flex flex-wrap justify-content-end ${ item.fundingFeeStatusClassName }`} >
      <span>$ {item.fundingFeeStatus > 0 && '+'}{formatNumber(item.fundingFee)}</span>
    </span>
  )
}

export default PositionItemFundingFee