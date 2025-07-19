import { useEffect, useState } from 'react';
import { useSwitchChain } from 'wagmi'
import BN from 'bignumber.js'
import { useTranslation, withTranslation, Trans } from 'react-i18next'

import ColumnList from '@/components/Column/List'
import { formatNumber, forEach, maskingAddress, merge, sortArrayByKey } from '@/utils';
import { constants, useTraderDetailsStore, useContractCyberSnakeStore } from '@/stores'
import { createStore } from '@/stores/helpers'
import { usePrivateWalletStore } from '@/stores';
import CoinIcon from '@/components/CoinIcon'

import BaseModal from './Base';

const ModalSpotAssets = () => {
  const traderDetailsStore = useTraderDetailsStore()
  const spotAssetsStore = createStore({
    list: [],
    sortColumnId: 'value'
  })()

  const { t, i18n } = useTranslation()

  const column = [
    { id: 'symbol', label: t('common.symbol'), className: 'col-4 col-md-4 col-xl-3' },
    { id: 'amount', sort: true, sortByKey: 'amount', label: t('common.amount'), className: 'justify-content-end text-end d-none d-md-flex col-md' },
    { id: 'value', sort: true, sortByKey: 'value', label: t('common.value'), className: 'justify-content-end text-end col' },
  ]

  const renderItem = (item, columnIndex) => {
    switch (column[columnIndex].id) {
      case 'symbol':
        return <span className='d-flex align-items-center gap-2'><CoinIcon size='sm' id={item.coin} />{item.coin}</span>
      case 'amount':
        return formatNumber(item.amount)
      case 'value':
        return <>$ {formatNumber(new BN(item.value).toFixed(constants.decimalPlaces.__COMMON__))}</>
      default:
        return null
    }
  }

  const handleClose = () => {
    traderDetailsStore.openSpotAssets = false;
  }

  const handleChangeSort = (columnId: string, sortByKey: string = '', ascending: boolean = false) => {
    if (!sortByKey) {
      sortByKey = column.find(item => item.id === columnId).sortByKey
    }

    // update
    merge(spotAssetsStore, {
      sortColumnId: columnId,
      list: sortArrayByKey(spotAssetsStore.list, sortByKey, ascending)
    })
  }

  // init
  useEffect(() => {
    if (!traderDetailsStore.openSpotAssets || !traderDetailsStore.spotAssets.length) return

    const list = []

    forEach(traderDetailsStore.spotAssets, item => {
      list.push(item)
    })

    spotAssetsStore.list = list
    handleChangeSort(spotAssetsStore.sortColumnId)
    return () => {
    }
  }, [traderDetailsStore.openSpotAssets])

  return (
    <BaseModal
      title={t('common.spotAssets')}
      open={traderDetailsStore.openSpotAssets}
      onClose={handleClose}
    >
      <ColumnList
        columns={column}
        data={spotAssetsStore.list}
        className='br-3'
        sortColumnId={spotAssetsStore.sortColumnId}
        renderItem={renderItem}
        onChangeSort={handleChangeSort} />
    </BaseModal>
  );
};

export default ModalSpotAssets;