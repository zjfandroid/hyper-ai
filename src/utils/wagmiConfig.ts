import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  sepolia,
  cyber,
  cyberTestnet,
  optimism,
  optimismSepolia,
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
} from 'wagmi/chains';
import { createConfig, http } from "wagmi";
import {
  okxWallet,
  metaMaskWallet,
  gateWallet,
  binanceWallet,
  bitgetWallet,
  coreWallet,
  imTokenWallet,
  walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets";

import { constants } from '@/stores/constants'

// WalletConnect Cloud https://cloud.walletconnect.com/
const projectId = "3b7ed29d68a7a6b3f52f04318320dd4d";

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        binanceWallet,
        okxWallet,
      ]
    },
    {
      groupName: 'Suggested',
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        bitgetWallet,
        gateWallet,
        coreWallet,
        imTokenWallet
      ]
    }
  ],
  { appName: constants.app.NAME, projectId }
)

export const cyberSnakeContractChainId = constants.app.isProd ? cyber.id : cyberTestnet.id

export const chains: any = constants.app.isProd
  ? [
      arbitrum,
      bsc,
      mainnet,
    ]
  : [
      arbitrumSepolia,
      bscTestnet,
      sepolia
    ]
const transports: any = constants.app.isProd
  ? {
      [arbitrum.id]: http(),
      [bsc.id]: http(),
      [mainnet.id]: http(),
    }
  : {
      [arbitrumSepolia.id]: http(),
      [bscTestnet.id]: http(),
      [sepolia.id]: http(),
    }

export const config = createConfig({
  connectors,
  ssr: true,
  chains,
  transports,
})
