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
                "w-[240px] justify-start text-left font-normal",
                "bg-slate-900/80 border-slate-700/50 hover:bg-slate-800/80 backdrop-blur-sm",
                "text-slate-200 hover:text-white transition-colors",
                !startDate && "text-slate-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
              {startDate ? format(startDate, "PPP HH:mm") : <span>Start date and time</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl" 
            align="start"
          >
            <div className="p-3 border-b border-slate-700/50">
              <h4 className="font-medium text-slate-200">Select Start Date & Time</h4>
            </div>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => onStartDateChange(date)}
              initialFocus
              className="bg-transparent"
            />
            <div className="p-3 border-t border-slate-700/50 bg-slate-900/50">
              <label className="block text-sm font-medium text-slate-400 mb-2">Time</label>
              <input
                type="time"
                value={format(startDate, "HH:mm")}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(":");
                  const newDate = new Date(startDate);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  onStartDateChange(newDate);
                }}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                "bg-slate-900/80 border-slate-700/50 hover:bg-slate-800/80 backdrop-blur-sm",
                "text-slate-200 hover:text-white transition-colors",
                !endDate && "text-slate-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-purple-400" />
              {endDate ? format(endDate, "PPP HH:mm") : <span>End date and time</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl" 
            align="start"
          >
            <div className="p-3 border-b border-slate-700/50">
              <h4 className="font-medium text-slate-200">Select End Date & Time</h4>
            </div>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => onEndDateChange(date)}
              initialFocus
              className="bg-transparent"
            />
            <div className="p-3 border-t border-slate-700/50 bg-slate-900/50">
              <label className="block text-sm font-medium text-slate-400 mb-2">Time</label>
              <input
                type="time"
                value={format(endDate, "HH:mm")}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(":");
                  const newDate = new Date(endDate);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  onEndDateChange(newDate);
                }}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
} 