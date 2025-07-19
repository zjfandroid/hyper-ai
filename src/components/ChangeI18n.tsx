import { Row, Col, Pagination, Switch, Select, Button, Dropdown } from "antd"
import type { MenuProps } from 'antd'
import { useEffect } from "react";
import { useTranslation } from "react-i18next"

import { IOutlineGlobal } from '@/components/icon'
import { constants, useCommonStore } from '@/stores'
import './ChangeI18n.scss'

const ChangeI18n = () => {
  const commonStore = useCommonStore()
	const { t, i18n } = useTranslation()

  const handleChange = ({ key }) => {
    i18n.changeLanguage(key)
  }

  // init
  // useEffect(() => {
  // }, [])

  return (
    <Dropdown overlayClassName='text-capitalize' placement="bottomRight" menu={{
        items: constants.app.I18NS.map(item => item),
        selectable: true,
        defaultSelectedKeys: [i18n.resolvedLanguage || constants.app.INIT_I18N],
        onClick: handleChange
      }}>
      <Button type='link' icon={<IOutlineGlobal className="zoom-80" />} className='px-4 fw-500 gap-2' >
        <span className="d-none d-sm-flex">{ constants.app.I18NS.find(item => item.key === i18n.resolvedLanguage)?.label }</span>
      </Button>
    </Dropdown>
  )
}

export default ChangeI18n