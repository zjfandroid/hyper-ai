import { useEffect, useState } from 'react'
import { Button, Input, InputNumber, Select, Tag, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'

import { IOutlineCopy } from '@/components/icon'
import { vergexApi, hyperApi } from '@/stores/req/helper'
import Loading from '@/components/Loading'
import { API_BASE_URL, HYPERLIQUID_API_URL, API_DOCS, ApiDoc } from './data'

import './index.scss'

const TrendingApi = () => {
  const { t } = useTranslation()
  const [selectedId, setSelectedId] = useState(API_DOCS[0].id)
  const [paramValues, setParamValues] = useState<Record<string, string>>({})
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [responseTime, setResponseTime] = useState<number>(0)

  const selectedDoc: ApiDoc = API_DOCS.find(d => d.id === selectedId) || API_DOCS[0]
  const isPost = selectedDoc.method === 'POST'

  // 切换接口时重置参数为默认值
  useEffect(() => {
    const defaults: Record<string, string> = {}
    selectedDoc.params.forEach(p => {
      if (p.fixed) defaults[p.name] = p.fixed
      else if (p.defaultValue) defaults[p.name] = p.defaultValue
    })
    setParamValues(defaults)
    setResponse(null)
    setError(null)
    setResponseTime(0)
  }, [selectedId])

  // 构建 query 参数（GET 请求，排除 inBody 参数）
  const buildQueryParams = () => {
    const params = new URLSearchParams()
    if (!isPost) {
      selectedDoc.params.forEach(p => {
        if (p.inBody) return
        const val = paramValues[p.name]
        if (val !== undefined && val !== '') params.set(p.name, val)
      })
    }
    return params.toString()
  }

  // 构建请求 URL
  const buildUrl = () => {
    const qs = buildQueryParams()
    return `${selectedDoc.baseUrl}${selectedDoc.path}${qs ? `?${qs}` : ''}`
  }

  // 构建 POST 请求体
  const buildBody = () => {
    const body: Record<string, any> = {}
    selectedDoc.params.forEach(p => {
      if (p.inBody) {
        body[p.name] = paramValues[p.name]
      }
    })
    return body
  }

  // 调用接口
  const handleCall = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)
    const start = Date.now()
    try {
      let res
      if (isPost) {
        const apiInstance = selectedDoc.baseUrl === HYPERLIQUID_API_URL ? hyperApi : vergexApi
        res = await apiInstance.post(selectedDoc.path, buildBody())
      } else {
        const apiInstance = selectedDoc.baseUrl === HYPERLIQUID_API_URL ? hyperApi : vergexApi
        const queryParams: Record<string, string> = {}
        selectedDoc.params.forEach(p => {
          if (p.inBody) return
          const val = paramValues[p.name]
          if (val !== undefined && val !== '') queryParams[p.name] = val
        })
        res = await apiInstance.get(selectedDoc.path, { params: queryParams })
      }
      setResponse(res.data)
      setResponseTime(Date.now() - start)
    } catch (e: any) {
      setError(e?.message || 'Request failed')
      setResponseTime(Date.now() - start)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    message.success(t('trendingApi.copied'))
  }

  const fullUrl = buildUrl()
  const requestBody = isPost ? JSON.stringify(buildBody(), null, 2) : null

  const methodColor = (method: string) => method === 'POST' ? 'orange' : 'green'

  return (
    <div className="trending-api-page container-fluid px-0 d-flex my-5 pt-5">
      <div className="container-xl d-flex flex-column flex-md-row px-3 px-md-4 gap-3 gap-md-4 mb-3 mb-md-5 py-0">
        {/* 左侧接口列表侧边栏 */}
        <aside className="trending-api-sidebar d-flex flex-column gap-2">
          <div className="fw-bold color-unimportant px-2 py-1">{t('trendingApi.interfaces')}</div>
          {/* 移动端下拉选择 */}
          <Select
            className="trending-api-mobile-select d-md-none"
            value={selectedId}
            onChange={setSelectedId}
            options={API_DOCS.map(doc => ({
              label: `${doc.method}  ${t(doc.titleI18n)}`,
              value: doc.id
            }))}
          />
          {/* 桌面端列表 */}
          <div className="trending-api-nav d-none d-md-flex flex-column gap-1">
            {API_DOCS.map(doc => (
              <div
                key={doc.id}
                className={`trending-api-nav-item d-flex align-items-center gap-2 p-2 br-2 pointer ${selectedId === doc.id ? 'active' : ''}`}
                onClick={() => setSelectedId(doc.id)}
              >
                <Tag color={methodColor(doc.method)} className="m-0">{doc.method}</Tag>
                <span className="text-truncate">{t(doc.titleI18n)}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* 右侧接口详情 */}
        <div className="trending-api-detail d-flex flex-column gap-4 flex-grow-1">
          {/* 标题 */}
          <div className="d-flex flex-column gap-2 p-4 br-3 bg-gray-alpha-4">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Tag color={methodColor(selectedDoc.method)} className="m-0">{selectedDoc.method}</Tag>
              <code className="trending-api-path-lg">{selectedDoc.baseUrl}{selectedDoc.path}</code>
              {selectedDoc.baseUrl === HYPERLIQUID_API_URL && (
                <Tag color="purple" className="m-0">HyperLiquid</Tag>
              )}
            </div>
            <h4 className="fw-bold mb-0">{t(selectedDoc.titleI18n)}</h4>
            <span className="color-secondary">{t(selectedDoc.descI18n)}</span>
          </div>

          {/* 参数表单 */}
          <div className="d-flex flex-column gap-3 p-4 br-3 bg-gray-alpha-4">
            <h5 className="fw-bold mb-0">{t('trendingApi.parameters')}</h5>
            <div className="d-flex flex-column gap-3">
              {selectedDoc.params.map(param => (
                <div key={param.name} className="d-flex flex-column flex-md-row align-items-md-center gap-2 gap-md-3">
                  <div className="d-flex align-items-center gap-2 col-12 col-md-4">
                    <code className="fw-bold">{param.name}</code>
                    {param.required && <Tag color="red" className="m-0">{t('trendingApi.required')}</Tag>}
                    <Tag className="m-0">{param.type}</Tag>
                    {param.inBody && <Tag color="orange" className="m-0">body</Tag>}
                  </div>
                  <div className="col-12 col-md-4">
                    {param.fixed ? (
                      <Input value={param.fixed} disabled size="small" />
                    ) : param.options ? (
                      <Select
                        size="small"
                        className="w-100"
                        value={paramValues[param.name]}
                        onChange={(v) => setParamValues(prev => ({ ...prev, [param.name]: v }))}
                        options={param.options.map(o => ({ label: o, value: o }))}
                      />
                    ) : (
                      <InputNumber
                        size="small"
                        className="w-100"
                        value={paramValues[param.name]}
                        onChange={(v) => setParamValues(prev => ({ ...prev, [param.name]: String(v || '') }))}
                      />
                    )}
                  </div>
                  <div className="col-12 col-md-4">
                    <small className="color-secondary">{t(param.descI18n)}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 请求 URL + 请求体 + 调用按钮 */}
          <div className="d-flex flex-column gap-2 p-4 br-3 bg-gray-alpha-4">
            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <h5 className="fw-bold mb-0">{t('trendingApi.requestUrl')}</h5>
              <div className="d-flex gap-2">
                <CopyToClipboard text={requestBody || fullUrl} onCopy={handleCopy}>
                  <Button size="small" ghost className="gap-1">
                    <IOutlineCopy className="w-16" /> {t('trendingApi.copy')}
                  </Button>
                </CopyToClipboard>
                <Button type="primary" size="small" loading={loading} onClick={handleCall}>
                  {t('trendingApi.tryIt')}
                </Button>
              </div>
            </div>
            <pre className="trending-api-url m-0 p-3 br-2">{fullUrl}</pre>
            {requestBody && (
              <>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <Tag color="orange" className="m-0">Body</Tag>
                  <small className="color-secondary">{t('trendingApi.requestBody')}</small>
                </div>
                <pre className="trending-api-url m-0 p-3 br-2">{requestBody}</pre>
              </>
            )}
          </div>

          {/* 响应结果 */}
          <div className="d-flex flex-column gap-2 p-4 br-3 bg-gray-alpha-4 position-relative">
            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <h5 className="fw-bold mb-0">{t('trendingApi.response')}</h5>
              {response && (
                <div className="d-flex align-items-center gap-2">
                  <Tag color="green" className="m-0">200 OK</Tag>
                  <span className="color-secondary">{responseTime} ms</span>
                </div>
              )}
              {error && (
                <Tag color="red" className="m-0">Error</Tag>
              )}
            </div>
            <div className="position-relative">
              {loading && <Loading loading={loading} />}
              {error && (
                <pre className="trending-api-json m-0 p-3 br-2 color-error">{error}</pre>
              )}
              {response && !error && (
                <pre className="trending-api-json m-0 p-3 br-2">{JSON.stringify(response, null, 2)}</pre>
              )}
              {!response && !error && !loading && (
                <div className="trending-api-placeholder d-flex align-items-center justify-content-center p-5 br-2">
                  <span className="color-unimportant">{t('trendingApi.clickTryIt')}</span>
                </div>
              )}
            </div>
          </div>

          {/* 响应字段说明 */}
          <div className="d-flex flex-column gap-2 p-4 br-3 bg-gray-alpha-4">
            <h5 className="fw-bold mb-0">{t('trendingApi.responseFields')}</h5>
            <div className="trending-api-fields-table">
              <div className="d-flex fw-bold color-unimportant py-2 border-bottom">
                <span className="col-3">{t('trendingApi.field')}</span>
                <span className="col-2">{t('trendingApi.type')}</span>
                <span className="col-7">{t('trendingApi.description')}</span>
              </div>
              {selectedDoc.responseFields.map((field, idx) => (
                <div key={idx} className="d-flex py-2 border-bottom">
                  <code className="col-3">{field.field}</code>
                  <span className="col-2 color-secondary">{field.type}</span>
                  <span className="col-7 color-secondary">{t(field.descI18n)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingApi
