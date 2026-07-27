import { message } from 'antd'
import axios from 'axios'

import { constants } from '@/stores'
import { localStorage } from '@/utils'

const baseCheck = (res: { data: any }, accountStore) => {
  const codes: Record<string, { message: string, func: () => void }> = {
    '-2': { message: 'Please log in again', func: () => accountStore.reset() },
  }

  const code = String(res.data.code)
  const error = code !== '0'

  if (error) {
    message.error(codes[code]?.message || res.data.msg)
    codes[code]?.func && codes[code]?.func()
  }
  return error
}

const baseURL = constants.app.API_BASE

const baseApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
})

// 拦截器
baseApi.interceptors.request.use(
  (config) => {
    const session = localStorage.get(constants.storageKey.SESSION)

    if (session) {
      config.headers['Authorization'] = `Bearer ${session}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const hyperApi = axios.create({
  baseURL: 'https://api.hyperliquid.xyz',
  headers: {
    'Content-Type': 'application/json'
  },
})

// VergeX 行情数据 API（公开接口，无需鉴权）
// 配置了 Cloudflare Worker 代理时统一走代理，规避跨域 403；代理失败自动回退直连
const vergexProxyBase = import.meta.env.VITE_VERGEX_PROXY
const VERGEX_DIRECT_BASE = 'https://vergex.trade'

// 直连实例（代理失败时回退使用）
const vergexDirectApi = axios.create({
  baseURL: VERGEX_DIRECT_BASE,
  headers: { 'Content-Type': 'application/json' },
})

const vergexApi = axios.create({
  baseURL: vergexProxyBase || VERGEX_DIRECT_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// 代理失败时（网络错误/超时/5xx/403）自动回退直连，避免 worker 不可用导致全部接口失效
if (vergexProxyBase) {
  vergexApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config
      // 避免重复重试
      if (config && !config.__vergexRetried) {
        config.__vergexRetried = true
        try {
          return await vergexDirectApi.request({
            method: config.method,
            url: config.url,
            params: config.params,
            data: config.data,
          })
        } catch (retryErr) {
          return Promise.reject(retryErr)
        }
      }
      return Promise.reject(error)
    }
  )
}

export {
  baseCheck,
  baseURL,
  baseApi,
  hyperApi,
  vergexApi,
}


