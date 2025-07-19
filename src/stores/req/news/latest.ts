
import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TNewsLatestStore } from '@/stores'

import { formatPositionByItem } from '../utils'

type NewsLatestResult = {
  data: Record<string, any>,
  error: boolean
}

export type TNewsLatest = {
  newsLatest: (accountStore: TAccountStore, newsLatestStore: TNewsLatestStore) => Promise<NewsLatestResult>
  newsLatestBusy: boolean
  newsLatestInit: boolean
}

export const newsLatest: TNewsLatest = {
  async newsLatest(accountStore, newsLatestStore) {
    const result: NewsLatestResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.newsLatestBusy) return result

    this.newsLatestBusy = true

    const res = await baseApi.get('/news/latest', {
      params: {
        lang: newsLatestStore.selectedLanguage,
        take: newsLatestStore.pageSize,
      }
    })
    // #TEST
    // const res = {
    //   data: {
    //     code: 0,
    //   data: [
    //     {
    //       id: 1,
    //       title: "比特币突破70,000美元大关",
    //       content: "<p>比特币价格今日突破70,000美元大关，创历史新高。分析师认为，这一轮上涨主要受机构投资者增持和市场流动性改善推动。</p>",
    //       columnistName: "张三",
    //       createTime: new Date().toISOString()
    //     },
    //     {
    //       id: 2,
    //       title: "以太坊2.0升级计划公布",
    //       content: "<p>以太坊基金会今日公布了以太坊2.0的最终升级时间表，预计将在下个月完成。此次升级将大幅提高网络性能和降低Gas费用。</p>",
    //       columnistName: "李四",
    //       createTime: new Date(Date.now() - 3600 * 1000).toISOString() // 1小时前
    //     },
    //     {
    //       id: 3,
    //       title: "监管机构发布加密货币新规",
    //       content: "<p>多国金融监管机构联合发布加密货币新规，明确了交易所合规要求和投资者保护措施。业内人士认为这将有助于行业健康发展。</p>",
    //       columnistName: "王五",
    //       createTime: new Date(Date.now() - 24 * 3600 * 1000).toISOString() // 1天前
    //     },
    //     {
    //       id: 4,
    //       title: "DeFi总锁仓量突破1000亿美元",
    //       content: "<p>去中心化金融(DeFi)生态系统的总锁仓量首次突破1000亿美元，较去年同期增长超过200%。Uniswap和Aave仍是最大的协议。</p>",
    //       columnistName: "赵六",
    //       createTime: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString() // 2天前
    //     },
    //     {
    //       id: 5,
    //       title: "NFT市场交易量环比增长50%",
    //       content: "<p>根据最新数据，NFT市场本月交易量环比增长50%，主要集中在游戏和艺术品领域。多个蓝筹NFT项目创下新的成交记录。</p>",
    //       columnistName: "孙七",
    //       createTime: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString() // 7天前
    //     },
    //     {
    //       id: 6,
    //       title: "Layer 2解决方案用户数量翻倍",
    //       content: "<p>以太坊Layer 2解决方案的用户数量在过去三个月内翻倍，Arbitrum和Optimism领跑。低Gas费和高性能成为用户迁移主要原因。</p>",
    //       columnistName: "周八",
    //       createTime: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString() // 30天前
    //     },
    //     {
    //       id: 7,
    //       title: "加密货币支付在电商领域普及率提升",
    //       content: "<p>全球电商平台接受加密货币支付的比例已达到15%，较去年同期提升5个百分点。消费者对加密支付的接受度也在稳步提高。</p>",
    //       columnistName: "吴九",
    //       createTime: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString() // 90天前
    //     },
    //     {
    //       id: 8,
    //       title: "2023年区块链技术发展趋势报告",
    //       content: "<p>最新发布的《2023年区块链技术发展趋势报告》指出，跨链技术、隐私计算和可持续发展将成为未来一年区块链技术的主要发展方向。</p>",
    //       columnistName: "郑十",
    //       createTime: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString() // 1年前
    //     }
    //   ]
    //   }
    // }

    result.error = baseCheck(res, accountStore)
    this.newsLatestBusy = false
    this.newsLatestInit = false

    if (result.error) return result

    // update
    const { data } = res.data

    result.data = {
      list: (data || []).map((item: any, idx: number) => {
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          columnistName: item.columnistName,
          // XXX: 手动补上时区
          createTs: new Date(item.createTime +'Z').getTime()
        }
      })
    }

    // update
    merge(newsLatestStore, result.data)

    return result
  },
  newsLatestBusy: false,
  newsLatestInit: true,
}