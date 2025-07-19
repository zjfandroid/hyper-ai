import { createStore } from '@/stores/helpers'

import { userTgLogin, TUserTgLogin } from './user/tg-login'
import { userInfo, TUserInfo } from './user/info'
import { userTgCode, TUserTgCode } from './user/tg-code'
import { userExportPrivateKey, TUserExportPrivateKey } from './user/export-private-key'
import { userPrivateWallet, TUserPrivateWallet } from './user/private-wallet'
import { userWalletDeposit, TUserWalletDeposit } from './user/wallet-deposit'
import { userCreatePrivateWallet, TUserCreatePrivateWallet } from './user/create-private-wallet'
import { userDeletePrivateWallet, TUserDeletePrivateWallet } from './user/delete-private-wallet'
import { userEvmLogin, TUserEvmLogin } from './user/evm-login'
import { userEvmSignMessage, TUserEvmSignMessage } from './user/evm-sign-message'

import { rewardUserLv, TRewardUserLv } from './reward/user-lv'
import { rewardUserInfo, TRewardUserInfo} from './reward/user-info'
import { rewardDetailedList, TRewardDetailedList } from './reward/detailed-list'

import { copyTryTradingClosePosition, TCopyTryTradingClosePosition } from './copy-trading/close-position'
import { copyTradingCreateCopyTrading, TCopyTradingCreateCopyTrading } from './copy-trading/create-copy-trading'
import { copyTradingMyCopyTrading, TCopyTradingMyCopyTrading } from './copy-trading/my-copy-trading'
import { copyTradingMyPosition, TCopyTradingMyPosition } from './copy-trading/my-position'
import { copyTradingTargetPosition, TCopyTradingTargetPosition } from './copy-trading/target-position'
import { copyTradingRemoveMyCopyTrading, TCopyTradingRemoveMyCopyTrading } from './copy-trading/remove-my-copy-trading'
import { copyTradingFindByAddress, TCopyTradingFindByAddress } from './copy-trading/find-by-address'

import { leaderboardProfitList, TLeaderboardProfitList } from './leaderboard/profit'
import { leaderboardCoinList, TLeaderboardCoinList } from './leaderboard/coin'
import { leaderboardSearchProfit, TLeaderboardSearchProfit } from './leaderboard/search-profit'
import { leaderboardPointOverallList, TLeaderboardPointOverallList } from './leaderboard/point-overall'
import { leaderboardPointReferralList, TLeaderboardPointReferralList } from './leaderboard/point-referral'

import { whalePositions, TWhalePositions } from './whale/positions'
import { whaleEvents, TWhaleEvents } from './whale/events'

import { newsLatest, TNewsLatest } from './news/latest'

import { trackingAddressPosition, TTrackingAddressPosition } from './tracking/address-positon'
import { trackingCreate, TTrackingCreate } from './tracking/create'
import { trackingRemove, TTrackingRemove } from './tracking/remove'

import { discoverList, TDiscoverList } from './discover/list'
import { discoverTradingStatistics, TDiscoverTradingStatistics } from './discover/trading-statistics'
import { discoverRecommend, TDiscoverRecommend } from './discover/recommend'
import { discoverKolList, TDiscoverKolList } from './discover/kol-list'
import { discoverKolTagging, TDiscoverKolTagging } from './discover/kol-tagging'
import { discoverKolVote, TDiscoverKolVote } from './discover/kol-vote'

import { hyperClearinghouseState, THyperClearinghouseState } from './hyper/clearinghouse-state'
import { hyperUserFills, THyperUserFills } from './hyper/user-fills'
import { hyperUserTWAP, THyperUserTWAP } from './hyper/user-twap'
import { hyperUserNonFunding, THyperUserNonFunding } from './hyper/user-non-funding'
import { hyperUserOpenOrdersAdditional, THyperUserOpenOrdersAdditional } from './hyper/user-open-orders-additional'
import { hyperUserSpotClearinghouseState, THyperUserSpotClearinghouseState } from './hyper/user-spot-clearinghouse-state'
import { hyperSpotMetaAndAssetCtxs, THyperSpotMetaAndAssetCtxs } from './hyper/spot-meta-and-asset-ctxs'
import { hyperUserPortfolio, THyperUserPortfolio } from './hyper/user-portfolio'
import { hyperPerpMetaAndAssetCtxs, THyperPerpMetaAndAssetCtxs } from './hyper/perp-meta-and-asset-ctxs'
import { hyperUserHistoricalOrders, THyperUserHistoricalOrders } from './hyper/user-historical-orders'

export * from './utils'

export type TReqStore =
  TUserTgLogin & TUserInfo & TUserTgCode & TUserExportPrivateKey & TUserPrivateWallet & TUserWalletDeposit & TUserCreatePrivateWallet & TUserDeletePrivateWallet & TUserEvmLogin & TUserEvmSignMessage &
  TRewardUserLv & TRewardUserInfo & TRewardDetailedList &
  TCopyTryTradingClosePosition & TCopyTradingCreateCopyTrading & TCopyTradingMyCopyTrading & TCopyTradingMyPosition & TCopyTradingTargetPosition & TCopyTradingRemoveMyCopyTrading & TCopyTradingFindByAddress &
  TLeaderboardProfitList & TLeaderboardCoinList & TLeaderboardSearchProfit & TLeaderboardPointOverallList & TLeaderboardPointReferralList &
  TWhalePositions & TWhaleEvents &
  TNewsLatest &
  TTrackingAddressPosition & TTrackingRemove & TTrackingCreate &
  TDiscoverList & TDiscoverTradingStatistics & TDiscoverKolList & TDiscoverKolTagging & TDiscoverKolVote &
  THyperClearinghouseState & THyperUserFills & THyperUserTWAP & THyperUserNonFunding & THyperUserOpenOrdersAdditional & THyperUserSpotClearinghouseState & THyperSpotMetaAndAssetCtxs & THyperUserPortfolio & TDiscoverRecommend & THyperPerpMetaAndAssetCtxs & THyperUserHistoricalOrders

const reqStore = {
  // Use
  ...userTgLogin, ...userInfo, ...userTgCode, ...userExportPrivateKey, ...userPrivateWallet, ...userWalletDeposit,
  ...userCreatePrivateWallet, ...userDeletePrivateWallet,
  ...userEvmLogin, ...userEvmSignMessage,
  // Reward
  ...rewardUserLv, ...rewardUserInfo, ...rewardDetailedList,
  // Copy Trading
  ...copyTryTradingClosePosition, ...copyTradingCreateCopyTrading, ...copyTradingMyCopyTrading,
  ...copyTradingMyPosition, ...copyTradingTargetPosition, ...copyTradingRemoveMyCopyTrading,
  ...copyTradingFindByAddress,
  // Leaderboard
  ...leaderboardProfitList, ...leaderboardCoinList, ...leaderboardSearchProfit, ...leaderboardPointOverallList, ...leaderboardPointReferralList,

  ...whalePositions, ...whaleEvents,

  ...newsLatest,

  ...trackingAddressPosition, ...trackingRemove,  ...trackingCreate,

  ...discoverList, ...discoverTradingStatistics, ...discoverRecommend, ...discoverKolList, ...discoverKolTagging, ...discoverKolVote,

  // Hyper
  ...hyperClearinghouseState, ...hyperUserFills, ...hyperUserTWAP,
  ...hyperUserNonFunding, ...hyperUserOpenOrdersAdditional, ...hyperUserSpotClearinghouseState,
  ...hyperSpotMetaAndAssetCtxs, ...hyperUserPortfolio, ...hyperPerpMetaAndAssetCtxs, ...hyperUserHistoricalOrders
}

export const useReqStore = createStore<TReqStore>(reqStore)
