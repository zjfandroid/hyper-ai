
import { RouterProvider } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme, DisclaimerComponent, RainbowKitAuthenticationProvider, Theme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StyleProvider } from '@ant-design/cssinjs'
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'
import { ConfigProvider, message, notification } from 'antd'
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles'

import { NotificationProvider } from '@/components/Notification/index'
import router from '@/router'
import { useAccountStore } from '@/stores'
import { config } from '@/utils/wagmiConfig'
import { merge } from '@/utils'
import { appInfo, customAvatar, useAuthentication } from '@/utils/RainbowKitConfig'
import { luminous } from '@/themes'
import { muiTheme } from '@/themes/mui'
import { HyperWSProvider } from '@/components/Hyper/WSContext'

message.config({
  duration: 5,
  maxCount: 3,
  rtl: true,
  prefixCls: '__antd__message',
  top: 64
})

const App = () => {
  const accountStore = useAccountStore()
  const { authenticationAdapter } = useAuthentication()
  const theme = merge(darkTheme(), {
    colors: {
      // accentColor: '#101828',
      // accentColorForeground: '#ffffff'
    }
  }) as Theme

  return (
    <WagmiProvider config={config}>
       <QueryClientProvider client={new QueryClient()}>
        <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={accountStore.evmAuthStatus}>
           <RainbowKitProvider theme={theme} appInfo={appInfo} avatar={customAvatar}>
            <ThemeProvider theme={muiTheme}>
              <ConfigProvider theme={luminous.theme}>
                <StyleProvider hashPriority="high">
                  <HyperWSProvider>
                    <NotificationProvider>
                    <RouterProvider router={router} />
                    </NotificationProvider>
                  </HyperWSProvider>
                </StyleProvider>
              </ConfigProvider>
            </ThemeProvider>
           </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
