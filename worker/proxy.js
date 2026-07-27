/**
 * Cloudflare Worker — vergex.trade API 跨域代理（通用）
 *
 * 作用：
 *   1. 将所有请求透传到 vergex.trade，移除浏览器 Origin/Referer 头，规避 CF 防护 403
 *   2. 添加 CORS 响应头，允许任意域名前端调用
 *   3. 按路径差异化缓存 TTL，降低回源请求量
 *   4. fetch 超时控制（10s），避免长时间挂起
 *   5. 健康检查端点 /__health
 *
 * 部署后访问形如：
 *   https://<worker>.<subdomain>.workers.dev/api/v1/data-intelligence/markets/cross-section/directional?chain=mainnet&liqBand=15
 *   https://<worker>.<subdomain>.workers.dev/trending-crypto?tab=net_flow&limit=20
 */

const TARGET_ORIGIN = 'https://vergex.trade'
const FETCH_TIMEOUT_MS = 10000 // 回源超时

// 按路径差异化缓存 TTL（秒）
const CACHE_TTL_MAP = [
  { match: /^\/api\/v1\/data-intelligence\//, ttl: 30 }, // 实时行情雷达
  { match: /^\/trending-crypto/, ttl: 30 }, // 资金流向等
  { match: /^\/trending-category/, ttl: 60 }, // AI500 / 预测市场
  { match: /^\/api\/v1\//, ttl: 30 }, // 其他 API
]
const DEFAULT_TTL = 30

// 允许转发的路径前缀白名单（防止 worker 被滥用为通用代理）
const ALLOWED_PATH_PREFIXES = [
  '/api/',
  '/trending-crypto',
  '/trending-category',
]

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

const getCacheTtl = (pathname) => {
  for (const { match, ttl } of CACHE_TTL_MAP) {
    if (match.test(pathname)) return ttl
  }
  return DEFAULT_TTL
}

const isAllowedPath = (pathname) => {
  return ALLOWED_PATH_PREFIXES.some(p => pathname.startsWith(p))
}

/**
 * 带超时的 fetch
 */
const fetchWithTimeout = (url, options, timeoutMs) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer))
}

export default {
  async fetch(request, env, ctx) {
    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    const url = new URL(request.url)

    // 健康检查
    if (url.pathname === '/__health') {
      return new Response(JSON.stringify({ ok: true, target: TARGET_ORIGIN, time: Date.now() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      })
    }

    // 根路径返回代理说明
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(JSON.stringify({
        service: 'vergex-trade-proxy',
        target: TARGET_ORIGIN,
        endpoints: ALLOWED_PATH_PREFIXES,
        health: '/__health',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      })
    }

    // 路径白名单校验
    if (!isAllowedPath(url.pathname)) {
      return new Response(JSON.stringify({ error: 'Path not allowed', path: url.pathname }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      })
    }

    const targetUrl = TARGET_ORIGIN + url.pathname + url.search
    const cacheTtl = getCacheTtl(url.pathname)

    // 构造转发请求头：移除可能触发拦截的头，伪装为同源请求
    const forwardHeaders = new Headers()
    forwardHeaders.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    forwardHeaders.set('Referer', 'https://vergex.trade/')
    forwardHeaders.set('Accept', 'application/json, text/plain, */*')

    if (request.method === 'POST') {
      forwardHeaders.set('Content-Type', request.headers.get('Content-Type') || 'application/json')
    }

    // GET 请求：先查 Cache API
    const cacheKey = new Request(targetUrl, { method: 'GET' })
    if (request.method === 'GET') {
      const cached = await caches.default.match(cacheKey)
      if (cached) {
        const headers = new Headers(cached.headers)
        Object.entries(CORS_HEADERS).forEach(([k, v]) => headers.set(k, v))
        headers.set('X-Proxy-Cache', 'HIT')
        headers.set('X-Proxy-Cache-Ttl', String(cacheTtl))
        return new Response(cached.body, { status: cached.status, headers })
      }
    }

    // 回源请求（带超时）
    let response
    try {
      response = await fetchWithTimeout(targetUrl, {
        method: request.method,
        headers: forwardHeaders,
        body: request.method === 'POST' ? await request.text() : undefined,
      }, FETCH_TIMEOUT_MS)
    } catch (err) {
      const isTimeout = err && err.name === 'AbortError'
      return new Response(JSON.stringify({
        error: isTimeout ? 'Upstream fetch timeout' : 'Upstream fetch failed',
        message: String(err),
      }), {
        status: isTimeout ? 504 : 502,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      })
    }

    // 构造响应
    const respHeaders = new Headers(response.headers)
    Object.entries(CORS_HEADERS).forEach(([k, v]) => respHeaders.set(k, v))
    respHeaders.set('X-Proxy-Cache', 'MISS')
    respHeaders.set('X-Proxy-Cache-Ttl', String(cacheTtl))

    const newResponse = new Response(response.body, {
      status: response.status,
      headers: respHeaders,
    })

    // GET 且成功的响应写入缓存
    if (request.method === 'GET' && response.status === 200) {
      ctx.waitUntil(caches.default.put(cacheKey, newResponse.clone()))
    }

    return newResponse
  },
}
