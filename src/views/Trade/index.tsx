import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

// import WebSocket from '@/views/Common/HyberWebSocket';
import { constants, useHyperStore, useTradeStore, useTraderDetailsPositionsStore, useTraderDetailsOpenOrdersAdditionalStore } from '@/stores'
import HyperWS from '@/components/Hyper/WS1'
import WebSocketConnection from '@/components/Hyper/WS'
import TradeOrderBook from './OrderBook'
import TabSwitch from '@/components/Tab/Switch'
import { useHyperWSContext, ReadyState } from '@/components/Hyper/WSContext';

import TraderDetailsNonFunding from '@/views/TraderDetails/NonFunding'
import TraderDetailsTWAP from '@/views/TraderDetails/TWAP'
import TraderDetailsRecentFills from '@/views/TraderDetails/RecentFills'
import { TraderDetailsOpenOrdersAdditional } from '@/views/TraderDetails/OpenOrdersAdditional'
import TraderDetailsPositions from '@/views/TraderDetails/Positions'
import TraderDetailsHistoricalOrders from '@/views/TraderDetails/HistoricalOrders'

import TradeTrades from './Trades'
import TradeMetaAndMarket from './MetaAndMarket'
import TradeKLine from './KLine'
import TradeTradingPanel from './TradingPanel'

const Trade = () => {
  const hyperStore = useHyperStore()
  const tradeStore = useTradeStore()
  const traderDetailsPositionsStore = useTraderDetailsPositionsStore()
  const traderDetailsOpenOrdersAdditionalStore = useTraderDetailsOpenOrdersAdditionalStore()

  const { coin } = useParams()
  const { t, i18n } = useTranslation()
  const { sendMessage, lastMessage, readyState } = useHyperWSContext()

  // init
  useEffect(() => {
    // NOTE: coin 不能 toUpperCase()，因为有些是含大小写
    tradeStore.coin = coin ?? tradeStore.DEFAULT_COIN

    // TEST: 应该从生成的私有钱包列表中获取，或选择的地址
    tradeStore.address = '0x48cd535b80439fefd6d00f74e5cf9b152adf2671'
    // tradeStore.address = '0x5a54ad9860b08aaee07174887f9ee5107b0a2e72'

    return () => {
      // NOTE: 各个内含组件自行 reset，因此这里不做处理
    }
  }, [coin])

  return (
    <>
      <div className="d-flex flex-column mt-5 pt-5 px-1 gap-2 mb-2 col">
        <div className='d-flex'>
          <div className='d-flex flex-column col'>
            <div className='d-flex gap-2'>
              <div className='col-9'>
                <TradeMetaAndMarket coin={tradeStore.coin} />
                <TradeKLine />
              </div>
              <div className='d-flex flex-column br-3 overflow-hidden col'>
                <TabSwitch className='' noMenu tiling data={tradeStore.sideTabs} currId={tradeStore.sideTabId} onClick={(item) => tradeStore.sideTabId = item.id} />
                {
                  tradeStore.sideTabId === 'orderBook' &&
                    <TradeOrderBook unReset coin={tradeStore.coin} />
                }
                {
                  tradeStore.sideTabId === 'trades' &&
                    <TradeTrades coin={tradeStore.coin} />
                }
              </div>
            </div>
          </div>
          <div className='d-flex p-3 br-3 bg-gray-alpha-4 gap-4 mx-1 col-2'>
            <TradeTradingPanel />
          </div>
        </div>
        <div className='d-flex col'>
          <div className='d-flex flex-column br-3 overflow-hidden mx-1 col'>
            <TabSwitch
              labelSuffixes={[` (${traderDetailsPositionsStore.list.length})`, ` (${traderDetailsOpenOrdersAdditionalStore.list.length})`]}
              data={tradeStore.recordTabs}
              currId={tradeStore.recordTabId}
              onClick={(item) => tradeStore.recordTabId = item.id} />
            <TraderDetailsPositions
              address={tradeStore.address}
              className={`col ${tradeStore.recordTabId === 'positions' ? '' : 'd-none'}`} />
            <TraderDetailsOpenOrdersAdditional
              address={tradeStore.address}
              filterCoin={tradeStore.coin}
              className={`col ${tradeStore.recordTabId === 'openOrders' ? '' : 'd-none'}`} />
            {
              tradeStore.recordTabId === 'historicalOrders' &&
                <TraderDetailsHistoricalOrders address={tradeStore.address} filterCoin={tradeStore.coin} />
            }
            {
              tradeStore.recordTabId === 'recentFills' &&
                <TraderDetailsRecentFills address={tradeStore.address} filterCoin={tradeStore.coin} className='col' />
            }
            {
              tradeStore.recordTabId === 'completedTrades' &&
                <>completedTrades</>
            }
            {
              tradeStore.recordTabId === 'twap' &&
                <TraderDetailsTWAP address={tradeStore.address} filterCoin={tradeStore.coin} className='col' />
            }
            {
              tradeStore.recordTabId === 'depositsAndWithdrawals' &&
                <TraderDetailsNonFunding address={tradeStore.address} className='col' />
            }
          </div>
          <div className='d-flex p-3 br-3 bg-gray-alpha-4 gap-4 mx-1 col-2'>
            Account
          </div>
        </div>
      </div>
    </>
  )
}

export default Trade