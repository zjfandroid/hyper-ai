import { Button, Popconfirm } from 'antd'
import { useEffect, useState } from 'react'; // 新增导入
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { isAddress } from 'viem'

import { IOutlineTrash, IOutlineEyeSlash, IOutlineNotification, IOutlineArrowUp1, IOutlineCloseNotification, IOutlineChart2, IOutlineEdit, IOutlineShare,  } from '@/components/icon'
import { constants, useReqStore, useDiscoverTradingStatisticsStore, useTrackingCreateStore, useAccountStore, useTrackingAddressPositionStore, useCopyTradingStore, useDiscoverStore } from '@/stores'
import PositionItemPnl from '@/components/PositionItem/Pnl'
import PositionItemMarginUsedRatio from '@/components/PositionItem/MarginUsedRatio'
import PositionItemAddress from '@/components/PositionItem/Address'
import { formatNumber, localStorage, merge } from '@/utils'
import TrackingAddressPositionContent from '@/components/Tracking/AddressPositionContent'
import SideButtonIcon from '@/components/Side/ButtonIcon'
import './AddressPosition.scss'

const TrackingAddressPosition = ({ item }) => {
  const reqStore = useReqStore()
  const accountStore = useAccountStore()
  const trackingAddressPositionStore = useTrackingAddressPositionStore()
  const copyTradingStore = useCopyTradingStore()
  const discoverStore = useDiscoverStore()
  const discoverTradingStatisticsStore = useDiscoverTradingStatisticsStore()
  const trackingCreateStore = useTrackingCreateStore()
  const { t, i18n } = useTranslation()

  const [isCollapsed, setIsCollapsed] = useState(true)

  const STORAGE_KEY = `${constants.storageKey.SETTING}trackingAddressUnfoldPosition`

  const handleRemove = async (item) => {
    // update
    trackingAddressPositionStore.removeTrackAddress = item.address

    const { error } = await reqStore.trackingRemove(accountStore, trackingAddressPositionStore)

    if (error) return

    // reset
    trackingAddressPositionStore.resetRemove()

    // 重新获取整个list
    await reqStore.trackingAddressPosition(accountStore, trackingAddressPositionStore)
  }

  const handleOpenTradingStatistics = (item) => {
    discoverTradingStatisticsStore.address = item.address

    discoverTradingStatisticsStore.openModal = true
  }

  const handleToggleCollapse = () => {
    const result = !isCollapsed

    try {
      // storage
      const cache = getStorageSetting()
      cache[item.address] = result
      localStorage.set(STORAGE_KEY, cache)
    } catch (e) {
      console.log(e)
    }

    setIsCollapsed(result);
  };

  const getStorageSetting = () => {
    return localStorage.get(STORAGE_KEY) || {}
  }

  // 快捷跟单
  const handleOpenQuickerCreateCopyTrade = (item?: any) => {
    copyTradingStore.quickerOpenPositionTargetAddress = item.address

    // NOTE: 同步完，最后打开弹窗
    copyTradingStore.openCopyTradingTarget = true
  }

  const handleOpenEditTracking = (item) => {
    merge(trackingCreateStore, {
      openCreateTracking: true,
      isEdit: true,
      createTrackAddress: item.address,
      checkCreateTrackAddress: isAddress(item.address),
      createTrackNote: item.note,
      notificationOn: item.notificationOn,
      notificationSelectedLanguage: item.notificationSelectedLanguage,
      notificationSelectedEventTypes: item.notificationSelectedEventTypes
    })
  }

  const handleSwitchTGNotification = async (item) => {
    merge(trackingCreateStore, {
      createTrackAddress: item.address,
      createTrackNote: item.note,
      notificationOn: !item.notificationOn,
      notificationSelectedLanguage: item.notificationSelectedLanguage,
      notificationSelectedEventTypes: item.notificationSelectedEventTypes
    })

    const { error } = await reqStore.trackingCreate(accountStore, trackingCreateStore, trackingAddressPositionStore)

    if (error) return

    // update
    await reqStore.trackingAddressPosition(accountStore, trackingAddressPositionStore)
  }

  // init
  useEffect(() => {
    // 初始化地址仓位的显示状态
    // storage
    const cache = getStorageSetting()
    setIsCollapsed(cache[item.address] ?? false)
  }, [])

  return (
    <>
      <dl className='d-flex flex-column br-2 overflow-hidden column-list'>
        <dt className='d-flex flex-column fw-normal'>
          <div className='d-flex flex-wrap gap-2 ps-3 pe-3 bg-gray-alpha-3 align-items-center'>
            <div className='d-flex col-3'>
              <PositionItemAddress avatar item={item} />
              {
                item.note
                  ? <span className='color-secondary ms-4'>{item.note}</span>
                  : ''
              }
            </div>
            <div className='d-flex flex-wrap gap-4 pt-2 pb-1 col-12 col-lg'>
              {
                [
                  { label: t('common.balance'), content: <>$ {formatNumber(item.balance)}</> },
                  { label: t('common.totalPositionValue'), content: <>$ {formatNumber(item.totalPositionValue)}</> },
                  { label: t('common.pnl'), content: <PositionItemPnl item={item} /> },
                  { label: t('common.marginUsedRatio'), content: <PositionItemMarginUsedRatio wrap item={item} /> },
                ].map((item, idx) => 
                  <div key={idx} className='d-flex flex-column col-5 col-md-2'>
                    <small className='color-unimportant'>{ item.label }</small>
                    <span className=''>{ item.content }</span>
                  </div>
                )
              }
            </div>
            <div className='d-flex gap-3 align-items-center justify-content-end ms-auto'>
              {
                [
                  { icon: <IOutlineChart2 className='zoom-85' />, title: t('common.tradingStatistics'), onClick: () => handleOpenTradingStatistics(item) },
                  { icon: <IOutlineShare className='zoom-85' />, title: t('common.copyTrading'), logged: true, onClick: () => handleOpenQuickerCreateCopyTrade(item) },
                  { icon: item.notificationOn ? <IOutlineNotification className='zoom-85' /> : <IOutlineCloseNotification className='zoom-85' />, title: t(item.notificationOn ? 'common.closeTGNotification' : 'common.openTGNotification'), logged: true, onClick: () => handleSwitchTGNotification(item) },
                  { icon: <IOutlineEdit className='zoom-85' />, title: t('common.edit'), logged: true, onClick: () => handleOpenEditTracking(item) },
                  { icon: <Popconfirm title={t('common.removeTracking')} onConfirm={() => handleRemove(item)} okText={t('common.remove')} icon={<IOutlineTrash className='zoom-80' />} showCancel={false}><IOutlineTrash className='zoom-85 linker' /></Popconfirm>, title: t('common.removeTracking'), onclick: () => {}},
                  { icon: <IOutlineArrowUp1 className={`zoom-90 m-2 linker ${isCollapsed ? 'rotate-180' : ''}`} />,
                    className: 'ms-3',
                    title: t(isCollapsed ? 'common.showPositions' : 'common.hidePositions'),
                    onClick: handleToggleCollapse
                  },
                ].map((item, idx) => <SideButtonIcon key={idx} className={item.className || ''} title={item.title} onClick={item.onClick} logged={item.logged} icon={item.icon} />)
              }
            </div>
          </div>
        </dt>
        <dd className={`collapsible-content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          <TrackingAddressPositionContent list={item.positions} />
        </dd>
      </dl>
    </>
  )
}

export default TrackingAddressPosition