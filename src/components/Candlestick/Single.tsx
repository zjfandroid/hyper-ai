import React, { useState } from 'react';
import { Tooltip } from 'antd';
import ColumnTooltip from '@/components/Column/Tooltip';

import './Single.scss';

interface SingleCandlestickProps {
  high: number;       // 最高价
  low: number;        // 最低价
  open: number;       // 起始价
  close: number;      // 当前价
  width?: number;     // K线宽度
  height?: number;    // K线高度
  className?: string; // 自定义类名
  showTooltip?: boolean; // 是否显示悬停提示
  formatPrice?: (price: number | string) => string; // 价格格式化函数
}

const SingleCandlestick: React.FC<SingleCandlestickProps> = ({
  high,
  low,
  open,
  close,
  width = 16,
  height = 100,
  className = '',
  showTooltip = true,
  formatPrice = (price) => price.toString(),
}) => {
  
  // 计算K线是上涨还是下跌
  const isUp = close >= open;
  
  // 计算实体和影线的位置和高度
  const range = high - low;
  
  // 防止除以零错误
  if (range === 0) {
    return <div className={`single-candlestick ${className}`} style={{ width, height }}>
      <div className={`body ${isUp ? 'up' : 'down'}`} style={{ height: '2px' }}></div>
    </div>;
  }
  
  // 计算各部分的百分比位置
  const bodyTop = ((high - Math.max(open, close)) / range) * 100;
  const bodyHeight = (Math.abs(close - open) / range) * 100;
  const upperShadowHeight = ((high - Math.max(open, close)) / range) * 100;
  const lowerShadowHeight = ((Math.min(open, close) - low) / range) * 100;

  // 计算价格变化百分比
  const priceChangePercent = ((close - open) / open * 100).toFixed(2);

  return (
    <ColumnTooltip placement='rightTop' title={(
        [
          { label: 'Open', value: open},
          { label: 'Close', value: close},
          { label: 'High', value: high},
          { label: 'Low', value: low},
          { label: 'Change', content: 
              <span className={`${isUp ? 'color-success' : 'color-error'}`}>
                {isUp ? '+' : ''}{priceChangePercent} %
              </span>
          },
        ].map((item, idx) =>
          <div key={idx} className="d-flex justify-content-between gap-4 mb-1 color-white">
            <span className="color-secondary">{ item.label }</span>
            <span className='fw-500'>{item.content ? item.content : formatPrice(item.value)}</span>
          </div>
        )
      )}>

      <div className={`d-flex flex-column col position-relative single-candlestick pointer ${className}`} style={{ width, height }}>

        {/* 上影线 */}
        {upperShadowHeight > 0 && (
          <div 
            className="shadow upper" 
            style={{ 
              top: 0, 
              height: `${upperShadowHeight}%` 
            }}
          ></div>
        )}

        {/* K线实体 */}
        <div 
          className={`body ${isUp ? 'up' : 'down'}`} 
          style={{ 
            top: `${bodyTop}%`, 
            height: `${bodyHeight || 1}%` 
          }}
        ></div>

        {/* 下影线 */}
        {lowerShadowHeight > 0 && (
          <div 
            className="shadow lower" 
            style={{ 
              bottom: 0, 
              height: `${lowerShadowHeight}%` 
            }}
          ></div>
        )}
      </div>
    </ColumnTooltip>
  );
};

export default SingleCandlestick;