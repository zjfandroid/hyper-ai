import { Button } from 'antd'
import { useConnectModal, useAccountModal, useChainModal, ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect } from 'react';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { IOutlineWallet3 } from '@/components/icon'
import { localStorage, merge } from '@/utils'
import { constants, useAccountStore, useReqStore } from '@/stores'

const LoginEVMWallet = ({ busy = false }) => {
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { openChainModal } = useChainModal()
  const { disconnect } = useDisconnect()
  const { address, chain } = useAccount()

  const accountStore = useAccountStore()
  const reqStore = useReqStore()

  const { t, i18n } = useTranslation()

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
    <Button ghost type="primary" className="br-4 border-w-2 px-4 fw-500 col"
      loading={busy}
      icon={<IOutlineWallet3 />}
      onClick={() => openConnectModal && openConnectModal()}>
      Sign in with Wallet
    </Button>
  )
}

export default LoginEVMWallet

