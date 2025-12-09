import { useState, useEffect } from 'react'
import { Outlet } from "react-router-dom"
import { useLocation } from 'react-router-dom';

import { constants } from "@/stores"
import LayoutHeader from './Header'
import LayoutFooter from './Footer'

const LayoutRootDefault = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])

  return (
    <div className="d-flex flex-column min-100vh">
      <LayoutHeader />
      <Outlet />
      {/* <LayoutFooter /> */}
    </div>
  )
}

export default LayoutRootDefault