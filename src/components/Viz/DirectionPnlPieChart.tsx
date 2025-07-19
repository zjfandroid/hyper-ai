import MUIBasePieChart from '@/components/MUI/BasePieChart'

const VizDirectionPnlPieChart = ({ item }) => {
  return (
    <MUIBasePieChart data={[
        ...(
          +item.longPnl < 0
            ? [{ value: Math.abs(item.longPnl), color: '#03741b60', label: 'Long Loss' }]
            : [{ value: item.longPnl, color: '#03741b', label: 'Long PnL' },]
        ),
        ...(
          +item.shortPnl < 0
            ? [{ value: Math.abs(item.shortPnl), color: '#78090960', label: 'Short Loss' }]
            : [{ value: item.shortPnl, color: '#780909', label: 'Short PnL' }]
        )
      ]} />
  )
}

export default VizDirectionPnlPieChart