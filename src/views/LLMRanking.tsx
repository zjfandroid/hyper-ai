import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Empty, Input, Progress, Row, Select, Space, Spin, Statistic, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { ReloadOutlined, LinkOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import { formatNumber } from '@/utils'

const { Paragraph, Text, Title } = Typography

const API_URL = 'https://www.benchlm.ai/api/data/leaderboard'
const AUTO_REFRESH_MS = 5 * 60 * 1000

type TCategoryScores = {
  agentic: number | null
  coding: number | null
  reasoning: number | null
  multimodalGrounded: number | null
  knowledge: number | null
  multilingual: number | null
  instructionFollowing: number | null
  math: number | null
}

type TModel = {
  rank: number
  model: string
  creator: string
  sourceType: string
  overallScore: number
  categoryScores: TCategoryScores
  inputPrice: number | null
  outputPrice: number | null
}

type TLeaderboardResponse = {
  lastUpdated: string
  mode: string
  models: TModel[]
}

type TSourceFilter = 'all' | 'proprietary' | 'open'

const CATEGORY_KEYS: Array<keyof TCategoryScores> = [
  'agentic',
  'coding',
  'reasoning',
  'multimodalGrounded',
  'knowledge',
  'multilingual',
  'instructionFollowing',
  'math'
]

const getCategoryColor = (score: number) => {
  if (score >= 90) return '#52c41a'
  if (score >= 80) return '#1677ff'
  if (score >= 70) return '#faad14'
  return '#ff7875'
}

const formatScore = (score?: number | null) => score == null ? '--' : score.toFixed(1)

const formatPrice = (price?: number | null) => {
  if (price == null) return '--'
  return `$${formatNumber(price)} / 1M`
}

const isOpenSource = (sourceType: string) => /open/i.test(sourceType)

const getTopCategory = (categoryScores: TCategoryScores) => {
  return CATEGORY_KEYS
    .map((key) => ({ key, score: categoryScores[key] }))
    .filter((item) => item.score != null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0] ?? null
}

const getValueLeader = (models: TModel[]) => {
  return models
    .filter((item) => item.inputPrice != null && item.outputPrice != null && item.overallScore > 0)
    .map((item) => ({
      model: item,
      valueScore: item.overallScore / (((item.inputPrice ?? 0) + (item.outputPrice ?? 0)) / 2)
    }))
    .sort((a, b) => b.valueScore - a.valueScore)[0]?.model ?? null
}

const LLMRanking = () => {
  const { t } = useTranslation()
  const [data, setData] = useState<TLeaderboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [provider, setProvider] = useState('all')
  const [sourceFilter, setSourceFilter] = useState<TSourceFilter>('all')
  const [lastFetchedAt, setLastFetchedAt] = useState('')

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result: TLeaderboardResponse = await response.json()
      setData(result)
      setLastFetchedAt(new Date().toLocaleString())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard()

    const timer = window.setInterval(() => {
      fetchLeaderboard()
    }, AUTO_REFRESH_MS)

    return () => {
      window.clearInterval(timer)
    }
  }, [fetchLeaderboard])

  const providerOptions = useMemo(() => {
    const values = Array.from(new Set((data?.models ?? []).map((item) => item.creator))).sort((a, b) => a.localeCompare(b))
    return [
      { label: t('aiModels.allProviders'), value: 'all' },
      ...values.map((item) => ({ label: item, value: item }))
    ]
  }, [data?.models, t])

  const filteredModels = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return (data?.models ?? []).filter((item) => {
      const matchesKeyword = !keyword
        || item.model.toLowerCase().includes(keyword)
        || item.creator.toLowerCase().includes(keyword)

      const matchesProvider = provider === 'all' || item.creator === provider
      const matchesSource = sourceFilter === 'all'
        || (sourceFilter === 'open' && isOpenSource(item.sourceType))
        || (sourceFilter === 'proprietary' && !isOpenSource(item.sourceType))

      return matchesKeyword && matchesProvider && matchesSource
    })
  }, [data?.models, provider, search, sourceFilter])

  const heroModels = filteredModels.length ? filteredModels : (data?.models ?? [])
  const topOverall = heroModels[0] ?? null
  const bestCoding = [...heroModels]
    .filter((item) => item.categoryScores.coding != null)
    .sort((a, b) => (b.categoryScores.coding ?? 0) - (a.categoryScores.coding ?? 0))[0] ?? null
  const bestAgentic = [...heroModels]
    .filter((item) => item.categoryScores.agentic != null)
    .sort((a, b) => (b.categoryScores.agentic ?? 0) - (a.categoryScores.agentic ?? 0))[0] ?? null
  const valueLeader = getValueLeader(heroModels)

  const columns: ColumnsType<TModel> = [
    {
      title: t('common.rank'),
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (value: number) => (
        <div className='d-flex align-items-center gap-2'>
          <span style={{ fontWeight: 700 }}>{value}</span>
          {value <= 3 && <Tag color='gold'>TOP</Tag>}
        </div>
      )
    },
    {
      title: t('aiModels.model'),
      key: 'model',
      width: 280,
      render: (_, record) => {
        const topCategory = getTopCategory(record.categoryScores)

        return (
          <div className='d-flex flex-column gap-2'>
            <div className='d-flex align-items-center gap-2 flex-wrap'>
              <Text strong style={{ color: '#fff' }}>{record.model}</Text>
              <Tag color={isOpenSource(record.sourceType) ? 'blue' : 'purple'}>
                {isOpenSource(record.sourceType) ? t('aiModels.openSource') : t('aiModels.proprietary')}
              </Tag>
            </div>
            <Text style={{ color: 'rgba(255,255,255,0.65)' }}>{record.creator}</Text>
            {
              topCategory &&
                <Tag color={getCategoryColor(topCategory.score ?? 0)}>
                  {t(`aiModels.categories.${topCategory.key}`)} {formatScore(topCategory.score)}
                </Tag>
            }
          </div>
        )
      }
    },
    {
      title: t('aiModels.overallScore'),
      dataIndex: 'overallScore',
      key: 'overallScore',
      width: 200,
      render: (value: number) => (
        <div style={{ minWidth: 160 }}>
          <div className='d-flex justify-content-between mb-1'>
            <Text style={{ color: '#fff' }}>{formatScore(value)}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)' }}>/ 100</Text>
          </div>
          <Progress percent={value} showInfo={false} strokeColor={getCategoryColor(value)} trailColor='rgba(255,255,255,0.12)' />
        </div>
      )
    },
    {
      title: t('aiModels.categoryFocus'),
      key: 'categories',
      width: 320,
      render: (_, record) => (
        <div className='d-flex flex-wrap gap-2'>
          {CATEGORY_KEYS.map((key) => (
            <Tag key={key} color='default' style={{ marginInlineEnd: 0 }}>
              {t(`aiModels.categories.${key}`)} {formatScore(record.categoryScores[key])}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: t('aiModels.pricing'),
      key: 'pricing',
      width: 180,
      render: (_, record) => (
        <div className='d-flex flex-column gap-1'>
          <Text style={{ color: '#fff' }}>{t('aiModels.inputPrice')}: {formatPrice(record.inputPrice)}</Text>
          <Text style={{ color: '#fff' }}>{t('aiModels.outputPrice')}: {formatPrice(record.outputPrice)}</Text>
        </div>
      )
    }
  ]

  return (
    <div className='container-fluid px-0 d-flex flex-column my-5 pt-5'>
      <div className='container-xl d-flex flex-column px-3 px-md-4 gap-3 gap-md-4 mb-3 mb-md-5 py-0'>
        <div
          className='d-flex flex-column gap-4 p-4 p-md-5 br-3'
          style={{
            background: 'linear-gradient(135deg, rgba(24, 29, 48, 0.96) 0%, rgba(20, 39, 84, 0.92) 45%, rgba(49, 23, 83, 0.92) 100%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 24px 80px rgba(5, 10, 30, 0.35)'
          }}
        >
          <div className='d-flex flex-column flex-lg-row justify-content-between gap-4'>
            <div className='d-flex flex-column gap-3 col-12 col-lg-8'>
              <Tag color='geekblue' style={{ width: 'fit-content', marginInlineEnd: 0 }}>{t('aiModels.liveSource')}</Tag>
              <Title level={2} style={{ margin: 0, color: '#fff' }}>{t('aiModels.headline')}</Title>
              <Paragraph style={{ margin: 0, color: 'rgba(255,255,255,0.72)', fontSize: 16 }}>
                {t('aiModels.subheadline')}
              </Paragraph>
              <div className='d-flex flex-wrap gap-2'>
                <Tag color='cyan'>{t('aiModels.mode')}: {data?.mode ?? '--'}</Tag>
                <Tag color='blue'>{t('aiModels.updatedAt')}: {data?.lastUpdated ?? '--'}</Tag>
                <Tag color='purple'>{t('aiModels.fetchedAt')}: {lastFetchedAt || '--'}</Tag>
              </div>
            </div>

            <div className='d-flex align-items-start justify-content-lg-end'>
              <Space wrap>
                <Button icon={<ReloadOutlined />} onClick={fetchLeaderboard} loading={loading}>
                  {t('aiModels.refresh')}
                </Button>
                <Button icon={<LinkOutlined />} href='https://www.benchlm.ai/' target='_blank'>
                  BenchLM
                </Button>
              </Space>
            </div>
          </div>

          {
            error &&
              <Alert
                type='error'
                showIcon
                message={t('aiModels.loadFailed')}
                description={error}
              />
          }

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} xl={6}>
              <Card bordered={false} style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.72)' }}>{t('aiModels.topOverall')}</span>}
                  value={topOverall?.overallScore ?? 0}
                  precision={1}
                  valueStyle={{ color: '#fff' }}
                  suffix={<span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14 }}>{topOverall?.model ?? '--'}</span>}
                />
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card bordered={false} style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.72)' }}>{t('aiModels.bestCoding')}</span>}
                  value={bestCoding?.categoryScores.coding ?? 0}
                  precision={1}
                  valueStyle={{ color: '#fff' }}
                  suffix={<span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14 }}>{bestCoding?.model ?? '--'}</span>}
                />
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card bordered={false} style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.72)' }}>{t('aiModels.bestAgentic')}</span>}
                  value={bestAgentic?.categoryScores.agentic ?? 0}
                  precision={1}
                  valueStyle={{ color: '#fff' }}
                  suffix={<span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14 }}>{bestAgentic?.model ?? '--'}</span>}
                />
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card bordered={false} style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.72)' }}>{t('aiModels.bestValue')}</span>}
                  value={valueLeader?.overallScore ?? 0}
                  precision={1}
                  valueStyle={{ color: '#fff' }}
                  suffix={<span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14 }}>{valueLeader?.model ?? '--'}</span>}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <Card
          bordered={false}
          className='br-3'
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
          bodyStyle={{ padding: 20 }}
        >
          <div className='d-flex flex-column gap-3'>
            <div className='d-flex flex-column flex-lg-row justify-content-between gap-3'>
              <div>
                <Title level={3} style={{ marginBottom: 4, color: '#fff' }}>{t('aiModels.tableTitle')}</Title>
                <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {t('aiModels.autoRefresh', { minutes: AUTO_REFRESH_MS / 60000 })}
                </Text>
              </div>
              <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                {t('aiModels.resultCount', { count: filteredModels.length })}
              </Text>
            </div>

            <Row gutter={[12, 12]}>
              <Col xs={24} md={10} xl={10}>
                <Input
                  allowClear
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('aiModels.searchPlaceholder')}
                />
              </Col>
              <Col xs={24} md={7} xl={7}>
                <Select
                  value={provider}
                  onChange={setProvider}
                  options={providerOptions}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} md={7} xl={7}>
                <Select
                  value={sourceFilter}
                  onChange={(value) => setSourceFilter(value)}
                  options={[
                    { label: t('aiModels.allSources'), value: 'all' },
                    { label: t('aiModels.proprietary'), value: 'proprietary' },
                    { label: t('aiModels.openSource'), value: 'open' }
                  ]}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>

            {
              loading
                ? <div className='d-flex justify-content-center py-5'><Spin size='large' /></div>
                : filteredModels.length
                    ? (
                      <Table
                        rowKey={(record) => `${record.rank}-${record.model}`}
                        columns={columns}
                        dataSource={filteredModels}
                        pagination={{ pageSize: 12, showSizeChanger: false }}
                        scroll={{ x: 1100 }}
                      />
                    )
                    : <Empty description={t('aiModels.noData')} />
            }
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LLMRanking
