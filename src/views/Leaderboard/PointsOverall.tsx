import { useEffect } from "react"
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { addressShortener, formatNumber, merge } from '@/utils'
import { IOutlineMedal } from '@/components/icon'
import { constants, useAccountStore, usePrivateWalletStore, useLeaderboardPointReferralStore, useLeaderboardPointOverallStore, useReqStore, useCopyTradingStore, useLeaderboardStore } from '@/stores'
import ColumnList from '@/components/Column/List'
import PositionItemAddress from '@/components/PositionItem/Address'
import Avatar from '@/components/Avatar'

import LeaderboardRankTopItem from './RankTopItem'

const LeaderboardPointsOverall = () => {
  const leaderboardStore = useLeaderboardStore()
  const reqStore = useReqStore()
  const accountStore = useAccountStore()
  const leaderboardPointOverallStore = useLeaderboardPointOverallStore()

  const { t, i18n } = useTranslation()

  const pointOverallColumn = [
    { id: 'rank', label: t('common.rank'), className: 'col-3 col-sm-2 col-md-1' },
    { id: 'account', label: t('common.account'), className: 'col-5 col-sm-3 col-md-2 col-xl-2' },
    { id: 'totalPoints', label: t('leaderboard.totalPoints'), className: 'text-end justify-content-end col-4 col-md-3 col-xl-3' },
    { id: 'refEarnings', label: t('leaderboard.refEarnings'), className: 'justify-content-end d-none d-sm-flex col-sm-3 col-md-2 col-xl-2' },
    { id: 'txnEarnings', label: t('leaderboard.txnEarnings'), className: 'justify-content-end d-none d-md-flex col-sm-3 col-md-2 col-xl-2' },
    { id: 'taskEarnings', label: t('leaderboard.taskEarnings'), className: 'justify-content-end d-none d-md-flex col-sm-3 col-md-2 col-xl-2' },
  ]

  const renderPointOverallColumn = (item, columnIndex) => {
    switch (pointOverallColumn[columnIndex].id) {
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
      case 'totalPoints':
        return <span className="color-white">{formatNumber(item.totalPoints)}</span>
      case 'refEarnings':
        return formatNumber(item.refEarnings)
      case 'txnEarnings':
        return formatNumber(item.txnEarnings)
      case 'taskEarnings':
        return formatNumber(item.taskEarnings)
      default:
        return null
    }
  }

  useEffect(() => {
    const asyncFunc = async () => {
      if (leaderboardStore.mainTypeValue === 'points') {
        switch(leaderboardStore.pointsTabId) {
          case 'overall':
            await reqStore.leaderboardPointOverallList(accountStore, leaderboardPointOverallStore)
            break
          default:
        }
      }
    }

    asyncFunc()

    return () => {
      leaderboardPointOverallStore.reset()
    }
  }, [leaderboardStore.mainTypeValue, leaderboardStore.pointsTabId, ])
  return (
    <>
      <div className="d-flex flex-wrap my-1">
        {
          leaderboardPointOverallStore.list.slice(0, 3).map((item, idx) => <LeaderboardRankTopItem key={idx} item={item} />)
        }
      </div>
      <ColumnList className="br-3"
        busy={reqStore.leaderboardPointOverallListBusy}
        columns={pointOverallColumn}
        data={leaderboardPointOverallStore.list}
        pageCurrent={leaderboardPointOverallStore.current}
        pageSize={leaderboardPointOverallStore.size}
        onPageChange={page => {
          leaderboardPointOverallStore.current = page
          reqStore.leaderboardPointOverallList(accountStore, leaderboardPointOverallStore)
        }}
        renderItem={renderPointOverallColumn} />
    </>
  )
}

export default LeaderboardPointsOverall