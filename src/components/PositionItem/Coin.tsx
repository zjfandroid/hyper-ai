import { Link, Router } from 'react-router-dom';

const PositionItemCoin = ({ item, link = false }) => {
  return (
      <>
        {
          link
            ? <Link to={`/trade/${item.coin}`} className='linker-hover' onClick={(e) => e.stopPropagation()}>
                {item.coin}
              </Link>
            : item.coin
        }
      </>
  )
}

export default PositionItemCoin