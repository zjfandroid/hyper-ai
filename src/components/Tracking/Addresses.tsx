import { useEffect } from 'react'
import { Button, Progress, Popconfirm, Tooltip, Dropdown, message, Select, Input, Timeline } from 'antd'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { IOutlineMoreSquare, IOutlineMonitor, IOutlineCopy, IOutlineMedal, IOutlineExport1, IOutlineImport1, IOutlineAdd, IOutlineEdit, IOutlineArrowUp1, IOutlineShare, ICyclical, IOutlineSearchNormal1 } from '@/components/icon'
import { useReqStore, useAccountStore, useTrackingCreateStore, useTrackingAddressPositionStore } from '@/stores'
import Busy from '@/components/Busy'
import TrackingAddressPosition from '@/components/Tracking/AddressPosition'
import ColumnNoData from '@/components/Column/NoData'
import ButtonIcon from '@/components/ButtonIcon'

const TrackingAddresses = () => {
  const trackingAddressPositionStore = useTrackingAddressPositionStore()
  const accountStore = useAccountStore()
  const reqStore = useReqStore()
  const trackingCreateStore = useTrackingCreateStore()
  const { t, i18n } = useTranslation()

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      await reqStore.trackingAddressPosition(accountStore, trackingAddressPositionStore)
    }

    // reset
    if (!accountStore.logged) {
      trackingAddressPositionStore.reset()
      return
    }

    asyncFunc()
  }, [accountStore.logged])

  return (
    <>
      <div className="d-flex gap-4 align-items-center justify-content-between col">
        <h4 className="d-flex gap-2 align-items-center fw-bold">
          <IOutlineMonitor />{t('common.trackAddress')}
          {
            accountStore.logged && <span>({trackingAddressPositionStore.list.length})</span>
          }
        </h4>
        <div className='d-flex gap-3'>
          <ButtonIcon logged icon={<IOutlineImport1 />} onClick={() => trackingAddressPositionStore.openBatchImportTracking = true}>{t('track.batchImport')}</ButtonIcon>
          <ButtonIcon logged disabled={!trackingAddressPositionStore.list.length} icon={<IOutlineExport1 />} onClick={() => trackingAddressPositionStore.openBatchExportTracking = true}>{t('track.batchExport')}</ButtonIcon>
          <ButtonIcon type='primary' icon={<IOutlineAdd />} logged className='gap-1 fw-bold px-3 br-4'
            onClick={() => trackingCreateStore.openCreateTracking = true }>
            <span className='d-none d-sm-block'>{t('common.createTrack')}</span>
          </ButtonIcon>
        </div>
      </div>
      <div className='d-flex flex-column overflow-hidden'>
        <Busy spinning={reqStore.trackingAddressPositionBusy}>
          <div className='d-flex flex-column gap-1'>
            { trackingAddressPositionStore.list.length
                ? trackingAddressPositionStore.list.map((item, idx) => <TrackingAddressPosition key={idx} item={item} />)
                : <ColumnNoData logged className='bg-gray-alpha-4 br-3 overflow-hidden' />
            }
          </div>
        </Busy>
      </div>
    </>
  )
}

export default TrackingAddresses