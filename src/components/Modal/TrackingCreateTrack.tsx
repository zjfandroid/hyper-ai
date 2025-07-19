import { useEffect } from 'react';
import { useSwitchChain } from 'wagmi';
import { isAddress } from 'viem'
import { Input, Button, message, Radio, Switch, Checkbox, notification } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom';

import { formatNumber } from '@/utils';
import { constants, useContractCyberSnakeStore, useTrackingCreateStore, useTrackingAddressPositionStore, useReqStore, useAccountStore } from '@/stores';
import { IOutlineCloseNotification, IOutlineNotification } from '@/components/icon';
import BaseModal from './Base';
import { useNotification } from '@/components/Notification'

const ModalTrackingCreateTrack = () => {
  const trackingCreateStore = useTrackingCreateStore();
  const reqStore = useReqStore()
  const accountStore = useAccountStore()
  const trackingAddressPositionStore = useTrackingAddressPositionStore()
  const { t, i18n } = useTranslation()
  const notification = useNotification()
  const navigate = useNavigate()

  const handleClose = () => {
    trackingCreateStore.openCreateTracking = false;
  };

  const handleChangeTrackAddress = (address: string | undefined) => {
    trackingCreateStore.createTrackAddress = address ?? ''
    trackingCreateStore.checkCreateTrackAddress = address ? isAddress(address) : false
  }

  const handleSubmit = async () => {
    const { error } = await reqStore.trackingCreate(accountStore, trackingCreateStore, trackingAddressPositionStore)

    if (error) return

    notification.success({
      message: t(trackingCreateStore.isEdit ? 'notification.editedSuccessfully' : 'notification.addedSuccessfully'),
      description: <span className='d-flex flex-column gap-1'>
        {t('notification.trackingAddressSuccess', { address: trackingCreateStore.createTrackAddress })}
        <small className='color-secondary'>{t('notification.view')}</small>
      </span>,
      onClick: () => navigate('/track-monitor')
    })
    handleClose()

    // update
    await reqStore.trackingAddressPosition(accountStore, trackingAddressPositionStore)
  }

  const onChangeNotificationOn = (checked: boolean) => {
    trackingCreateStore.notificationOn = !trackingCreateStore.notificationOn
  }

  const handleChangeEventTypes = (checkedList: string[]) => {
    // 确保至少选择一项
    if (checkedList.length === 0) {
      message.warning(t('message.pleaseSelectAtLeastOneItem'));
      return;
    }
    trackingCreateStore.notificationSelectedEventTypes = checkedList;
  }

  // init
  useEffect(() => {
    if (!trackingCreateStore.openCreateTracking) return

    // quick create
    if (trackingCreateStore.quickCreateTrackAddress) {
      const _addressTemp = trackingCreateStore.quickCreateTrackAddress

      trackingCreateStore.reset()

      handleChangeTrackAddress(_addressTemp)
    } else {
      if (trackingCreateStore.isEdit) {
      } else {
        trackingCreateStore.reset()
      }
    }

    return () => {
      trackingCreateStore.reset()
    }
  }, [trackingCreateStore.openCreateTracking])

  return (
    <>
      <BaseModal
        title={t(trackingCreateStore.isEdit ? 'common.editTrack' : 'common.createTrack')}
        open={trackingCreateStore.openCreateTracking}
        onClose={handleClose}
        onSubmit={handleSubmit}
        submitText={t(trackingCreateStore.isEdit ? 'common.confirm' : 'common.create')}
        submitDisabled={!trackingCreateStore.checkCreateTrackAddress}
        submitLoading={reqStore.trackingCreateBusy}
      >
        {
          [
            { label: t('common.address'), content: <Input value={trackingCreateStore.createTrackAddress} size='small' status={trackingCreateStore.createTrackAddress && !trackingCreateStore.checkCreateTrackAddress ? 'error' : ''} className='br-2' placeholder={t('track.inputTrackAddress')} onChange={(e) => handleChangeTrackAddress(e.target.value.trim())} /> },
            { label: t('common.addressNote'), content: <Input value={trackingCreateStore.createTrackNote} size='small' className='br-2' placeholder={`(${t('common.optional')})`} onChange={(e) => trackingCreateStore.createTrackNote = e.target.value.trim()} /> },
            { label: <Button ghost onClick={() => onChangeNotificationOn() } size='small' className='d-flex gap-2 br-2 ps-2 pe-2 col-12'>
                <IOutlineNotification className='w-20' />{t('common.openTGNotification')}
                <Switch defaultChecked checked={trackingCreateStore.notificationOn} className='ms-auto' />
              </Button> },
            { label: t('common.notificationLanguage'), hide: !trackingCreateStore.notificationOn, content: <>
                <Radio.Group className='col' block value={trackingCreateStore.notificationSelectedLanguage} onChange={(e) => trackingCreateStore.notificationSelectedLanguage = e.target.value }>
                  { trackingCreateStore.notificationLanguages.map((item, idx) => <Radio.Button key={idx} value={item.value}>{ item.i18n ? t(item.i18n) : item.label}</Radio.Button>)}
                </Radio.Group>
              </>
            },
            { label: t('common.monitoringEventTypes'), hide: !trackingCreateStore.notificationOn, content: <>
                <Checkbox.Group value={trackingCreateStore.notificationSelectedEventTypes} onChange={handleChangeEventTypes} className='d-flex gap-2'>
                  { trackingCreateStore.notificationEventTypes.map((item, idx) =>
                    <Button key={idx} className='px-2' size='small' ghost><Checkbox key={idx} checked={trackingCreateStore.notificationSelectedEventTypes.includes(item.value)} value={item.value}>{ item.i18n ? t(item.i18n) : item.label}</Checkbox></Button>
                  )}
                </Checkbox.Group>
                {}
              </>
            },
          ].map((item, idx) =>
            !item.hide
              ? <div key={idx} className='d-flex flex-column gap-2 justify-content-between bg-gray-alpha-4 p-3 br-1' style={{ marginTop: '-2px' }}>
                <span className='d-flex gap-2 color-secondary'>{ item.label }</span>
                {
                  item.content && <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
                }
                </div>
              : <div key={idx}></div>
          )
        }
      </BaseModal>
    </>
  );
};

export default ModalTrackingCreateTrack;