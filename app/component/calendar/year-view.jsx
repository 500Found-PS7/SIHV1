import { motion } from "framer-motion"
import { format, addMonths, startOfYear, endOfMonth, isSameMonth, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

export function YearView({ date, events }) {
  const yearStart = startOfYear(date)
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i))
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="grid grid-cols-3 gap-6">
      {months.map((month, monthIndex) => {
        const monthEvents = events.filter(event => isSameMonth(event.date, month))
        const daysInMonth = Array.from(
          { length: endOfMonth(month).getDate() },
          (_, i) => i + 1
        )

        return (
          <motion.div
            key={month.toString()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: monthIndex * 0.05 }}
            className="rounded-lg border border-[#2C2C2E] p-4 hover:shadow-lg transition-shadow bg-[#1C1C1E]"
          >
            <motion.h3 
              className="text-sm font-medium mb-2 text-[#FFFFFF]"
              whileHover={{ scale: 1.05 }}
            >
              {format(month, "MMMM")}
            </motion.h3>
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {weekDays.map((day, index) => (
                <div key={`${monthIndex}-${day}-${index}`} className="text-xs text-[#98989D]">
                  {day[0]}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array(new Date(month.getFullYear(), month.getMonth(), 1).getDay())
                .fill(null)
                .map((_, i) => (
                  <div key={`empty-${monthIndex}-${i}`} />
                ))}
              {daysInMonth.map((day) => {
                const currentDate = new Date(
                  month.getFullYear(),
                  month.getMonth(),
                  day
                )
                const hasEvents = events.some((event) =>
                  isSameDay(event.date, currentDate)
                )

                return (
                  <motion.div
                    key={`${monthIndex}-${day}`}
                    whileHover={{ scale: 1.2 }}
                    className={cn(
                      "text-xs aspect-square flex items-center justify-center rounded-full text-[#FFFFFF]",
                      hasEvents && "bg-[#0A84FF]/10 text-[#0A84FF] font-medium"
                    )}
                  >
                    {day}
                  </motion.div>
                )
              })}
            </div>
            {monthEvents.length > 0 && (
              <div className="mt-2 space-y-1">
                {monthEvents.map((event) => (
                  <motion.div
                    key={`${monthIndex}-${event.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    className={cn(
                      "text-xs rounded px-1.5 py-0.5 cursor-pointer",
                      event.type === "festival" && "bg-[#32D74B]/20 text-[#32D74B]",
                      event.type === "birthday" && "bg-[#BF5AF2]/20 text-[#BF5AF2]",
                      event.type === "meeting" && "bg-[#0A84FF]/20 text-[#0A84FF]"
                    )}
                  >
                    {format(event.date, "d")} - {event.title}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
} 