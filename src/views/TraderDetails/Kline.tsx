import { useEffect, useRef, useState } from 'react'
import { Button, Progress, Popconfirm, Tooltip, Dropdown, message, Select, Input } from 'antd'
import BN from 'bignumber.js'
import { isAddress } from 'viem'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { useParams } from 'react-router-dom';

import { formatNumber } from '@/utils'
import { IOutlineMoreSquare, IOutlineCopy, IOutlineMedal, IOutlineAdd, IOutlineArrowUp1, IOutlineShare, ICyclical, IOutlineSearchNormal1 } from '@/components/icon'
import { constants, useAccountStore, usePrivateWalletStore, useTraderDetailsPortfolioKlineStore, useTrackingCreateStore, useDiscoverTradingStatisticsStore, useTraderDetailsOpenOrdersAdditionalStore, useTraderDetailsPositionsStore, useTraderDetailsStore, useReqStore, useCopyTradingStore, useLeaderboardStore } from '@/stores'
import MiniChartBaseline from '@/components/MiniChart/Baseline'
import DropdownMenu from '@/components/Dropdown/Menu'
import PositionItemCommonPnl from '@/components/PositionItem/CommonPnl'

const TraderDetailsKline = ({ className = '' }) => {
  const traderDetailsPortfolioKlineStore = useTraderDetailsPortfolioKlineStore()
  const colRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 200 });
  const { t, i18n } = useTranslation()
  const CHART_AREA_MIN_HEIGHT = 300

  const handleChangeSelectCycle = async (value: string) => {
    traderDetailsPortfolioKlineStore.selectedCycleValue = value
  }

  useEffect(() => {
    if (colRef.current) {
      const { width, height } = colRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }

    // 创建 ResizeObserver 实例来监听尺寸变化
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        let { width, height } = entry.contentRect;
        height = Math.max(height, CHART_AREA_MIN_HEIGHT)

        setDimensions({ width, height });
      }
    });

    if (colRef.current) {
      resizeObserver.observe(colRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={`d-flex flex-column col ${className ?? ''}`}>
      <div className='d-flex flex-wrap gap-2'>
        <div className='d-flex flex-column'>
          <span className="d-flex align-items-center justify-content-between color-unimportant pb-1">
            <span className='d-flex gap-1 flex-shrink-0'>
              { t(traderDetailsPortfolioKlineStore.selectedCycleItem.i18n)} { t(traderDetailsPortfolioKlineStore.selectedDataFieldItem.i18n)} ({ t(traderDetailsPortfolioKlineStore.selectedTradeTypeItem.i18n)})
            </span>
          </span>
          <div className="d-flex flex-column color-secondary gap-1">
            <span className="h5 fw-bold">
              <PositionItemCommonPnl value={traderDetailsPortfolioKlineStore.selectedKlineDataLastValue} />
            </span>
          </div>
        </div>

        <div className='d-flex flex-wrap gap-2 align-items-start ms-auto'>
          <DropdownMenu buttonSize='small'
            items={traderDetailsPortfolioKlineStore.cycles}
            selectedValue={traderDetailsPortfolioKlineStore.selectedCycleValue}
            onSelect={(val) => traderDetailsPortfolioKlineStore.selectedCycleValue = val}
            icon={<ICyclical className='w-18' />} />
          <DropdownMenu buttonSize='small'
            items={traderDetailsPortfolioKlineStore.tradeTypes}
            selectedValue={traderDetailsPortfolioKlineStore.selectedTradeTypeValue}
            onSelect={(val) => traderDetailsPortfolioKlineStore.selectedTradeTypeValue = val} />
          <DropdownMenu buttonSize='small'
            items={traderDetailsPortfolioKlineStore.dataFields}
            selectedValue={traderDetailsPortfolioKlineStore.selectedDataFieldValue}
            onSelect={(val) => traderDetailsPortfolioKlineStore.selectedDataFieldValue = val} />
        </div>
      </div>
      <div className='d-flex col position-relative' style={{ minHeight: `${CHART_AREA_MIN_HEIGHT}px` }}>
        <div className='col overflow-hidden' ref={colRef}></div>
        <MiniChartBaseline className='position-absolute' scale data={traderDetailsPortfolioKlineStore.selectedKlineData} width={dimensions.width} height={dimensions.height} />
      </div>
    </div>
  )
}

export default TraderDetailsKline