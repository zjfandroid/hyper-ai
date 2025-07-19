const VizTemplate = ({ item }) => {
  return (
    <li className={`d-flex br-2 ${item.className}`}>
      <div className='d-flex flex-wrap py-3 px-3 br-2 highlight gap-4 col'>
        <div className='d-flex flex-column col'>
          <small className={`d-flex align-items-center gap-1 color-unimportant ${item.labelClassName ?? 'pb-2'}`}>{ item.label }{ item.side }</small>
          <span className="d-flex flex-column color-secondary gap-1 mt-auto">
            <span className='h5 fw-bold color-white pb-1'>{ item.content }</span>
            { item.sub }
            { (item.subs || []).map((_item, _idx) => (
              <small key={_idx} className='d-flex color-secondary gap-2'>
                <span className="flex-shrink-0">{ _item.label }</span>
                <span className="d-flex flex-wrap fw-500 color-white ms-auto">{ _item.content }</span>
              </small>
            )) }
          </span>
        </div>
        { item.cover && <div className='mt-auto'>{ item.cover }</div> }
      </div>
    </li>
  )
}

export default VizTemplate