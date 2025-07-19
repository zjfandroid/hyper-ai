import { useEffect } from 'react'
import { Button, Progress, Popconfirm, Tooltip, Dropdown, message, Select } from 'antd'
import dayjs from 'dayjs'
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import BN from 'bignumber.js'
import { isAddress } from 'viem'

import { IOutlineMoreSquare, IShare, IOutlineCopy, IOutlineEdit, IOutlineAdd, IOutlineShare, IOutlineMonitor, IOutlineTrash } from '@/components/icon'
import { formatNumber, merge } from '@/utils'
import { constants, useAccountStore, useTraderDetailsOpenOrdersAdditionalStore, usePrivateWalletStore, useReqStore, useCopyTradingStore } from '@/stores'
import ColumnTooltip from '@/components/Column/Tooltip'
import ColumnList from '@/components/Column/List'
import TabBase from '@/components/Tab/Base'
import ModalClosePosition from '@/components/Modal/ClosePosition'
import TabSwitch from '@/components/Tab/Switch'
import ModalCreateCopyTrading from '@/components/Modal/CreateCopyTrading'
import PositionItemDirectionLeverage from '@/components/PositionItem/DirectionLeverage'
import PositionItemPositionValue from '@/components/PositionItem/PositionValue'
import PositionItemUPnl from '@/components/PositionItem/UPnl'
import PositionItemAddress from '@/components/PositionItem/Address'
import PositionItemMarginUsedRatio from '@/components/PositionItem/MarginUsedRatio'
import ModalCreatePrivateWallet from '@/components/Modal/CreatePrivateWallet'
import ModalDeposit from '@/components/Modal/Deposit'
import ModalExportPrivateKey from '@/components/Modal/ExportPrivateKey'
import ModalRemoveWallet from '@/components/Modal/RemoveWallet'
// import ModalWithdraw from '@/components/Modal/Withdraw'
import SideButtonIcon from '@/components/Side/ButtonIcon'
import TimeAgo from '@/components/TimeAgo'
import ModalShareCopyTrade from '@/components/Modal/ShareCopyTrade'
import ButtonIcon from '@/components/ButtonIcon'

import TraderDetailsNonFunding from '@/views/TraderDetails/NonFunding'
import TraderDetailsRecentFills from '@/views/TraderDetails/RecentFills'
import TraderDetailsTWAP from '@/views/TraderDetails/TWAP'
import { TraderDetailsOpenOrdersAdditional } from '@/views/TraderDetails/OpenOrdersAdditional'
import TraderDetailsHistoricalOrders from '@/views/TraderDetails/HistoricalOrders'

const CopyTrading = () => {
  const accountStore = useAccountStore()
  const reqStore = useReqStore()
  const privateWalletStore = usePrivateWalletStore()
  const copyTradingStore = useCopyTradingStore()
  const traderDetailsOpenOrdersAdditionalStore = useTraderDetailsOpenOrdersAdditionalStore()
  const { t, i18n } = useTranslation()

  const ownWalletsColumn = [
    { id: 'walletId', label: t('common.walletId'), className: 'd-none d-lg-flex col-lg-1' },
    { id: 'address', label: t('common.address'), className: 'col-5 col-sm-2 col-md-2 col-xl-2' },
    { id: 'createTs', label: t('common.createTime'), className: 'justify-content-end d-none d-xl-flex col-xl-1' },
    { id: 'balance', label: t('common.balance'), className: 'justify-content-end text-end col-6 col-sm-3 col-md-2 col-xl-2' },
    { id: 'uPnl', label: t('common.uPnl'), className: 'justify-content-end d-none d-md-flex col-md-2 col-xl-2' },
    { id: 'marginUsed', label: t('common.marginUsed'), className: 'justify-content-end d-none d-sm-flex col-3 col-md-2 col-xl-2' },
    { id: 'withdrawable', label: t('common.withdrawable'), className: 'justify-content-end d-none d-sm-flex col-sm-3 col-md-2 col-xl-1' },
    { id: 'operator', label: '', className: 'justify-content-end text-end col' },
  ]

  const ownCopyTradesColumn = [
    { id: 'note', label: t('common.addressNote'), className: 'd-none d-md-block col-md-2 col-xl-1' },
    { id: 'address', label: t('common.address'), className: 'col-3 col-md-3 col-xl-2' },
    { id: 'balance', label: t('common.balance'), className: 'justify-content-end text-end col-3 col-md-2 col-xl-2' },
    { id: 'pnl', label: t('common.pnl'), className: 'justify-content-end text-end col-3 col-md-3' },
    { id: 'marginUsedRatio', label: t('common.marginUsedRatio'), className: 'justify-content-end text-end d-none d-xl-flex col-xl-2' },
    { id: 'operator', label: '', className: 'justify-content-end text-end col' },
  ]

  const tabPosition = [
    { id: 'walletId', label: t('common.walletId'), className: 'd-none d-xl-flex col-xl-1' },
    { id: 'symbol', label: t('common.symbol'), className: 'col-2 col-sm-2 col-md-1 col-xl-1' },
    { id: 'leverage', label: t('common.directionLeverage'), className: 'd-none d-sm-flex col-sm-2 col-md-2 col-lg-1' },
    { id: 'positionValue', label: t('common.positionValue'), className: 'justify-content-end text-end col-3 col-md-2 col-xl-2' },
    { id: 'uPnl', label: t('common.uPnl'), className: 'justify-content-end text-end col-3 col-sm-2 col-md-2 col-lg-1' },
    { id: 'margin', label: t('common.margin'), className: 'justify-content-end text-end d-none d-md-flex col-md-2 col-lg-2 col-xl-2' },
    { id: 'openingPrice', label: t('common.openingPrice'), className: 'justify-content-end text-end d-none d-xl-flex col-xl-1' },
    { id: 'markPrice', label: t('common.markPrice'), className: 'justify-content-end text-end d-none d-lg-flex col-lg-2 col-xl-1 ' },
    { id: 'liquidationPrice', label: t('common.liquidationPrice'), className: 'justify-content-end text-end d-none d-md-flex col-md-1 col-xl-1' },
    { id: 'operator', label: '', className: 'ms-auto justify-content-end' },
  ]

  const renderOwnWalletItem = (item, columnIndex) => {
    switch (ownWalletsColumn[columnIndex].id) {
      case 'walletId':
        return item.walletId
      case 'address':
        return <PositionItemAddress item={item} />
      case 'createTs':
        return <TimeAgo ts={item.createTs} />
      case 'balance':
        return <>$ {formatNumber(item.balance)}</>
      case 'uPnl':
        return <span className={`${ item.uPnlStatusClassName }`} >$ {new BN(item.uPnl).gt(0) && '+'}{formatNumber(item.uPnl)}</span>
      case 'marginUsed':
        return <>$ {formatNumber(item.totalMarginUsed)}</>
      case 'withdrawable':
        return <>$ {formatNumber(item.withdrawable)}</>
      case 'operator':
        return (
          <Dropdown placement="bottomRight" className='br-4'
            menu={{ items: [
              { content: <div onClick={() => merge(privateWalletStore, { openExportPrivateKey: true, operaWalletIdx: item.idx}) }>{ t('common.exportPrivateKey') }</div> },
              { content: <div onClick={() => merge(privateWalletStore, { openDeposit: true, operaWalletIdx: item.idx}) }>{ t('common.deposit') }</div> },
              // { content: <div onClick={() => merge(privateWalletStore, { openWithdraw: true, operaWalletIdx: item.idx}) }>Withdraw</div> },
              { danger: true, content: <div onClick={() => merge(privateWalletStore, { openRemove: true, operaWalletIdx: item.idx}) }>{ t('common.removeWallet') }</div> },
            ].map((item, idx) => ({ key: idx, label: item.content, danger: item.danger }))}}>
            <IOutlineMoreSquare className='linker' />
          </Dropdown>
        )
      default:
        return null
    }
  }

  const renderOwnCopyTradesItem = (item, columnIndex) => {
    switch (ownCopyTradesColumn[columnIndex].id) {
      case 'address':
        return <PositionItemAddress item={item} />
      case 'note':
        return item.note
      case 'balance':
        return <>$ {formatNumber(item.balance)}</>
      case 'marginUsedRatio':
        return <PositionItemMarginUsedRatio item={item} />
      case 'pnl':
        return (
          <span className={`${ item.pnlStatusClassname }`} >
            $ {new BN(item.pnl).gt(0) && '+'}{formatNumber(item.pnl)}
          </span>
        )
      case 'operator':
        return (
          <span className='d-flex gap-3 align-items-center justify-content-end'>
            {
              [
                { icon: <IShare className='zoom-85' />, title: t('common.share'), onClick: () => handleOpenShareCopyTrade(item) },
                { icon: <IOutlineEdit className='zoom-85' />, title: t('common.editCopyTrading'), onClick: () => handleOpenCreateCopyTrade(item, true) },
                { icon: <Popconfirm title={t('common.removeCopyTrading')} onConfirm={() => handleOpenRemoveCopyTrade(item)} okText={t('common.remove')} icon={<IOutlineTrash className='zoom-80' />} showCancel={false}><IOutlineTrash className='zoom-90 linker' /></Popconfirm>, title: t('common.removeCopyTrading'), logged: true},
              ].map((item, idx) => <SideButtonIcon key={idx} title={item.title} onClick={item.onClick} logged={item.logged} icon={item.icon} />)
            }
          </span>
        )
      default:
        return null
    }
  }

  const renderPositionItem = (item, columnIndex) => {
    switch (tabPosition[columnIndex].id) {
      case 'walletId':
        return item.walletId
      case 'symbol':
        return item.coin
      case 'leverage':
        return <PositionItemDirectionLeverage item={item} />
      case 'positionValue':
        return <PositionItemPositionValue item={item} />
      case 'uPnl':
        return <PositionItemUPnl item={item} />
      case 'openingPrice':
        return <>$ {item.openPrice}</>
      case 'liquidationPrice':
        return item.liquidationPrice
          ? <>$ {item.liquidationPrice}</>
          : '-'
      case 'margin':
        return <>$ { formatNumber(item.marginUsed) }</>
      case 'markPrice':
        return <>$ { item.markPrice }</>
      case 'operator':
        return <div className='hover-primary br-4 px-2 py-1 fw-500' onClick={() => merge(copyTradingStore, { openClosePosition: true, operaPositionIdx: item.idx}) }>{ t('common.closeAll')}</div>
      default:
        return null
    }
  }

  const handleOpenCreateCopyTrade = (item?: any, edit: boolean = false) => {
    copyTradingStore.isOpenPositionTargetEdit = edit

    if (edit) {
      copyTradingStore.operaCopyTradingTargetItemIdx = item.idx
    }

    // NOTE: 同步完，最后打开弹窗
    copyTradingStore.openCopyTradingTarget = true
  }

  const handleOpenShareCopyTrade = async (item: any) => {
    copyTradingStore.shareCopyTradeAddress = item.address

    copyTradingStore.openShareCopyTrade = true
  }

  const handleOpenRemoveCopyTrade = async (item: any) => {
    // sync
    copyTradingStore.operaCopyTradingTargetItemIdx = item.idx

    const { error } = await reqStore.copyTradingRemoveMyCopyTrading(accountStore, copyTradingStore)

    if (error) return

    // update
    await reqStore.copyTradingMyCopyTrading(accountStore, copyTradingStore)
  }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      await reqStore.userPrivateWallet(accountStore, privateWalletStore)
      await reqStore.copyTradingMyCopyTrading(accountStore, copyTradingStore)
      await reqStore.copyTradingMyPosition(accountStore, copyTradingStore)
    }

    if (!accountStore.logged) {
      privateWalletStore.reset()
      copyTradingStore.reset()
      return
    }

    asyncFunc()
    return () => {
      privateWalletStore.reset()
      copyTradingStore.reset()
    }
  }, [accountStore.logged])

  return (
    <>
      {/* <div className='pt-5 mt-5'>
        <Button onClick={() => privateWalletStore.openDeposit = true }>openDeposit</Button>
        <Button onClick={() => privateWalletStore.openWithdraw = true }>openWithdraw</Button>
      </div> */}
      {/* <div className='mt-4'></div> */}

      <div className="container-fluid px-0 d-flex flex-column my-5 pt-5">
        <div className="container-xl d-flex flex-column px-3 px-md-4 gap-3 gap-md-4 my-3 my-md-5 py-0">
          <div className="d-flex gap-4 align-items-center justify-content-between col">
            <h4 className="fw-bold">{ t('common.myWallets') }</h4>
            <div>
              <ColumnTooltip title={ privateWalletStore.list.length ? t('copyTrading.walletCreationLimit') : '' }>
                <>
                  <ButtonIcon type='primary' logged icon={<IOutlineAdd />} disabled={!!privateWalletStore.list.length} className='gap-1 fw-bold px-3 br-4' onClick={() => privateWalletStore.openCreatePrivateWallet = true }>
                    <span className='d-none d-sm-block'>{ t('common.createWallet') }</span>
                  </ButtonIcon>
                </>
              </ColumnTooltip>
            </div>
          </div>
          <ColumnList className='br-3' logged columns={ownWalletsColumn} data={privateWalletStore.list} busy={reqStore.userPrivateWalletBusy} renderItem={renderOwnWalletItem} />
        </div>

        <div className="container-xl d-flex flex-column px-3 px-md-4 gap-3 gap-md-4 my-3 my-md-5 py-0">
          <div className="d-flex gap-4 align-items-center justify-content-between col">
            <h4 className="d-flex gap-3 align-items-center fw-bold">
              <IOutlineShare className='zoom-110' />{ t('common.copyTradingTarget') }
              {
                accountStore.logged && <span>({copyTradingStore.copyTradingList.length})</span>
              }
            </h4>
            <div>
              <ButtonIcon type='primary' logged icon={<IOutlineAdd />} className='gap-1 fw-bold px-3 br-4' onClick={() => handleOpenCreateCopyTrade() }><span className='d-none d-sm-block'>{ t('common.createCopyTrading') }</span></ButtonIcon>
            </div>
          </div>
          <ColumnList className='br-3' logged columns={ownCopyTradesColumn} data={copyTradingStore.copyTradingList} busy={reqStore.copyTradingMyCopyTradingBusy} renderItem={renderOwnCopyTradesItem} />
        </div>

        <div className="container-xl d-flex flex-column px-3 px-md-4 gap-3 gap-md-4 my-3 my-md-5 py-0">
          <div className='d-flex flex-column br-3 overflow-hidden'>
            <TabSwitch
              labelSuffixes={[` (${copyTradingStore.positionList.length})`, ` (${traderDetailsOpenOrdersAdditionalStore.list.length})`]}
              data={copyTradingStore.tabs}
              currId={copyTradingStore.tabId}
              onClick={(item) => copyTradingStore.tabId = item.id} />
            {
              copyTradingStore.tabId === 'positions' &&
                <ColumnList columns={tabPosition} logged data={copyTradingStore.positionList} busy={reqStore.copyTradingMyPositionBusy} renderItem={renderPositionItem} />
            }
            {
              copyTradingStore.tabId === 'openOrders' &&
                <TraderDetailsOpenOrdersAdditional address={privateWalletStore.addresses[0]} />
            }
            {
              copyTradingStore.tabId === 'historicalOrders' &&
                <TraderDetailsHistoricalOrders address={privateWalletStore.addresses[0]} />
            }
            {
              copyTradingStore.tabId === 'recentFills' &&
                <TraderDetailsRecentFills address={privateWalletStore.addresses[0]} />
            }
            {
              copyTradingStore.tabId === 'completedTrades' &&
                <>completedTrades</>
            }
            {
              copyTradingStore.tabId === 'twap' &&
                <TraderDetailsTWAP address={privateWalletStore.addresses[0]} />
            }
            {
              copyTradingStore.tabId === 'depositsAndWithdrawals' &&
                <TraderDetailsNonFunding address={privateWalletStore.addresses[0]} />
            }
          </div>
        </div>
      </div>

      <ModalCreatePrivateWallet />
      <ModalDeposit />
      <ModalExportPrivateKey />
      <ModalRemoveWallet />
      <ModalClosePosition />
      <ModalCreateCopyTrading />
      {/* <ModalWithdraw /> */}
      <ModalShareCopyTrade />
    </>
  )
}

export default CopyTrading