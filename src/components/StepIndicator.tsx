import React, { ReactNode, HTMLProps } from 'react'

interface StepIndicatorProps extends HTMLProps<HTMLDivElement> {
  current: number
  steps?: number
  initial?: number
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ current, steps = 3, initial = 0, ...rest }) => {
  return (
    <div { ...rest }>
      <div className='d-flex gap-1'>
        {
          Array(steps).fill(initial).map((item, idx) => (
            <div className={`col bg-gray-1 pt-1 ${ idx + item === current ? 'bg-primary' : '' }`} key={idx}></div>
          ))
        }
      </div>
    </div>
  )
}

export default StepIndicator