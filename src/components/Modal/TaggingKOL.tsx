import { useEffect } from 'react';
import { useSwitchChain } from 'wagmi';
import { isAddress } from 'viem'
import { Input, Button, message, Radio, Switch, Checkbox, notification } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom';

import { formatNumber } from '@/utils';
import { constants, useContractCyberSnakeStore, useDiscoverKolStore, useTrackingCreateStore, useTrackingAddressPositionStore, useReqStore, useAccountStore } from '@/stores';
import { IOutlineCloseNotification, IOutlineNotification } from '@/components/icon';
import BaseModal from './Base';
import { useNotification } from '@/components/Notification'

const ModalTaggingKOL = () => {
  const reqStore = useReqStore()
  const accountStore = useAccountStore()
  const { t, i18n } = useTranslation()
  const discoverKolStore = useDiscoverKolStore()
  const notification = useNotification()
  const navigate = useNavigate()

  const handleClose = () => {
    discoverKolStore.openAssistTaggingKol = false;
  };

  const handleSubmit = async () => {
    const { error } = await reqStore.discoverKolTagging(accountStore, discoverKolStore)

    if (error) return

    notification.success({
      message: t('notification.addedSuccessfully')
    })
    handleClose()
  }

  const handleChangeAddress = (address: string | undefined) => {
    discoverKolStore.assistTaggingKolAddress = address ?? ''
    discoverKolStore.checkAssistTaggingKolAddress = address ? isAddress(address) : false
  }

  const handleChangeUsername = (username: string | undefined) => {
    discoverKolStore.assistTaggingKolUsername = username ?? ''
    discoverKolStore.checkAssistTaggingKolUsername = !!username
  }

  // init
  useEffect(() => {
    return () => {
      discoverKolStore.resetAssistTaggingKol()
    }
  }, [discoverKolStore.openAssistTaggingKol])

  return (
    <>
      <BaseModal
        title={t('discover.assistTaggingKol')}
        open={discoverKolStore.openAssistTaggingKol}
        onClose={handleClose}
        onSubmit={handleSubmit}
        submitText={t('common.submit')}
        submitDisabled={!(discoverKolStore.checkAssistTaggingKolAddress && discoverKolStore.assistTaggingKolUsername)}
        submitLoading={reqStore.discoverKolTaggingBusy}>
        {
          [
            { label: t('common.xUsername'), content: <Input value={discoverKolStore.assistTaggingKolUsername} size='small' status={discoverKolStore.assistTaggingKolUsername && !discoverKolStore.checkAssistTaggingKolUsername ? 'error' : ''} className='br-2' placeholder={t('discover.inputKolXUsername')} onChange={(e) => handleChangeUsername(e.target.value.trim())} /> },
            { label: t('common.address'), content: <Input value={discoverKolStore.assistTaggingKolAddress} size='small' status={discoverKolStore.assistTaggingKolAddress && !discoverKolStore.checkAssistTaggingKolAddress ? 'error' : ''} className='br-2' placeholder={t('discover.inputKolWalletAddress')} onChange={(e) => handleChangeAddress(e.target.value.trim())} /> },
          ].map((item, idx) =>
            <div key={idx} className='d-flex flex-column gap-2 justify-content-between bg-gray-alpha-4 p-3 br-1' style={{ marginTop: '-2px' }}>
              <span className='d-flex gap-2 color-secondary'>{ item.label }</span>
              {
                item.content && <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
              }
            </div>
          )
        }
        <span className='d-flex flex-column gap-1 small color-secondary ps-2 pt-2'>
          <span>- {t('discover.taggingKolNote')}</span>
        </span>
      </BaseModal>
    </>
  );
};

export default ModalTaggingKOL;