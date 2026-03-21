import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { formatNumber } from '@/utils'
import { IOutlineArrowRight1, IOutlinePeople } from '@/components/icon'
import LineCharts from '@/views/components/charts/LineChart'

// Using the mock data directly as requested
import vaultsData from '@/assets/mock/vaults.json'

const VaultCard = ({ item }: { item: any }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const isPositive = item.middle_pct > 0
  const color = isPositive ? '#22C55E' : '#EF4444' // Green / Red

  const chartData = useMemo(() => {
    return (item.chartData || []).map((val: number, idx: number) => ({
      date: new Date().getTime() + idx * 86400000, // mock dates
      value: val
    }))
  }, [item.chartData])

  const durationStr = useMemo(() => {
    const diff = Date.now() - item.hl_create_time_millis
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days < 30) return `${days} days`
    if (days < 365) return `${Math.floor(days / 30)} months`
    return 'a year'
  }, [item.hl_create_time_millis])

  const handleCardClick = () => {
    navigate(`/trader/${item.hl_vault_address}`)
  }

  return (
    <div className="d-flex flex-column cursor-pointer" style={{ width: '25%', minWidth: '280px' }} onClick={handleCardClick}>
      <div 
        className="d-flex flex-column p-4 br-3 bg-gray-alpha-4 mx-1 mb-2 col gap-3 hover-bg-gray-alpha-5" 
        style={{ border: `1px solid ${item.hl_allow_deposits ? 'rgba(255,255,255,0.1)' : 'rgba(245, 158, 11, 0.3)'}`, transition: 'background-color 0.2s ease' }}
      >
        {/* Header */}
        <div className="d-flex align-items-center gap-3">
          {/* Avatar */}
          <div className="d-flex align-items-center justify-content-center br-round bg-gray-alpha-3" style={{ width: '40px', height: '40px' }}>
            {item.logo_url ? (
              <img src={item.logo_url} alt="" className="br-round w-full h-full object-fit-cover" />
            ) : (
              <IOutlinePeople className="zoom-120 color-secondary" />
            )}
          </div>
          <div className="d-flex flex-column col">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-truncate" style={{ maxWidth: '120px' }}>{item.display_name}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 mt-1">
              <span className="d-flex align-items-center gap-1 color-secondary font-12">
                {item.nb_followers} <IOutlinePeople className="zoom-70" />
              </span>
              <span className="color-secondary font-12">{durationStr}</span>
              <span className="color-white font-12 fw-500">Tvl ${formatNumber(item.tvl)}</span>
            </div>
          </div>
        </div>

        {/* ROI and Chart */}
        <div className="d-flex flex-column mt-2">
          <span className="color-secondary font-12 mb-1">{item.middle_text}</span>
          <span className={`h4 fw-bold mb-3 ${isPositive ? 'color-success' : 'color-error'}`}>
            {isPositive ? '+' : ''}{item.middle_pct}%
          </span>
          <div style={{ height: '60px', width: '100%', marginLeft: '-5px' }}>
            <LineCharts data={chartData} data1={[]} color={color} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} className="my-1"></div>

        {/* Stats */}
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column gap-1">
            <span className="color-secondary font-12">{item.bottom_left_text}</span>
            <span className="fw-bold">{item.bottom_left_pct}</span>
          </div>
          <div className="d-flex flex-column gap-1 text-end">
            <span className="color-secondary font-12">{item.bottom_right_text}</span>
            <span className="fw-bold">{item.bottom_right_pct}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex align-items-center gap-2 mt-2">
          <div 
            className={`d-flex align-items-center px-3 py-2 br-2 font-12 fw-bold ${item.hl_allow_deposits ? 'color-success' : 'color-warning'}`}
            style={{ border: `1px solid ${item.hl_allow_deposits ? '#22C55E' : '#F59E0B'}`, background: item.hl_allow_deposits ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)' }}
          >
            {item.hl_allow_deposits ? '🔓 OPEN' : '🔒 LOCKED'}
          </div>
          <div 
            className="d-flex justify-content-center align-items-center col px-3 py-2 br-2 bg-gray-alpha-3 cursor-pointer hover-bg-gray-alpha-5"
            onClick={(e) => {
              e.stopPropagation()
              window.open(`https://app.hyperliquid.xyz/vaults/${item.hl_vault_address}`, '_blank', 'noopener,noreferrer')
            }}
          >
            <span className="font-14 fw-500">Show Details</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const TopVaults = () => {
  const { t } = useTranslation()

  // Take top 10 vaults for the grid
  const list = vaultsData.slice(0, 10)

  return (
    <div className='d-flex flex-column gap-3 gap-md-4 position-relative z-index-9 mt-5'>
      <div className='d-flex align-items-center justify-content-between'>
        <h5 className="fw-bold">Top Vaults</h5>
        <Link to='/discover'><IOutlineArrowRight1 className='zoom-80' /></Link>
      </div>
      <div className='d-flex flex-wrap mx-n1'>
        {list.map((item, idx) => (
          <VaultCard key={idx} item={item} />
        ))}
      </div>
    </div>
  )
}

export default TopVaults
