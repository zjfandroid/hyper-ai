import BN from 'bignumber.js'

import './ProgressBar.scss'

const ProgressBar = ({ percent, className = '', barClassName = '', bgColor = 'rgba(255,255,255,0.12)' }) => {
  const percentage = BN.min(BN.max(percent, 0), 100).toString()

  return (
    <div className={`d-flex col ${className} progress-bar overflow-hidden`} style={{ backgroundColor: bgColor }}>
      <div className={`d-flex col ${barClassName}`} style={{ width: `${percentage}%` }} />
    </div>
  );
};

export default ProgressBar;