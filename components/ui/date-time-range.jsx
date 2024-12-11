import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";

export function DateTimeRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}) {
  // Helper function to safely format date
  const formatDateTime = (date) => {
    try {
      return isValid(date) ? format(date, "PPP HH:mm") : "";
    } catch (error) {
      console.error("Invalid date:", error);
      return "";
    }
  };

  // Helper function to safely format time
  const formatTime = (date) => {
    try {
      return isValid(date) ? format(date, "HH:mm") : "00:00";
    } catch (error) {
      console.error("Invalid time:", error);
      return "00:00";
    }
  };

  // Helper function to safely update time
  const updateTime = (date, timeString) => {
    try {
      if (!isValid(date)) {
        date = new Date();
      }
      const [hours, minutes] = timeString.split(":");
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      return newDate;
    } catch (error) {
      console.error("Error updating time:", error);
      return date;
    }
  };

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
              {startDate && isValid(startDate) ? formatDateTime(startDate) : <span>Start date and time</span>}
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
              selected={isValid(startDate) ? startDate : undefined}
              onSelect={(date) => {
                if (date) {
                  const newDate = new Date(date);
                  if (startDate && isValid(startDate)) {
                    newDate.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);
                  }
                  onStartDateChange(newDate);
                }
              }}
              initialFocus
              className="bg-transparent"
            />
            <div className="p-3 border-t border-slate-700/50 bg-slate-900/50">
              <label className="block text-sm font-medium text-slate-400 mb-2">Time</label>
              <input
                type="time"
                value={formatTime(startDate)}
                onChange={(e) => {
                  const newDate = updateTime(startDate, e.target.value);
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
              {endDate && isValid(endDate) ? formatDateTime(endDate) : <span>End date and time</span>}
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
              selected={isValid(endDate) ? endDate : undefined}
              onSelect={(date) => {
                if (date) {
                  const newDate = new Date(date);
                  if (endDate && isValid(endDate)) {
                    newDate.setHours(endDate.getHours(), endDate.getMinutes(), 0, 0);
                  }
                  onEndDateChange(newDate);
                }
              }}
              initialFocus
              className="bg-transparent"
            />
            <div className="p-3 border-t border-slate-700/50 bg-slate-900/50">
              <label className="block text-sm font-medium text-slate-400 mb-2">Time</label>
              <input
                type="time"
                value={formatTime(endDate)}
                onChange={(e) => {
                  const newDate = updateTime(endDate, e.target.value);
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