
import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TRewardDetailedListStore } from '@/stores'

type RewardDetailedListResult = {
  data: Record<string, any>,
  error: boolean
}

export type TRewardDetailedList = {
  rewardDetailedList: (accountStore: TAccountStore, rewardDetailedListStore: TRewardDetailedListStore) => Promise<RewardDetailedListResult>
  rewardDetailedListBusy: boolean
}

export const rewardDetailedList: TRewardDetailedList = {
  async rewardDetailedList(accountStore, rewardDetailedListStore) {
    const result: RewardDetailedListResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.rewardDetailedListBusy || !logged) return result

    this.rewardDetailedListBusy = true

    const res = await baseApi.get('/rewards/details', {
      params: {
        pageNum: rewardDetailedListStore.current,
        pageSize: rewardDetailedListStore.size,
        days: +rewardDetailedListStore.selectedDayValue,
        sourceId: +rewardDetailedListStore.selectedSourceIdValue,
      }
    })
    // const res = {
    //   data: {
    //     code: '0',
    //     data: [
    //       {
    //           "amount": 100,
    //           "sourceId": "1",
    //           "createTime": 1622548800000
    //       },
    //       {
    //           "amount": 250,
    //           "sourceId": "2",
    //           "createTime": 1622635200000
    //       },
    //       {
    //           "amount": 75,
    //           "sourceId": "3",
    //           "createTime": 1622721600000
    //       },
    //       {
    //           "amount": 300,
    //           "sourceId": "0",
    //           "createTime": 1622808000000
    //       },
    //       {
    //           "amount": 50,
    //           "sourceId": "source_5",
    //           "createTime": 1622894400000
    //       },
    //       {
    //           "amount": 400,
    //           "sourceId": "source_6",
    //           "createTime": 1622980800000
    //       },
    //       {
    //           "amount": 150,
    //           "sourceId": "source_7",
    //           "createTime": 1623067200000
    //       },
    //       {
    //           "amount": 500,
    //           "sourceId": "source_8",
    //           "createTime": 1623153600000
    //       },
    //       {
    //           "amount": 200,
    //           "sourceId": "source_9",
    //           "createTime": 1623240000000
    //       },
    //       {
    //           "amount": 21350,
    //           "sourceId": "source_10",
    //           "createTime": 1623326400000
    //       }
    //   ]
    //   }
    // }

    result.error = baseCheck(res, accountStore)
    this.rewardDetailedListBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    // NOTE: 目前只有一个
    result.data = {
      last: data.map(item => {
        return {
          amount: item.amount,
          sourceId: item.sourceId,
          createTs: item.createTime
        }
      }),
      isEnd: data.length < rewardDetailedListStore.size,
      // total: count
    }

    // update
    merge(rewardDetailedListStore, result.data)

    return result
  },
  rewardDetailedListBusy: false,
}