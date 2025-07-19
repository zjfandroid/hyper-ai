import React, { ReactNode, HTMLProps } from 'react'
import { Pagination } from 'antd'
import { Link } from "react-router-dom"
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import Busy from '@/components/Busy'
import { constants, useAccountStore } from '@/stores'
import {
  IOutlineWarning2
} from '@/components/icon'
import LoginBtn from '@/components/Login/Btn'

interface ColumnNoDataProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  size?: 'small'|'middle'|'large'
  message?: string
  logged?: boolean // 是否需要登录态，会显示登录入口
}

const ColumnNoData: React.FC<ColumnNoDataProps> = ({ size = 'middle', logged = false, message = '', ...rest }) => {
  const accountStore = useAccountStore()
  const { t, i18n } = useTranslation()

  const sizes = {
    small: 'm-5',
    middle: 'm-5 p-5',
    large: 'm-5 p-5'
  }
  return (
    <div className="d-flex p-5 justify-content-center col" { ...rest }>
      <div className={`d-flex flex-column align-items-center justify-content-center gap-3 ${ sizes[size] }`}>
        {
          logged && !accountStore.logged
            ? <>
                <LoginBtn />
                <span className="color-secondary fw-500">
                  {t('common.loginRequired')}
                </span>
              </>
            : <>
                <IOutlineWarning2 className='color-secondary w-64' />
                <span className="color-secondary fw-500">
                  { message || t('common.noData') }
                </span>
              </>
        }
      </div>
    </div>
  )
}

export default ColumnNoData