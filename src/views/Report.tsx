import React, { useState, useEffect, useRef } from 'react';
import { List, Typography, Button, Card, FloatButton } from 'antd';
import { ArrowLeftOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Article {
  id: string;
  title: string;
  content: string;
}

const sanitizeTitle = (value: string): string => value.replace(/\s+/g, ' ').trim();

const formatTitleFromId = (articleId: string): string => {
  return articleId
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const extractTitleFromHtml = (html: string, articleId: string): string => {
  if (typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const candidates = [
      doc.querySelector('title')?.textContent,
      doc.querySelector('h1')?.textContent,
      doc.querySelector('h2')?.textContent,
      doc.querySelector('article h3')?.textContent,
      doc.querySelector('section h3')?.textContent,
      doc.querySelector('article p')?.textContent,
      doc.querySelector('section p')?.textContent,
      doc.querySelector('p')?.textContent
    ];

    const matchedTitle = candidates
      .map((candidate) => sanitizeTitle(candidate || ''))
      .find(Boolean);

    if (matchedTitle) {
      return matchedTitle;
    }
  }

  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch?.[1]) {
    return sanitizeTitle(titleMatch[1]);
  }

  return formatTitleFromId(articleId);
};

const ReportPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [articleContent, setArticleContent] = useState<string>('');

  const processHtmlContent = async (html: string, articleId: string): Promise<string> => {
    let processed = html;
    if (articleId === 'ccjg_article') {
      const coverModule = await import('@/assets/html/ccjg_cover.jpg');
      processed = processed.replace('./ccjg_cover.jpg', coverModule.default);
    }
    return processed;
  };

  useEffect(() => {
    const articleModules = import.meta.glob('@/assets/html/*.html', { query: '?raw', import: 'default' });

    Promise.all(
      Object.entries(articleModules).map(async ([path, loader]) => {
        const content = await loader();
        const id = path.split('/').pop()?.replace('.html', '') || '';
        return {
          id,
          title: extractTitleFromHtml(content, id),
          content
        };
      })
    ).then(availableArticles => {
      availableArticles.sort((a, b) => a.id.localeCompare(b.id));
      setArticles(availableArticles);
    });
  }, []);

  const handleArticleSelect = async (article: Article) => {
    setSelectedArticle(article.id);
    const processedContent = await processHtmlContent(article.content, article.id);
    setArticleContent(processedContent);
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
