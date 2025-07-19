import { useState, useEffect, useRef } from 'react'
import { useLocation, useMatches, Link } from "react-router-dom"
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { Button, Dropdown, MenuProps } from 'antd'

import SenderInvitationsCode from '@/components/SenderInvitationsCode'
import TelegramLogin from '@/components/TelegramLogin'
import { IOutlineLogout, IOutlineMenu1 } from '@/components/icon'
import { urlSafeBase58DecodeByJSON, toKM, merge, maskingAddress } from '@/utils'
import AccountNav from '@/components/Account/Nav'
import { constants, useAccountStore, useCommonStore, useReqStore, useHomeStore } from '@/stores'
import Logo from '@/components/Logo'
import Avatar from '@/components/Avatar'
import ChangeI18n from '@/components/ChangeI18n'
import HyperAllPrice from '@/components/Hyper/AllPrice'
import LoginBtn from '@/components/Login/Btn'
import ModalLogin from '@/components/Modal/Login'
import AddressAvatar from '@/components/AddressAvatar'

import './Header.scss'

const LayoutHeader = () => {
  const accountStore = useAccountStore()
  const location = useLocation()
  const cmmonStore = useCommonStore()
  const homeStore = useHomeStore()
  const reqStore = useReqStore()
  const { t, i18n } = useTranslation()
  const contentRef = useRef<HTMLDivElement>(null)
  const [placeholderHeight, setPlaceholderHeight] = useState(0)

  const [navBgAlpha, setNavBgAlpha] = useState(0);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setNavBgAlpha(Math.min(1, scrollY / 400));
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const nav = [
    { i18n: 'header.home', name: 'Home', to: '/' },
    ...cmmonStore.nav
  ]

  const sideNavItems: MenuProps['items'] = nav.map((item, idx) => ({
    key: idx,
    label: item.disabled
      ? <div key={idx} className={`d-flex color-secondary`}>{ t(item.i18n) }</div>
      : item.to
        ? <Link key={idx} to={item.to} className={`d-flex br-2 ${location.pathname === item.to ? 'fw-bold hover' : 'color-unimportant'}`}>{ t(item.i18n) }</Link>
        : <a href={item.href} target={item.target} key={idx} className={`d-flex br-2 ${location.pathname === item.to ? 'fw-bold hover' : 'color-unimportant'}`}>{ t(item.i18n) }</a>
  }))

  const updateContentHeight = () => {
    if (contentRef.current) {
      setPlaceholderHeight(contentRef.current.clientHeight - 1)
    }
  }

  // const handleOpenModalLogin = () => {
  //   accountStore.openModalLogin = true
  // }

  const handleTgLogin = async (user) => {
    accountStore.tgAccountData = JSON.stringify(user)
    const { error } = await reqStore.userTgLogin(accountStore)

    if (error) return
  }

  // init
  useEffect(() => {
    updateContentHeight()

    window.addEventListener('resize', updateContentHeight)

    return () => {
      window.removeEventListener('resize', updateContentHeight)
    };
  }, [])

  return (
    <>
      <div ref={contentRef} className="position-fixed container-fluid position-top z-index-99 p-0 header" style={{ backgroundColor: `rgba(10,10,10,${navBgAlpha})` }}>
        <div className=' d-flex flex-wrap gap-3 p-3 px-md-4 align-items-center'>
          <Logo size='small' mark className='d-sm-none' />
          <Logo size='small' className='d-none d-sm-flex' />
          <div className='d-none d-xl-flex col mx-4 gap-2 nav'>
            {
              nav.map((item, idx) =>
                item.disabled
                  ? <span key={idx} className={`d-flex h6 fw-300 px-4 py-2 color-secondary`}>{ t(item.i18n) }</span>
                  : item.to
                    ? <Link key={idx} to={item.to} className={`d-flex h6 fw-300 px-4 py-2 br-2 linker ${location.pathname === item.to ? 'fw-bold hover' : 'color-unimportant'}`}>{ t(item.i18n) }</Link>
                    : <a href={item.href} target={item.target} key={idx} className={`d-flex h6 fw-300 px-4 py-2 br-2 linker ${location.pathname === item.to ? 'fw-bold hover' : 'color-unimportant'}`}>{ t(item.i18n) }</a>
              )
            }
          </div>

          <div className="d-flex align-items-center gap-3 col-auto ms-auto">
            <ChangeI18n />
            {/* <Button href={homeStore.startUrl} target='_blank' size='small' type='primary' ghost className='br-4 border-w-2 px-4 fw-500'>Start Strategy</Button> */}
            {
              accountStore.logged
                ? <Dropdown placement="bottomRight" className='br-4'
                    menu={{ items: [
                      <div className='d-flex gap-2' onClick={() => accountStore.reset() }><IOutlineLogout className='color-secondary zoom-85' /> {t('common.logOut')}</div>,
                    ].map((item, idx) => ({ key: idx, label: item}))}}>
                    <div className='d-flex gap-2 align-items-center cursor-default'>
                      {
                        accountStore.evmAddress
                          ? <AddressAvatar size={32} address={accountStore.evmAddress} />
                          : <Avatar href={accountStore.tgHeadIco} name={accountStore.tgLastName} size='md' />
                      }
                      <span className='fw-500 h6 color-white'>
                        {
                          accountStore.evmAddress
                            ? maskingAddress(accountStore.evmAddress)
                            : <>{accountStore.tgLastName} {accountStore.tgFirstName}</>
                        }
                      </span>
                    </div>
                  </Dropdown>
                : <LoginBtn />
                // : <TelegramLogin botId={constants.app.TG_BOT_ID} onAuth={handleTgLogin} />
                // : <Button onClick={handleOpenModalLogin} size='small' type='primary' ghost className='br-4 border-w-2 px-4 fw-500'>Log In</Button>
            }

            <Dropdown placement="bottomRight" className='br-4'
              menu={{ items: sideNavItems }}>
              <div className="d-flex d-xl-none p-2 linker">
                <IOutlineMenu1 className='color-white' />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* <div style={{ height: `${placeholderHeight}px`}}></div> */}
      <ModalLogin />
      <HyperAllPrice />
      <SenderInvitationsCode />
    </>
  )
}

export default LayoutHeader