import { useEffect } from 'react'
import { Button, Progress, Popconfirm, Tooltip, Dropdown, message, Select, Input, Radio } from 'antd'
import BN from 'bignumber.js'
import { isAddress } from 'viem'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { IOutlineMoreSquare, IOutlineCopy, IOutlineMedal, IOutlineAdd, IOutlineArrowUp1, IOutlineShare, ICyclical, IOutlineSearchNormal1 } from '@/components/icon'
import { addressShortener, formatNumber, merge } from '@/utils'
import { constants, useAccountStore, usePrivateWalletStore, useLeaderboardPointReferralStore, useLeaderboardPointOverallStore, useReqStore, useCopyTradingStore, useLeaderboardStore } from '@/stores'
import ColumnTooltip from '@/components/Column/Tooltip'
import ColumnList from '@/components/Column/List'
import TabSwitch from '@/components/Tab/Switch'
import CandlestickSingle from '@/components/Candlestick/Single'
import InputSearch from '@/components/Input/Search'
import ModalCreateCopyTrading from '@/components/Modal/CreateCopyTrading'
import SideButtonIcon from '@/components/Side/ButtonIcon'
import PositionItemAddress from '@/components/PositionItem/Address'
import DropdownMenu from '@/components/Dropdown/Menu'

import LeaderboardPointsOverall from './PointsOverall'
import LeaderboardPointsReferral from './PointsReferral'

const Leaderboard = () => {
  const accountStore = useAccountStore()
  const copyTradingStore = useCopyTradingStore()
  const reqStore = useReqStore()
  const leaderboardStore = useLeaderboardStore()
  const leaderboardPointOverallStore = useLeaderboardPointOverallStore()
  const { t, i18n } = useTranslation()

  const profitColumn = [
    { id: 'rank', label: t('common.rank'), className: 'd-none d-lg-flex col-xl-1' },
    { id: 'address', label: t('common.address'), className: 'col-5 col-sm-3 col-md-2 col-xl-2' },
    { id: 'totalValue', sort: true, label: t('common.accountValue'), className: 'text-end justify-content-end col-6 col-sm-3 col-md-2 col-xl-2' },
    { id: 'pnl', sort: true, cycle: true, label: t('common.pnl'), className: 'justify-content-end d-none d-md-flex col-md-3 col-xl-2' },
    { id: 'roi', sort: true, cycle: true, label: t('common.roi'), className: 'justify-content-end d-none d-sm-flex col-sm-3 col-md-2 col-xl-2' },
    { id: 'volume', sort: true, cycle: true, label: t('common.volume'), className: 'justify-content-end d-none d-lg-flex col-3 col-md-2 col-xl-2' },
    { id: 'operator', label: '', className: 'justify-content-end text-end col' },
  ]

  const searchProfitColumn = [
    { id: 'cycle', label: t('common.cycle'), className: 'col-2' },
    { id: 'pnl', label: t('common.pnl'), className: 'justify-content-end text-end col col-md-3 col-xl-3' },
    { id: 'roi', label: t('common.roi'), className: 'justify-content-end text-end col col-md-3 col-xl-3' },
    { id: 'volume', label: t('common.volume'), className: 'justify-content-end d-none d-md-flex col-md' },
  ]

  const coinColumn = [
    { id: 'symbol', label: t('common.symbol'), className: 'col-2 col-sm-2 col-md-1' },
    { id: 'lastPrice', label: t('common.lastPrice'), className: 'text-end justify-content-end col-4 col-sm-2 col-md-2 col-xl-2' },
    { id: 'priceChange24h', label: t('common.twentyFourHChange'), className: 'd-flex text-end justify-content-end col-6 col-sm-5 col-md-3 col-xl-3' },
    { id: 'funding8h', label: t('common.eightHFunding'), className: 'justify-content-end d-none d-sm-flex col-sm-3 col-md-3 col-xl-2' },
    { id: 'volume', label: t('common.twentyFourHVolume'), className: 'justify-content-end d-none d-md-flex col-3 col-md-3 col-xl-2' },
    { id: 'openInterest', label: t('common.openInterest'), className: 'justify-content-end d-none d-lg-flex col-lg-2' },
    // { id: 'operator', label: '', className: 'col text-end' },
  ]


  const renderProfitColumn = (item, columnIndex) => {
    switch (profitColumn[columnIndex].id) {
      case 'rank':
        return item.rank > 3
          ? <div className='w-24 text-center'>{ item.rank }</div>
          : <IOutlineMedal className={`flex-shrink-0 ${item.rank === 1 && 'color-gold' || item.rank === 2 && 'color-silver' || item.rank === 3 && 'color-bronze'}`} />
      case 'address':
        return <PositionItemAddress item={item} />
      case 'totalValue':
        return <>$ {formatNumber(item.totalValue)}</>
      case 'pnl':
        return <span className={`${ item.pnlStatusClassName }`} >
            {item.pnl !== 'NaN' ? <>$ {new BN(item.pnlStatus).gt(0) && '+'}{formatNumber(item.pnl)}</> : '-' }
          </span>
      case 'roi':
        return <span className={`${ item.roiStatusClassName }`} >
            { item.roi!== 'NaN' ? <>{new BN(item.roiStatus).gt(0) && '+'}{formatNumber(item.roi)} %</> : '-' }
          </span>
      case 'volume':
        return item.volume !== 'NaN' ? <>$ {formatNumber(item.volume)}</> : '-'
      case 'operator':
        return (
          <span className='d-flex gap-3 align-items-center justify-content-end'>
            {
              [
                { icon: <IOutlineSearchNormal1 className='zoom-85' />, title: t('common.viewHistory'), onClick: () => handleJumpSearchProfitAddress(item.address)  },
                { icon: <IOutlineShare className='zoom-85' />, title: t('common.copyTrading'), logged: true, onClick: () => handleOpenQuickerCreateCopyTrade(item) },
              ].map((item, idx) => <SideButtonIcon key={idx} title={item.title} onClick={item.onClick} logged={item.logged} icon={item.icon} />)
            }
          </span>
          )
      default:
        return null
    }
  }

  const renderSearchProfitColumn = (item, columnIndex) => {
    switch (searchProfitColumn[columnIndex].id) {
      case 'cycle':
        return t(leaderboardStore.CYCLE_KEYS[item.cycle]?.i18n)
      case 'totalValue':
        return <>$ {formatNumber(item.totalValue)}</>
      case 'pnl':
        return (
          <span className={`${ item.pnlStatusClassName }`} >
            {
              item.pnl !== 'NaN'
                ? <>$ {new BN(item.pnlStatus).gt(0) && '+'}{formatNumber(item.pnl)}</>
                : '-'
            }
          </span>
        )
      case 'roi':
        return (
          <span className={`${ item.roiStatusClassName }`} >
            {
              item.roi!== 'NaN'
                ? <>$ {new BN(item.roiStatus).gt(0) && '+'}{formatNumber(item.roi)}</>
                : '-'
            }
          </span>
        )
      case 'volume':
        return item.volume !== 'NaN' ? <>$ {formatNumber(item.volume)}</> : '-'
      default:
        return null
    }
  }

  const renderCoinColumn = (item, columnIndex) => {
    switch (coinColumn[columnIndex].id) {
      case 'symbol':
        return item.symbol
      case 'lastPrice':
        return <span>$ {item.price}</span>
      case 'volume':
        return (
          <span className='d-flex flex-column text-end'>
          $ {formatNumber(item.quoteVolume24h)}<br/>
          <small className='opacity-70'>{formatNumber(item.volume24h)} {item.symbol}</small>
          </span>
        )
      case 'openInterest':
        return (
          <span className='d-flex flex-column text-end'>
            {formatNumber(item.openInterest)}
            <small className='opacity-70'>{item.symbol}</small>
          </span>
        )
      case 'priceChange24h':
        return (
          <div className='d-flex gap-2'>
            <span className={`d-flex flex-column ${ item.priceChange24hClassName }`} >
              <span>$ {new BN(item.priceChange24hStatus).gt(0) && '+'}{formatNumber(item.priceChange24h)}</span>
              <small>{ item.priceChangePercent24h } %</small>
            </span>
            <CandlestickSingle width={8} height={36} high={item.high24h} low={item.low24h} open={item.open24h} close={item.close24h} formatPrice={(price) => `$ ${price}`} />
          </div>
          )
      case 'funding8h':
        return <>{new BN(item.funding8hStatus).gt(0) && '+'}{formatNumber(item.funding8h)} %</>
      default:
        return null
    }
  }

  // 快捷跟单
  const handleOpenQuickerCreateCopyTrade = (item?: any) => {
    copyTradingStore.quickerOpenPositionTargetAddress = item.address

    // NOTE: 同步完，最后打开弹窗
    copyTradingStore.openCopyTradingTarget = true
  }

  const handleProfitChangeSort = async (columnId: string) => {
    leaderboardStore.profitSortColumnId = columnId

    const { error } = await reqStore.leaderboardProfitList(accountStore, leaderboardStore)

    if (error) return
  }

  const handleSearchProfitAddress = async (address: string = '') => {
    // sync
    if (address) {
      leaderboardStore.searchProfitAddressInput = address
    }

    if (!isAddress(leaderboardStore.searchProfitAddressInput)) {
      message.error(t('message.pleaseInputAddress'))
      return
    }

    const { error } = await reqStore.leaderboardSearchProfit(accountStore, leaderboardStore)

    if (error) return
  }

  const handleJumpSearchProfitAddress = async (address: string = '') => {
    // 记录当前位置
    leaderboardStore.scrollY = window.scrollY || document.documentElement.scrollTop;
    window.scrollTo({
        top: 0,
        behavior: 'auto'
      });

    await handleSearchProfitAddress(address);
  }

  const handleChangeSelectCycle = async (value: string) => {
    leaderboardStore.selectedCycleValue = value
    await reqStore.leaderboardProfitList(accountStore, leaderboardStore)
  }

  const handleSearchProfitAddressClear = () => {
    leaderboardStore.resetSearchProfit()

    // 有记录则返回原来位置
    if (leaderboardStore.scrollY) {
      setTimeout(() => {
        window.scrollTo({
          top: leaderboardStore.scrollY,
          behavior: 'auto'
        })
        // reset
        leaderboardStore.scrollY = 0
      }, 100)
    }
  }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      if (leaderboardStore.mainTypeValue === 'market') {
        switch(leaderboardStore.marketTabId) {
          case 'profit':
            await reqStore.leaderboardProfitList(accountStore, leaderboardStore)
            break
          case 'gainer':
          case 'newly':
          case 'popular':
          case 'loser':
          case 'volume':
            await reqStore.leaderboardCoinList(accountStore, leaderboardStore)
            break
          default:
        }
      }
    }

    asyncFunc()

    return () => {
      // NOTE: 都是覆盖当前 list，单页列表，所以可以不用reset
      // leaderboardStore.reset()
    }
  }, [leaderboardStore.mainTypeValue, leaderboardStore.marketTabId])

  return (
    <>
      {/* <div className='mt-4'></div> */}

      <div className="container-fluid px-0 d-flex flex-column my-5 pt-5">
        <div className="container-xl d-flex flex-column px-3 px-md-4 gap-3 gap-md-4 mb-3 mb-md-5 py-0">

          <div className="d-flex flex-column gap-4">
            <div className='d-flex flex-wrap justify-content-center justify-content-md-start my-5 py-5'>
              <div className='d-flex flex-column gap-5 col-12 col-md-7'>
                <div className="d-flex flex-column text-center text-md-start gap-4">
                  <h2 className='fw-bold'>{t('leaderboard.headline')}</h2>
                  <span className='h5 color-secondary col-12 col-md-10 text-center text-md-start'>{t('leaderboard.subheadline')}</span>
                  <div className="mt-1 col-12 col-md-10 col-lg-6">
                    <Radio.Group block value={leaderboardStore.mainTypeValue} onChange={(e) => leaderboardStore.mainTypeValue = e.target.value}>
                      { leaderboardStore.mainTypeRadios.map((item, idx) => <Radio.Button key={idx} value={item.value}>{ item.i18n ? t(item.i18n) : item.label}</Radio.Button>)}
                    </Radio.Group>
                  </div>
                </div>
              </div>
              <div className="d-none d-md-flex col align-items-center">
                {/* <img src={i18n.resolvedLanguage === 'zh-Hans' && IHomeBrainTriple4ZhHans || i18n.resolvedLanguage === 'zh-Hant' && IHomeBrainTriple4ZhHant ||  IHomeBrainTriple4} className="w-full" /> */}
              </div>
            </div>
          </div>

          {
            leaderboardStore.mainTypeValue === 'points' &&
              <div className='d-flex flex-column br-3 overflow-hidden'>
                <TabSwitch className='' data={leaderboardStore.pointsTabs} currId={leaderboardStore.pointsTabId} onClick={(item) => leaderboardStore.pointsTabId = item.id} />
                {
                  leaderboardStore.pointsTabId === 'overall' &&
                    <LeaderboardPointsOverall />
                }
                {
                  leaderboardStore.pointsTabId === 'referral' &&
                    <LeaderboardPointsReferral />
                }
              </div>
          }
          {
            leaderboardStore.mainTypeValue === 'market' &&
              <div className='d-flex flex-column br-3 overflow-hidden'>
                <TabSwitch className='' data={leaderboardStore.marketTabs} currId={leaderboardStore.marketTabId} onClick={(item) => leaderboardStore.marketTabId = item.id} />
                {
                  leaderboardStore.marketTabId === 'profit' &&
                    <>
                      <div className='d-flex align-items-center gap-3 py-3'>
                        <InputSearch size='small'
                          className='col'
                          value={leaderboardStore.searchProfitAddressInput}
                          placeholder={t('common.inputAddressTradersHistory')}
                          onChange={(value) => leaderboardStore.searchProfitAddressInput = value}
                          onSearch={() => handleSearchProfitAddress()}
                        />
                        {
                          leaderboardStore.searchProfitAddress
                            ? <Button type='primary' ghost className='gap-1 fw-bold px-3 br-4' size='small' onClick={() => handleSearchProfitAddressClear() }><IOutlineAdd className='rotate-45' />{t('common.clear')}</Button>
                            : <DropdownMenu buttonSize='small'
                                items={leaderboardStore.cycles}
                                selectedValue={leaderboardStore.selectedCycleValue}
                                onSelect={handleChangeSelectCycle}
                                icon={<ICyclical className='w-18' />} />
                        }
                      </div>
                      {
                        leaderboardStore.searchProfitAddress
                          ? <>
                              <div className='d-flex'>
                                <div className='d-flex flex-wrap gap-1 col pb-1' style={{ marginBottom: '-2px' }}>
                                  {
                                    [
                                      { label: t('common.address'), className: 'col', content: <PositionItemAddress shortener={false} item={{ address: leaderboardStore.searchProfitAddress }} />
                                    },
                                      { label: t('common.accountValue'), className: 'col', content: <>$ { formatNumber(leaderboardStore.searchProfitList[0]?.totalValue ?? '-') }</> },
                                    ].map((item, idx) =>
                                    <div key={idx} className={`d-flex flex-column gap-2 justify-content-between bg-gray-alpha-4 p-3 br-1 ${ item.className }`} style={{ marginTop: '-2px', marginLeft: idx ? '-2px' : '0' }}>
                                      <span className='d-flex gap-2 color-secondary'>{ item.label }</span>
                                      <span className='d-flex align-items-center gap-2 h6 fw-500'>{ item.content }</span>
                                    </div>)
                                  }
                                </div>
                              </div>
                              <ColumnList busy={reqStore.leaderboardSearchProfitBusy} columns={searchProfitColumn} data={leaderboardStore.searchProfitList} renderItem={renderSearchProfitColumn} />
                            </>
                          : <ColumnList busy={reqStore.leaderboardProfitListBusy} onlyDesc cycleLabel={leaderboardStore.CYCLE_KEYS[leaderboardStore.selectedCycleValue].label} columns={profitColumn} onChangeSort={handleProfitChangeSort} sortColumnId={leaderboardStore.profitSortColumnId} data={leaderboardStore.profitList} renderItem={renderProfitColumn} />
                      }
                    </>
                }
                {
                  leaderboardStore.marketTabId === 'gainer' &&
                    <ColumnList busy={reqStore.leaderboardCoinListBusy} columns={coinColumn} data={leaderboardStore.coinList} renderItem={renderCoinColumn} />
                }
                {
                  leaderboardStore.marketTabId === 'newly' &&
                    <ColumnList busy={reqStore.leaderboardCoinListBusy} columns={coinColumn} data={leaderboardStore.coinList} renderItem={renderCoinColumn} />
                }
                {
                  leaderboardStore.marketTabId === 'popular' &&
                    <ColumnList busy={reqStore.leaderboardCoinListBusy} columns={coinColumn} data={leaderboardStore.coinList} renderItem={renderCoinColumn} />
                }
                {
                  leaderboardStore.marketTabId === 'loser' &&
                    <ColumnList busy={reqStore.leaderboardCoinListBusy} columns={coinColumn} data={leaderboardStore.coinList} renderItem={renderCoinColumn} />
                }
                {
                  leaderboardStore.marketTabId === 'volume' &&
                    <ColumnList busy={reqStore.leaderboardCoinListBusy} columns={coinColumn} data={leaderboardStore.coinList} renderItem={renderCoinColumn} />
                }
              </div>
          }
        </div>
      </div>

      <ModalCreateCopyTrading />
    </>
  )
}

export default Leaderboard