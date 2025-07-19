import { blo } from "blo";

const AddressAvatar = ({ address, size = 20, className = '' }) => {
  return (
    <div className={`avatar ${className ?? ''}`}>
      <img alt={address} src={blo(address, size)} className="br-1" />
    </div>
  )
}

export default AddressAvatar