import { useEffect, useState } from "react"
import { useSwitchChain } from 'wagmi'
import { Button, Pagination, message, Progress } from 'antd'
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { formatNumber } from '@/utils';
import { constants, useRewardStore, useAccountStore } from '@/stores';
import { usePrivateWalletStore } from '@/stores';
import BaseModal from './Base';

const ModalReferralFriends = () => {
  const rewardStore = useRewardStore()
  const accountStore = useAccountStore()

  const { t, i18n } = useTranslation()
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    rewardStore.openReferralFriends = false;
  }

  const handleCopyReferralLink = () => {
    message.success(t('message.referralLinkCopied'));
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }
  return (
    <BaseModal
      title={t('rewards.referralFriends')}
      open={rewardStore.openReferralFriends}
      onClose={handleClose}>
      {
        [
          { label: t('rewards.referralFriendsStep1'), content: <>
              <CopyToClipboard text={accountStore.inviteUrl} onCopy={handleCopyReferralLink}>
                <Button type='primary' disabled={!accountStore.logged} ghost className='gap-1 fw-bold px-3 br-4 col mt-2' size='small'>
                  {t('rewards.copyReferralLink')}
                </Button>
              </CopyToClipboard>
            </>
          },
          { label: t('rewards.referralFriendsStep2'), content: <>
            </>
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

export default ModalReferralFriends