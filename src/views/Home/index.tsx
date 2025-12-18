import { Button, Statistic, message, Popconfirm } from 'antd'
import { useEffect } from 'react'
import { Link, useLocation } from "react-router-dom"
import CountUp from 'react-countup';
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { isAddress } from 'viem'
import { useNavigate } from 'react-router-dom';

import SideButtonIcon from '@/components/Side/ButtonIcon'
import { useHomeStore, useReqStore, useTrackingCreateStore, useCopyTradingStore, useDiscoverTradingStatisticsStore, useDiscoverStore, useAccountStore, useDiscoverRecommendStore, useTeamStore, useOwnTeamMembersStore } from '@/stores'
import { IOutlineArrowRight1, IOutlineMonitor, IOutlineChart2, IOutlineShare } from '@/components/icon'
import { formatNumber } from '@/utils'
import ModalCreateCopyTrading from '@/components/Modal/CreateCopyTrading'
import InputSearch from '@/components/Input/Search'
import PositionItemAddress from '@/components/PositionItem/Address'
import Busy from '@/components/Busy'
import ModalTradingStatistics from '@/components/Modal/TradingStatistics'
import TrackingCreateTrack from '@/components/Modal/TrackingCreateTrack'

import IMainDIcon1 from '@/assets/image/view/Home/main/d-icon-1.svg?react'
import IMainDIcon2 from '@/assets/image/view/Home/main/d-icon-2.svg?react'
import IMainDIcon3 from '@/assets/image/view/Home/main/d-icon-3.svg?react'

import IBrainIcon1 from '@/assets/image/view/Home/brain/icon-1.svg?react'
import IBrainIcon2 from '@/assets/image/view/Home/brain/icon-2.svg?react'
import IBrainIcon3 from '@/assets/image/view/Home/brain/icon-3.svg?react'
import IBrainIcon4 from '@/assets/image/view/Home/brain/icon-4.svg?react'

import ITriple1 from '@/assets/image/view/Home/brain/triple-1.png'
import ITriple2 from '@/assets/image/view/Home/brain/triple-2.png'
import ITriple3 from '@/assets/image/view/Home/brain/triple-3.png'
import ITriple4 from '@/assets/image/view/Home/brain/triple-4.png'

import IFeatureCover1 from '@/assets/image/view/Home/feature/cover-1.png'
import IFeatureCover2 from '@/assets/image/view/Home/feature/cover-2.png'
import IFeatureCover3 from '@/assets/image/view/Home/feature/cover-3.png'

import IHAntalpha from '@/assets/image/view/Home/backed/antalpha.png'
import IHCobo from '@/assets/image/view/Home/backed/cobo.png'
import IHCyber from '@/assets/image/view/Home/backed/cyber.png'
import IHGate from '@/assets/image/view/Home/backed/gate.png'
import IHHtx from '@/assets/image/view/Home/backed/htx.png'
import IHKucoin from '@/assets/image/view/Home/backed/kucoin.png'
import IHMexc from '@/assets/image/view/Home/backed/mexc.png'
import IHMirana from '@/assets/image/view/Home/backed/mirana.png'
import IHNgc from '@/assets/image/view/Home/backed/ngc.png'
import IHRedline from '@/assets/image/view/Home/backed/redline.png'
import IHRedpoint from '@/assets/image/view/Home/backed/redpoint.png'
import IHSky9 from '@/assets/image/view/Home/backed/sky9@x2.png'
import IHSnz from '@/assets/image/view/Home/backed/snz.png'
import IHUphonest from '@/assets/image/view/Home/backed/uphonest.png'
import IHFenbushi from '@/assets/image/view/Home/backed/fenbushi.png'

import HomeParticlesJSON from './HomeParticlesJSON.json'

import IMainCover from '@/assets/image/view/Home/main/cover.png'
import PositionItemCommonPnl from '@/components/PositionItem/CommonPnl';
import PositionItemPnl from '@/components/PositionItem/Pnl';

import './style.scss'

const Home = () => {
  const homeStore = useHomeStore()
  const accountStore = useAccountStore()
  const discoverStore = useDiscoverStore()
  const reqStore = useReqStore()
  const discoverRecommendStore = useDiscoverRecommendStore()
  const copyTradingStore = useCopyTradingStore()
  const trackingCreateStore = useTrackingCreateStore()
  const discoverTradingStatisticsStore = useDiscoverTradingStatisticsStore()

  const { t, i18n } = useTranslation()
  const navigate = useNavigate();

  const handleSearchByAddress = async () => {
    const address = discoverStore.searchAddressInput

    if (!isAddress(address)) {
      message.error(t('message.pleaseInputAddress'))
      return
    }
    discoverStore.resetSearch()
    navigate(`/trader/${address}`)
  }

  const handleDiscoverRecommend = async () => {
    // NOTE: 由这里控制，所以不用再单独缓存保存配置
    switch(i18n.resolvedLanguage) {
      case 'zh-Hans':
      case 'zh-Hant':
        discoverRecommendStore.selectedLanguage = 'zh'
        break
      case 'en':
      default:
        discoverRecommendStore.selectedLanguage = 'en'
    }

    const { error } = await reqStore.discoverRecommend(accountStore, discoverRecommendStore)
  }

  const handleOpenQuickerCreateCopyTrade = (item?: any) => {
    copyTradingStore.quickerOpenPositionTargetAddress = item.address

    // NOTE: 同步完，最后打开弹窗
    copyTradingStore.openCopyTradingTarget = true
  }

  const handleOpenTradingStatistics = (item) => {
    discoverTradingStatisticsStore.address = item.address

    discoverTradingStatisticsStore.openModal = true
  }

  const handleOpenCreateTrackAddress = async (item) => {
    // sync quick
    trackingCreateStore.quickCreateTrackAddress = item.address

    trackingCreateStore.openCreateTracking = true
  }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      particlesJS('particlesBg', HomeParticlesJSON);

      await handleDiscoverRecommend()
    }

    asyncFunc()
    return () => {
      discoverRecommendStore.reset()
    }
  }, [])

  // 语言切换的影响
  useEffect(() => {
    const asyncFunc = async () => {
      await handleDiscoverRecommend()
    }

    asyncFunc()
  }, [i18n.resolvedLanguage])

  return (
    <>
      <div className="container-fluid px-0 d-flex flex-column py-5 main-cover">
        <div className="container-xl d-flex flex-column px-3 px-md-4 gap-4 gap-md-5 my-0 my-md-5 py-0">

          <div className="d-flex flex-column gap-4 my-5 coverBg">
            {/* <div className='d-flex justify-content-center justify-content-md-start col-12 col-md-8 my-5 py-5'>
              <div className='d-flex flex-column gap-1'>
                <h2 className="d-flex flex-column text-center text-md-start">
                  <span className='h3 fw-bold'>{t('home.mainTitle')}</span>
                </h2>
                <InputSearch
                  className='col-12 col-md-8 position-relative z-index-9'
                  value={discoverStore.searchAddressInput}
                  placeholder={t('common.searchAddress')}
                  onChange={(value) => discoverStore.searchAddressInput = value}
                  onSearch={() => handleSearchByAddress()} />
              </div>
            </div> */}

            {/* <div className="d-flex col-lg-6 gap-4 mt-5 position-relative z-index-9">
              <Button href={homeStore.startUrl} target='_blank' type='primary' size='large' className='br-4 border-w-2 fw-500 col'>Start Strategy</Button>
            </div> */}
            <Busy spinning={reqStore.discoverRecommendBusy}>
              <div className='d-flex flex-column gap-3 gap-md-4 position-relative z-index-9'>
                <div className='d-flex align-items-center justify-content-between'>
                  <h5 className="fw-bold">{ t('common.hotAddress') }</h5>
                  <Link to='/discover'><IOutlineArrowRight1 className='zoom-80' /></Link>
                </div>
                <div className='d-flex flex-wrap'>
                  {
                    (discoverRecommendStore.list || []).map((item, idx) => (
                      <div key={idx} className='d-flex col-12 col-lg-4'>
                        <div className='d-flex p-4 br-3 bg-gray-alpha-4 gap-4 mx-1 mb-2 col'>
                          <div className='d-flex flex-column col-12 gap-1'>
                            <div className='d-flex'>
                              <div className='d-flex flex-wrap gap-1'>
                                <PositionItemAddress avatar item={item} className='h6 fw-bold' />
                                { item.note && <span className='color-secondary'>({ item.note })</span> }
                              </div>
                              <div className='d-flex gap-3 align-items-start justify-content-end ms-auto'>
                                {
                                  [
                                    { icon: <IOutlineChart2 className='zoom-85' />, title: t('common.tradingStatistics'), onClick: () => handleOpenTradingStatistics(item) },
                                    { icon: <IOutlineMonitor className='zoom-85' />, title: t('common.trackAddress'), logged: true, onClick: () => handleOpenCreateTrackAddress(item) },
                                    { icon: <IOutlineShare className='zoom-85' />, title: t('common.copyTrading'), logged: true, onClick: () => handleOpenQuickerCreateCopyTrade(item) },
                                  ].map((item, idx) => <SideButtonIcon key={idx} title={item.title} onClick={item.onClick} logged={item.logged} icon={item.icon} />)
                                }
                              </div>
                            </div>
                            <div className='d-flex flex-wrap'>
                              {
                                [
                                  { label: t('common.accountTotalValue'), className: 'col-12', content: <span className='h5 fw-bold'>$ { formatNumber(item.accountTotalValue) }</span> },
                                  { label: t('common.pnl'), content: <PositionItemCommonPnl value={item.pnl} /> },
                                  { label: t('common.tradesCount'), content: <>{ formatNumber(item.tradesCount) }</> },
                                  { label: t('common.winRate'), content: <>{ item.tradesCount > 0 ? item.winRate : '-' } %</> },
                                  { label: t('common.aiTags'), className: 'col-12',
                                    content: <div className='d-flex flex-wrap gap-1'>
                                      {
                                        (item.tags || []).map((_tag, _idx) => (
                                          <span key={_idx} className='d-flex px-2 br-2 bg-gray-alpha-3 color-primary'>{ _tag }</span>
                                        ))
                                      }
                                    </div>
                                  }
                                ].map((item, idx) => (
                                  <div key={idx} className={`d-flex flex-column mt-2 pt-1 col-4 ${item.className || ''}`}>
                                    <small className="color-unimportant pb-1">{ item.label }</small>
                                    <span className="color-secondary">
                                      <span className="d-flex flex-column">
                                        <span className="color-white">{ item.content }</span>
                                        {/* <small>-153.5864 ETH</small> */}
                                      </span>
                                    </span>
                                  </div>
                                ))
                              }
                            </div>

                            <span className="d-flex flex-column color-secondary gap-1">
                              {/* { item.content } */}
                            </span>
                          </div>
                          <div className='d-flex align-items-end'>
                            {/* { item.cover } */}
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </Busy>
          </div>
          <div id="particlesBg"></div>
        </div>

        {/* <div className="container-xl d-flex flex-column px-3 px-md-4 gap-4 gap-md-5 my-0 my-md-5 py-0">
          <div className="br-4 p-3 p-md-5">
            <ul className="d-flex flex-wrap gap-3 align-items-center py-3 py-md-4">
              {
                [
                  { name: 'User Count', icon: <IMainDIcon1 />, content: <Statistic value={627} precision={0} formatter={(value) => <CountUp end={value as number} separator="," className='h2 fw-bold' />} /> },
                  { name: 'Transaction Commission', icon: <IMainDIcon2 />, content: <span className='d-flex gap-2'>$ <Statistic value={64827.41} precision={2} formatter={(value) => <CountUp end={value as number} decimals={2} separator="," className='h2 fw-bold' />} /></span> },
                  { name: 'Repurchase Tele', icon: <IMainDIcon3 />, content: <Statistic value={16856235.7} precision={1} formatter={(value) => <CountUp end={value as number} decimals={1} separator="," className='h2 fw-bold' />} /> },
                ].map((item, idx) =>
                  <li key={idx} className="d-flex flex-column gap-2 align-items-center col-12 col-md p-4 br-3">
                    <span className='fw-bold h2'>{ item.content }</span>
                    <span className="d-flex align-items-center gap-2">{ item.icon }<span className=' fw-bold color-primary-linear'>{ item.name }</span></span>
                  </li>
                )
              }
            </ul>
          </div>
        </div> */}
      </div>

      <div className='main-line'></div>

      <div className="container-fluid px-0 d-flex flex-column my-5 pt-5 brain">
        <div className="container-xl d-flex flex-column align-items-center px-3 px-md-4 gap-4 gap-md-5 my-0 my-md-5 py-0">
          <div className="d-flex flex-column gap-4 align-items-center justify-content-center col-12 col-md-8">
            <h2 className="fw-bold text-center">{t('home.cover2Title')}</h2>
            <span className='color-secondary text-center px-md-5'>{t('home.cover2SubTitle')}</span>
          </div>
          <ul className="d-flex flex-wrap justify-content-center col-12">
            {
              [
                { title: t('home.cover2Li1Title'), content: <Trans>{t('home.cover2Li1Content')}</Trans>, icon: <IBrainIcon1 /> },
                { title: t('home.cover2Li2Title'), content: <Trans>{t('home.cover2Li2Content')}</Trans>, icon: <IBrainIcon2 /> },
                { title: t('home.cover2Li3Title'), content: <Trans>{t('home.cover2Li3Content')}</Trans>, icon: <IBrainIcon3 /> },
                { title: t('home.cover2Li4Title'), content: <Trans>{t('home.cover2Li4Content')}</Trans>, icon: <IBrainIcon4 /> },
              ].map((item, idx) => (
                <li key={idx} className="d-flex flex-column position-relative col-12 col-md-6 col-xl-3 p-4 gap-4">
                  <div className='br-3 p-3 ms-auto ms-md-0 me-auto bg-white-thin'>
                    { item.icon }
                  </div>
                  <div className="d-flex flex-column gap-4 col">
                    <span className="h4 fw-bold text-center text-md-start">{ item.title }</span>
                    <span className="d-flex flex-column gap-2 color-secondary-thin text-center text-md-start white-wrap" >{ item.content }</span>
                  </div>
                  { Array(4).fill('').map((_item ,_idx) => <span key={_idx}></span>)}
                </li>
              ))
            }
          </ul>
        </div>

        <div className='my-5'></div>

        <div className="container-xl d-flex flex-column align-items-center px-3 px-md-4 gap-4 gap-md-5 my-0 my-md-5 py-0">
          <div className="d-flex flex-column gap-4 align-items-center justify-content-center col-12 col-md-8">
            <h2 className="fw-bold text-center">{t('home.cover3Title')}</h2>
            <span className='color-secondary text-center px-md-5'>{t('home.cover3SubTitle')}</span>
          </div>
          <ul className="d-flex flex-wrap justify-content-center col-12">
            {
              [
                { title: t('home.cover3Li1Title'), content: t('home.cover3Li1Content'), img: ITriple1 },
                { title: t('home.cover3Li2Title'), content: t('home.cover3Li2Content'), img: ITriple2 },
                { title: t('home.cover3Li3Title'), content: t('home.cover3Li3Content'), img: ITriple3 },
                { title: t('home.cover3Li4Title'), content: t('home.cover3Li4Content'), img: ITriple4 },
              ].map((item, idx) => (
                <li key={idx} className="d-flex flex-column position-relative col-12 col-md-6 p-4 gap-4">
                  <div className="d-flex flex-column gap-4 col">
                    <span className="h4 fw-bold text-center text-md-start">{ item.title }</span>
                    <span className="d-flex flex-column gap-2 color-secondary-thin text-center text-md-start white-wrap" >{ item.content }</span>
                  </div>
                  <div className='col mt-3'>
                    <img src={item.img} className='w-full' />
                  </div>
                  { Array(4).fill('').map((_item ,_idx) => <span key={_idx}></span>)}
                </li>
              ))
            }
          </ul>
        </div>
      </div>

      <div className="container-fluid px-0 d-flex flex-column my-5 pt-5 features">
        <div className="container-xl d-flex flex-column align-items-center px-3 px-md-4 gap-4 gap-md-5 my-0 py-0">

          <div className="d-flex flex-column gap-4 align-items-center justify-content-center col-12 col-md-8">
            <h2 className="fw-bold text-center">{t('home.cover4Title')}</h2>
            <span className='color-secondary text-center px-md-5'>{t('home.cover4SubTitle')}</span>
          </div>
          <div className="d-flex flex-column justify-content-center col-12">
            {
              [
                { name: t('home.cover4Li1SubTitle'), title: t('home.cover4Li1Title'), content: t('home.cover4Li1Content'), tags: t('home.cover4Li1Tag', { returnObjects: true }), src: IFeatureCover1 },
                { name: t('home.cover4Li2SubTitle'), title: t('home.cover4Li2Title'), content: t('home.cover4Li2Content'), tags: t('home.cover4Li2Tag', { returnObjects: true }), src: IFeatureCover2 },
                { name: t('home.cover4Li3SubTitle'), title: t('home.cover4Li3Title'), content: t('home.cover4Li3Content'), tags: t('home.cover4Li3Tag', { returnObjects: true }), src: IFeatureCover3 },
              ].map((item, idx) => (
                <div key={idx} className="d-flex flex-column flex-lg-row align-items-center bg-primary-dilute br-4 my-0 mt-lg-5 py-lg-4">
                  <div className="d-flex flex-column gap-2 col mx-4 ms-lg-5 pt-4 pt-lg-0 mt-3 mt-lg-0">
                    <span className="fw-bold h6 text-center text-lg-start color-primary-linear">{ item.name }</span>
                    <span className="h4 fw-bold text-center text-lg-start">{ item.title }</span>
                    <span className="py-4 color-secondary  text-center text-lg-start">{ item.content }</span>
                    <div className='d-flex flex-wrap gap-3 mt-3 justify-content-center justify-content-lg-start'>
                      {
                        item.tags.map((tag, idx) => (
                          <span key={idx} className="d-flex align-items-center fw-500 h6 color-white br-4 px-3 px-lg-4 py-2 py-lg-3 tag">{ tag }</span>
                        ))
                      }
                    </div>
                  </div>
                  <div className='col-lg-5'>
                    <img src={item.src} className="full" />
                  </div>
                </div>
              ))
            }
          </div>

        </div>
      </div>

      <div className="container-fluid px-0 d-flex flex-column my-5 pt-5 backed">
        <div className="container-xl d-flex flex-column align-items-center px-3 px-md-4 gap-4 gap-md-5 py-0">

          <div className="d-flex flex-column gap-4 align-items-center justify-content-center col-12 col-md-8">
            <h2 className="fw-bold text-center">{t('home.backedBy')}</h2>
          </div>
          <ul className="d-flex flex-wrap justify-content-center col-12 gap-4">
            {
              [
                { src: IHRedpoint, className: 'col' },
                { src: IHAntalpha, className: 'col' },
                { src: IHMirana, className: 'col' },
                { src: IHCyber, className: 'col' },
                { src: IHCobo, className: 'col' },
                { src: IHGate, className: 'col' },
                { src: IHKucoin, className: 'col' },
                { src: IHNgc, className: 'col' },
                { src: IHHtx, className: 'col' },
                { src: IHMexc, className: 'col' },
                { src: IHUphonest, className: 'col' },
                { src: IHSky9, className: 'col' },
                { src: IHRedline, className: 'col' },
                { src: IHSnz, className: 'col' },
                { src: IHFenbushi, className: 'col' },
              ].map((item, idx) => (
                <li key={idx} className={`d-flex flex-column justify-content-center align-items-center br-4 py-5 px-5 ${item.className}`}>
                  <img src={item.src} />
                </li>))
            }
          </ul>
        </div>
      </div>

      <ModalTradingStatistics />
      <TrackingCreateTrack />
      <ModalCreateCopyTrading />
    </>
  )
}

export default Home