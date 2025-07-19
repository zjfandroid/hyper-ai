import React, { createContext, useContext, ReactNode } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

export { ReadyState }

// 定义WebSocket上下文类型
interface WebSocketContextType {
  sendMessage: (message: string | object) => void;
  lastMessage: MessageEvent | null;
  readyState: ReadyState;
}

// 创建上下文，初始值为null
const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface HyperWSProviderProps {
  children: ReactNode;
}

export const HyperWSProvider: React.FC<HyperWSProviderProps> = ({ children }) => {
  const { sendMessage, lastMessage, readyState } = useWebSocket('wss://api.hyperliquid.xyz/ws', {
    share: true,
    // reconnectAttempts: 10,
    // reconnectInterval: 3000,
    // shouldReconnect: (closeEvent) => true,
  });

  // 创建上下文值对象
  const contextValue: WebSocketContextType = {
    sendMessage: (message) => {
      const data = typeof message === 'string' ? message : JSON.stringify(message);
      sendMessage(data);
    },
    lastMessage,
    readyState
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// 自定义钩子，用于在组件中访问WebSocket上下文
export const useHyperWSContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === null) {
    throw new Error('useHyperWSContext must be used inside HyperWSProvider');
  }
  return context;
};