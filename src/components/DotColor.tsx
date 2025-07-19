import './DotColor.scss'

const DotColor = ({ id, label = '' }) => {
  return (
    <span className='d-flex align-items-center gap-2'>
      <span className={`dot-color ${id}-bg`}></span>
      {label}
    </span>
  )
}

export default DotColor