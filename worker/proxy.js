/**
 * Cloudflare Worker — vergex.trade API 跨域代理
 *
 * 作用：
 *   1. 移除浏览器跨域请求的 Origin/Referer 头，避免被 Cloudflare 防护拦截（403）
 *   2. 添加 CORS 响应头，允许任意域名前端调用
 *   3. 对 GET 请求做边缘缓存（默认 30 秒），降低回源请求量
 *
 * 部署后访问形如：
 *   https://<your-worker>.<your-subdomain>.workers.dev/api/v1/data-intelligence/markets/cross-section/directional?chain=mainnet&liqBand=15
 */

const TARGET_ORIGIN = 'https://vergex.trade'
const CACHE_TTL = 30 // 秒，仅对 GET 请求生效

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

export default {
  async fetch(request, env, ctx) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    const url = new URL(request.url)
    const targetUrl = TARGET_ORIGIN + url.pathname + url.search

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
        return new Response(cached.body, { status: cached.status, headers })
      }
    }

    // 回源请求
    let response
    try {
      response = await fetch(targetUrl, {
        method: request.method,
        headers: forwardHeaders,
        body: request.method === 'POST' ? await request.text() : undefined,
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Upstream fetch failed', message: String(err) }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      })
    }

    // 构造响应
    const respHeaders = new Headers(response.headers)
    Object.entries(CORS_HEADERS).forEach(([k, v]) => respHeaders.set(k, v))
    respHeaders.set('X-Proxy-Cache', 'MISS')

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
