import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateControls({ selectedDate, onDateChange }) {
  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        onClick={() => handleDateChange(-1)}
        className="bg-blue-500/20 hover:bg-blue-500/30 text-white"
      >
        Previous Day
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-[240px] justify-start text-left font-normal bg-blue-500/20 hover:bg-blue-500/30 text-white`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(selectedDate, 'dd MMMM yyyy')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-zinc-950 border-zinc-800">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        onClick={() => handleDateChange(1)}
        className="bg-blue-500/20 hover:bg-blue-500/30 text-white"
      >
        Next Day
      </Button>
    </div>
  );
} 