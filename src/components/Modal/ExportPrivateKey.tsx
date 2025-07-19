import { useEffect } from 'react';
import { useSwitchChain } from 'wagmi';
import { Input, Button, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber } from '@/utils';
import { constants, useAccountStore, usePrivateWalletStore,  useReqStore } from '@/stores';
import BaseModal from './Base';

const ModalExportPrivateKey = () => {
  const privateWalletStore = usePrivateWalletStore();
  const reqStore = useReqStore()
  const accountStore = useAccountStore();
  const { t, i18n } = useTranslation()

  const handleClose = () => {
    privateWalletStore.openExportPrivateKey = false;
  };

  const handleSubmit = async () => {
    const { error } = await reqStore.userExportPrivateKey(accountStore, privateWalletStore)

    if (error) return
  };

  // init
  useEffect(() => {
    if (!privateWalletStore.openExportPrivateKey) return

    privateWalletStore.resetExportPrivateKey()
  }, [privateWalletStore.openExportPrivateKey])

  return (
    <BaseModal
      title={t('common.exportPrivateKey')}
      open={privateWalletStore.openExportPrivateKey}
      onClose={handleClose}
      onSubmit={privateWalletStore.exportPrivateKeyContent ? undefined : handleSubmit}
      submitText={t('common.export')}
      submitDisabled={privateWalletStore.exportPrivateKeyPW.length < privateWalletStore.MIN_PW_LENGTH }
      submitLoading={reqStore.userExportPrivateKeyBusy}
    >
      {
        [
          { label: t('common.addressNote'), content: privateWalletStore.list[privateWalletStore.operaWalletIdx]?.nickname ?? '-'  },
          { label: t('common.address'), content: privateWalletStore.list[privateWalletStore.operaWalletIdx]?.address ?? '-' },
          privateWalletStore.exportPrivateKeyContent
            ? { label: 'Wallet Private Key', content:
                  <div className='d-flex flex-column gap-2 col'>
                    <Input.TextArea value={privateWalletStore.exportPrivateKeyContent} className='br-2' readOnly autoSize />
                    <CopyToClipboard text={privateWalletStore.exportPrivateKeyContent} onCopy={() => message.success(t('message.privateKeyCopied'))}>
                      <Button size='small' ghost>Copy Private Key</Button>
                    </CopyToClipboard>
                  </div>
              }
            : { label: t('common.password'), tip: t('copyTrading.viewPrivateKeyPrompt'), content: <Input.Password value={privateWalletStore.exportPrivateKeyPW} className='br-2' placeholder={`${t('common.hint')}: ${privateWalletStore.list[privateWalletStore.operaWalletIdx]?.pwPrompt ?? ''}`} onChange={(e) => privateWalletStore.exportPrivateKeyPW = e.target.value} /> },
        ].map((item, idx) =>
        <div key={idx} className='d-flex flex-column gap-2 justify-content-between bg-gray-alpha-4 p-3 br-1' style={{ marginTop: '-2px' }}>
          <span className='d-flex gap-2 color-secondary'>{ item.label }</span>
          <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
        </div>)
      }
    </BaseModal>
  );
};

export default ModalExportPrivateKey;