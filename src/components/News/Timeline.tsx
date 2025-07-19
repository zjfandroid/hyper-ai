import React, { useState, useEffect, useCallback } from 'react';
import { Timeline, Spin, Empty, Button, Switch } from 'antd';
import dayjs from 'dayjs';
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import { constants } from '@/stores'
import ColumnTooltip from '@/components/Column/Tooltip'
import ColumnNoData from '@/components/Column/NoData';
import Busy from '@/components/Busy';
import ToolbarAutoRefresh from '@/components/Toolbar/AutoRefresh'
import ToolbarAutoRefreshButton from '@/components/Toolbar/AutoRefreshButton'
import { TBaseNewsItem } from '@/stores';

import './Timeline.scss';
import TimeAgo from '../TimeAgo';

interface NewsTimelineProps {
  list: Array<TBaseNewsItem>;
  loading?: boolean;
  title?: string; 
  className?: string;
  // dateFormat?: string;
  // fullDateFormat?: string;
  dataSources?: React.ReactNode;
  onRefresh?: () => Promise<void>;
  autoRefreshCD?: number;
  contentEllipsis?: boolean;
  maxHeight?: number | string; // 添加高度属性
}

const NewsTimeline: React.FC<NewsTimelineProps> = ({
  list = [],
  loading = false,
  className = '',
  title = 'Latest News',
  // dateFormat = 'MMM D, YYYY',
  // fullDateFormat = 'MMM D, YYYY h:mm A',
  dataSources = null,
  onRefresh,
  autoRefreshCD = 300,
  contentEllipsis = false,
  maxHeight
}) => {
  const { t, i18n } = useTranslation()

  // 计算内容区域的样式，包括高度和滚动
  const contentStyle: React.CSSProperties = {
    overflowY: maxHeight ? 'auto' : 'visible',
    maxHeight: maxHeight || 'none',
  };

  const [newsList, setNewsList] = useState<TBaseNewsItem[]>([]);

  // XXX: 需要完善过长内容的点击展开时，点击的位置，避免不需要展开的内容也被提示可展开
  const toggleFold = (id: string | number) => {
    setNewsList(prevList => 
      prevList.map(item =>
        item.id === id ? { ...item, fold: !item.fold } : item
      )
    );
  };

  // init
  useEffect(() => {
    setNewsList(list.map(item => ({ ...item, fold: contentEllipsis })));
  }, [list]);

  return (
    <div className={`d-flex flex-column gap-3 gap-md-4 news-timeline position-relative ${className}`}>
      <div className="d-flex gap-4 align-items-center justify-content-between col">
        <h4 className="fw-bold">{ title }</h4>
        <div className="d-flex align-items-center gap-2">
          <ToolbarAutoRefreshButton
            loading={loading}
            onRefresh={onRefresh}
            storageSettingKey='newsTimelineAutoRefreshing' autoRefreshCD={autoRefreshCD} />
        </div>
      </div>

      <Busy spinning={loading}>
        <div className="timeline-content bg-gray-alpha-4 br-3 px-3" style={contentStyle}>
          {
            newsList.length
              ? <Timeline mode="left"
                  items={newsList.map((item, idx) => ({ // 移除 idx，因为 item 中已经有 id
                    label: '',
                    children: (
                      <div className='d-flex flex-column gap-2'>
                        <div className='d-flex justify-content-between align-items-center gap-2'>
                          <TimeAgo ts={item.createTs} uppercase miniUnit={false} />
                          {item.columnistName && (
                            <small className="color-secondary">{t('common.source')}: {item.columnistName}</small>
                          )}
                        </div>
                        <a href={`https://www.aicoin.com/${i18n.resolvedLanguage}/news-flash/${item.id}`} className="fw-500 h5 mb-1 linker-hover" target='_blank'>{item.title}</a>
                        <div className="color-secondary pointer" onClick={() => toggleFold(item.id)}>
                          <div className={item.fold ? 'content-ellipsis' : ''} dangerouslySetInnerHTML={{ __html: item.content }} />
                        </div>
                      </div>
                    )
                  }))}
                />
              : <ColumnNoData />
          }
        </div>
        { dataSources }
      </Busy>
    </div>
  );
};

export default NewsTimeline;