import { useEffect } from 'react'
import { Button, Pagination, message, Radio } from 'antd'
import { isAddress } from 'viem'
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { useNavigate } from 'react-router-dom';

import { useDiscoverStore, useAccountStore, useReqStore } from '@/stores'
import { IOutlineSort, IOutlineCopy, IOutlineMedal, IOutlineAdd, IOutlineArrowRight1, IOutlineArrowUp1, IOutlineShare, ICyclical, IOutlineSearchNormal1 } from '@/components/icon'
import InputSearch from '@/components/Input/Search'
import DropdownMenu from '@/components/Dropdown/Menu'
import Busy from '@/components/Busy'
import ColumnNoData from '@/components/Column/NoData'
import TrackingAddressCard from '@/components/Tracking/AddressCard'
import TrackingCreateTrack from '@/components/Modal/TrackingCreateTrack'
import ModalCreateCopyTrading from '@/components/Modal/CreateCopyTrading'
import ModalTradingStatistics from '@/components/Modal/TradingStatistics'

import DiscoverKOL from './KOL'

const Discover = () => {
  const accountStore = useAccountStore()
  const reqStore = useReqStore()
  const discoverStore = useDiscoverStore()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate();

  const handleChangeSelectCycle = async (value: string) => {
    discoverStore.selectedCycleValue = value

    // 通过 cycle 进行的请求，要重置 list
    await handleUpdateList(true)
  }

  const handleSearchByAddress = async () => {
    const address = discoverStore.searchAddressInput

    if (!isAddress(address)) {
      message.error(t('message.pleaseInputAddress'))
      return
    }
    discoverStore.resetSearch()

    navigate(`/trader/${address}`)

    // update
    // discoverStore.searchAddress = address

    // 通过搜索
    // await handleUpdateList(true)
  }

  const handleUpdateList = async (reset: boolean = false) => {
    if (reset) {
      discoverStore.resetList()
    }

    const { error } = await reqStore.discoverList(accountStore, discoverStore)
  }

  const handleSortBy = async (item) => {
    // update
    discoverStore.sortByKey = item.id

    // 通过 sort 进行的请求，要重置 list
    await handleUpdateList(true)
  }
  const handleNextPagePush = async () => {
    // update
    discoverStore.next()

    await handleUpdateList()
  }

  // const handleSearchAddressClear = async () => {
  //   discoverStore.resetSearch()

  //   await handleUpdateList()
  // }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      await handleUpdateList()
    }

    asyncFunc()

    return () => {
      discoverStore.reset()
    }
  }, [])

  return (
    <>
      {/* <div className='mt-4'></div> */}

      <div className="container-fluid px-0 d-flex flex-column my-5 pt-5">
        <div className="container-xl d-flex flex-column px-3 px-md-4 gap-3 gap-md-4 mb-3 mb-md-5 py-0">

          <div className="d-flex flex-column gap-4">
            <div className='d-flex flex-wrap justify-content-center justify-content-md-start my-5 py-5'>
              <div className='d-flex flex-column gap-5 col-12 col-md-7'>
                <div className="d-flex flex-column text-center text-md-start gap-4">
                  <h2 className='fw-bold'>{t('discover.headline')}</h2>
                  <span className='h5 color-secondary col-12 col-md-10 text-center text-md-start'>{t('discover.subheadline')}</span>
                  <div className="mt-1 col-12 col-md-10 col-lg-6">
                    <Radio.Group block value={discoverStore.mainTypeValue} onChange={(e) => discoverStore.mainTypeValue = e.target.value}>
                      { discoverStore.mainTypeRadios.map((item, idx) => <Radio.Button key={idx} value={item.value}>{ item.i18n ? t(item.i18n) : item.label}</Radio.Button>)}
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
            discoverStore.mainTypeValue === 'smart' &&
              <>
                <div className="d-flex flex-wrap gap-4 align-items-center justify-content-between col">
                  <div className='d-flex align-items-center gap-3 col-12 col-sm'>
                    <InputSearch
                        size='small'
                        className='col'
                        value={discoverStore.searchAddressInput}
                        placeholder={t('common.searchAddress')}
                        onChange={(value) => discoverStore.searchAddressInput = value}
                        onSearch={() => handleSearchByAddress()}
                      />
                    {/* {
                      discoverStore.searchAddress
                        && <Button type='primary' ghost className='gap-1 fw-bold px-3 br-4' size='small' onClick={handleSearchAddressClear}><IOutlineAdd className='rotate-45' />Clear</Button>
                    } */}
                    <DropdownMenu buttonSize='small'
                      items={discoverStore.cycles}
                      selectedValue={discoverStore.selectedCycleValue}
                      onSelect={handleChangeSelectCycle}
                      icon={<ICyclical className='w-18' />} />
                  </div>
                </div>

                <div className='d-flex flex-column gap-2'>
                  <div className='d-flex flex-wrap align-items-center gap-2'>
                    {
                      [
                        discoverStore.SORT_KEYS.winRate,
                        discoverStore.SORT_KEYS.accountTotalValue,
                        // discoverStore.SORT_KEYS.roi,
                        discoverStore.SORT_KEYS.pnl,
                        discoverStore.SORT_KEYS.executedTrades,
                        discoverStore.SORT_KEYS.profitableTrades,
                        discoverStore.SORT_KEYS.lastOperation,
                        discoverStore.SORT_KEYS.avgHoldingPeriod,
                        discoverStore.SORT_KEYS.currentPosition,
                      ].map((item, idx) => {
                        return (
                          <div key={idx} className='d-flex bg-gray-alpha-4 br-2'>
                            <Button size={'small'} className='br-2 px-3 py-1 gap-2 fw-bold' type='text' onClick={() => handleSortBy(item)}>
                              <span className={`${ discoverStore.sortByKey === item.id ? 'fw-bold' : 'color-secondary' }`}>
                                { item.i18n ? t(item.i18n) : item.label }
                                <IOutlineSort className='w-16 ms-2' />
                              </span>
                            </Button>
                          </div>
                        )
                      })
                    }
                  </div>
                  <Busy spinning={reqStore.discoverListBusy}>
                    <div className='d-flex flex-column gap-1'>
                      { discoverStore.list.length
                          ? <>
                              { discoverStore.list.map((item, idx) => <TrackingAddressCard key={idx} item={item} />) }
                              { !discoverStore.isEnd
                                  ? <Button type='text' className='px-5' size='small' onClick={handleNextPagePush}><span className='color-secondary'>{t('common.loadMore')}</span></Button>
                                  : <small className='color-unimportant text-center py-4'>{t('common.noMoreResults')}</small>
                              }
                            </>
                          : <ColumnNoData className='bg-gray-alpha-4 br-3 overflow-hidden' />
                      }
                    </div>
                  </Busy>
                </div>
              </>
          }

          {
            discoverStore.mainTypeValue === 'kol' &&
              <DiscoverKOL />
          }
        </div>
      </div>

      <ModalTradingStatistics />
      <TrackingCreateTrack />
      <ModalCreateCopyTrading />
    </>
  )
}

export default Discover