import LineCharts from './charts/LineChart';
import { formatDecimalNumber } from '@/utils';

const VaultCard = ({ vault }: { vault: any }) => {
  const { summary, apr, pnls } = vault;
  const { name, vaultAddress, tvl } = summary;

  const allTimePnl = pnls.find((pnl: any) => pnl[0] === 'allTime')?.[1] || [];
  const chartData = allTimePnl.map((value: string, index: number) => ({
    date: index,
    value: parseFloat(value),
  }));

  const handleCardClick = () => {
    window.open(`https://app.hyperliquid.xyz/vaults/${vaultAddress}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 flex flex-col justify-between cursor-pointer" onClick={handleCardClick}>
      <div>
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-white">{name}</span>
          <span className="text-xs text-gray-400">{`${vaultAddress.slice(
            0,
            6
          )}...${vaultAddress.slice(-4)}`}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">TVL</div>
            <div className="text-base font-bold text-white">
              ${formatDecimalNumber(tvl, 2)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">APR</div>
            <div
              className={`text-base font-bold ${
                apr > 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {formatDecimalNumber(apr * 100, 2)}%
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <LineCharts data={chartData} data1={[]} color={apr > 0 ? '#22C55E' : '#EF4444'} />
      </div>
      <a
        href={`https://hyperdash.info/vault/${vaultAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-right text-xs text-gray-400 mt-1 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        All-time PNL ↗
      </a>
    </div>
  );
};

export default VaultCard;