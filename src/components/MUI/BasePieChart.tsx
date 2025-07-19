import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect } from 'react';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

const DEFAULT_PIE_CHART_PROPS = {
  height: 82,
  width: 82,
  margin: { right: 0, top: 0, bottom: 0, left: 0  },
  hideLegend: true,
}
const DEFAULT_PIE_CHART_SERIES = {
  innerRadius: 24,
  outerRadius: 42,
  paddingAngle: 8,
  cornerRadius: 4,
}

// 小尺寸图表的配置
const SMALL_PIE_CHART_PROPS = {
  ...DEFAULT_PIE_CHART_PROPS,
  height: 48,
  width: 48,
}
const SMALL_PIE_CHART_SERIES = {
  ...DEFAULT_PIE_CHART_SERIES,
  innerRadius: 12,
  outerRadius: 24,
}

const MUIBasePieChart = ({ data, size = 'middle' }) => {
  const { t, i18n } = useTranslation()

  // 根据 size 参数选择不同的配置
  const chartProps = size === 'small' ? SMALL_PIE_CHART_PROPS : DEFAULT_PIE_CHART_PROPS;
  const seriesProps = size === 'small' ? SMALL_PIE_CHART_SERIES : DEFAULT_PIE_CHART_SERIES;

  return (
    <PieChart
      series={[
        {
          data,
          ...seriesProps
        },
      ]}
      {...chartProps}
    />
  )
}

export default MUIBasePieChart