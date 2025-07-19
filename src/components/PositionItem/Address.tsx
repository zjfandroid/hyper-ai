import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message } from 'antd'
import { useState } from 'react';
import { useTranslation, withTranslation, Trans } from 'react-i18next'
import { Link, Router } from 'react-router-dom';

import { IOutlineCopy, IOutlineCopySuccess } from '@/components/icon'
import ColumnTooltip from '@/components/Column/Tooltip'
import { addressShortener } from '@/utils'
import AddressAvatar from '@/components/AddressAvatar'

const PositionItemAddress = ({ item, link = true, avatarSize = 20, prePlainLength = 6, shortener = true, avatar = false, postPlainLength = 4, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const { t, i18n } = useTranslation()

  const handleCopy = () => {
    message.success(t('message.addressCopied'));
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const renderAddress = () => {
    return shortener
      ? addressShortener(item.address, prePlainLength, postPlainLength)
      : item.address
  }

  return (
    <ColumnTooltip className={`d-flex align-items-center gap-2 color-white ${className}`} title={shortener ? item.address : ''}>
      { avatar && <AddressAvatar size={avatarSize} address={item.address} /> }
      {
        link
          ? <Link to={`/trader/${item.address}`} className='linker-hover'>
              {renderAddress()}
            </Link>
          : renderAddress()
      }
      <CopyToClipboard text={item.address} onCopy={handleCopy}>
        <span onClick={(e) => e.stopPropagation() }>
          {copied
            ? <IOutlineCopySuccess className='w-16 color-success linker' />
            : <IOutlineCopy className='w-16 color-secondary linker' />
          }
        </span>
      </CopyToClipboard>
    </ColumnTooltip>
  )
}

export default PositionItemAddress