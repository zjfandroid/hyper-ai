import { formatDecimalNumber, formatTimeToTz } from '@/utils';
import { useEffect, useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {
  LineChart,
} from 'echarts/charts';

import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from 'echarts/components';

import {
  CanvasRenderer,
  // SVGRenderer,
} from 'echarts/renderers';

echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer]
);

const LineCharts = (props: any) => {

  const { data, data1, color } = props

  const xAxis = useMemo(() => {
    return data.map((item: any) => formatTimeToTz(item.date, 'MM-DD'))
  }, [data])

  const yAxis0 = useMemo(() => {
    return data.map((item: any) => formatDecimalNumber(item.value, 2))
  }, [data])

  const yAxis1 = useMemo(() => {
    return data1.map((item: any) => formatDecimalNumber(item.value, 2))
  }, [data1])

  const yMax0 = useMemo(() => {
    return Math.ceil(Math.max(...yAxis0) * 1.2)
  }, [yAxis0])

  const yMax1 = useMemo(() => {
    return Math.ceil(Math.max(...yAxis1) * 1.2)
  }, [yAxis1])

  const yMax = useMemo(() => {
    return Math.max(yMax0, yMax1)
  }, [yMax0, yMax1])

  const options = useMemo(() => {
    return {
      grid: { // 让图表占满容器
        top: '5px',
        left: '5px',
        right: '5px',
        bottom: '5px',
      },
      color: color ?? '#F86868',
      tooltip: {
        show: false,
      },
      xAxis: {
        show: false,
        type: 'category',
        data: xAxis,
      },
      yAxis: {
        show: false,
        type: 'value',
        splitNumber: 2,
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          showSymbol: false,
          symbolSize: 6,
          data: yAxis0,
          type: 'line'
        },
        {
          showSymbol: false,
          symbolSize: 6,
          data: yAxis1,
          type: 'line'
        }
      ]
    }
  }, [xAxis, yAxis0, yAxis1, yMax, color])

  useEffect(() => {
    echarts.use(
      [TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer]
    );
  }, [])

  return <ReactEChartsCore
    echarts={echarts}
    option={options}
    style={{ height: 100 }}
    notMerge={true}
    lazyUpdate={true}
    theme={"theme_name"}
  />
}

export default LineCharts;