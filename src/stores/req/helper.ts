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
const vergexApi = axios.create({
  baseURL: 'https://vergex.trade',
  headers: {
    'Content-Type': 'application/json'
  },
})

// VergeX 代理 API（通过 Cloudflare Worker 转发，解决跨域 403）
// 未配置代理时为 null，调用方需回退到客户端计算模式
const vergexProxyBase = import.meta.env.VITE_VERGEX_PROXY
const vergexProxyApi = vergexProxyBase ? axios.create({
  baseURL: vergexProxyBase,
  headers: { 'Content-Type': 'application/json' },
}) : null

export {
  baseCheck,
  baseURL,
  baseApi,
  hyperApi,
  vergexApi,
  vergexProxyApi
}


