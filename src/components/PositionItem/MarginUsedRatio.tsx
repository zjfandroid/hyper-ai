import BN from 'bignumber.js'
import { Progress } from 'antd';

const PositionItemMarginUsedRatio = ({ item, wrap = false, className = '' }) => {
  const color = new BN(item.marginUsedRatio).gte(100) ? '#FF9900' : '#29BDCC'

  return (
    <span className={`d-flex gap-1 ${ wrap ? 'flex-wrap align-items-center' : 'flex-column justify-content-center'} ${className}`}>
      <Progress showInfo={false} percent={item.marginUsedRatio} className='br-4 overflow-hidden mt-1' steps={5} size={{ height: 4, width: 10 }} strokeColor={color} />
      {item.marginUsedRatio} %
    </span>
  )
}

export default PositionItemMarginUsedRatio