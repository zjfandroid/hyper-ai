import React from 'react';
import { List, Typography, Avatar, Spin, Image } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';

const { Text } = Typography;

interface NewsItem {
  time: string;
  content: string;
  userAvatar?: string;
  nickName?: string;
  imgs?: string[];
}

const NewsPage = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});

  const fetchNews = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.timestore.vip/timeline/recommendList?current=${page}&id=0&size=10&type=1&days=30`
      );
      console.log('API Response:', response.data); // 打印完整的API响应
      if (response.data && response.data.data) {
        const formattedData = response.data.data.records.map((item: any) => ({
          time: item.ctimeStr || '',
          content: item.postContent || '',
          userAvatar: item.userAvatar || '',
          nickName: item.nickName || '',
          imgs: item.img ? item.img.split(',').filter((i: string) => i.trim() !== '') : []
        }));
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

  return (
    <div style={{ height: 'calc(100vh - 72px)', marginTop: '72px', overflowY: 'auto' }} onScroll={handleScroll}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '16px' }}>
        <List
          dataSource={newsData}
          split={false}
          renderItem={(item, index) => {
            const isExpanded = !!expandedMap[index];
            const raw = item.content || '';
            const contentText = isExpanded ? raw : (raw.length > 160 ? raw.slice(0, 160) + '…' : raw);
            return (
              <List.Item style={{ padding: '20px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Avatar src={item.userAvatar} size={44} style={{ flexShrink: 0 }} />
                  <div style={{ marginLeft: '12px', flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                      <Text strong style={{ fontSize: '15px' }}>{item.nickName || '匿名用户'}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text>
                    </div>
                    <div style={{ marginBottom: '12px', fontSize: '15px', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.88)' }}>{contentText}</Text>
                      {raw.length > 160 && (
                        <a style={{ marginLeft: '6px', color: 'rgba(255, 255, 255, 0.6)' }} onClick={() => toggleExpand(index)}>{isExpanded ? '收起' : '展开'}</a>
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
        {loading && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Spin />
          </div>
        )}
        {!hasMore && !loading && (
          <div style={{ textAlign: 'center', margin: '20px 0', color: 'rgba(255, 255, 255, 0.45)' }}>
            没有更多数据了
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;