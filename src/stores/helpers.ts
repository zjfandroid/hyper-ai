import { TObject } from '@/utils';
import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react'

const useLayout = typeof window === 'undefined' ? useEffect : useLayoutEffect

export const createStore = <T extends TObject<any>>(initial: T) => {
  const state = initial
  const listeners = new Set()

  function subscribe(listener: (state: any, key: any) => () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  function setState(key: string | symbol, value: any) {
    // @ts-ignore
    if (!Object.is(state[key], value)) {
      // @ts-ignore
      state[key] = value
    }
    // @ts-ignore
    listeners.forEach((listener) => listener(state, key))
  }

  function useStore(): T {
    const [, rerender] = useState()
    const tracked = useRef({})
    const stateRef = useRef(state)

    const proxy = useMemo(() => {
      stateRef.current = state

      return new Proxy(
        {},
        {
          get(_, property) {
            // @ts-ignore
            tracked.current[property] = true
            // @ts-ignore
            return stateRef.current[property]
          },
          set(_, property, value) {
            setState(property, value)
            return true
          },
        }
      )
    }, [])

    useLayout(() => {
      // @ts-ignore
      const unsub = subscribe((_, key) => {
        // @ts-ignore
        if (tracked.current[key]) {
          // @ts-ignore
          rerender({})
        }
      })

      return unsub
    }, [])

    // @ts-ignore
    return proxy
  }

  return useStore
}