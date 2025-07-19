import { Button } from 'antd'
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { Link } from "react-router-dom"

import {
  IOutlineMenu,
  IX,
  ITelegram
} from '@/components/icon'
// import ILinkTo from '@/assets/image/component/Footer/link-to.svg?react'
import { IOutlineExport2 } from '@/components/icon'
import { constants, useCommonStore } from '@/stores'
import Logo from '@/components/Logo'

import './Footer.scss'

const LayoutFooter = () => {
  const commonStore = useCommonStore()
  const { t, i18n } = useTranslation()

  return (
    <div className="container-fluid px-0 d-flex flex-column footer mt-auto">
      <div className="d-flex flex-column flex-lg-row gap-3 align-items-center justify-content-center justify-content-lg-between">
        <div className='d-flex flex-wrap justify-content-center justify-content-md-start gap-4 align-items-center p-3 p-md-4 col'>
          <div>
            <Logo mark size='large' />
          </div>
          <div className='d-flex flex-column col-12 col-md col-xl-8'>
            <span className='h5 fw-bold text-center text-md-start'>{ t('footer.websiteService') }</span>
            <ul className='d-flex flex-wrap fw-500 color-secondary-thin mt-3 mx-auto mx-md-0'>
              {
                [
                  ...commonStore.nav
                ].map((item, idx) => (
                  <li key={idx} className='d-flex gap-2 py-1 pe-3 col-6'>•
                    { item.disabled
                        ? <span>{ t(item.i18n) }</span>
                        : item.to
                            ? <Link to={item.to} className='linker color-unimportant'>{ t(item.i18n) }</Link>
                              : <a href={item.href} target='_blank' className='linker color-unimportant'>{ t(item.i18n) }</a>
                    }
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
        <div className='d-flex flex-column col-12 col-lg-4 px-3 ps-lg-5 pe-lg-4 pb-4 py-lg-5 gap-line'>
          <span className='h5 fw-bold text-center text-lg-start'>{ t('footer.socialMedia') }</span>
          <ul className='d-flex flex-column fw-500 gap-2 mt-3'>
            {
              [
                { text: t('common.telegram'), icon: <ITelegram />, href: constants.app.TELEGRAM },
                { text: t('common.x'), icon: <IX />, href: constants.app.TWITTER },
              ].map((item, idx) => (
                <li key={idx} className=''>
                  <a href={item.href} target='_blank' className='d-flex linker color-unimportant col border-gray px-3 py-2 gap-2 align-items-center br-4'>
                    { item.icon }
                    <span>{ item.text }</span>
                    <IOutlineExport2 className='ms-auto w-20' />
                  </a>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      <div className='d-flex flex-column flex-lg-row justify-content-center align-items-center justify-content-between p-4'>
        {/* <span className='color-secondary'>Powered by the <a className='color-primary-linear fw-500' href='https://teleprotocol.io/' target='_blank'>TELE AI Framework</a></span> */}
        <span className='d-flex gap-2 align-items-center fw-500 color-secondary'>
          <em className='color-secondary-dark fw-bold h5'>[</em>
          © {constants.app.NAME} 2025
          <em className='color-secondary-dark fw-bold h5'>]</em>
        </span>
        {/* <span className='fw-bold color-white'>
          Email: <a href='mailto:'>@mail</a>
        </span> */}
      </div>
    </div>
  )
}

export default LayoutFooter