// 预测市场标签中英文翻译模块
// 采用模板匹配 + 术语词典的方式处理高频模式

// 国家/地区词典（世界杯相关）
const COUNTRY_DICT: Record<string, string> = {
  'Spain': '西班牙', 'Argentina': '阿根廷', 'England': '英格兰', 'France': '法国',
  'Brazil': '巴西', 'Germany': '德国', 'Portugal': '葡萄牙', 'Netherlands': '荷兰',
  'Italy': '意大利', 'USA': '美国', 'Uruguay': '乌拉圭', 'Mexico': '墨西哥',
  'Belgium': '比利时', 'Colombia': '哥伦比亚', 'Peru': '秘鲁', 'Japan': '日本',
  'Norway': '挪威', 'Canada': '加拿大', 'Ecuador': '厄瓜多尔', 'Paraguay': '巴拉圭',
  'New Zealand': '新西兰', 'Australia': '澳大利亚', 'Iran': '伊朗', 'Uzbekistan': '乌兹别克斯坦',
  'South Korea': '韩国', 'Jordan': '约旦', 'Morocco': '摩洛哥', 'South Africa': '南非',
  'Senegal': '塞内加尔', 'Ivory Coast': '科特迪瓦', 'Ghana': '加纳', 'Egypt': '埃及',
  'Algeria': '阿尔及利亚', 'Cape Verde': '佛得角', 'Qatar': '卡塔尔', 'Saudi Arabia': '沙特阿拉伯',
  'Scotland': '苏格兰', 'Switzerland': '瑞士', 'Austria': '奥地利', 'Croatia': '克罗地亚',
  'Haiti': '海地', 'Curaçao': '库拉索', 'Panama': '巴拿马', 'Sweden': '瑞典',
  'Congo DR': '刚果民主共和国', 'Iraq': '伊拉克', 'Bosnia-Herzegovina': '波黑',
  'Czechia': '捷克', 'Turkiye': '土耳其',
}

// 人物词典（常见政治家/球员）
const PERSON_DICT: Record<string, string> = {
  'Abiy Ahmed': '阿比·艾哈迈德', 'Gedion Timothewos': '吉迪恩·蒂莫特沃斯',
  'Berhanu Nega': '贝尔哈努·内加', 'Shimelis Abdisa': '希梅利斯·阿卜迪萨',
  'Alesa Mengesha': '阿莱萨·门格斯哈',
  'Lionel Messi': '梅西', 'Kylian Mbappe': '姆巴佩', 'Harry Kane': '哈里·凯恩',
  'Jude Bellingham': '贝林厄姆', 'Mikel Oyarzabal': '奥亚萨瓦尔',
  'Anthony Gordon': '安东尼·戈登', 'Enzo Fernández': '恩佐·费尔南德斯',
  'Lautaro Martínez': '劳塔罗·马丁内斯',
}

// 通用术语词典
const TERM_DICT: Record<string, string> = {
  'FIFA World Cup': '国际足联世界杯',
  'World Cup': '世界杯',
  'Prime Minister': '总理',
  'President': '总统',
  'Fed': '美联储',
  'interest rates': '利率',
  'no change': '维持不变',
  'increase': '加息',
  'decrease': '降息',
  'meeting': '会议',
  'bps': '基点',
  'goalscorer': '最佳射手',
  'top goalscorer': '最佳射手',
  'goals': '进球',
  'assists': '助攻',
  'Player Props': '球员玩法',
  'Decision': '决议',
  'Golden Boot Winner': '金靴奖得主',
  'Winner': '冠军',
}

// 替换文本中的词典条目
const applyDict = (text: string, dict: Record<string, string>): string => {
  let result = text
  // 按长度降序排列，优先匹配长词
  const keys = Object.keys(dict).sort((a, b) => b.length - a.length)
  for (const key of keys) {
    const regex = new RegExp(key, 'g')
    result = result.replace(regex, dict[key])
  }
  return result
}

// 模板规则：匹配并翻译特定句式
interface TemplateRule {
  pattern: RegExp
  translate: (match: RegExpMatchArray) => string | null
}

const TEMPLATE_RULES: TemplateRule[] = [
  // "Will X win the 2026 FIFA World Cup?" -> "X 会赢得 2026 年国际足联世界杯吗？"
  {
    pattern: /^Will (.+?) win the (\d{4}) FIFA World Cup\??$/,
    translate: (m) => {
      const country = COUNTRY_DICT[m[1]] || PERSON_DICT[m[1]] || m[1]
      return `${country} 会赢得 ${m[2]} 年国际足联世界杯吗？`
    },
  },
  // "Will X be the next Prime Minister of Y?" -> "X 会成为下任 Y 总理吗？"
  {
    pattern: /^Will (.+?) be the next Prime Minister of (.+)\??$/,
    translate: (m) => {
      const person = PERSON_DICT[m[1]] || m[1]
      const country = COUNTRY_DICT[m[2]] || m[2]
      return `${person} 会成为下任 ${country} 总理吗？`
    },
  },
  // "Will X be the top goalscorer at the 2026 FIFA World Cup?"
  {
    pattern: /^Will (.+?) be the top goalscorer at the (\d{4}) FIFA World Cup\??$/,
    translate: (m) => {
      const person = PERSON_DICT[m[1]] || m[1]
      return `${person} 会成为 ${m[2]} 年国际足联世界杯最佳射手吗？`
    },
  },
  // "Will there be no change in Fed interest rates after the July 2026 meeting?"
  {
    pattern: /^Will there be no change in Fed interest rates after the (\w+) (\d{4}) meeting\??$/,
    translate: (m) => `${m[2]} 年 ${m[1]} 会议后美联储会维持利率不变吗？`,
  },
  // "Will the Fed increase/decrease interest rates by X bps after the Y Z meeting?"
  {
    pattern: /^Will the Fed (increase|decrease) interest rates by (\d+\+?) bps after the (\w+) (\d{4}) meeting\??$/,
    translate: (m) => {
      const action = m[1] === 'increase' ? '加息' : '降息'
      return `${m[4]} 年 ${m[3]} 会议后美联储会${action} ${m[2]} 基点吗？`
    },
  },
  // "X: N+ goals/assists" -> "X: N+ 进球/助攻"
  {
    pattern: /^(.+?): (\d+)\+ (goals|assists)$/,
    translate: (m) => {
      const person = PERSON_DICT[m[1]] || m[1]
      const stat = m[3] === 'goals' ? '进球' : '助攻'
      return `${person}: ${m[2]}+ ${stat}`
    },
  },
]

// 翻译单个标签
export const translatePredictionLabel = (label: string): string => {
  if (!label) return ''

  const trimmed = label.trim()

  // 1. 尝试模板规则匹配
  for (const rule of TEMPLATE_RULES) {
    const match = trimmed.match(rule.pattern)
    if (match) {
      const translated = rule.translate(match)
      if (translated) return translated
    }
  }

  // 2. 回退：应用词典替换
  let result = applyDict(trimmed, TERM_DICT)
  result = applyDict(result, COUNTRY_DICT)
  result = applyDict(result, PERSON_DICT)

  // 3. 通用 "Will X..." 句式兜底
  if (result.startsWith('Will ') && result.endsWith('?')) {
    const inner = result.slice(5, -1)
    return `${inner} 吗？`
  }

  return result
}

// 批量翻译 outcomes
export const translateOutcomes = (outcomes: Array<{ label: string; price: number }>) => {
  return (outcomes || []).map(o => ({
    ...o,
    labelZh: translatePredictionLabel(o.label),
  }))
}
