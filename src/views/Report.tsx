import React, { useState, useEffect, useRef } from 'react';
import { List, Typography, Button, Card, FloatButton } from 'antd';
import { ArrowLeftOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';

import article0323Viral from '@/assets/html/article_0323_viral.html?raw';
import ccjgArticle from '@/assets/html/ccjg_article.html?raw';
import ccjgCover from '@/assets/html/ccjg_cover.jpg';
import dmlArticle from '@/assets/html/dml_article.html?raw';
import goldSilverCrashArticle from '@/assets/html/gold_silver_crash_article.html?raw';
import hcgArticle from '@/assets/html/hcg_article.html?raw';
import hywArticle from '@/assets/html/hyw_article.html?raw';
import jkxnArticle from '@/assets/html/jkxn_article.html?raw';
import marketOutlookArticle from '@/assets/html/market_outlook_article.html?raw';
import marketReviewArticle from '@/assets/html/market_review_20260323.html?raw';
import realEstateArticle from '@/assets/html/real_estate_article.html?raw';
import rjjkArticle from '@/assets/html/rjjk_article.html?raw';
import unitreeIpoArticle from '@/assets/html/unitree_ipo_article.html?raw';
import wdkArticle from '@/assets/html/wdk_article.html?raw';
import znwhArticle from '@/assets/html/znwh_article.html?raw';
import cfgxArticle from '@/assets/html/article_cfgx.html?raw';
import articleDml from '@/assets/html/article_dml.html?raw';
import articleHdln from '@/assets/html/article_hdln.html?raw';
import articleHljf from '@/assets/html/article_hljf.html?raw';
import articleJkxn from '@/assets/html/article_jkxn.html?raw';
import articleZjky from '@/assets/html/article_zjky.html?raw';
import articleZljt from '@/assets/html/article_zljt.html?raw';
import articleZyhn from '@/assets/html/article_zyhn.html?raw';

const { Title, Text } = Typography;

interface Article {
  id: string;
  title: string;
  content: string;
}

const extractTitleFromHtml = (html: string): string => {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  return titleMatch ? titleMatch[1].trim() : '未命名文章';
};

const ReportPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [articleContent, setArticleContent] = useState<string>('');

  const processHtmlContent = (html: string, articleId: string): string => {
    let processed = html;
    if (articleId === 'ccjg_article') {
      processed = processed.replace('./ccjg_cover.jpg', ccjgCover);
    }
    return processed;
  };

  useEffect(() => {
    const articleData = [
      { id: 'article_0323_viral', content: article0323Viral },
      { id: 'ccjg_article', content: ccjgArticle },
      { id: 'dml_article', content: dmlArticle },
      { id: 'gold_silver_crash', content: goldSilverCrashArticle },
      { id: 'hcg_article', content: hcgArticle },
      { id: 'hyw_article', content: hywArticle },
      { id: 'jkxn_article', content: jkxnArticle },
      { id: 'market_outlook', content: marketOutlookArticle },
      { id: 'market_review', content: marketReviewArticle },
      { id: 'real_estate', content: realEstateArticle },
      { id: 'rjjk_article', content: rjjkArticle },
      { id: 'unitree_ipo', content: unitreeIpoArticle },
      { id: 'wdk_article', content: wdkArticle },
      { id: 'znwh_article', content: znwhArticle },
      { id: 'cfgx_article', content: cfgxArticle },
      { id: 'article_dml', content: articleDml },
      { id: 'article_hdln', content: articleHdln },
      { id: 'article_hljf', content: articleHljf },
      { id: 'article_jkxn', content: articleJkxn },
      { id: 'article_zjky', content: articleZjky },
      { id: 'article_zljt', content: articleZljt },
      { id: 'article_zyhn', content: articleZyhn },
    ];

    const availableArticles: Article[] = articleData.map(article => ({
      id: article.id,
      title: extractTitleFromHtml(article.content),
      content: article.content
    }));

    setArticles(availableArticles);
  }, []);

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article.id);
    setArticleContent(processHtmlContent(article.content, article.id));
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
    setArticleContent('');
  };

  const articleContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (articleContainerRef.current) {
      articleContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (selectedArticle) {
    return (
      <div
        ref={articleContainerRef}
        style={{ height: 'calc(100vh - 72px)', marginTop: '72px', overflowY: 'auto', position: 'relative' }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <iframe
              srcDoc={articleContent}
              style={{
                width: '100%',
                height: '80vh',
                border: 'none',
                background: 'white'
              }}
              title="Article"
            />
          </div>
        </div>
        
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToList}
          style={{
            position: 'fixed',
            top: '88px',
            left: '24px',
            zIndex: 1000,
            background: 'rgba(20, 20, 20, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)'
          }}
        >
          返回
        </Button>

        <FloatButton
          icon={<VerticalAlignTopOutlined />}
          onClick={scrollToTop}
          style={{
            right: 24,
            bottom: 24,
            background: 'rgba(20, 20, 20, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 72px)', marginTop: '72px', overflowY: 'auto' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '16px' }}>
        <List
          dataSource={articles}
          split={false}
          renderItem={(article) => (
            <List.Item
              style={{ padding: '0 0 16px 0' }}
            >
              <Card
                hoverable
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px'
                }}
                onClick={() => handleArticleSelect(article)}
                bodyStyle={{ padding: '20px' }}
              >
                <Text style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.88)', lineHeight: '1.6' }}>
                  {article.title}
                </Text>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ReportPage;
