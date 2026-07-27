export interface ApiParam {
  name: string
  type: 'string' | 'number'
  required: boolean
  fixed?: string // 固定值，不可编辑
  defaultValue?: string
  options?: string[]
  descI18n: string
  inBody?: boolean // POST 请求时参数放在 body 中
}

export interface ApiResponseField {
  field: string
  type: string
  descI18n: string
}

export interface ApiDoc {
  id: string
  method: 'GET' | 'POST'
  baseUrl: string
  path: string
  titleI18n: string
  descI18n: string
  params: ApiParam[]
  responseFields: ApiResponseField[]
  responseStructure: 'topLow' | 'futureSpot' | 'rows' | 'object' | 'array'
  group: 'crypto' | 'stock' | 'radar'
}

export const API_BASE_URL = 'https://vergex.trade'
export const HYPERLIQUID_API_URL = 'https://api.hyperliquid.xyz'
// 牛熊雷达专用代理（Cloudflare Worker），避免直连 vergex 触发 403
export const VERGEX_PROXY_URL = import.meta.env.VITE_VERGEX_PROXY || ''

export const API_DOCS: ApiDoc[] = [
  {
    id: 'bias_radar',
    method: 'GET',
    baseUrl: VERGEX_PROXY_URL || API_BASE_URL,
    path: '/api/v1/data-intelligence/markets/cross-section/directional',
    titleI18n: 'trendingApi.biasRadarTitle',
    descI18n: 'trendingApi.biasRadarDesc',
    responseStructure: 'object',
    group: 'radar',
    params: [
      { name: 'chain', type: 'string', required: true, fixed: 'mainnet', descI18n: 'trendingApi.paramChain' },
      { name: 'liqBand', type: 'number', required: true, defaultValue: '15', descI18n: 'trendingApi.paramLiqBand' },
    ],
    responseFields: [
      { field: 'items', type: 'array', descI18n: 'trendingApi.fieldItems' },
      { field: 'symbol', type: 'string', descI18n: 'trendingApi.fieldSymbol' },
      { field: 'market.marketType', type: 'string', descI18n: 'trendingApi.fieldMarketType' },
      { field: 'market.marketId', type: 'number', descI18n: 'trendingApi.fieldMarketId' },
      { field: 'bias', type: 'string', descI18n: 'trendingApi.fieldBias' },
      { field: 'directionScore', type: 'number', descI18n: 'trendingApi.fieldDirectionScore' },
      { field: 'bullishCount', type: 'number', descI18n: 'trendingApi.fieldBullishCount' },
      { field: 'bearishCount', type: 'number', descI18n: 'trendingApi.fieldBearishCount' },
      { field: 'neutralCount', type: 'number', descI18n: 'trendingApi.fieldNeutralCount' },
      { field: 'rank', type: 'number', descI18n: 'trendingApi.fieldRank' },
      { field: 'markPrice', type: 'number', descI18n: 'trendingApi.fieldMarkPriceNum' },
      { field: 'factorDirections', type: 'object', descI18n: 'trendingApi.fieldFactorDirections' },
    ],
  },
  {
    id: 'net_flow',
    method: 'GET',
    baseUrl: VERGEX_PROXY_URL || API_BASE_URL,
    path: '/trending-crypto',
    titleI18n: 'trendingApi.netFlowTitle',
    descI18n: 'trendingApi.netFlowDesc',
    responseStructure: 'topLow',
    group: 'crypto',
    params: [
      { name: 'tab', type: 'string', required: true, fixed: 'net_flow', descI18n: 'trendingApi.paramTab' },
      { name: 'duration', type: 'string', required: true, defaultValue: '24h', options: ['1h', '4h', '12h', '24h'], descI18n: 'trendingApi.paramDuration' },
      { name: 'limit', type: 'number', required: true, defaultValue: '50', descI18n: 'trendingApi.paramLimit' },
    ],
    responseFields: [
      { field: 'top', type: 'array', descI18n: 'trendingApi.fieldTop' },
      { field: 'low', type: 'array', descI18n: 'trendingApi.fieldLow' },
      { field: 'symbol', type: 'string', descI18n: 'trendingApi.fieldSymbol' },
      { field: 'amount', type: 'number', descI18n: 'trendingApi.fieldAmount' },
      { field: 'price', type: 'number', descI18n: 'trendingApi.fieldPrice' },
      { field: 'price_delta_percent', type: 'number', descI18n: 'trendingApi.fieldPriceDeltaPercent' },
      { field: 'rank', type: 'number', descI18n: 'trendingApi.fieldRank' },
    ],
  },
  {
    id: 'oi',
    method: 'GET',
    baseUrl: VERGEX_PROXY_URL || API_BASE_URL,
    path: '/trending-crypto',
    titleI18n: 'trendingApi.oiTitle',
    descI18n: 'trendingApi.oiDesc',
    responseStructure: 'topLow',
    group: 'crypto',
    params: [
      { name: 'tab', type: 'string', required: true, fixed: 'oi', descI18n: 'trendingApi.paramTab' },
      { name: 'duration', type: 'string', required: true, defaultValue: '24h', options: ['1h', '4h', '12h', '24h'], descI18n: 'trendingApi.paramDuration' },
      { name: 'limit', type: 'number', required: true, defaultValue: '50', descI18n: 'trendingApi.paramLimit' },
    ],
    responseFields: [
      { field: 'top', type: 'array', descI18n: 'trendingApi.fieldTop' },
      { field: 'low', type: 'array', descI18n: 'trendingApi.fieldLow' },
      { field: 'symbol', type: 'string', descI18n: 'trendingApi.fieldSymbol' },
      { field: 'current_oi', type: 'number', descI18n: 'trendingApi.fieldCurrentOi' },
      { field: 'oi_delta', type: 'number', descI18n: 'trendingApi.fieldOiDelta' },
      { field: 'oi_delta_percent', type: 'number', descI18n: 'trendingApi.fieldOiDeltaPercent' },
      { field: 'oi_delta_value', type: 'number', descI18n: 'trendingApi.fieldOiDeltaValue' },
      { field: 'net_long', type: 'number', descI18n: 'trendingApi.fieldNetLong' },
      { field: 'net_short', type: 'number', descI18n: 'trendingApi.fieldNetShort' },
      { field: 'price', type: 'number', descI18n: 'trendingApi.fieldPrice' },
      { field: 'price_delta_percent', type: 'number', descI18n: 'trendingApi.fieldPriceDeltaPercent' },
      { field: 'rank', type: 'number', descI18n: 'trendingApi.fieldRank' },
    ],
  },
  {
    id: 'depth',
    method: 'GET',
    baseUrl: VERGEX_PROXY_URL || API_BASE_URL,
    path: '/trending-crypto',
    titleI18n: 'trendingApi.depthTitle',
    descI18n: 'trendingApi.depthDesc',
    responseStructure: 'futureSpot',
    group: 'crypto',
    params: [
      { name: 'tab', type: 'string', required: true, fixed: 'depth', descI18n: 'trendingApi.paramTab' },
      { name: 'limit', type: 'number', required: true, defaultValue: '50', descI18n: 'trendingApi.paramLimit' },
    ],
    responseFields: [
      { field: 'future', type: 'array', descI18n: 'trendingApi.fieldFuture' },
      { field: 'spot', type: 'array', descI18n: 'trendingApi.fieldSpot' },
      { field: 'symbol', type: 'string', descI18n: 'trendingApi.fieldSymbol' },
      { field: 'bid_volume', type: 'number', descI18n: 'trendingApi.fieldBidVolume' },
      { field: 'ask_volume', type: 'number', descI18n: 'trendingApi.fieldAskVolume' },
      { field: 'delta', type: 'number', descI18n: 'trendingApi.fieldDelta' },
      { field: 'price', type: 'number', descI18n: 'trendingApi.fieldPrice' },
      { field: 'price_delta_percent', type: 'number', descI18n: 'trendingApi.fieldPriceDeltaPercent' },
      { field: 'rank', type: 'number', descI18n: 'trendingApi.fieldRank' },
    ],
  },
  {
    id: 'rates',
    method: 'GET',
    baseUrl: VERGEX_PROXY_URL || API_BASE_URL,
    path: '/trending-crypto',
    titleI18n: 'trendingApi.ratesTitle',
    descI18n: 'trendingApi.ratesDesc',
    responseStructure: 'topLow',
    group: 'crypto',
    params: [
      { name: 'tab', type: 'string', required: true, fixed: 'rates', descI18n: 'trendingApi.paramTab' },
      { name: 'limit', type: 'number', required: true, defaultValue: '50', descI18n: 'trendingApi.paramLimit' },
    ],
    responseFields: [
      { field: 'top', type: 'array', descI18n: 'trendingApi.fieldTop' },
      { field: 'low', type: 'array', descI18n: 'trendingApi.fieldLow' },
      { field: 'symbol', type: 'string', descI18n: 'trendingApi.fieldSymbol' },
      { field: 'funding_rate', type: 'number', descI18n: 'trendingApi.fieldFundingRate' },
      { field: 'mark_price', type: 'number', descI18n: 'trendingApi.fieldMarkPrice' },
      { field: 'index_price', type: 'number', descI18n: 'trendingApi.fieldIndexPrice' },
      { field: 'next_funding_time', type: 'number (ms)', descI18n: 'trendingApi.fieldNextFundingTime' },
      { field: 'price_delta_percent', type: 'number', descI18n: 'trendingApi.fieldPriceDeltaPercent' },
      { field: 'rank', type: 'number', descI18n: 'trendingApi.fieldRank' },
    ],
  },
  {
    id: 'price',
    method: 'GET',
    baseUrl: VERGEX_PROXY_URL || API_BASE_URL,
    path: '/trending-crypto',
    titleI18n: 'trendingApi.priceTitle',
    descI18n: 'trendingApi.priceDesc',
    responseStructure: 'topLow',
    group: 'crypto',
    params: [
      { name: 'tab', type: 'string', required: true, fixed: 'price', descI18n: 'trendingApi.paramTab' },
      { name: 'duration', type: 'string', required: true, defaultValue: '24h', options: ['1h', '4h', '12h', '24h'], descI18n: 'trendingApi.paramDuration' },
      { name: 'limit', type: 'number', required: true, defaultValue: '50', descI18n: 'trendingApi.paramLimit' },
    ],
    responseFields: [
      { field: 'top', type: 'array', descI18n: 'trendingApi.fieldTop' },
      { field: 'low', type: 'array', descI18n: 'trendingApi.fieldLow' },
      { field: 'pair', type: 'string', descI18n: 'trendingApi.fieldPair' },
      { field: 'symbol', type: 'string', descI18n: 'trendingApi.fieldSymbol' },
      { field: 'price_delta', type: 'number', descI18n: 'trendingApi.fieldPriceDelta' },
      { field: 'price', type: 'number', descI18n: 'trendingApi.fieldPrice' },
      { field: 'future_flow', type: 'number', descI18n: 'trendingApi.fieldFutureFlow' },
      { field: 'spot_flow', type: 'number', descI18n: 'trendingApi.fieldSpotFlow' },
      { field: 'oi', type: 'number', descI18n: 'trendingApi.fieldOi' },
      { field: 'oi_delta', type: 'number', descI18n: 'trendingApi.fieldOiDelta' },
      { field: 'oi_delta_value', type: 'number', descI18n: 'trendingApi.fieldOiDeltaValue' },
    ],
  },
  {
    id: 'hl_preipo',
    method: 'GET',
    baseUrl: VERGEX_PROXY_URL || API_BASE_URL,
    path: '/trending-hl',
    titleI18n: 'trendingApi.hlTitle',
    descI18n: 'trendingApi.hlDesc',
    responseStructure: 'rows',
    group: 'crypto',
    params: [
      { name: 'category', type: 'string', required: true, fixed: 'other', descI18n: 'trendingApi.paramCategory' },
      { name: 'sub', type: 'string', required: true, fixed: 'preipo', descI18n: 'trendingApi.paramSub' },
    ],
    responseFields: [
      { field: 'generatedAt', type: 'string (ISO)', descI18n: 'trendingApi.fieldGeneratedAt' },
      { field: 'rows', type: 'array', descI18n: 'trendingApi.fieldRows' },
      { field: 'symbol', type: 'string', descI18n: 'trendingApi.fieldSymbolHl' },
      { field: 'base', type: 'string', descI18n: 'trendingApi.fieldBase' },
      { field: 'quote', type: 'string', descI18n: 'trendingApi.fieldQuote' },
      { field: 'dex', type: 'string', descI18n: 'trendingApi.fieldDex' },
      { field: 'maxLeverage', type: 'number', descI18n: 'trendingApi.fieldMaxLeverage' },
      { field: 'lastPrice', type: 'number', descI18n: 'trendingApi.fieldLastPrice' },
      { field: 'change24hAbs', type: 'number', descI18n: 'trendingApi.fieldChange24hAbs' },
      { field: 'change24hPct', type: 'number', descI18n: 'trendingApi.fieldChange24hPct' },
      { field: 'funding8h', type: 'number', descI18n: 'trendingApi.fieldFunding8h' },
      { field: 'volume24h', type: 'number', descI18n: 'trendingApi.fieldVolume24h' },
      { field: 'openInterest', type: 'number', descI18n: 'trendingApi.fieldOpenInterest' },
    ],
  },
  {
    id: 'category_ai500',
    method: 'GET',
    baseUrl: VERGEX_PROXY_URL || API_BASE_URL,
    path: '/trending-category',
    titleI18n: 'trendingApi.ai500Title',
    descI18n: 'trendingApi.ai500Desc',
    responseStructure: 'object',
    group: 'stock',
    params: [
      { name: 'lang', type: 'string', required: true, defaultValue: 'en', options: ['en', 'zh'], descI18n: 'trendingApi.paramLang' },
      { name: 'key', type: 'string', required: true, fixed: 'ai500', descI18n: 'trendingApi.paramCategoryKey' },
    ],
    responseFields: [
      { field: 'generatedAt', type: 'string (ISO)', descI18n: 'trendingApi.fieldGeneratedAt' },
      { field: 'marketSession', type: 'object', descI18n: 'trendingApi.fieldMarketSession' },
      { field: 'category', type: 'object', descI18n: 'trendingApi.fieldCategory' },
      { field: 'category.assets', type: 'array', descI18n: 'trendingApi.fieldAssets' },
      { field: 'symbol', type: 'string', descI18n: 'trendingApi.fieldSymbol' },
      { field: 'price', type: 'string', descI18n: 'trendingApi.fieldPriceStr' },
      { field: 'change', type: 'string', descI18n: 'trendingApi.fieldChangeStr' },
      { field: 'score', type: 'number', descI18n: 'trendingApi.fieldScore' },
      { field: 'signal', type: 'string', descI18n: 'trendingApi.fieldSignal' },
      { field: 'pair', type: 'string', descI18n: 'trendingApi.fieldPair' },
      { field: 'changePctValue', type: 'number', descI18n: 'trendingApi.fieldChangePctValue' },
      { field: 'startPrice', type: 'number', descI18n: 'trendingApi.fieldStartPrice' },
      { field: 'startTime', type: 'number (Unix s)', descI18n: 'trendingApi.fieldStartTime' },
    ],
  },
  {
    id: 'category_prediction',
    method: 'GET',
    baseUrl: VERGEX_PROXY_URL || API_BASE_URL,
    path: '/trending-category',
    titleI18n: 'trendingApi.predictionTitle',
    descI18n: 'trendingApi.predictionDesc',
    responseStructure: 'object',
    group: 'stock',
    params: [
      { name: 'lang', type: 'string', required: true, defaultValue: 'en', options: ['en', 'zh'], descI18n: 'trendingApi.paramLang' },
      { name: 'key', type: 'string', required: true, fixed: 'prediction', descI18n: 'trendingApi.paramCategoryKey' },
    ],
    responseFields: [
      { field: 'generatedAt', type: 'string (ISO)', descI18n: 'trendingApi.fieldGeneratedAt' },
      { field: 'marketSession', type: 'object', descI18n: 'trendingApi.fieldMarketSession' },
      { field: 'category', type: 'object', descI18n: 'trendingApi.fieldCategory' },
      { field: 'category.assets', type: 'array', descI18n: 'trendingApi.fieldAssets' },
      { field: 'symbol', type: 'string', descI18n: 'trendingApi.fieldSymbol' },
      { field: 'title', type: 'string', descI18n: 'trendingApi.fieldTitle' },
      { field: 'price', type: 'string', descI18n: 'trendingApi.fieldPriceStr' },
      { field: 'change', type: 'string', descI18n: 'trendingApi.fieldChangeStr' },
      { field: 'volume', type: 'string', descI18n: 'trendingApi.fieldVolumeStr' },
      { field: 'yesPriceValue', type: 'number', descI18n: 'trendingApi.fieldYesPriceValue' },
      { field: 'volume24hrValue', type: 'number', descI18n: 'trendingApi.fieldVolume24hrValue' },
      { field: 'totalVolumeValue', type: 'number', descI18n: 'trendingApi.fieldTotalVolumeValue' },
      { field: 'icon', type: 'string (URL)', descI18n: 'trendingApi.fieldIcon' },
      { field: 'tags', type: 'array', descI18n: 'trendingApi.fieldTags' },
    ],
  },
  {
    id: 'hl_perp_meta',
    method: 'POST',
    baseUrl: HYPERLIQUID_API_URL,
    path: '/info',
    titleI18n: 'trendingApi.hlPerpMetaTitle',
    descI18n: 'trendingApi.hlPerpMetaDesc',
    responseStructure: 'array',
    group: 'crypto',
    params: [
      { name: 'type', type: 'string', required: true, fixed: 'metaAndAssetCtxs', inBody: true, descI18n: 'trendingApi.paramType' },
    ],
    responseFields: [
      { field: '[0].universe', type: 'array', descI18n: 'trendingApi.fieldUniverse' },
      { field: 'universe[].name', type: 'string', descI18n: 'trendingApi.fieldUniverseName' },
      { field: 'universe[].szDecimals', type: 'number', descI18n: 'trendingApi.fieldSzDecimals' },
      { field: 'universe[].maxLeverage', type: 'number', descI18n: 'trendingApi.fieldMaxLeverage' },
      { field: '[1][]', type: 'array', descI18n: 'trendingApi.fieldAssetCtxs' },
      { field: 'funding', type: 'string', descI18n: 'trendingApi.fieldFunding' },
      { field: 'openInterest', type: 'string', descI18n: 'trendingApi.fieldOpenInterestAsset' },
      { field: 'markPrice', type: 'string', descI18n: 'trendingApi.fieldMarkPrice' },
      { field: 'midPrice', type: 'string', descI18n: 'trendingApi.fieldMidPrice' },
      { field: 'dayNtlVolume', type: 'string', descI18n: 'trendingApi.fieldDayNtlVolume' },
      { field: 'prevDayPx', type: 'string', descI18n: 'trendingApi.fieldPrevDayPx' },
    ],
  },
  {
    id: 'hl_all_mids',
    method: 'POST',
    baseUrl: HYPERLIQUID_API_URL,
    path: '/info',
    titleI18n: 'trendingApi.hlAllMidsTitle',
    descI18n: 'trendingApi.hlAllMidsDesc',
    responseStructure: 'object',
    group: 'crypto',
    params: [
      { name: 'type', type: 'string', required: true, fixed: 'allMids', inBody: true, descI18n: 'trendingApi.paramType' },
    ],
    responseFields: [
      { field: '[key]', type: 'string', descI18n: 'trendingApi.fieldMidsKey' },
      { field: '[value]', type: 'string', descI18n: 'trendingApi.fieldMidsValue' },
    ],
  },
  {
    id: 'hl_spot_meta',
    method: 'POST',
    baseUrl: HYPERLIQUID_API_URL,
    path: '/info',
    titleI18n: 'trendingApi.hlSpotMetaTitle',
    descI18n: 'trendingApi.hlSpotMetaDesc',
    responseStructure: 'array',
    group: 'crypto',
    params: [
      { name: 'type', type: 'string', required: true, fixed: 'spotMetaAndAssetCtxs', inBody: true, descI18n: 'trendingApi.paramType' },
    ],
    responseFields: [
      { field: '[0].universe', type: 'array', descI18n: 'trendingApi.fieldSpotUniverse' },
      { field: 'universe[].name', type: 'string', descI18n: 'trendingApi.fieldUniverseName' },
      { field: 'universe[].tokens', type: 'number[]', descI18n: 'trendingApi.fieldTokens' },
      { field: 'universe[].index', type: 'number', descI18n: 'trendingApi.fieldIndex' },
      { field: 'universe[].isCanonical', type: 'boolean', descI18n: 'trendingApi.fieldIsCanonical' },
      { field: '[1][]', type: 'array', descI18n: 'trendingApi.fieldAssetCtxs' },
      { field: 'dayNtlVolume', type: 'string', descI18n: 'trendingApi.fieldDayNtlVolume' },
      { field: 'markPx', type: 'string', descI18n: 'trendingApi.fieldMarkPx' },
      { field: 'midPx', type: 'string', descI18n: 'trendingApi.fieldMidPrice' },
    ],
  },
]
