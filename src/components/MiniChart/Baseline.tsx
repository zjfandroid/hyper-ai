import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import BN from 'bignumber.js';
import { createChart, ColorType, AreaSeries, BaselineSeries, IChartApi } from 'lightweight-charts';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { formatNumber, getLocalTimezoneOffsetInSeconds } from '@/utils'
import { constants } from '@/stores'
import PositionItemCommonPnl from '@/components/PositionItem/CommonPnl'

import './Baseline.scss'

interface TDataPoint {
  time: string | number;
  value: number;
}

interface MiniChartBaselineProps {
  data: Array<TDataPoint>;
  width?: number;
  height?: number;
  scale?: boolean
  tooltipVisible?: boolean;
  tooltipAutoLocal?: boolean;
  className?: string;
  mini?: boolean;
}

const MiniChartBaseline: React.FC<MiniChartBaselineProps> = ({
  data,
  width = 120,
  height = 60,
  mini = false,
  scale = false,
  tooltipVisible = true,
  tooltipAutoLocal = true,
  className = '',
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);
  const [point, setPoint] = useState(null)

  const { t, i18n } = useTranslation()
  const topColorRGB = '20, 195, 98'; // 绿色
  const bottomColorRGB = '208, 21, 21'; // 红色

  // 创建图表和系列的函数
  useEffect(() => {
    if (!(chartContainerRef.current && tooltipRef.current)) return;

    // 如果图表已经存在，则不需要重新创建
    if (!chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width,
        height,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: 'rgba(255, 255, 255, 0.5)',
        },
        rightPriceScale: {
          visible: !mini, // 隐藏y轴
        },
        timeScale: {
          visible: !mini, // 隐藏x轴
          fixLeftEdge: true,
          fixRightEdge: true,
          timeVisible: true,
          secondsVisible: false,
          // localization: {
          //   timeFormatter: (time: number) => {
          //     return dayjs(time * 1000).format(t('formatTime.fullDate'))
          //   },
          // },
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: false,
          },
        },
        crosshair: {
          vertLine: {
            visible: !mini,
          },
          horzLine: {
            visible: !mini,
          },
        },
        handleScroll: false,
        handleScale: scale,
      });

      // 添加面积图系列
      const areaSeries = chart.addSeries(BaselineSeries, {
        lineWidth: 2,
        // baseValue: {
        //   type: 'price',
        //   price: 0
        // },
        priceFormat: {
          // type: 'price',
          // precision: 2,
          // minMove: 0.01,
          type: "custom",
          formatter: (price: number) => `$ ${formatNumber(new BN(price).toFixed(constants.decimalPlaces.__COMMON__))}`
        },
        topLineColor: `rgba(${topColorRGB}, 1)`,
        topFillColor1: `rgba(${topColorRGB}, 1)`,
        topFillColor2: `rgba(${topColorRGB}, 0.01)`,
        bottomFillColor1: `rgba(${bottomColorRGB}, 0.01)`,
        bottomFillColor2: `rgba(${bottomColorRGB}, 1)`,
        bottomLineColor: `rgba(${bottomColorRGB}, 1)`,
      });

      // 保存引用
      chartRef.current = chart;
      seriesRef.current = areaSeries;

      // 设置数据
      areaSeries.setData(data);

      // 自适应内容
      chart.timeScale().fitContent();

      // 处理悬停提示
      if (tooltipVisible && tooltipRef.current) {
        const toolTipWidth = tooltipRef.current.clientHeight;
        const toolTipHeight = tooltipRef.current.clientHeight;
        const toolTipMargin = 15;

        chartContainerRef.current.appendChild(tooltipRef.current);
        
        // 添加鼠标离开事件监听器
        const handleMouseLeave = () => {
          if (tooltipRef.current) {
            tooltipRef.current.style.display = 'none';
            setPoint(null); // 清除当前数据点
          }
        };
        
        chartContainerRef.current.addEventListener('mouseleave', handleMouseLeave);
      
        // 监听十字线移动事件
        chart.subscribeCrosshairMove(param => {
          if (
            param.point === undefined ||
            !param.time ||
            param.point.x < 0 ||
            param.point.x > width ||
            param.point.y < 0 ||
            param.point.y > height
          ) {
            tooltipRef.current.style.display = 'none';
            return;
          }

          // 使用 seriesData 替代 seriesPrices
          const dataPoint = param.seriesData.get(areaSeries);

          tooltipRef.current.style.display = 'flex';

          if (dataPoint && tooltipRef?.current) {
            setPoint(dataPoint)

            if (!tooltipAutoLocal) return

            const coordinate = areaSeries.priceToCoordinate(dataPoint.value);
            let left = 0
            let right = 0
            // XXX: 150
            if (width - 150 > param.point.x) {
              left = param.point.x ;
            } else {
              left = param.point.x - 150;
              // console.log(param.point.x , toolTipWidth)
            }

            // if (left < toolTipMargin) {
            //   left = toolTipMargin;
            // }

            // if (left + toolTipWidth > width - toolTipMargin) {
            //   left = width - toolTipMargin - toolTipWidth;
            //   console.log(left)
            // }

            let top = coordinate ? coordinate - toolTipHeight - toolTipMargin : 0;
            if (top < toolTipMargin) {
              top = toolTipHeight + toolTipMargin;
            }

            tooltipRef.current.style.left = `${left}px`;
            tooltipRef.current.style.top = `${top}px`;
          }
        });
      }
    }

    // 清理函数
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, [data, tooltipVisible, mini, scale]); // 移除 width 和 height 依赖

  // 处理尺寸变化的单独 useEffect
  useEffect(() => {
    if (chartRef.current && width > 0 && height > 0) {
      // 调整图表大小
      chartRef.current.applyOptions({
        width,
        height,
      });

      // 重新适应内容
      chartRef.current.timeScale().fitContent();
    }
  }, [width, height]);

  return (
    <div className={`mini-chart-base-line ${className}`}>
      <div ref={chartContainerRef} />

      <div ref={tooltipRef} className="position-absolute mini-chart-base-line-tooltip ">
        {
          point && <div className='d-flex flex-column gap-1 p-2 br-2 '>
              <PositionItemCommonPnl value={point.value} className='h6 fw-500'/>
              <small className='color-secondary'>
                {dayjs(new Date(point.time * 1000 - getLocalTimezoneOffsetInSeconds()).getTime()).format(t('formatTime.fullDate'))}
              </small>
            </div>
        }
      </div>
    </div>
  );
};

export default MiniChartBaseline;