import BN from 'bignumber.js'

import { constants } from '@/stores'
import MUIBasePieChart from '@/components/MUI/BasePieChart'

const VizPnlFeesPieChart = ({ item, size = 'middle' }) => {

  return (
    <MUIBasePieChart size={size} data={[
        ...(
          +item.fees < 0
          ? [{ value: Math.abs(item.fees), color: '#78090960', label: 'Fees Paid' }]
          : [{ value: item.fees, color: '#03741b60', label: 'Fees Credit' }]
        ),
        ...(
          +item.netPnL < 0
            ? [{ value: Math.abs(item.netPnL), color: '#78090960', label: 'Net Loss' }]
            : [{ value: item.netPnL, color: '#03741b', label: 'Net Profit' }]
        )
      ]} />
  )
}

export default VizPnlFeesPieChart