import { useHyperStore } from '@/stores'

const PositionItemMarkPrice = ({ item }) => {
  const hyperStore = useHyperStore()

  return (
    <>
      $ {hyperStore.perpMarket[item.coin]?.markPrice || item.markPrice || '-' }
    </>
  )
}

export default PositionItemMarkPrice