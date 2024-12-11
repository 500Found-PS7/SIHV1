import { Button } from "@/components/ui/button";

export function ErrorDisplay({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
      <div className="text-red-500 font-medium">Error loading data</div>
      <div className="text-zinc-400 text-sm">{error}</div>
      <Button 
        onClick={onRetry}
        className="bg-blue-500/20 hover:bg-blue-500/30 text-white"
      >
        Try Again
      </Button>
    </div>
  );
} 