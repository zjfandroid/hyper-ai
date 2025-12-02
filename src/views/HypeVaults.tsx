import React, { useEffect, useState } from 'react';
import Container from './components/Container';
import { number } from 'echarts/types/src/echarts.all.js';
import humvaLogoImg from '@/assets/images/humva.png';
import dyttLogoImg from '@/assets/images/dytt.png';
import iyfLogoImg from '@/assets/images/iyf.webp';
import LineCharts from './components/charts/LineChart';
import VaultCard from './components/VaultCard';

export default function HypeVaults() {
  const [assetsObj, setAssetsObj] = React.useState<Record<string, number>>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [vaultList, setVaultList] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState(0);

  // 初始化资产数据
  useEffect(() => {
    setLoading(true);
    fetch('http://57.181.73.173:8003/py/jesse/fetchVaults')
      .then((res) => res.json())
      .then((data) => {
        console.log('data>>>>>',data);
        
        setVaultList(data.data);
        setLoading(false);
      });
  }, []);

  return (
    <Container title='Vaults' isCommonBg={true}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vaultList.map((vault) => (
          <VaultCard key={vault.summary.vaultAddress} vault={vault} />
        ))}
      </div>
    </Container>
  );
}
