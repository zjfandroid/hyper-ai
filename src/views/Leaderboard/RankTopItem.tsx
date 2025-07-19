import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { addressShortener, formatNumber, merge } from '@/utils'
import Avatar from '@/components/Avatar'
import AddressAvatar from '@/components/AddressAvatar'

import IRankLevel1 from '@/assets/image/rank/Level=1.png'
import IRankLevel2 from '@/assets/image/rank/Level=2.png'
import IRankLevel3 from '@/assets/image/rank/Level=3.png'
import './RankTopItem.scss'

const LeaderboardRankTopItem = ({ item }) => {
  const { t, i18n } = useTranslation()

  return (
    <div className="d-flex col-12 col-md-4 position-relative leaderboard-rank-top-item">
      <div className="d-flex align-items-center gap-4 m-1 br-2 p-3 bg-silver1 bg-gray-alpha-4 col">
        <div className='d-flex align-items-center position-relative ms-2'>
          { item.address
              ? <AddressAvatar size={72} address={item.address} />
              : <Avatar href={item.avatar} name={item.tgLastName} size='xlg' />
          }
          <img src={item.rank === 1 && IRankLevel1 || item.rank === 2 && IRankLevel2 || IRankLevel3} className='position-absolute opacity-80' style={{ marginLeft: '-8px' }} />
        </div>
        <div className="d-flex flex-column">
          <span className="h5 fw-bold">
            { item.address
                ? addressShortener(item.address)
                : <>@{item.tgUsername}</> }
          </span>
          <div className="d-flex mt-2 gap-2 col-4 col-12">
            <span className="color-unimportant pb-1">{t('leaderboard.totalPoints')}</span>
            <span className="color-white h6 fw-500">{formatNumber(item.totalPoints)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardRankTopItem