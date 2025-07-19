import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber } from '@/utils'
import ColumnNoData from '@/components/Column/NoData'
import PositionItemPositionValue from '@/components/PositionItem/PositionValue'
import Busy from '@/components/Busy'
import PositionItemUPnl from '@/components/PositionItem/UPnl'
import PositionItemDirectionLeverage from '@/components/PositionItem/DirectionLeverage'


const TrackingAddressPositionContent = ({ list }) => {
  const { t, i18n } = useTranslation()

  return list.length
    ? <ul className='d-flex flex-wrap px-2 py-1'>
        {
          list.map((position, idx) =>
            <li key={idx} className='col-12 col-sm-6 col-lg-4 br-2 '>
              <div className='d-flex flex-wrap p-3 br-2 highlight'>
                <div className='d-flex align-items-center gap-2 col-12'>
                  <span className='fw-bold'>{position.coin}</span>
                  <span className='color-secondary'>$ {position.openPrice}</span>
                  <PositionItemDirectionLeverage item={position} />
                </div>
                {
                  [
                    // { label: 'Opening Price', content: <>$ {position.openPrice}</> },
                    // { label: 'Mark Price', content: <>$ {position.markPrice}</> },
                    { label: t('common.positionValue'), content: <PositionItemPositionValue item={position} /> },
                    { label: t('common.uPnl'), content: <PositionItemUPnl item={position} /> },
                    { label: t('common.margin'), content: <>$ {formatNumber(position.marginUsed)}</> },
                  ].map((item, idx) => 
                    <div key={idx} className='d-flex flex-column col-4 mt-2 pt-1'>
                      <small className='color-unimportant pb-1'>{ item.label }</small>
                      <span className='color-secondary'>{ item.content }</span>
                    </div>
                  )
                }
              </div>
            </li>
          )
        }
      </ul>
    : <ColumnNoData message='No Positions' className='p-0' />
 
}

export default TrackingAddressPositionContent