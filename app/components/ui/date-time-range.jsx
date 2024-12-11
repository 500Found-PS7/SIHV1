import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";

export function DateTimeRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal bg-black/20",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP HH:mm") : <span>Start date and time</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-black/90" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => onStartDateChange(date)}
              initialFocus
            />
            <div className="p-3 border-t border-border">
              <input
                type="time"
                value={format(startDate, "HH:mm")}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(":");
                  const newDate = new Date(startDate);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  onStartDateChange(newDate);
                }}
                className="w-full bg-transparent border rounded p-2"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal bg-black/20",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP HH:mm") : <span>End date and time</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-black/90" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => onEndDateChange(date)}
              initialFocus
            />
            <div className="p-3 border-t border-border">
              <input
                type="time"
                value={format(endDate, "HH:mm")}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(":");
                  const newDate = new Date(endDate);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  onEndDateChange(newDate);
                }}
                className="w-full bg-transparent border rounded p-2"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
} 