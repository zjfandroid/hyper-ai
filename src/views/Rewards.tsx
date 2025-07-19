import { useEffect, useState } from "react"
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { useLocation, useMatches, Link } from "react-router-dom"
import { Button, Pagination, message, Progress } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import BN from 'bignumber.js'

import { formatNumber } from '@/utils'
import { IOutlineExport2 } from '@/components/icon'
import { constants, useReqStore, useRewardDetailedListStore, useAccountStore, useRewardStore } from "@/stores"
import DropdownMenu from '@/components/Dropdown/Menu'
import ColumnList from '@/components/Column/List'
import TimeAgo from '@/components/TimeAgo'
import Busy from '@/components/Busy'
import Avatar from '@/components/Avatar'
import ButtonIcon from '@/components/ButtonIcon'
import ColumnNoData from "@/components/Column/NoData"
import ModalReferralFriends from '@/components/Modal/ReferralFriends'

import IHomeBrainTriple4 from '@/assets/image/view/Home/brain/triple-4.png'
import IHomeBrainTriple4ZhHans from '@/assets/image/view/Home/brain/triple-4-zh-Hans.png'
import IHomeBrainTriple4ZhHant from '@/assets/image/view/Home/brain/triple-4-zh-Hant.png'

const Rewards = () => {
  const reqStore = useReqStore()
  const rewardDetailedListStore = useRewardDetailedListStore()
  const accountStore = useAccountStore()
  const rewardStore = useRewardStore()
  const { t, i18n } = useTranslation()
  const [copied, setCopied] = useState(false);

  const handleRewardsDetailedList = async (next: boolean = false) => {
    if (next) {
      rewardDetailedListStore.next()
    } else {
      // reset
      rewardDetailedListStore.reset()
    }

    await reqStore.rewardDetailedList(accountStore, rewardDetailedListStore)
  }

  const taskColumn = [
    { id: 'label', label: t('rewards.taskDetails'), className: 'col' },
    { id: 'point', label: t('rewards.points'), className: 'justify-content-end text-end d-none d-sm-flex  col-4 col-sm-3' },
    { id: 'status', label: t('common.status'), className: 'justify-content-end text-end col-5 col-md-5 col-lg-4' },
  ]

  const referralRecordsList = [
    { id: 'username', label: t('common.username'), className: 'col' },
    { id: 'status', label: t('common.status'), className: 'justify-content-end text-end col-4 col-sm-2' },
    { id: 'reward', label: t('rewards.reward'), className: 'justify-content-end text-end d-none d-sm-flex col-sm-3 col-md-3' },
    { id: 'time', label: t('common.time'), className: 'justify-content-end text-end d-none d-sm-flex col-sm-3 col-md-2' },
  ]

  const rewardsList = [
    { id: 'event', label: t('rewards.event'), className: 'col' },
    { id: 'reward', label: t('rewards.reward'), className: 'justify-content-end text-end col-4' },
    { id: 'time', label: t('common.time'), className: 'justify-content-end text-end d-none d-sm-flex col-sm-3 col-md-4' },
  ]

  const renderTask = (item, columnIndex: number) => {
    switch (taskColumn[columnIndex].id) {
      case 'label':
        return item.label
      case 'point':
        return <>+{item.point} {t('rewards.points')}</>
      case 'status':
        return (
          <>
            {
              item.invite &&
                <Button onClick={() => rewardStore.openReferralFriends = true} size='small' type='primary' ghost className='br-4 px-4' disabled={item.status}>
                  {t(item.status ? 'common.completed' : 'common.goCompleted')}
                </Button>
            }
            {
              item.href &&
                <Button href={item.href || ''} target='_blank' size='small' type='primary' ghost className='br-4 px-4' disabled={item.status}>
                  {t(item.status ? 'common.completed' : 'common.goCompleted')}
                </Button>
            }
            {
              item.to &&
                <Link to={item.to}>
                  <Button size='small' type='primary' ghost className='br-4 px-4' disabled={item.status}>
                    {t(item.status ? 'common.completed' : 'common.goCompleted')}
                  </Button>
                </Link>
            }
          </>
        )
      default:
        return null
    }
  }

  const renderReferralRecordsListItem = (item, columnIndex: number) => {
    switch (referralRecordsList[columnIndex].id) {
      case 'username':
        return <>@{item.username}</>
      case 'status':
        return t(`rewards.tier${item.status}`)
      case 'reward':
        return <>+ {formatNumber(item.amount)} {t('rewards.points')}</>
      case 'time':
        return <TimeAgo ts={item.createTs} />
      default:
        return null
    }
  }

  const renderRewardsListItem = (item, columnIndex: number) => {
    switch (rewardsList[columnIndex].id) {
      case 'event':
        return t(rewardDetailedListStore.SOURCE_ID_KEYS[item.sourceId]?.i18n || item.sourceId)
      case 'reward':
        return formatNumber(item.amount)
      case 'time':
        return <TimeAgo ts={item.createTs} />
      default:
        return null
    }
  }

  const handleReset = () => {
    rewardDetailedListStore.reset()
    rewardStore.reset()
  }

  const handleCopyReferralLink = () => {
    message.success(t('message.referralLinkCopied'));
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      await reqStore.rewardUserLv(accountStore, rewardStore)
      await reqStore.rewardUserInfo(accountStore, rewardStore)
      await handleRewardsDetailedList()
    }

    if (!accountStore.logged) {
      handleReset()
      return
    }

    asyncFunc()

    return () => {
      handleReset()
    }
  }, [accountStore.logged])

  return (
    <>
      <div className="container-fluid px-0 d-flex flex-column my-5 pt-5 rewards">
        <div className="container-xl d-flex flex-column px-3 px-md-4 gap-3 gap-md-4 mb-3 mb-md-5 py-0">

          <div className="d-flex flex-column gap-4">
            <div className='d-flex flex-wrap justify-content-center justify-content-md-start my-5 py-5'>
              <div className='d-flex flex-column gap-5 col-12 col-md-7'>
                <div className="d-flex flex-column text-center text-md-start gap-4">
                  <h2 className='fw-bold'>{t('rewards.headline')}</h2>
                  <span className='h5 color-secondary col-12 col-md-10 text-center text-md-start'>{t('rewards.subheadline')}</span>
                  <div className="mt-1">
                    <Button href='https://hyperbots-organization.gitbook.io/hyperbots-organization/hyperbot-official/points-system' className='br-4 border-w-2 fw-500 gap-2' ghost type='dashed'  target='_blank'>{t('common.learnMore')}<IOutlineExport2 className="w-20" /></Button>
                  </div>
                </div>
              </div>
              <div className="d-none d-md-flex col align-items-center">
                <img src={i18n.resolvedLanguage === 'zh-Hans' && IHomeBrainTriple4ZhHans || i18n.resolvedLanguage === 'zh-Hant' && IHomeBrainTriple4ZhHant ||  IHomeBrainTriple4} className="w-full" />
              </div>
            </div>
          </div>

          <Busy spinning={reqStore.rewardUserLvBusy || reqStore.rewardUserInfoBusy}>
            <div className="d-flex align-items-center gap-4 col mb-3">
              <Avatar href={accountStore.tgHeadIco} name={accountStore.tgLastName} size='xlg' />
              <div className="d-flex flex-column gap-2 col">
                <div className="d-flex justify-content-between h6">
                  <span className="fw-500">{t('rewards.level')} { rewardStore.currentLevel }</span>
                  <span>
                    { formatNumber(rewardStore.totalTradingVolume) }/{ rewardStore.lvs.length
                      ? <>{formatNumber(rewardStore.lvs[Math.max(rewardStore.currentLevel - 1, 0)]?.maxTradingVolume)} ({new BN(rewardStore.totalTradingVolume).div(rewardStore.lvs[rewardStore.currentLevel - 1]?.maxTradingVolume).times(100).toFixed(2)}%)</>
                      : '-'
                    }
                  </span>
                </div>
                <Progress showInfo={false} percent={accountStore.logged ? new BN(rewardStore.totalTradingVolume).div(rewardStore.lvs[Math.max(rewardStore.currentLevel - 1, 0)]?.maxTradingVolume).times(100).toFixed(2) : 0} className='br-4 overflow-hidden mt-1' size={{ height: 8 }} strokeColor={'#29BDCC'} />
                <div className="d-flex justify-content-between">
                  <span><em className="color-secondary">{t('rewards.nextLevel')}: </em>{t('rewards.receiveBonus', { num: rewardStore.nextBonus })}</span>
                  <span className="color-secondary">{t('rewards.transactionVolumeRequired', { num: formatNumber(rewardStore.nextLevelTradingVolume) })}</span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <div className="d-flex flex-column col col-md px-4 pt-4 pb-3 br-3 bg-gray-alpha-4 gap-2">
                <h5 className="fw-500 color-secondary">{t('rewards.currentBonusCoefficient')}</h5>
                <span className="d-flex h4 fw-bold align-items-center col">{formatNumber(rewardStore.currentBonus)}x {t('rewards.rewards')}</span>
              </div>
              <div className="d-flex flex-column col col-md px-4 pt-4 pb-3 br-3 bg-gray-alpha-4 gap-2">
                <h5 className="fw-500 color-secondary">{t('rewards.pointsBalance')}</h5>
                <span className="d-flex h4 fw-bold align-items-center col">{formatNumber(rewardStore.pointsBalance)}</span>
              </div>
              <div className="d-flex flex-column col-12 col-lg px-4 pt-4 pb-3 br-3 bg-gray-alpha-4 gap-3">
                <div className="d-flex justify-content-between">
                  <h5 className="fw-500 color-secondary">{t('rewards.referralFriendsData')}</h5>
                  <CopyToClipboard text={accountStore.inviteUrl} onCopy={handleCopyReferralLink}>
                    <ButtonIcon type='primary' logged className='gap-1 fw-bold px-3 br-4'>
                      {t('rewards.copyReferralLink')}
                    </ButtonIcon>
                  </CopyToClipboard>
                </div>
                <div className="d-flex flex-wrap">
                  {
                    [
                      { label: t('common.total'), content: formatNumber(rewardStore.totalReferral) },
                      { label: t('rewards.tier1'), content: formatNumber(rewardStore.directInvite) },
                      { label: t('rewards.tier2'), content: formatNumber(rewardStore.tier2) },
                      { label: t('rewards.tier3'), content: formatNumber(rewardStore.tier3) },
                    ].map((item, idx) => (
                      <div key={idx} className={`d-flex flex-column col-3`}>
                        <small className="color-unimportant pb-1">{ item.label }</small>
                        <span className="color-secondary">
                          <span className="d-flex flex-column">
                            <span className="color-white h5 fw-bold">{ accountStore.logged ? item.content : '-' }</span>
                          </span>
                        </span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </Busy>
        </div>

        <div className="container-xl d-flex flex-wrap px-3 gap-3 gap-md-4 px-md-4 my-3 my-md-5 py-0 align-items-start">
          <div className="d-flex flex-column gap-3 gap-md-4 col-12 col-md">
            <div className="d-flex flex-wrap gap-4 align-items-center justify-content-between col">
              <h4 className="fw-bold">{t('rewards.dailyTasks')}</h4>
            </div>
            <div className='d-flex flex-column'>
              <ColumnList noDataSize='small' logged className='br-3' columns={taskColumn}
                data={[
                  { label: t('rewards.invite3friends'), point: 5, status: rewardStore.invite3Friends, invite: true },
                  { label: t('rewards.trade1000'), point: 5, status: rewardStore.trade1000Today, href: 'https://t.me/Hyperbotai_bot?start=ref_7582143522' },
                  { label: t('rewards.trade5Times'), point: 5, status: rewardStore.trade5Times, href: 'https://t.me/Hyperbotai_bot?start=ref_7582143522' },
                  // { label: t('rewards.copyTrade3Times'), point: 5, status: rewardStore.copyTrade3Times, to: '/discover' },
                ]}
                renderItem={renderTask} />
              <small className='color-unimportant p-3'>{t('rewards.taskResetNote')}</small>
            </div>
          </div>
          <div className="d-flex flex-column gap-3 gap-md-4 col-12 col-md">
            <div className="d-flex flex-wrap gap-4 align-items-center justify-content-between col">
              <h4 className="fw-bold">{t('rewards.referralRecords')}</h4>
            </div>
            <Busy spinning={reqStore.rewardUserInfoBusy}>
              <div className='d-flex flex-column gap-3'>
                <ColumnList
                  className='br-3'
                  noDataSize='small'
                  columns={referralRecordsList}
                  data={rewardStore.referralRecords.filter((item, idx) => idx >= (rewardStore.referralRecordCurrent - 1) * rewardStore.referralRecordPageSize && idx < rewardStore.referralRecordCurrent * rewardStore.referralRecordPageSize)}
                  busy={reqStore.rewardUserInfoBusy}
                  renderItem={renderReferralRecordsListItem} />
                <Pagination size="small" simple current={rewardStore.referralRecordCurrent} pageSize={rewardStore.referralRecordPageSize} total={rewardStore.referralRecords.length}
                  className="justify-content-center"
                  onChange={(page) => rewardStore.referralRecordCurrent = page} />
              </div>
            </Busy>
          </div>
        </div>

        <div className="container-xl d-flex flex-column px-3 px-md-4 gap-3 gap-md-4 my-3 my-md-5 py-0">
          <div className="d-flex flex-wrap gap-4 align-items-center justify-content-between col">
            <h4 className="fw-bold">{t('rewards.pointsDetails')}</h4>
            <div className="d-flex flex-wrap align-items-center gap-2">
              {[
                {
                  items: rewardDetailedListStore.selectDay,
                  selectedValue: rewardDetailedListStore.selectedDayValue,
                  storeKey: 'selectedDayValue',
                },
                {
                  items: rewardDetailedListStore.selectSourceIds,
                  selectedValue: rewardDetailedListStore.selectedSourceIdValue,
                  storeKey: 'selectedSourceIdValue',
                },
              ].map((config, index) => (
                <DropdownMenu key={index} buttonSize="small"
                  items={config.items}
                  selectedValue={config.selectedValue}
                  onSelect={(val) => {
                    rewardDetailedListStore[config.storeKey] = val;
                    handleRewardsDetailedList()
                  }}
                />
              ))}
            </div>
          </div>

          <Busy spinning={reqStore.discoverListBusy}>
            <div className='d-flex flex-column gap-1'>
              <ColumnList className='br-3'
                columns={rewardsList}
                data={rewardDetailedListStore.list}
                busy={reqStore.whalePositionsBusy}
                pageCurrent={rewardDetailedListStore.current}
                pageSize={rewardDetailedListStore.size}
                renderItem={renderRewardsListItem} />
            </div>
          </Busy>
        </div>
      </div>

      <ModalReferralFriends />
    </>
  )
}

export default Rewards