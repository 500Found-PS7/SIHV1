import { useMemo } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

export function LoadStats({ data }) {
  const stats = useMemo(() => {
    if (!data || data.length === 0) return {
      current: { value: 0, change: 0 },
      peak: { value: 0, change: 0 },
      average: { value: 0, change: 0 },
      accuracy: { value: 0, change: 0 }
    };

    const loads = data.map(item => item.load);
    const peak = Math.max(...loads);
    const average = Math.round(loads.reduce((a, b) => a + b, 0) / loads.length);
    const current = loads[loads.length - 1];

    // Calculate percentage changes (mock data for now)
    const currentChange = 2.3;
    const peakChange = 1.5;
    const accuracyValue = 95.8;
    const accuracyChange = 0.8;

    return {
      current: { value: current, change: currentChange },
      peak: { value: peak, change: peakChange },
      average: { value: average, change: null },
      accuracy: { value: accuracyValue, change: accuracyChange }
    };
  }, [data]);

  const StatCard = ({ title, value, change, unit = "MW" }) => (
    <div className="bg-zinc-900/50 p-4 rounded-lg">
      <div className="text-zinc-400 text-sm font-medium mb-1">{title}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold text-white">
          {value.toLocaleString()} <span className="text-sm text-zinc-400">{unit}</span>
        </div>
        {change !== null && (
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? (
              <ArrowUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 mr-1" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <StatCard 
        title="Current Load" 
        value={stats.current.value} 
        change={stats.current.change}
      />
      <StatCard 
        title="Peak Load" 
        value={stats.peak.value} 
        change={stats.peak.change}
      />
      <StatCard 
        title="Average Load" 
        value={stats.average.value} 
        change={null}
      />
      <StatCard 
        title="Forecast Accuracy" 
        value={stats.accuracy.value} 
        change={stats.accuracy.change}
        unit="%"
      />
    </div>
  );
} 