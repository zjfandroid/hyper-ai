import { useEffect } from 'react';
import { useSwitchChain } from 'wagmi';
import { Input, Button, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber, urlSafeBase58Encode } from '@/utils';
import { constants,   useContractCyberSnakeStore } from '@/stores';
import { usePrivateWalletStore, useTrackingAddressPositionStore } from '@/stores';
import BaseModal from './Base';

const ModalTrackingBatchExport = () => {
  const trackingAddressPositionStore = useTrackingAddressPositionStore();
  const { t, i18n } = useTranslation()

  const handleClose = () => {
    trackingAddressPositionStore.openBatchExportTracking = false;
  };

  // init
  useEffect(() => {
    if (!trackingAddressPositionStore.openBatchExportTracking) return;
    trackingAddressPositionStore.resetExport();

    // NOTE: 批量导出时，需要将地址和备注合并成一个字符串，然后进行 base58 编码
    trackingAddressPositionStore.batchExportContent = trackingAddressPositionStore.list.map((item,idx) => `${item.address},${item.note}`).join('\n')
    trackingAddressPositionStore.batchExportContent = urlSafeBase58Encode(trackingAddressPositionStore.batchExportContent)
  }, [trackingAddressPositionStore.openBatchExportTracking]);

  return (
    <BaseModal
      title={t('track.batchExportTracking')}
      open={trackingAddressPositionStore.openBatchExportTracking}
      onClose={handleClose}
      onSubmit={null}
    >
      {
        [
          { label: t('track.batchExportTrackingCode'), content:
              <div className='d-flex flex-column gap-2 col'>
                <Input.TextArea value={trackingAddressPositionStore.batchExportContent} className='br-2' readOnly autoSize />
                <CopyToClipboard text={trackingAddressPositionStore.batchExportContent} onCopy={() => message.success(t('message.batchExportCopied'))}>
                  <Button size='small' ghost>{t('common.copy')}</Button>
                </CopyToClipboard>
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

export default ModalTrackingBatchExport;