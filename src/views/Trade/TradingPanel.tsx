import { useTradeStore } from '@/stores'

const TradeTradingPanel = () => {
  const tradeStore = useTradeStore()


  return (
    <>
      TradingPanel

订单薄<br/>
??? 当前订单显示<br/>
??? 精度进制<br/>
{tradeStore.address}


    </>
  )
}

export default TradeTradingPanel