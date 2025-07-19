import { Button, Input } from "antd"
import React, { ReactNode, HTMLProps } from 'react'
import {
  IOutlineSearchNormal1,
  IQuestionCircle
} from '@/components/icon'

interface FixedBottomSearchProps extends HTMLProps<HTMLDivElement> {
  onClick: () => Promise<any> | any
  placeholder: string
}

const FixedBottomSearch: React.FC<FixedBottomSearchProps> = ({ onClick, placeholder, ...rest }) => {

  return (
    <>
      <div className="d-flex position-fixed position-rl z-index-9 p-3" style={{ bottom: '54px' }}>
        <Input value='' readOnly size='small' className='col-12' placeholder={placeholder}
          onClick={onClick}
          prefix={<IOutlineSearchNormal1 className="w-20 color-secondary" />} />
      </div>
      <div className="py-3"></div>
    </>
  )

}

export default FixedBottomSearch