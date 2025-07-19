import { useEffect } from 'react';
import { useSwitchChain } from 'wagmi';
import { Input } from 'antd';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { IOutlineWarning2 } from '@/components/icon'
import { formatNumber } from '@/utils';
import { constants, useAccountStore, usePrivateWalletStore,  useReqStore } from '@/stores';
import BaseModal from './Base';

const ModalRemoveWallet = () => {
  const privateWalletStore = usePrivateWalletStore();
  const reqStore = useReqStore()
  const accountStore = useAccountStore();
  const { t, i18n } = useTranslation()

  const handleClose = () => {
    privateWalletStore.openRemove = false;
  };

  const handleSubmit = async () => {
    const { error } = await reqStore.userDeletePrivateWallet(accountStore, privateWalletStore)

    if (error) return

    handleClose()
    // update
    await reqStore.userPrivateWallet(accountStore, privateWalletStore)
  };

  // init
  useEffect(() => {
    if (!privateWalletStore.openRemove) return

    privateWalletStore.resetRemove()
  }, [privateWalletStore.openRemove])

  return (
    <BaseModal
      title={t('common.removeWallet')}
      titleClassName='color-error'
      open={privateWalletStore.openRemove}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitText={t('common.remove')}
      submitDisabled={privateWalletStore.removePW.length < privateWalletStore.MIN_PW_LENGTH }
      submitLoading={reqStore.userDeletePrivateWalletBusy}
    >
      <div className='d-flex flex-column gap-2 align-items-center text-center bg-error-1 color-error p-3 br-2 mb-4 text-uppercase'>
        <IOutlineWarning2 className='w-64' />
        <h5 className='fw-bold'>{ t('common.warning') }</h5>
        <span className='fw-bold'>{ t('copyTrading.deletingWalletWarning') }</span>
      </div>
      {
        [
          { label: t('common.address'), content: <>{ privateWalletStore.list[privateWalletStore.operaWalletIdx]?.address ?? '-' }</> },
          { label: t('common.password'), tip: t('copyTrading.viewPrivateKeyPrompt'), content: <Input.Password value={privateWalletStore.removePW} className='br-2' placeholder={`${t('common.hint') }: ${privateWalletStore.list[privateWalletStore.operaWalletIdx]?.pwPrompt ?? ''}`} onChange={(e) => privateWalletStore.removePW = e.target.value} /> },
        ].map((item, idx) => 
        <div key={idx} className='d-flex flex-column gap-2 justify-content-between bg-gray-alpha-4 p-3 br-1' style={{ marginTop: '-2px' }}>
          <span className='d-flex gap-2 color-secondary'>{ item.label }</span>
          <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
        </div>)
      }
    </BaseModal>
  );
};

export default ModalRemoveWallet;