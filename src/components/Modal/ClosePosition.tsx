import { useEffect, useRef } from 'react';
import { message, Input, InputNumber } from 'antd';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber, sleep, inputIsNumber } from '@/utils';
import TokenIcon from '@/components/TokenIcon';
import { IOutlineCopy } from '@/components/icon'
import { useAccountStore, usePrivateWalletStore, useReqStore, useCopyTradingStore } from '@/stores'
import BaseModal from './Base';
import WalletChainIcon from '@/components/Wallet/ChainIcon';
import TabBase from '@/components/Tab/Base'

const ModalClosePosition = () => {
  const privateWalletStore = usePrivateWalletStore();
  const accountStore = useAccountStore()
  const reqStore = useReqStore()
  const copyTradingStore = useCopyTradingStore()
  const { t, i18n } = useTranslation()

  const inputLimitPriceRef = useRef(null);

  const handleClose = () => {
    copyTradingStore.openClosePosition = false;
  };

  const handleSubmit = async () => {
    const { error } = await reqStore.copyTryTradingClosePosition(accountStore, copyTradingStore)

    if (error) return

    handleClose()
    // NOTE: 成功后更新仓位数据
    await reqStore.copyTradingMyPosition(accountStore, copyTradingStore)
  };

  const handleTabChange = (id) => {
    copyTradingStore.closePositionTabId = id
  }

  const handleInputPrice = (e) => {
    const value = e.target.value
    if (!inputIsNumber(value)) return
    copyTradingStore.closePositionPrice = value;
  }

  // init
  useEffect(() => {
    if (!copyTradingStore.openClosePosition) return

    copyTradingStore.resetClosePosition()
  }, [copyTradingStore.openClosePosition])

  // NOTE: 如果弹窗一直开着，仓位数据更新而仓位不存在的情况
  useEffect(() => {
    if (!copyTradingStore.operaPositionItem && copyTradingStore.openClosePosition) {
      handleClose()
    }
  }, [copyTradingStore.operaPositionItem])

  useEffect(() => {
    const asyncFunc = async () => {
      // NOTE: 解决弹框刚显示后，input 无法获取焦点的现象
      await sleep(250)
      if (copyTradingStore.openClosePosition && copyTradingStore.closePositionTabId === 'limit' && inputLimitPriceRef.current) {
        inputLimitPriceRef.current.focus()
      }
    }

    asyncFunc()
  }, [copyTradingStore.closePositionTabId, copyTradingStore.openClosePosition])

  return (
    <BaseModal
      title={`
        ${ copyTradingStore.operaPositionItem?.coin }
        ${ copyTradingStore.operaPositionItem?.leverage }x
        - ${ copyTradingStore.operaPositionItem?.direction === 'long' ? t('common.closeLong') : t('common.closeShort') }`}
      titleClassName='mb-2 text-capitalize'
      open={copyTradingStore.openClosePosition}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitText={t('common.closeAll')}
      submitDisabled={copyTradingStore.closePositionTabId === 'limit' && !copyTradingStore.closePositionPrice}
      submitLoading={reqStore.copyTryTradingClosePositionBusy}
    >
      <TabBase data={copyTradingStore.closePositionTabs} curr={copyTradingStore.closePositionTabId} onClick={handleTabChange} />
      <div className='d-flex flex-wrap gap-1'>
        {
          [
            { label: t('common.openingPrice'), className: 'col', content: <>$ { copyTradingStore.operaPositionItem?.openPrice ?? '-' }</> },
            { label: t('common.markPrice'), className: 'col', content: <>$ { copyTradingStore.operaPositionItem?.openPrice ?? '-' }</> },
          ].map((item, idx) =>
          <div key={idx} className={`d-flex flex-column gap-2 justify-content-between bg-gray-alpha-4 p-3 br-1 ${ item.className }`} style={{ marginTop: '-2px', marginLeft: idx ? '-2px' : '0' }}>
            <span className='d-flex gap-2 color-secondary'>{ item.label }</span>
            <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
          </div>)
        }
      </div>
      {
        [
          { label: <>{ t('common.price') } (USD)</>, content:
              <>
                { copyTradingStore.closePositionTabId === 'limit' && <Input ref={inputLimitPriceRef} value={copyTradingStore.closePositionPrice} className='br-2' placeholder='' onChange={handleInputPrice} /> }
                { copyTradingStore.closePositionTabId === 'market' && <Input disabled value={t('common.marketPrice')} className='br-2' placeholder='' /> }
              </>
          },
        ].map((item, idx) =>
        <div key={idx} className='d-flex flex-column gap-2 justify-content-between bg-gray-alpha-4 p-3 br-1' style={{ marginTop: '-2px' }}>
          <span className='d-flex gap-2 color-secondary'>{ item.label }</span>
          <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
        </div>)
      }
      <span className='d-flex flex-column gap-1 small color-secondary ps-2 pt-2'>
        <span>
          { t('copyTrading.closePositionLimitPriceWarning',
            { type: t( copyTradingStore.closePositionTabId === 'limit' ? 'common.limitPrice' : 'common.marketPrice' )})}
        </span>
      </span>
    </BaseModal>
  );
};

export default ModalClosePosition;