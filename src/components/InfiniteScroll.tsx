import React, { ReactNode, HTMLProps, useEffect, useState } from 'react'

import { constants } from '@/stores/constants'

interface InfiniteScrollProps extends HTMLProps<HTMLDivElement> {
  onLoad: () => Promise<any> | any
  isEnd: boolean
  busy: boolean
  el?: HTMLElement
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ onLoad, isEnd, busy, el = document.documentElement, ...rest }) => {
  const [scrollReqLock, setScrollReqLock] = useState(false)

  const handleScroll = async () => {
    const scrollHeight = el.scrollHeight;
    const scrollTop = el.scrollTop;
    const clientHeight = el.clientHeight;

    // 当滚动距离加上剩余距离大于总高度时,触发方法
    if ((scrollTop + clientHeight >= scrollHeight - constants.app.SCROLL_BOTTOM_GAP) && !scrollReqLock) {
      setScrollReqLock(true)

      if (!isEnd && !busy) {
        await onLoad()
        setScrollReqLock(false)
      }
    }
  }

  // init
  useEffect(() => {
    el.addEventListener('scroll', handleScroll)

    return () => {
      el.removeEventListener('scroll', handleScroll)
    };
  }, [])

  return (
    <div { ...rest }>
      <span className='d-flex text-center justify-content-center col color-secondary-dark'>Reached the Bottom</span>
    </div>
  )
}
export default InfiniteScroll