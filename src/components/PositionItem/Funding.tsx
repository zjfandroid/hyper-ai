import BN from 'bignumber.js'

import { formatNumber } from '@/utils'
import { formatStatusClassName, formatUPnlStatus } from '@/stores'

const PositionItemFunding = ({ item }) => {
  const fundingStatus = formatUPnlStatus(new BN(item.funding))
  const fundingStatusClassname = formatStatusClassName(fundingStatus)

  return (
    <span className={`d-flex flex-column justify-content-end ${ fundingStatusClassname }`} >
      $ {formatNumber(item.funding)}
    </span>
  )
}

export default PositionItemFunding