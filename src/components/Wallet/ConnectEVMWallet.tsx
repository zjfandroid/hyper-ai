import { Button } from 'antd'
import { useConnectModal, useAccountModal, useChainModal, ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect } from 'react';

import { localStorage, merge } from '@/utils'
import { constants, useAccountStore, useReqStore } from '@/stores'

const ConnectEVMWallet = () => {
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { openChainModal } = useChainModal()
  const { disconnect } = useDisconnect()

  const accountStore = useAccountStore()
  const reqStore = useReqStore()
  const { address, chain } = useAccount()

  // init
  useEffect(() => {
    const asyncFunc = async () => {
      // update
      const { ADDRESS, SESSION } = constants.storageKey
      const session = localStorage.get(SESSION + address)

      // sync
      merge(accountStore, {
        evmAddress: address,
        evmChainId: chain?.id,
        logged: !!session,
        session,
        evmAuthStatus: session ? 'authenticated' : 'unauthenticated'
      })

      if (session) return

      // if (accountStore.evmSignedMessage) {
      //   await reqStore.userWalletLogin(accountStore)
      // }
    }

    if (!address) return 

    asyncFunc()
  }, [address, chain])

  return (
    <>
      {
        address
          ? <ConnectButton chainStatus="icon" showBalance={{ smallScreen: false, largeScreen: true }} />
          : <span className="d-flex fw-500 gap-3 col hover-black br-3 px-4 py-3 align-items-center justify-content-center" onClick={() => openConnectModal && openConnectModal()}>Connect Wallet</span>
      }
    </>
  )
}

export default ConnectEVMWallet

