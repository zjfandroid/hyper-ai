import { useState, ReactNode, useEffect, HTMLProps } from 'react'
import { Outlet } from "react-router-dom"
import { useLocation } from 'react-router-dom';

import { constants } from "@/stores"
import LayoutHeader from './Header'
import LayoutFooter from './Footer'

import './RootStarlight.scss'

interface LayoutRootStarlightProps extends HTMLProps<HTMLDivElement> {
  full?: boolean
  footer?: ReactNode
}

const LayoutRootStarlight: React.FC<LayoutRootStarlightProps> = ({ full = false, footer = <LayoutFooter /> }) => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])

  return (
    <div className={`d-flex flex-column position-relative root-starlight ${full ? 'h-100vh' : 'min-100vh'}`}>
      <LayoutHeader />
      <Outlet />
      {footer}
    </div>
  )
}

export default LayoutRootStarlight