"use client";
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center px-8",
        caption_label: "text-sm font-medium text-slate-200",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-slate-800/50 border border-slate-700/50 p-0 opacity-50 hover:opacity-100 hover:bg-slate-700/50 text-slate-200"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-slate-400 rounded-md w-9 font-medium text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-800/50",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
          "h-9 w-9"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-slate-300 hover:text-white hover:bg-slate-800/80 focus:bg-slate-800/80 focus:text-white",
          "aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-blue-600/30 text-blue-200 hover:bg-blue-600/40 hover:text-blue-100 focus:bg-blue-600/40 focus:text-blue-100 rounded-md",
        day_today: "bg-slate-800/80 text-blue-400 font-semibold rounded-md",
        day_outside:
          "text-slate-600 opacity-50 aria-selected:bg-slate-800/30 aria-selected:text-slate-500 aria-selected:opacity-30",
        day_disabled: "text-slate-600 opacity-50",
        day_range_middle:
          "aria-selected:bg-slate-800/50 aria-selected:text-slate-200",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
