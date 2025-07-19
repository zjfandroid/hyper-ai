# Hyperbot

## Info

- Andt: <https://ant-design.antgroup.com/docs/react/introduce-cn/>
- Andt theme:
- Design: <https://www.figma.com/design/ESo3mJYUopTMbgfg0jcNou/hyperbot?t=IB9rXqozPIBQRaPE-0>
- API: 
- 产品文档 
- 参考 icon:
  - <https://www.iconfont.cn/collections/detail?spm=a313x.search_index.0.da5a778a4.4b683a819wc16c&cid=38549>
  - <https://www.iconfont.cn/collections/detail?spm=a313x.collections_index.i1.d9df05512.10e73a81dpUzTk&cid=39349>

## Develop

```dash
pnpm dev
```

## Build

```bash
# dev
pnpm test:zip

47.236.11.8
cd /usr/share/nginx/html/hyperbot && unzip -o dist.zip
<https://testbird.online/hyperbot>

# prod
pnpm prod:zip

47.236.230.146
cd /home/ecs-user/web && unzip -o dist.zip
<https://hyperbot.network>
```
