import { useEffect } from 'react';
import { useSwitchChain } from 'wagmi';
import { Input } from 'antd';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber } from '@/utils';
import { IOutlineInfoCircle } from '@/components/icon'
import { constants, useAccountStore, usePrivateWalletStore,  useReqStore } from '@/stores';
import ColumnTooltip from '../Column/Tooltip';
import ModalBase from './Base';

const ModalCreatePrivateWallet = () => {
  const privateWalletStore = usePrivateWalletStore();
  const reqStore = useReqStore()
  const accountStore = useAccountStore();
  const { t, i18n } = useTranslation()

  const handleClose = () => {
    privateWalletStore.openCreatePrivateWallet = false;
  };

  const handleSubmit = async () => {
    const { error } = await reqStore.userCreatePrivateWallet(accountStore, privateWalletStore);

    if (error) return

    handleClose()
    // update
    await reqStore.userPrivateWallet(accountStore, privateWalletStore)
  };

  // init
  useEffect(() => {
    // if (!privateWalletStore.openCreatePrivateWallet) return

    return () => {
      privateWalletStore.reset()
    }
  }, [privateWalletStore.openCreatePrivateWallet])

  return (
    <ModalBase
      title={t('common.createWallet')}
      open={privateWalletStore.openCreatePrivateWallet}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitText={t('common.create')}
      submitDisabled={!(privateWalletStore.createNickname && privateWalletStore.createPW?.length >= privateWalletStore.MIN_PW_LENGTH)}
      submitLoading={reqStore.userCreatePrivateWalletBusy}
    >
      {
        [
          { label: t('common.addressNote'), content: <Input value={privateWalletStore.createNickname} className='br-2' placeholder={t('common.addressNote')} onChange={(e) => privateWalletStore.createNickname = e.target.value.trim() } /> },
          { label: t('common.password'), tip: t('copyTrading.viewPrivateKeyPrompt'), content: <Input.Password value={privateWalletStore.createPW} className='br-2' placeholder={t('common.minimumCharacters', { minLength: privateWalletStore.MIN_PW_LENGTH })} onChange={(e) => privateWalletStore.createPW = e.target.value} /> },
          { label: t('common.passwordHint'), content: <Input value={privateWalletStore.createPWPrompt} className='br-2' placeholder={`(${t('common.optional')})`} onChange={(e) => privateWalletStore.createPWPrompt = e.target.value} /> },
        ].map((item, idx) => 
        <div key={idx} className='d-flex flex-column gap-2 justify-content-between bg-gray-alpha-5 p-3 br-1' style={{ marginTop: '-2px' }}>
          <span className='d-flex gap-2 color-secondary'>
            { item.label }
            { item.tip && <ColumnTooltip title={item.tip}><IOutlineInfoCircle className='zoom-75 linker' /></ColumnTooltip> }
          </span>
          <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
        </div>)
      }
    </ModalBase>
  );
};

export default ModalCreatePrivateWallet;