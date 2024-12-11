import { Button } from "@/components/ui/button";

export function TimeNavigation({ onTimeChange }) {
  return (
    <div className="flex items-center justify-between mb-4 bg-zinc-900/50 p-2 rounded-lg">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onTimeChange(-1)}
          className="bg-blue-500/20 hover:bg-blue-500/30 text-white text-sm"
          size="sm"
        >
          -1h
        </Button>
        <Button
          onClick={() => onTimeChange(-3)}
          className="bg-blue-500/20 hover:bg-blue-500/30 text-white text-sm"
          size="sm"
        >
          -3h
        </Button>
        <Button
          onClick={() => onTimeChange(-6)}
          className="bg-blue-500/20 hover:bg-blue-500/30 text-white text-sm"
          size="sm"
        >
          -6h
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onTimeChange(1)}
          className="bg-blue-500/20 hover:bg-blue-500/30 text-white text-sm"
          size="sm"
        >
          +1h
        </Button>
        <Button
          onClick={() => onTimeChange(3)}
          className="bg-blue-500/20 hover:bg-blue-500/30 text-white text-sm"
          size="sm"
        >
          +3h
        </Button>
        <Button
          onClick={() => onTimeChange(6)}
          className="bg-blue-500/20 hover:bg-blue-500/30 text-white text-sm"
          size="sm"
        >
          +6h
        </Button>
      </div>
    </div>
  );
} 