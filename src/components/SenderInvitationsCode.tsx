import { useEffect, useRef} from 'react';
import { useLocation } from 'react-router-dom';

import { constants, useAccountStore } from '@/stores'

const SenderInvitationsCode = () => {
  const location = useLocation();
  const accountStore = useAccountStore();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const value = queryParams.get(constants.paramKey.senderInvitationsCode) || ''

    accountStore.senderInvitationsCode = value
  }, [])

  return (
    <></>
  )
}

export default SenderInvitationsCode