import { useEffect, useRef} from 'react';
import { isAddress } from 'viem'
import { message, Input, Button, Radio, Slider } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber, inputIsNumber, sleep, merge } from '@/utils';
import TokenIcon from '@/components/TokenIcon';
import { IOutlineCopy, IOutlineSearchNormal1, IOutlineShieldSearch, IOutlineInfoCircle } from '@/components/icon'
import { constants, useAccountStore, usePrivateWalletStore, useReqStore, useCopyTradingStore } from '@/stores'
import BaseModal from './Base';
import WalletChainIcon from '@/components/Wallet/ChainIcon';
import ColumnList from '@/components/Column/List'
import PositionItemDirectionLeverage from '@/components/PositionItem/DirectionLeverage'
import PositionItemPositionValue from '@/components/PositionItem/PositionValue'
import PositionItemUPnl from '@/components/PositionItem/UPnl'
import Busy from '@/components/Busy'
import ColumnTooltip from '@/components/Column/Tooltip'
import InputSearch from '@/components/Input/Search';
import LoginBtn from '@/components/Login/Btn'
import { useNotification } from '@/components/Notification'

const ModalCreateCopyTrading = () => {
  const accountStore = useAccountStore()
  const reqStore = useReqStore()
  const copyTradingStore = useCopyTradingStore()
  const location = useLocation();
  const { t, i18n } = useTranslation()
  const notification = useNotification()
  const navigate = useNavigate()

  const inputTargetAddressRef = useRef(null);

  const targetPosition = [
    { id: 'symbol', label: t('common.symbol'), className: 'col-2' },
    { id: 'leverage', label: t('common.directionLeverage'), className: 'col-3' },
    { id: 'positionValue', label: t('common.positionValue'), className: 'justify-content-end text-end col-4' },
    { id: 'uPnl', label: t('common.uPnl'), className: 'justify-content-end text-end col' },
  ]

  const renderPositionItem = (item, columnIndex) => {
    switch (targetPosition[columnIndex].id) {
      case 'symbol':
        return item.coin
      case 'leverage':
        return <PositionItemDirectionLeverage item={item} />
      case 'positionValue':
        return <PositionItemPositionValue item={item} />
      case 'uPnl':
        return <PositionItemUPnl item={item} />
      default:
        return null
    }
  }

  const handleClose = () => {
    copyTradingStore.openCopyTradingTarget = false;
  };

  const handleSubmit = async () => {
    const { error } = await reqStore.copyTradingCreateCopyTrading(accountStore, copyTradingStore)

    if (error) return

    handleClose()
    notification.success({
      message: t(copyTradingStore.isOpenPositionTargetEdit ? 'notification.editedSuccessfully' : 'notification.addedSuccessfully'),
      description: <span className='d-flex flex-column gap-1'>
        {t('notification.copyTradingAddressSuccess', { address: copyTradingStore.copyTradingTargetAddress })}
        <small className='color-secondary'>{t('notification.view')}</small>
      </span>,
      onClick: () => navigate('/copy-trading')
    })
    // update
    await reqStore.copyTradingMyCopyTrading(accountStore, copyTradingStore)
  };

  const handleSearchTargetAddress = async () => {
    // reset
    copyTradingStore.resetCopyTradingTargetInfo()

    if (!isAddress(copyTradingStore.copyTradingSearchTargetAddress)) {
      message.error(t('message.pleaseInputAddress'))
      return
    }

    const { error } = await reqStore.copyTradingTargetPosition(accountStore, copyTradingStore)

    if (error) return
  }

  const handleSyncOpenPositionSellModelValue = (decode?: boolean = false) => {
    // 必须 sell 止盈止损模式
    if (copyTradingStore.openPositionSellModel !== 3) return

    // 反过来解码
    if (decode) {
      copyTradingStore.openPositionSellModelValue.split('|').map((item, idx) => {
        switch(idx) {
          case 0:
            copyTradingStore.openPositionSellModelTakeProfitRatioValue = +(item || 0)
            break
          case 1:
            copyTradingStore.openPositionSellModelStopLossRatioValue = +(item || 0)
            break
          default:
        }
      })
    } else {
      copyTradingStore.openPositionSellModelValue = `${copyTradingStore.openPositionSellModelTakeProfitRatioValue || ''}|${copyTradingStore.openPositionSellModelStopLossRatioValue || ''}`
    }
  }

  const handleQuickerOpenPosition = async () => {
    // update
    copyTradingStore.copyTradingSearchTargetAddress = copyTradingStore.quickerOpenPositionTargetAddress

    handleSearchTargetAddress()
    // reset
    copyTradingStore.resetQuickerOpenPosition()

    // 查询是否有跟单这个地址
    await reqStore.copyTradingFindByAddress(accountStore, copyTradingStore)

    const hasQuickerOpenPositionItem = !!copyTradingStore.quickerOpenPositionItem

    copyTradingStore.isOpenPositionTargetEdit = hasQuickerOpenPositionItem // 编辑模式

    if (hasQuickerOpenPositionItem) {
      const { address, note, leverage, buyModel, buyModelValue, sellModel, sellModelValue } = copyTradingStore.quickerOpenPositionItem
      // sync
      merge(copyTradingStore, {
        copyTradingSearchTargetAddress: address,
        openPositionTargeNote: note,
        openPositionLeverage: leverage,
        openPositionBuyModel: buyModel,
        openPositionBuyModelValue: buyModelValue,
        openPositionSellModel: sellModel,
        openPositionSellModelValue: sellModelValue,
      })
    }
  }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      // 快捷跟单模式
      if (copyTradingStore.quickerOpenPositionTargetAddress) {
        handleQuickerOpenPosition()
        return
      }

      if (copyTradingStore.operaCopyTradingTargetItemIdx >= 0 && copyTradingStore.operaCopyTradingTargetItem && copyTradingStore.isOpenPositionTargetEdit) {
        const { address, note, leverage, buyModel, buyModelValue, sellModel, sellModelValue } = copyTradingStore.operaCopyTradingTargetItem

        // sync
        merge(copyTradingStore, {
          copyTradingSearchTargetAddress: address,
          openPositionTargeNote: note,
          openPositionLeverage: leverage,
          openPositionBuyModel: buyModel,
          openPositionBuyModelValue: buyModelValue,
          openPositionSellModel: sellModel,
          openPositionSellModelValue: sellModelValue,
        })

        // 显示仓位
        handleSearchTargetAddress()
        handleSyncOpenPositionSellModelValue(true)
      }

      // NOTE: 编辑模式，不自动焦点到Address Search
      if (copyTradingStore.isOpenPositionTargetEdit) return
      // NOTE: 解决弹框刚显示后，input 无法获取焦点的现象
      await sleep(250)
      if (copyTradingStore.openCopyTradingTarget && inputTargetAddressRef.current) {
        inputTargetAddressRef.current.focus()
      }
    }

    if (!copyTradingStore.openCopyTradingTarget || !accountStore.logged) return

    // reset
    copyTradingStore.resetCopyTradingTarget()
    copyTradingStore.resetOpenPosition()

    asyncFunc()

  }, [copyTradingStore.openCopyTradingTarget])

  useEffect(() => {
    const asyncFunc = async () => {
      try {
        // 获取查询参数
        const queryParams = new URLSearchParams(location.search);
        const cctAddress = queryParams.get(constants.paramKey.copyTradingTargetAddress);

        if (cctAddress && isAddress(cctAddress)) {

          // 进入快速跟单模式
          copyTradingStore.openCopyTradingTarget = true
          await sleep(300)
          copyTradingStore.quickerOpenPositionTargetAddress = cctAddress
          handleQuickerOpenPosition()
        }

      } catch (error) {
        console.log(error);
      }
    }

    asyncFunc()
  }, [location, accountStore.logged])

  return (
    <BaseModal
      title={t(copyTradingStore.isOpenPositionTargetEdit ? 'common.editCopyTrading' : 'common.createCopyTrading')}
      width={980}
      open={copyTradingStore.openCopyTradingTarget}
      onClose={handleClose}
    >
      <div className='d-flex flex-wrap gap-3'>
        <div className='d-flex flex-column col-12 col-md gap-1'>
          <Busy spinning={reqStore.copyTradingTargetPositionBusy}>
            <InputSearch
              ref={inputTargetAddressRef}
              value={copyTradingStore.copyTradingSearchTargetAddress}
              className='br-2'
              placeholder={t('copyTrading.searchCopyTradingAddress')}
              onPressEnter={handleSearchTargetAddress}
              readOnly={copyTradingStore.isOpenPositionTargetEdit}
              disabled={copyTradingStore.isOpenPositionTargetEdit}
              onChange={(value) => copyTradingStore.copyTradingSearchTargetAddress = value}
              onSearch={handleSearchTargetAddress}
            />
          </Busy>

          <div className='d-flex flex-wrap gap-1'>
            {
              [
                { label: t('common.totalPositionValue'), className: 'col', content: <>{ copyTradingStore.copyTradingTargetTotalPositionValue ? `$ ${ formatNumber(copyTradingStore.copyTradingTargetTotalPositionValue) }` : '-' }</> },
                { label: t('common.totalUPnL'), className: 'col', content: <span className={`${copyTradingStore.copyTradingTargetTotalUPnlStatusClassName}`}>{ copyTradingStore.copyTradingTargetTotalUPnl ? `$ ${ formatNumber(copyTradingStore.copyTradingTargetTotalUPnl) }` : '-' }</span> },
              ].map((item, idx) =>
              <div key={idx} className={`d-flex flex-column gap-2 justify-content-between bg-gray-alpha-4 p-3 br-1 ${ item.className }`} style={{ marginTop: '-2px', marginLeft: idx ? '-2px' : '0' }}>
                <span className='d-flex gap-2 color-secondary'>{ item.label }</span>
                <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
              </div>)
            }
          </div>
          <ColumnList height={400} columns={targetPosition} data={copyTradingStore.copyTradingTargetPositionList} busy={false} renderItem={renderPositionItem} className='br-2' />
        </div>

        <div className='d-flex flex-column col-12 col-md'>
          {
            [
              { label: t('common.addressNote'), content: <Input value={copyTradingStore.openPositionTargeNote} className='br-2' placeholder={`(${t('common.optional')})`} onChange={(e) => copyTradingStore.openPositionTargeNote = e.target.value.trim() }/> },
              { label: t('common.tradeStrategy'), content:
                  <div className='d-flex flex-column gap-2 col'>
                    <Radio.Group block value={copyTradingStore.openPositionTradeStrategyValue} onChange={(e) => copyTradingStore.openPositionTradeStrategyValue = e.target.value }>
                      { copyTradingStore.openPositionTradeStrategyRadios.map((item, idx) => <Radio.Button key={idx} value={item.value}>{ item.i18n ? t(item.i18n) : item.label}</Radio.Button>)}
                    </Radio.Group>
                  </div>
              },
              { label: t('common.leverage'), content:
                <span className='d-flex col'>
                  <Slider className='col-9 m-0 mx-3' marks={{1: `${copyTradingStore.openPositionLeverageMin}x`, 5: '5x', 10: '10x', 25: '25x', 40: `${copyTradingStore.openPositionLeverageMax}x`}} step={1} value={copyTradingStore.openPositionLeverage} min={copyTradingStore.openPositionLeverageMin} max={copyTradingStore.openPositionLeverageMax} onChange={(val) => copyTradingStore.openPositionLeverage = val} />
                  <span className='ps-4'>
                    <Input className='col br-2' value={copyTradingStore.openPositionLeverage} onChange={(e) => {
                      const value = e.target.value

                      if (!inputIsNumber(value)) return
                      const num = +value
                      copyTradingStore.openPositionLeverage = Math.min(Math.max(copyTradingStore.openPositionLeverageMin, num), copyTradingStore.openPositionLeverageMax)
                    } }/>
                  </span>
                </span>
              },
              { label: t('common.followBuyMode'), content:
                  <div className='d-flex flex-column gap-2 col'>
                    <Radio.Group block value={copyTradingStore.openPositionBuyModel} onChange={(e) => copyTradingStore.openPositionBuyModel = e.target.value }>
                      { copyTradingStore.openPositionBuyModelRadios.map((item, idx) => <Radio.Button key={idx} value={item.value}>{ item.i18n ? t(item.i18n) : item.label}</Radio.Button>)}
                    </Radio.Group>
                    <div className='d-flex flex-column gap-1 mt-1'>
                      { copyTradingStore.openPositionBuyModel === 1 &&
                        <>
                          <Input prefix='$' value={copyTradingStore.openPositionBuyModelValue} className='br-2' placeholder={`${t('copyTrading.setFixedCopyBuyingAmount')} (USD)`} onChange={(e) => {
                            const value = e.target.value

                            if (!inputIsNumber(value)) return
                            copyTradingStore.openPositionBuyModelValue = value
                          }} />
                        </>
                      }
                      { copyTradingStore.openPositionBuyModel === 3 &&
                          <Input prefix='$' value={copyTradingStore.openPositionBuyModelValue} className='br-2' placeholder={`${t('copyTrading.setMaximumCopyBuyingAmount')} (USD)`} onChange={(e) => {
                            const value = e.target.value
                            if (!inputIsNumber(value)) return
                            copyTradingStore.openPositionBuyModelValue = value
                          }} />
                      }
                    </div>
                  </div>
              },
              { label: t('common.followSellMode'), content:
                <div className='d-flex flex-column gap-2 col'>
                  <Radio.Group block value={copyTradingStore.openPositionSellModel} onChange={(e) => copyTradingStore.openPositionSellModel = e.target.value}>
                    { copyTradingStore.openPositionSellModelRadios.map((item, idx) => <Radio.Button key={idx} value={item.value}>{ item.i18n ? t(item.i18n) : item.label}</Radio.Button>)}
                  </Radio.Group>
                  <div className='d-flex gap-1 mt-1'>
                    { copyTradingStore.openPositionSellModel === 3 &&
                      <>
                        <div className='d-flex flex-column gap-2 col'>
                          <span className='d-flex align-items-center gap-2'><small className='color-secondary'>{t('common.takeProfit')}</small> { copyTradingStore.openPositionSellModelTakeProfitRatioValue }%</span>
                          <Slider className='col-9 m-0 ms-3 mb-3' marks={{0: '0%', 50: '50%', 100: '100%'}} step={5} value={copyTradingStore.openPositionSellModelTakeProfitRatioValue} min={0} max={100} onChange={(val) => {
                            copyTradingStore.openPositionSellModelTakeProfitRatioValue = val
                            handleSyncOpenPositionSellModelValue()
                          }} />
                        </div>
                        <div className='d-flex flex-column gap-2 col'>
                          <span className='d-flex align-items-center gap-2'><small className='color-secondary'>{t('common.stopLoss')}</small>{ copyTradingStore.openPositionSellModelStopLossRatioValue }%</span>
                          <Slider className='col-9 m-0 ms-3 mb-3' marks={{0: '0%', 50: '50%', 100: '100%'}} step={5} value={copyTradingStore.openPositionSellModelStopLossRatioValue} min={0} max={100} onChange={(val) => {
                            copyTradingStore.openPositionSellModelStopLossRatioValue = val
                            handleSyncOpenPositionSellModelValue()
                          }} />
                        </div>
                        {/* <Input value={copyTradingStore.openPositionSellModelTakeProfitRatioValue} className='br-2' placeholder='' onChange={(e) => {
                            const value = e.target.value.trim()
                            if (!inputIsNumber(value)) return
                            // update
                            // copyTradingStore.openPositionSellModelTakeProfitRatioValue = value
                            handleSyncOpenPositionSellModelValue()
                            // copyTradingStore.openPositionSellModelValue
                          }} /> */}
                        {/* <Input value={copyTradingStore.openPositionSellModelStopLossRatioValue} className='br-2' placeholder='' onChange={(e) => {
                            const value = e.target.value.trim()
                            if (!inputIsNumber(value)) return
                            // update
                            // copyTradingStore.openPositionSellModelStopLossRatioValue = value
                            // handleSyncOpenPositionSellModelValue()
                            // copyTradingStore.openPositionSellModelValue
                          }} /> */}
                      </>
                    }
                  </div>
                </div>
               },
            ].map((item, idx) =>
            <div key={idx} className='d-flex flex-column gap-2 justify-content-between bg-gray-alpha-4 p-3 br-1' style={{ marginTop: '-2px' }}>
              <span className='d-flex gap-2 color-secondary'>{ item.label }</span>
              <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
            </div>)
          }
          <div className='d-flex justify-content-end pt-4 mt-auto'>
            <ColumnTooltip title={
              copyTradingStore.openPositionSellModel === 3 && !copyTradingStore.openPositionSellModelTakeProfitRatioValue && !copyTradingStore.openPositionSellModelStopLossRatioValue && t('copyTrading.takeProfitStopLossWarning')
                || ''
            }>
              <Button size='small'
                disabled={
                  !copyTradingStore.copyTradingTargetAddress
                    || copyTradingStore.openPositionSellModel === 3 && !copyTradingStore.openPositionSellModelTakeProfitRatioValue && !copyTradingStore.openPositionSellModelStopLossRatioValue
                } type='primary' loading={reqStore.copyTradingCreateCopyTradingBusy} className='d-flex align-items-center justify-content-center  fw-bold br-4 px-3 col gap-2' onClick={handleSubmit}>
                {
                  (copyTradingStore.openPositionSellModel === 3 && !copyTradingStore.openPositionSellModelTakeProfitRatioValue && !copyTradingStore.openPositionSellModelStopLossRatioValue)
                    && <IOutlineInfoCircle className='zoom-90' />
                }
                { t(copyTradingStore.isOpenPositionTargetEdit ? 'common.edit' : 'common.create' )}
              </Button>
            </ColumnTooltip>
          </div>
        </div>
      </div>

      {/* 支持未登录引导 */}
      {
        !accountStore.logged &&
          <div className='d-flex flex-column align-items-center position-full justify-content-center bg-black-thin gap-3 position-absolute z-index-99'>
            <LoginBtn />
            <span className="color-secondary fw-500">
              {t('common.loginRequired')}
            </span>
          </div>
      }

    </BaseModal>
  );
};

export default ModalCreateCopyTrading;