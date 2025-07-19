import { useEffect } from 'react';
import { useSwitchChain } from 'wagmi';

import { formatNumber } from '@/utils';
import { constants,   useContractCyberSnakeStore } from '@/stores';
import { usePrivateWalletStore } from '@/stores';
import BaseModal from './Base';

const ModalWithdraw = () => {
  const privateWalletStore = usePrivateWalletStore();

  const handleClose = () => {
    privateWalletStore.openWithdraw = false;
  };

  const handleSubmit = async () => {
    // 提交逻辑
  };

  return (
    <BaseModal
      title="Withdraw"
      open={privateWalletStore.openWithdraw}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitLoading={false}
    >
      {
        [
          { label: 'Wallet Balance', content: <></> },
          { label: 'Network', content: <></> },
          { label: 'Estimated gas fee', content: 'aaa' },
        ].map((item, idx) => 
        <div key={idx} className='d-flex justify-content-between bg-gray-alpha-4 p-3 br-1' style={{ marginTop: '-2px' }}>
          <span className='d-flex gap-2 color-secondary'>{ item.label }</span>
          <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
        </div>)
      }
    </BaseModal>
  );
};

export default ModalWithdraw;