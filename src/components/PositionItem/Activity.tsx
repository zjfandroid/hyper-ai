import BN from 'bignumber.js'
import { Progress } from 'antd'

import ColumnTooltip from '@/components/Column/Tooltip'

const PositionItemActivity = ({ value, className = '' }) => {
  // const color = new BN(item.marginUsedRatio).gte(100) ? '#FF9900' : '#29BDCC'
    // 定义颜色数组
  const colors = [
    'rgba(255, 153, 0, 0.2)', // 0-19
    'rgba(255, 153, 0, 0.4)', // 20-39
    'rgba(255, 153, 0, 0.4)', // 40-59
    'rgba(255, 153, 0, 0.7)', // 60-79
    'rgba(255, 153, 0, 0.7)',  // 80-99
    'rgba(255, 153, 0, 1)'  // 100%及以上
  ];
  const index = Math.min(Math.floor(value / 20), 5);

  return (
    <ColumnTooltip title={`${value} %`}>
      <Progress showInfo={false} percent={value} className='' steps={5} size={{ height: 8, width: 4 }} strokeColor={colors[index]} />
    </ColumnTooltip>
  )
}

export default PositionItemActivity