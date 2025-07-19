import { RainbowKitProvider, AvatarComponent, createAuthenticationAdapter } from '@rainbow-me/rainbowkit';
import { createSiweMessage } from 'viem/siwe';
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from 'react'

import { constants, useAccountStore, useReqStore, useAccountLoginStore } from '@/stores'
import { merge } from '.'
import ILogoIcon from '@/assets/image/component/Logo/mark-white.png'

export const appInfo = {
  appName: constants.app.NAME,
  // disclaimer: ({ Text, Link }) => (
  //   <Text>
  //     Welcome
  //   </Text>
  // )
}

export const customAvatar: AvatarComponent = ({ address, ensImage, size }) => 
  <img src={ensImage ? ensImage : ILogoIcon} width={size} height={size} style={{ borderRadius: 999 }} alt='' />

export const useAuthentication = () => {
  const accountStore = useAccountStore()
  const reqStore = useReqStore()

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      return new Date().getTime().toString()
    },

    createMessage: ({ nonce, address, chainId }) => {
      // sync
      merge(accountStore, {
        evmAddress: address,
        evmChainId: chainId,
      })

      // return createSiweMessage({
      //   domain: window.location.host,
      //   address,
      //   // statement: `Sign in the ${constants.app.NAME} app.`,
      //   statement: accountStore.evmSignMessage,
      //   uri: window.location.origin,
      //   version: '1',
      //   chainId,
      //   nonce,
      // })
      return accountStore.evmSignMessage
    },

    verify: async ({ message, signature }) => {
      // sync
      merge(accountStore, {
        evmSignMessage: message,
        evmSignedMessage: signature
      })

      const { error } = await reqStore.userEvmLogin(accountStore)

      return !error
    },

    signOut: async () => {
      accountStore.reset()
    },
  })

  return { authenticationAdapter }
}