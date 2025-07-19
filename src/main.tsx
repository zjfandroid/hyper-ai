import React from 'react'
import ReactDOM from 'react-dom/client'

import './assets/style/main.scss'
import "@rainbow-me/rainbowkit/styles.css"
import App from './App'
import './i18n'

declare global {
  interface Window {
    Ethereum: any;
    particlesJS: any;
    Telegram: any;
    onTelegramAuth: any;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
)