import { useEffect } from "react"
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { addressShortener, formatNumber, merge } from '@/utils'
import { constants, useAccountStore, usePrivateWalletStore, useLeaderboardPointReferralStore, useLeaderboardPointOverallStore, useReqStore, useCopyTradingStore, useLeaderboardStore } from '@/stores'
import ColumnList from '@/components/Column/List'
import PositionItemAddress from '@/components/PositionItem/Address'
import Avatar from '@/components/Avatar'

import LeaderboardRankTopItem from './RankTopItem'

const LeaderboardPointsReferral = () => {
  const leaderboardStore = useLeaderboardStore()
  const reqStore = useReqStore()
  const accountStore = useAccountStore()
  const leaderboardPointReferralStore = useLeaderboardPointReferralStore()

  const { t, i18n } = useTranslation()

  const column = [
    { id: 'rank', label: t('common.rank'), className: 'col-3 col-sm-2 col-md-1' },
    { id: 'account', label: t('common.account'), className: 'col-5 col-sm-3 col-md-2 col-xl-2' },
    { id: 'totalInvited', label: t('leaderboard.totalInvited'), className: 'text-end justify-content-end col-4 col-md-3 col-xl-3' },
    { id: 'tier1', label: t('leaderboard.tier1'), className: 'justify-content-end d-none d-sm-flex col-sm-3 col-md-2 col-xl-2' },
    { id: 'tier2', label: t('leaderboard.tier2'), className: 'justify-content-end d-none d-md-flex col-sm-3 col-md-2 col-xl-2' },
    { id: 'tier3', label: t('leaderboard.tier3'), className: 'justify-content-end d-none d-md-flex col-sm-3 col-md-2 col-xl-2' },
  ]

  const renderColumn = (item, columnIndex) => {
    switch (column[columnIndex].id) {
      case 'rank':
        return item.rank
      case 'account':
        return (
          <span className='d-flex align-items-center gap-2 color-white'>
            {
              item.address
                ? <PositionItemAddress avatarSize={28} avatar item={item} />
                : <>
                    <Avatar href={item.avatar} name={item.tgLastName} size='smd' />
                    { item.tgUsername
                        ? <>@{item.tgUsername}</>
                        : item.tgFirstName || item.tgLastName
                    }
                  </>
            }
          </span>
        )
      case 'totalInvited':
        return <span className="color-white">{formatNumber(item.totalInvited)}</span>
      case 'tier1':
        return formatNumber(item.tier1)
      case 'tier2':
        return formatNumber(item.tier2)
      case 'tier3':
        return formatNumber(item.tier3)
      default:
        return null
    }
  }

  useEffect(() => {
    const asyncFunc = async () => {
      if (leaderboardStore.mainTypeValue === 'points' && leaderboardStore.pointsTabId === 'referral') {
        await reqStore.leaderboardPointReferralList(accountStore, leaderboardPointReferralStore)
      }
    }

    asyncFunc()

    return () => {
      leaderboardPointReferralStore.reset()
    }
  }, [leaderboardStore.mainTypeValue, leaderboardStore.pointsTabId, ])
  return (
    <>
      <div className="d-flex flex-wrap my-1">
        {
          leaderboardPointReferralStore.list.slice(0, 3).map((item, idx) => <LeaderboardRankTopItem key={idx} item={item} />)
        }
      </div>
      <ColumnList className="br-3"
        busy={reqStore.leaderboardPointReferralListBusy}
        columns={column}
        data={leaderboardPointReferralStore.list}
        pageCurrent={leaderboardPointReferralStore.current}
        pageSize={leaderboardPointReferralStore.size}
        onPageChange={page => {
          leaderboardPointReferralStore.current = page
          reqStore.leaderboardPointReferralList(accountStore, leaderboardPointReferralStore)
        }}
        renderItem={renderColumn} />
    </>
  )
}

export default LeaderboardPointsReferral