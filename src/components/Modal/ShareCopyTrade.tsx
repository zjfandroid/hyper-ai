import { useEffect } from 'react';
import { useSwitchChain } from 'wagmi';
import { Input, Button, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber } from '@/utils';
import { constants, useAccountStore, useCopyTradingStore,  useReqStore } from '@/stores';
import BaseModal from './Base';

const ModalShareCopyTrade = () => {
  const copyTradingStore = useCopyTradingStore()
  const reqStore = useReqStore()
  const accountStore = useAccountStore();
  const { t, i18n } = useTranslation()

  const handleClose = () => {
    copyTradingStore.openShareCopyTrade = false;
  };

  const handleSubmit = async () => {
    const { error } = await reqStore.userExportPrivateKey(accountStore, privateWalletStore)

    if (error) return
  };

  // init
  useEffect(() => {
    if (!copyTradingStore.openShareCopyTrade) {
      copyTradingStore.resetShareCopyTrade()

      return
    } else {
      const fullUrl = window.location.href;
      const baseUrl = new URL(fullUrl).origin;

      copyTradingStore.shareCopyTradeLink = `${constants.app.URL || baseUrl}/copy-trading?${constants.paramKey.copyTradingTargetAddress}=${copyTradingStore.shareCopyTradeAddress}`
    }
  }, [copyTradingStore.openShareCopyTrade])

  return (
    <BaseModal
      title={t('common.shareCopyTrading')}
      open={copyTradingStore.openShareCopyTrade}
      onClose={handleClose}
      onSubmit={null}
    >
      {
        [
          { label: t('common.shareCopyTradingLink'), content: 
            <div className='d-flex flex-column gap-2 col'>
              <Input.TextArea value={copyTradingStore.shareCopyTradeLink} className='br-2' readOnly autoSize />
              <CopyToClipboard text={copyTradingStore.shareCopyTradeLink} onCopy={() => message.success(t('message.shareLinkCopied'))}>
                <Button size='small' ghost>{t('common.copy')}</Button>
              </CopyToClipboard>
            </div>
            },
        ].map((item, idx) =>
        <div key={idx} className='d-flex flex-column gap-2 justify-content-between bg-gray-alpha-4 p-3 br-1' style={{ marginTop: '-2px' }}>
          <span className='d-flex gap-2 color-secondary'>{ item.label }</span>
          <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
        </div>)
      }
    </BaseModal>
  );
};

export default ModalShareCopyTrade;