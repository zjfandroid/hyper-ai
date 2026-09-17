import React from 'react';
import { List, Typography, Avatar, Spin, Image, Segmented } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import './News.scss';

const { Text } = Typography;

interface NewsItem {
  time: string;
  content: string;
  userAvatar?: string;
  nickName?: string;
  imgs?: string[];
  cover?: string;
  likeCount?: number;
  commentCount?: number;
}

type TabKey = 'discover' | 'feed';

const NewsPage = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<TabKey>('discover');

  const fetchNews = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.tsdaq.com/timeline/follows?current=${page}&id=0&size=100&type=1&days=2`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      if (response.data && response.data.data) {
        const formattedData = response.data.data.records.map((item: any) => ({
          time: item.ctimeStr || '',
          content: item.postContent || '',
          userAvatar: item.userAvatar || '',
          nickName: item.nickName || '',
          cover: item.cover || '',
          likeCount: item.liked || 0,
          commentCount: item.comments || 0,
          imgs: item.img ? item.img.split(',').filter((i: string) => i.trim() !== '') : []
        }))
        // 按时间倒序
        .sort((a: NewsItem, b: NewsItem) => (a.time < b.time ? 1 : -1));
        setNewsData(prevData => [...prevData, ...formattedData]);
        setHasMore(response.data.data.records.length > 0);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 50 && hasMore && !loading) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const toggleExpand = (idx: number) => {
    setExpandedMap(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // 发现页：以完整帖子为卡片
  const discoverCards = useMemo(() => newsData, [newsData]);
  // 取第一张图作为封面（无独立 cover 时）
  const coverOf = (item: NewsItem) => (item as any).cover || item.imgs?.[0] || '';
  // 纯文字帖子（无图无封面）
  const textPosts = useMemo(() => discoverCards.filter(c => !coverOf(c)), [discoverCards]);

  return (
    <div style={{ height: 'calc(100vh - 72px)', marginTop: '72px', overflowY: 'auto' }} onScroll={handleScroll}>
      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '20px 16px' }}>
        {/* 顶部：标题 + 分组切换 */}
        <div className="news-header">
          <div>
            <h2 className="news-title">发现</h2>
            <div className="news-subtitle">Discover</div>
          </div>
          <Segmented
            value={activeTab}
            onChange={(v) => setActiveTab(v as TabKey)}
            options={[
              { label: '发现', value: 'discover' },
              { label: '动态', value: 'feed' },
            ]}
          />
        </div>

        {activeTab === 'discover' ? (
          <div className="news-discover">
            {/* 卡片瀑布：有图帖子以卡片展示 */}
            <div className="news-card-grid">
              {discoverCards.filter(c => coverOf(c)).map((item, index) => {
                const imgs = item.imgs && item.imgs.length > 0 ? item.imgs : coverOf(item) ? [coverOf(item)] : [];
                return (
                  <div key={index} className="news-card">
                    <div className="news-card-cover">
                      <Image
                        src={imgs[0]}
                        alt="cover"
                        width="100%"
                        height="100%"
                        style={{ objectFit: 'cover' }}
                        fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjcwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMyMzI2MzgiLz48L3N2Zz4="
                      />
                    </div>
                    <div className="news-card-body">
                      <div className="news-card-meta">
                        <Avatar src={item.userAvatar} size={22} style={{ flexShrink: 0 }} />
                        <Text strong style={{ fontSize: '13px' }}>{item.nickName || '用户'}</Text>
                      </div>
                      <div className="news-card-content">{item.content}</div>
                      <div className="news-card-stats">
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 纯文字帖子：完整列表展示 */}
            {textPosts.length > 0 && (
              <div className="news-text-list">
                {textPosts.map((item, index) => {
                  const isExpanded = !!expandedMap[index];
                  const raw = item.content || '';
                  const contentText = isExpanded ? raw : (raw.length > 160 ? raw.slice(0, 160) + '…' : raw);
                  return (
                    <div key={index} className="news-text-item">
                      <Avatar src={item.userAvatar} size={40} style={{ flexShrink: 0 }} />
                      <div className="news-text-body">
                        <div className="news-text-meta">
                          <Text strong style={{ fontSize: '14px' }}>{item.nickName || '用户'}</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text>
                        </div>
                        <div className={`news-text-content${isExpanded ? '' : ' news-text-clamp'}`}>
                          {contentText}
                          {raw.length > 160 && (
                            <a className="news-text-toggle" onClick={() => toggleExpand(index)}>{isExpanded ? '收起' : '展开'}</a>
                          )}
                        </div>
                        <div className="news-text-stats">
                          <span>赞 {item.likeCount ?? 0}</span>
                          <span>评论 {item.commentCount ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', margin: '24px 0' }}>
                <Spin />
              </div>
            )}
            {!hasMore && !loading && discoverCards.length > 0 && (
              <div style={{ textAlign: 'center', margin: '24px 0', color: 'var(--color-secondary)' }}>
                没有更多内容了
              </div>
            )}
          </div>
        ) : (
          <List
            dataSource={newsData}
            split={false}
            renderItem={(item, index) => {
              const isExpanded = !!expandedMap[index];
              const raw = item.content || '';
              const contentText = isExpanded ? raw : (raw.length > 160 ? raw.slice(0, 160) + '…' : raw);
              return (
                <List.Item style={{ padding: '20px 0', borderBottom: '1px solid var(--bg-gray-alpha-4)', display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar src={item.userAvatar} size={44} style={{ flexShrink: 0 }} />
                    <div style={{ marginLeft: '12px', flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                        <Text strong style={{ fontSize: '15px' }}>{item.nickName || '匿名用户'}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text>
                      </div>
                      <div style={{ marginBottom: '12px', fontSize: '15px', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        <Text style={{ color: 'inherit' }}>{contentText}</Text>
                        {raw.length > 160 && (
                          <a style={{ marginLeft: '6px', color: 'inherit', opacity: 0.6 }} onClick={() => toggleExpand(index)}>{isExpanded ? '收起' : '展开'}</a>
                        )}
                      </div>
                      {item.imgs && item.imgs.length > 0 && (
                        <Image.PreviewGroup>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: `repeat(${item.imgs.length === 1 ? 1 : item.imgs.length === 2 ? 2 : 3}, 1fr)`,
                              gap: '8px',
                              maxWidth: item.imgs.length === 1 ? '72%' : '100%'
                            }}
                          >
                            {item.imgs.map((img, imgIndex) => (
                              <div key={imgIndex} style={{ aspectRatio: '16/9', width: '100%', position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                                <Image
                                  src={img}
                                  alt={`News Image ${imgIndex + 1}`}
                                  width="100%"
                                  height="100%"
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            ))}
                          </div>
                        </Image.PreviewGroup>
                      )}
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        )}

        {/* 动态 tab 的加载 / 空状态 */}
        {activeTab === 'feed' && loading && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Spin />
          </div>
        )}
        {activeTab === 'feed' && !hasMore && !loading && (
          <div style={{ textAlign: 'center', margin: '20px 0', color: 'inherit', opacity: 0.45 }}>
            没有更多数据了
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;