import { useEffect, useRef} from 'react';
import { isAddress } from 'viem'
import BN from 'bignumber.js'
import { message, Input, Button, Radio, Slider, Progress } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber, inputIsNumber, sleep, merge } from '@/utils';
import TokenIcon from '@/components/TokenIcon';
import { IOutlineCopy, IOutlineSearchNormal1, ICyclical, IOutlineShieldSearch, IOutlineInfoCircle } from '@/components/icon'
import { useAccountStore, useDiscoverTradingStatisticsStore, usePrivateWalletStore, useReqStore, useCopyTradingStore, useDiscoverStore } from '@/stores'
import BaseModal from './Base';
import WalletChainIcon from '@/components/Wallet/ChainIcon';
import ColumnList from '@/components/Column/List'
import PositionItemDirectionLeverage from '@/components/PositionItem/DirectionLeverage'
import PositionItemPositionValue from '@/components/PositionItem/PositionValue'
import PositionItemUPnl from '@/components/PositionItem/UPnl'
import Busy from '@/components/Busy'
import ColumnTooltip from '@/components/Column/Tooltip'
import InputSearch from '@/components/Input/Search';
import DropdownMenu from '@/components/Dropdown/Menu'
import PositionItemAddress from '@/components/PositionItem/Address'
import VizPnlFeesPieChart from '@/components/Viz/PnlFeesPieChart'
import PositionItemPnl from '@/components/PositionItem/Pnl'
import PositionItemFees from '@/components/PositionItem/Fees'
import TimeAgo from '@/components/TimeAgo'
import ColumnNoData from '@/components/Column/NoData'
import VizTemplate from '@/components/Viz/Template'
import VizDirectionPnlPieChart from '@/components/Viz/DirectionPnlPieChart'
import MUIBasePieChart from '@/components/MUI/BasePieChart'
import TimeDuration from '@/components/TimeDuration'
import DotColor from '@/components/DotColor'
import PositionItemCommonPnl from '@/components/PositionItem/CommonPnl'

import CoinIcon from '@/components/CoinIcon'
import BigNumber from 'bignumber.js';

const ModalTradingStatistics = () => {
  const reqStore = useReqStore()
  const accountStore = useAccountStore()
  const discoverTradingStatisticsStore = useDiscoverTradingStatisticsStore()
  const { t, i18n } = useTranslation()

  const handleClose = () => {
    discoverTradingStatisticsStore.openModal = false;
  };

  const handleTradingStatisticsUpdate = async () => {
    await reqStore.discoverTradingStatistics(accountStore, discoverTradingStatisticsStore)
  }

  const handleChangeSelectCycle = async (value: string) => {
    discoverTradingStatisticsStore.selectedCycleValue = value

    await handleTradingStatisticsUpdate()
  }

  // init
  useEffect(() => {
    if (!discoverTradingStatisticsStore.openModal) return

    handleTradingStatisticsUpdate()

    return () => {
      discoverTradingStatisticsStore.reset()
    }
  }, [discoverTradingStatisticsStore.openModal])

  return (
    <BaseModal
      width={990}
      title={t('common.tradingStatistics')}
      open={discoverTradingStatisticsStore.openModal}
      onClose={handleClose}
      onSubmit={null}
    >
      <Busy spinning={reqStore.discoverTradingStatisticsBusy}>
        <div className='d-flex flex-column gap-2'>
          <div className='d-flex justify-content-between align-items-center'>
            <PositionItemAddress avatar item={discoverTradingStatisticsStore} />
            <DropdownMenu buttonSize='small'
              items={discoverTradingStatisticsStore.cycles}
              selectedValue={discoverTradingStatisticsStore.selectedCycleValue}
              onSelect={handleChangeSelectCycle}
              icon={<ICyclical className='w-18' />} />
          </div>
          <dl className='column-list'>
            <dd>
              <ul className='d-flex flex-wrap'>
                {
                  [
                    { label: t('common.winRate'), className: 'col-12 col-sm-6 col-xl-3',
                      content: <>{ discoverTradingStatisticsStore.winRate } %</>,
                      subs: [
                        { label: t('common.gross'), content: <PositionItemCommonPnl className='fw-500' value={discoverTradingStatisticsStore.gross} /> },
                        { label: t('common.fees'), content: <PositionItemCommonPnl className='fw-500' value={discoverTradingStatisticsStore.fees} /> }
                      ],
                    // sub: <>
                    //   <span className='color-success'><small className='color-secondary'>Long</small> { discoverTradingStatisticsStore.longWinRate } %</span>
                    //   <span className='color-error'><small className='color-secondary'>Short</small> { discoverTradingStatisticsStore.shortWinRate } %</span>
                    // </>,
                    // cover: <MUIBasePieChart data={[
                    //     { value: discoverTradingStatisticsStore.longWinRate, color: '#03741b', label: 'Long Win Rate' },
                    //     { value: discoverTradingStatisticsStore.shortWinRate, color: '#780909', label: 'Short Win Rate' },
                    //     { value: discoverTradingStatisticsStore.lossRate, color: 'rgba(255, 255, 255, 0.1)', label: 'Loss Rate' },
                    //   ]} />
                  },
                    { label: t('common.tradesCount'), className: 'col-12 col-sm-6 col-xl-3',
                      content: formatNumber(discoverTradingStatisticsStore.executedTrades),
                      subs: [
                        { label: <DotColor id='profit' label={t('common.profit')} />, content: formatNumber(discoverTradingStatisticsStore.profitableTrades) },
                        { label: <DotColor id='loss' label={t('common.loss')} />, content: formatNumber(discoverTradingStatisticsStore.losingTrades) }
                      ],
                      cover: <MUIBasePieChart data={[
                          { value: discoverTradingStatisticsStore.profitableTrades, color: 'rgba(96, 147, 250, 0.8)', label: 'Profit Count' },
                          { value: discoverTradingStatisticsStore.losingTrades, color: 'rgba(96, 147, 250, 0.1)', label: 'Loss Count' },
                        ]} />
                    },
                    { label: t('common.pnl'), className: 'col-12 col-sm-6 col-xl-3',
                      content: <PositionItemCommonPnl value={discoverTradingStatisticsStore.pnl} />,
                      subs: [
                        { label: t('common.actLong'), content: <PositionItemCommonPnl className='fw-500 color-secondary' value={discoverTradingStatisticsStore.longPnl} /> },
                        { label: t('common.actShort'), content: <PositionItemCommonPnl className='fw-500 color-secondary' value={discoverTradingStatisticsStore.shortPnl} /> }
                      ],
                      // cover: <VizDirectionPnlPieChart item={discoverTradingStatisticsStore} />
                    },
                    { label: t('common.totalHoldingTime'), className: 'col-12 col-sm-6 col-xl-3',
                      content: <TimeDuration ts={discoverTradingStatisticsStore.tradeDuration} />,
                      subs: [
                        { label: t('common.holdingRange'), content: <><TimeDuration ts={discoverTradingStatisticsStore.minDuration} /> ~ <TimeDuration ts={discoverTradingStatisticsStore.maxDuration} /></> },
                        { label: t('common.averageHoldingTime'), content: <TimeDuration ts={new BN(discoverTradingStatisticsStore.tradeDuration).div(discoverTradingStatisticsStore.executedTrades).toString()} /> }
                      ],
                    },
                  ].map((item, idx) => <VizTemplate key={idx} item={item} /> )
                }
              </ul>
            </dd>
          </dl>

          <dl className='column-list'>
            <dt className='my-3'>
              <span className='d-flex gap-3 align-items-center fw-bold'>{t('common.top10BestTrades')}</span>
            </dt>
            <dd>
              <ul className='d-flex flex-wrap'>
                {
                  discoverTradingStatisticsStore.bestTrades.length
                    ? discoverTradingStatisticsStore.bestTrades.map((item, idx) => {
                        return (
                          <li key={idx} className={`col-12 col-sm-6 col-md-4 col-lg-3 br-2`}>
                            <div className='d-flex flex-column p-3 br-2 highlight gap-2'>
                              <span className='d-flex align-items-center gap-2 color-secondary'>
                                <CoinIcon size='sm' id={item.coin} />{ item.coin }
                                <PositionItemDirectionLeverage item={item} />
                                <small className='ms-auto'>
                                  <TimeAgo ts={item.createTs} />
                                </small>
                              </span>

                              <PositionItemPnl className='h6 fw-bold' item={item} />
                              <small className='d-flex align-items-center gap-2 color-secondary'>
                                {t('common.duration')}
                                <span className='fw-500'><TimeDuration ts={item.duration} /></span>
                              </small>
                            </div>
                          </li>
                        )})
                    : <ColumnNoData size='small' className='bg-gray-alpha-5 br-3 overflow-hidden col' />
                }
              </ul>
            </dd>
          </dl>

          <dl className='column-list'>
            <dt className='my-3'>
              <span className='d-flex gap-3 align-items-center fw-bold'>{t('common.historicalPerformanceByAsset')}</span>
            </dt>
            <dd>
              <ul className='d-flex flex-wrap'>
                {
                  discoverTradingStatisticsStore.performanceAssets.length
                    ? discoverTradingStatisticsStore.performanceAssets.map((item, idx) => {
                        return (
                          <li key={idx} className={`col-12 col-sm-6 col-md-4 col-lg-3 br-2`}>
                            <div className='d-flex flex-column p-3 br-2 highlight gap-2'>
                              <span className='d-flex align-items-center gap-2 color-secondary'>
                                <CoinIcon size='sm' id={item.coin} />{ item.coin }
                                <small className='ms-auto'>
                                  {t('common.numTrades', { num: formatNumber(item.trades) })}
                                </small>
                              </span>
                              <div className='d-flex gap-3'>
                                <div className='d-flex flex-column gap-1 col'>
                                  <PositionItemPnl className='h6 fw-bold pb-1' item={item} />

                                  <small className='d-flex align-items-center justify-content-between color-secondary'>
                                    {t('common.netPnL')}
                                    <PositionItemCommonPnl className='fw-500' value={item.netPnL} />
                                  </small>
                                  <small className='d-flex align-items-center justify-content-between color-secondary'>
                                    {t('common.fees')}
                                    <PositionItemFees className='fw-500' item={item} />
                                  </small>
                                </div>
                                {/* <div>
                                  <VizPnlFeesPieChart size='small' item={item} />
                                </div> */}
                              </div>
                            </div>
                          </li>
                      )})
                    : <ColumnNoData className='bg-gray-alpha-5 br-3 overflow-hidden col' />
                }
              </ul>
            </dd>
          </dl>
        </div>
      </Busy>
    </BaseModal>
  );
};

export default ModalTradingStatistics;