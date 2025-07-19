import { useRef } from 'react'

import { constants, useCommonStore, useAccountStore, usePrivateWalletStore, useTraderDetailsPortfolioKlineStore, useHyperStore, useTrackingCreateStore, useDiscoverTradingStatisticsStore, useTraderDetailsOpenOrdersAdditionalStore, useTraderDetailsPositionsStore, useTraderDetailsStore, useReqStore, useCopyTradingStore, useLeaderboardStore } from '@/stores'
import WebSocketConnection from '@/components/Hyper/WS';

const WebSocket = () => {
  const commonStore = useCommonStore()

  const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log('收到消息:', data);
  };

  const handleOpen = () => {
    console.log('WebSocket连接已打开');
  };

    // 创建ref
  const wsRef = useRef<{
    sendMessage: (message: string | object) => boolean;
    closeConnection: () => void;
  }>(null);

  // 发送自定义消息的函数
  const handleSendMessage = () => {
    wsRef.current?.sendMessage({
      method: 'subscribe',
      subscription: { "type": "l2Book", "coin": "BTC" }
    })
  }

  return (
    <>
    <WebSocketConnection url="wss://api.hyperliquid.xyz/ws" connectionRef={wsRef} onMessage={handleMessage} onOpen={handleOpen} pingInterval={50000} showStatus={true} />
          <button onClick={handleSendMessage}>发送消息</button>

    </>
  )
}

export default WebSocket