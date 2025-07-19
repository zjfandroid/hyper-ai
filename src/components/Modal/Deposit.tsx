import { useEffect } from 'react';
import { message, Input } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber, inputIsNumber } from '@/utils';
import TokenIcon from '@/components/TokenIcon';
import { IOutlineCopy } from '@/components/icon'
import { useAccountStore, usePrivateWalletStore, useReqStore, useCopyTradingStore } from '@/stores'
import BaseModal from './Base';
import WalletChainIcon from '@/components/Wallet/ChainIcon';


const ModalDeposit = () => {
  const privateWalletStore = usePrivateWalletStore();
  const accountStore = useAccountStore()
  const reqStore = useReqStore()
  const { t, i18n } = useTranslation()

  const handleClose = () => {
    privateWalletStore.openDeposit = false;
  };

  const handleSubmit = async () => {
    const { error } = await reqStore.userWalletDeposit(accountStore, privateWalletStore)

    if (error) return

    handleClose()
  };

  // init
  useEffect(() => {
    if (!privateWalletStore.openDeposit) return

    privateWalletStore.resetDeposit()
  }, [privateWalletStore.openDeposit])

  return (
    <BaseModal
      title={t('common.deposit')}
      open={privateWalletStore.openDeposit}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitDisabled={privateWalletStore.MIN_DEPOSIT_USDC_AMOUNT !> +privateWalletStore.depositNumber}
      submitLoading={reqStore.userWalletDepositBusy}
      submitText={t('common.submit')}
    >
      {
        [
          { label: `1. ${t('copyTrading.confirmAsNetwork')}`, content: <><WalletChainIcon size='smd' id={42_161} />Arbitrum</> },
          { label: `2. ${t('copyTrading.copyWalletAddress')}`, content:
            <>
              <div className='d-flex align-items-center gap-2 color-white'>
                { privateWalletStore.list[privateWalletStore.operaWalletIdx]?.address ?? '-'}
                <CopyToClipboard text={ privateWalletStore.list[privateWalletStore.operaWalletIdx]?.address ?? '-'} onCopy={() => message.success(t('message.addressCopied'))}>
                  <IOutlineCopy className='w-16 color-secondary linker' />
                </CopyToClipboard>
              </div>
            </> },
          { label: <>3. {t('copyTrading.depositing')}<TokenIcon id={'eth'} size='sm' />ETH</>, content: t('copyTrading.ethGasWarning') },
          { label: <>4. {t('copyTrading.depositing')}<TokenIcon id='usdc' size='sm' />USDC</>, content: <Input value={privateWalletStore.depositNumber} className='br-2' placeholder={t('copyTrading.minimumDeposit', { amount: privateWalletStore.MIN_DEPOSIT_USDC_AMOUNT })} onChange={(e) => {
              const value = e.target.value
              if (!inputIsNumber(value)) return
              privateWalletStore.depositNumber = value
            }} />
          },
        ].map((item, idx) =>
        <div key={idx} className='d-flex flex-column gap-2 justify-content-between bg-gray-alpha-4 p-3 br-1' style={{ marginTop: '-2px' }}>
          <span className='d-flex gap-2 color-secondary'>{ item.label }</span>
          <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
        </div>)
      }
      <span className='d-flex flex-column gap-1 small color-secondary ps-2 pt-2'>
        <span>- {t('copyTrading.depositWarning')}</span>
        <span>- {t('copyTrading.copyTradingStart')}</span>
      </span>
    </BaseModal>
  );
};

export default ModalDeposit;