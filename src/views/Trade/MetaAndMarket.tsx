import { useEffect, HTMLProps, FC } from 'react'
import BN from 'bignumber.js'
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { useNavigate } from 'react-router-dom';

import { formatNumber, infiniteLoop } from '@/utils'
import { constants, useReqStore, useHyperStore, useTradeStore, hyperRawByWsActiveAssetCtx } from '@/stores'
import { IOutlineFlash } from '@/components/icon'
import AreaDrawerCoins from '@/components/Area/DrawerCoins'
import PositionItemCommonPnl from '@/components/PositionItem/CommonPnl'
import CoinIcon from '@/components/CoinIcon'
import { useHyperWSContext, ReadyState } from '@/components/Hyper/WSContext';

interface TradeMetaAndMarketProps extends HTMLProps<HTMLDivElement> {
  coin: string
  autoRefreshing?: boolean
  unReset?: boolean // 组件销毁时不触发原本针对数据源的清理流程
  className?: string
}

export const TradeMetaAndMarket: FC<TradeMetaAndMarketProps> = ({
  coin,
  autoRefreshing = true,
  unReset = false,
  className = ''
}) => {
  const hyperStore = useHyperStore()
  const tradeStore = useTradeStore()
  const reqStore = useReqStore()

  const navigator = useNavigate()
  const { t, i18n } = useTranslation()
  const { decimalPlaces } = constants
  const { sendMessage, lastMessage, readyState } = useHyperWSContext()

  const handleSendMessage = (unsubscribe: boolean = false) => {
    const _coin = tradeStore.coin
    const methodContent = unsubscribe? 'unsubscribe' : 'subscribe'

    if (readyState !== ReadyState.OPEN || !_coin) return

    sendMessage(`{ "method": "${methodContent}", "subscription": { "type": "activeAssetCtx", "coin": "${_coin}" } }`)
  }

  const onInitUpdate = async () => {
    // 地址
    if (coin !== tradeStore.coin) {
      if (tradeStore.coin) {
        // unsubscribe
        handleSendMessage(true)
      }
      tradeStore.coin = coin
    }

    // NOTE: 必须要有 meta 数据
    await reqStore.hyperPerpMetaAndAssetCtxs(hyperStore)
    handleSendMessage()
  }

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      // NOTE: 不能 tradeStore.reset()
      if (!coin) return

      if (!autoRefreshing) return

      await onInitUpdate()
    }

    asyncFunc()

    return () => {
      handleSendMessage(true)

      if (!unReset) {
        // NOTE: 不能 tradeStore.reset()
      }
    }
  }, [readyState, coin, autoRefreshing])

  // 处理原始数据
  useEffect(() => {
    if (lastMessage == null) return

    try {
      const res = JSON.parse(lastMessage.data)

      switch(res.channel) {
        case 'activeAssetCtx':
          hyperStore.perpMarket[res.data.coin]= hyperRawByWsActiveAssetCtx(res.data.ctx)
          break
        default:
      }
    } catch(e) {
      console.error(e)
    }
  }, [lastMessage])

  return (
    <>
      <div className='d-flex flex-wrap'>
        <div className='d-flex col-12'>
          <div className='d-flex px-3 py-3 br-3 bg-gray-alpha-4 gap-4 mx-1 mb-2 col'>
            <div className='d-flex flex-wrap col gap-5'>
              <div className='d-flex align-items-center gap-1 linker col-12 col-md-auto' onClick={() => tradeStore.openSelectCoins = true }>
                <CoinIcon size='smd' id={coin} className='me-2' />
                <span className='h5 fw-bold'>{coin}-USD</span>
                <IOutlineFlash className='w-20 color-secondary' />
              </div>
              {
                [
                  { label: t('common.markPrice'),
                    content: hyperStore.perpMarket[coin]?.markPrice ?? '-',
                  },
                  { label: t('common.pct24h'),
                    content: <span className='d-flex gap-1'>
                      <PositionItemCommonPnl prefix='' value={hyperStore.perpMarket[coin]?.priceChange24h} />
                      <span className='color-secondary'>/</span>
                      <PositionItemCommonPnl prefix='' value={hyperStore.perpMarket[coin]?.priceChange24hPct} suffix=' %' />
                    </span>
                  },
                  { label: t('common.24hVolume'),
                    content: <>$ {hyperStore.perpMarket[coin]?.dayNtlVolume ? formatNumber(new BN(hyperStore.perpMarket[coin]?.dayNtlVolume).toFixed(constants.decimalPlaces.__COMMON__)) : '-'}</>,
                    // sub: <>{formatNumber(new BN(hyperStore.perpMarket[coin]?.dayBaseVlm).toFixed(hyperStore.perpMeta[coin]?.sizeDecimals))} {coin}</>
                  },
                  { label: t('common.openInterest'),
                    content: <>$ {hyperStore.perpMarket[coin]?.markPrice ? formatNumber(new BN(hyperStore.perpMarket[coin]?.markPrice).times(hyperStore.perpMarket[coin]?.openInterest).toFixed(decimalPlaces.__COMMON__)) : '-'}</>,
                    // sub: <>{formatNumber(hyperStore.perpMarket[coin]?.openInterest)} {coin}</>
                  },
                  { label: t('common.fundingFee'),
                    content: <>{hyperStore.perpMarket[coin]?.fundingPct ?? '-'} %</>
                  },
                ].map((item, idx) => (
                  <div key={idx} className={`d-flex flex-column col-auto ${item.className ?? ''}`}>
                    <small className="color-unimportant pb-1">{ item.label }</small>
                    <span className="color-secondary">
                      <span className="d-flex flex-column">
                        <span className="color-white">{ item.content }</span>
                        {item.sub && <small>{item.sub}</small>}
                      </span>
                    </span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      <AreaDrawerCoins onClose={(item) => {
        if (item.coin) {
          navigator(`/trade/${item.coin}`)
        }
      }}/>
    </>
  )
}

export default TradeMetaAndMarket