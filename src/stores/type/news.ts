export interface TBaseNewsItem {
  id: number,
  title: string,
  content: string,
  columnistName: string,
  createTs: number

  fold: boolean, // 是否折叠，缺省 false
}