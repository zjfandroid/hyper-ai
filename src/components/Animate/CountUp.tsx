import { useEffect, useState } from 'react'
import CountUp from 'react-countup';

import { constants } from '@/stores'
import { formatNumber } from '@/utils'

const AnimateCountUp = ({ end, decimals = constants.decimalPlaces.__COMMON__ }) => {
  const [start, setStart] = useState(0)

  const handleOnEnd = () => {
    setStart(end)
  }

  return (
    <CountUp start={start} preserveValue duration={0.5} onEnd={handleOnEnd} end={end} decimals={decimals} formattingFn={(value) => formatNumber(value)} delay={0}>
      {({ countUpRef }) => (
        <span ref={countUpRef} />
      )}
    </CountUp>
  )
}

export default AnimateCountUp