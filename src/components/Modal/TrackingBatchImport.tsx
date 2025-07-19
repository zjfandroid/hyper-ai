import { useEffect } from 'react';
import { useSwitchChain } from 'wagmi';
import { Input, Button, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber, urlSafeBase58Decode } from '@/utils';
import { useAccountStore, useTrackingAddressPositionStore, useTrackingCreateStore, useReqStore } from '@/stores';
import BaseModal from './Base';

const ModalTrackingBatchImport = () => {
  const trackingCreateStore = useTrackingCreateStore();
  const reqStore = useReqStore()
  const accountStore = useAccountStore()
  const trackingAddressPositionStore = useTrackingAddressPositionStore()
  const { t, i18n } = useTranslation()

  const handleClose = () => {

    trackingAddressPositionStore.openBatchImportTracking = false;
  };

  const handleSubmit = async () => {
    try {
      const decode = urlSafeBase58Decode(trackingAddressPositionStore.batchImportContent)
      // update
      trackingAddressPositionStore.batchImportAddresses = decode.split('\n').map((item) => {
        const data = item.split(',')

        return {
          wallet: data[0],
          remark: data[1]
        }
      })
    } catch (error) {
      console.log(error)
      message.error(t('message.batchImportInvalidFormat'))
    }

    const { error } = await reqStore.trackingCreate(accountStore, trackingCreateStore, trackingAddressPositionStore)

    if (error) return

    message.success(t('message.batchImportSuccess'))
    // reset
    trackingAddressPositionStore.resetImport()
    handleClose()

    // update
    await reqStore.trackingAddressPosition(accountStore, trackingAddressPositionStore)
  };

  // init
  useEffect(() => {
    if (!trackingAddressPositionStore.openBatchImportTracking) return;
    trackingAddressPositionStore.resetImport();
  }, [trackingAddressPositionStore.openBatchImportTracking]);

  return (
    <BaseModal
      title={t('track.batchImportTracking')}
      open={trackingAddressPositionStore.openBatchImportTracking}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitText={t('track.batchImport')}
      submitDisabled={!trackingAddressPositionStore.batchImportContent}
      submitLoading={reqStore.trackingCreateBusy}
    >
      {
        [
          { label: t('track.batchImportTrackingCode'), content:
              <div className='d-flex flex-column gap-2 col'>
                <Input.TextArea value={trackingAddressPositionStore.batchImportContent} className='br-2' autoSize={{ maxRows: 10, minRows: 6 }} onChange={(e) => trackingAddressPositionStore.batchImportContent = e.target.value.trim()} style={{ height: '300px'}} />
              </div>
          }
        ].map((item, idx) =>
        <div key={idx} className='d-flex flex-column gap-2 justify-content-between bg-gray-alpha-4 p-3 br-1' style={{ marginTop: '-2px' }}>
          <span className='d-flex gap-2 color-secondary'>{ item.label }</span>
          <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
        </div>)
      }
    </BaseModal>
  );
};

export default ModalTrackingBatchImport;