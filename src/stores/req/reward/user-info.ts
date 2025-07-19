
import { merge, defaults } from '@/utils'
import { baseCheck, baseApi } from '@/stores/req/helper'
import { constants, TAccountStore, TRewardStore } from '@/stores'

type RewardUserInfoResult = {
  data: Record<string, any>,
  error: boolean
}

export type TRewardUserInfo = {
  rewardUserInfo: (accountStore: TAccountStore, rewardStore: TRewardStore) => Promise<RewardUserInfoResult>
  rewardUserInfoBusy: boolean
}

export const rewardUserInfo: TRewardUserInfo = {
  async rewardUserInfo(accountStore, rewardStore) {
    const result: RewardUserInfoResult = { data: {}, error: true }
    const { logged } = accountStore

    if (this.rewardUserInfoBusy || !logged) return result

    this.rewardUserInfoBusy = true

    const res = await baseApi.get('/rewards')
    // const res = {
    //   data: {
    //     code: '0',
    //     data: {
    //       "currentLevel": 1,
    //       "totalTradingVolume": 1200,
    //       "nextLevelTradingVolume": 10000,
    //       "currentBonus": 150,
    //       "nextBonus": 200,
    //       "pointsBalance": 300,
    //       "totalReferral": 12,
    //       "directInvite": 5,
    //       "tier2": 3,
    //       "tier3": 4,
    //       "invite3Friends": true,
    //       "trade1000Today": true,
    //       "trade5Times": true,
    //       "copyTrade3Times": true,
    //       "referralRecords": [
    //           {
    //               "username": "user1",
    //               "status": 1,
    //               "reward": 50,
    //               "time": 1622548800000
    //           },
    //           {
    //               "username": "user2",
    //               "status": 1,
    //               "reward": 30,
    //               "time": 1622635200000
    //           },
    //           {
    //               "username": "user3",
    //               "status": 0,
    //               "reward": 0,
    //               "time": 1622721600000
    //           },
    //           {
    //               "username": "user4",
    //               "status": 1,
    //               "reward": 20,
    //               "time": 1622808000000
    //           },
    //           {
    //               "username": "user5",
    //               "status": 1,
    //               "reward": 40,
    //               "time": 1622894400000
    //           },
    //           {
    //               "username": "user6",
    //               "status": 0,
    //               "reward": 0,
    //               "time": 1622980800000
    //           },
    //           {
    //               "username": "user7",
    //               "status": 1,
    //               "reward": 60,
    //               "time": 1623067200000
    //           },
    //           {
    //               "username": "user8",
    //               "status": 1,
    //               "reward": 10,
    //               "time": 1623153600000
    //           },
    //           {
    //               "username": "user9",
    //               "status": 0,
    //               "reward": 0,
    //               "time": 1623240000000
    //           },
    //           {
    //               "username": "user10",
    //               "status": 1,
    //               "reward": 80,
    //               "time": 1623326400000
    //           },
    //           {
    //               "username": "user11",
    //               "status": 1,
    //               "reward": 25,
    //               "time": 1623412800000
    //           },
    //           {
    //               "username": "user12",
    //               "status": 0,
    //               "reward": 0,
    //               "time": 1623499200000
    //           }
    //       ]
    //   },
    //   }
    // }

    result.error = baseCheck(res, accountStore)
    this.rewardUserInfoBusy = false

    if (result.error) return result

    // update
    const { data } = res.data

    // NOTE: 目前只有一个
    result.data = {
      copyTrade3Times: data.copyTrade3Times,
      currentBonus: data.currentBonus + '',
      currentLevel: data.currentLevel + '',
      directInvite: data.directInvite,
      invite3Friends: data.invite3Friends,
      nextBonus: data.nextBonus + '',
      nextLevelTradingVolume: data.nextLevelTradingVolume + '',
      pointsBalance: data.pointsBalance || '0',
      referralRecords: data.referralRecords.map((item: any) => ({
        username: item.username,
        status: item.status, // 1、直接邀请 2、tier2 3、tier3
        amount: item.reward,
        createTs: item.time,
      })),
      tier2: data.tier2,
      tier3: data.tier3,
      totalReferral: data.totalReferral,
      totalTradingVolume: data.totalTradingVolume + '',
      trade1000Today: data.trade1000Today,
      trade5Times: data.trade5Times,
    }

    // update
    merge(rewardStore, result.data)

    return result
  },
  rewardUserInfoBusy: false,
}