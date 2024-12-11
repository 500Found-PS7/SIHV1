"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { addMonths, format, subMonths, addWeeks, subWeeks, addDays, subDays, addYears, subYears, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isSameMonth } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarGrid } from "./calendar-grid"
import { DayView } from "./day-view"
import { WeekView } from "./week-view"
import { YearView } from "./year-view"

const sampleEvents = [
  {
    id: "1",
    title: "Diwali(Deepawali)", 
    date: new Date(2024, 10, 1),
    type: "festival"
  },
  {
    id: "2",
    title: "Govardhan Puja",
    date: new Date(2024, 10, 2),
    type: "festival"
  },
  {
    id: "3",
    title: "Session for Cohort 2",
    date: new Date(2024, 10, 5),
    time: "6:30 PM",
    type: "meeting"
  },
  {
    id: "4",
    title: "Guru Nanak Jayanti",
    date: new Date(2024, 10, 15),
    type: "festival"
  }
]

export function Calendar({ onDateSelect }) {
  const [currentDate, setCurrentDate] = React.useState(new Date(2024, 10))
  const [selectedDate, setSelectedDate] = React.useState(null)
  const [view, setView] = React.useState("month")

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleNavigate = (direction) => {
    switch (view) {
      case "day":
        setCurrentDate(direction === "next" ? addDays(currentDate, 1) : subDays(currentDate, 1))
        break
      case "week":
        setCurrentDate(direction === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
        break
      case "month":
        setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
        break
      case "year":
        setCurrentDate(direction === "next" ? addYears(currentDate, 1) : subYears(currentDate, 1))
        break
    }
  }

  const getDateRangeText = () => {
    switch (view) {
      case "day":
        return format(currentDate, "MMMM d, yyyy")
      case "week":
        const weekStart = startOfWeek(currentDate)
        const weekEnd = endOfWeek(currentDate)
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`
      case "month":
        return format(currentDate, "MMMM yyyy")
      case "year":
        return format(currentDate, "yyyy")
      default:
        return ""
    }
  }

  const renderView = () => {
    const viewProps = {
      date: currentDate,
      selectedDate,
      events: sampleEvents,
      onDateSelect: handleDateSelect
    };

    switch (view) {
      case "day":
        return <DayView {...viewProps} />
      case "week":
        return <WeekView {...viewProps} />
      case "month":
        return <CalendarGrid {...viewProps} />
      case "year":
        return <YearView {...viewProps} />
      default:
        return null
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col bg-black text-white"
    >
      <motion.header 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex items-center justify-between border-b border-gray-800 px-6 py-3"
      >
        <div className="flex items-center gap-4">
          <motion.h1 
            layout
            className="text-xl font-semibold min-w-[200px]"
          >
            {getDateRangeText()}
          </motion.h1>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex">
            {["day", "week", "month", "year"].map((v) => (
              <motion.div
                key={v}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={view === v ? "secondary" : "ghost"}
                  className="text-sm"
                  onClick={() => setView(v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              </motion.div>
            ))}
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search"
              className="w-64 pl-8"
            />
          </motion.div>
        </div>
      </motion.header>
      <motion.main 
        layout
        className="flex-1 overflow-auto p-6 bg-black"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${view}-${currentDate.toString()}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </motion.div>
  )
}
