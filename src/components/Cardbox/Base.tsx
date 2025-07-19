import React, { ReactNode, HTMLProps } from 'react'

interface CardBoxBaseProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode
}

const CardboxBase: React.FC<CardBoxBaseProps> = ({ children = <></>, ...rest }) => {
  return (
    <div {...rest}>
      <div className={`d-flex flex-column p-3 bg-gray-alpha-4 col`}>
        { children }
      </div>
    </div>
  )
}

export default CardboxBase