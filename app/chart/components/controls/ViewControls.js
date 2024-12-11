import { Button } from "@/components/ui/button";

export function ViewControls({ viewType, onViewChange, showTable, onToggleTable }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <Button
          onClick={() => onViewChange('5min')}
          className={`${viewType === '5min' ? 'bg-blue-500' : 'bg-blue-500/20'} hover:bg-blue-500/30 text-white`}
        >
          5 Min
        </Button>
        <Button
          onClick={() => onViewChange('hourly')}
          className={`${viewType === 'hourly' ? 'bg-blue-500' : 'bg-blue-500/20'} hover:bg-blue-500/30 text-white`}
        >
          Hourly
        </Button>
        <Button
          onClick={() => onViewChange('weekly')}
          className={`${viewType === 'weekly' ? 'bg-blue-500' : 'bg-blue-500/20'} hover:bg-blue-500/30 text-white`}
        >
          Weekly
        </Button>
        <Button
          onClick={() => onViewChange('monthly')}
          className={`${viewType === 'monthly' ? 'bg-blue-500' : 'bg-blue-500/20'} hover:bg-blue-500/30 text-white`}
        >
          Monthly
        </Button>
      </div>

      <Button
        onClick={onToggleTable}
        className="bg-blue-500/20 hover:bg-blue-500/30 text-white"
      >
        {showTable ? 'Show Chart' : 'Show Table'}
      </Button>
    </div>
  );
} 