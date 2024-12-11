import { addDays, format, startOfWeek, isToday } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function CalendarGrid({ date, selectedDate, events = [], onDateSelect }) {
  const startDate = startOfWeek(date)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <motion.div 
      layout
      className="grid grid-cols-7 gap-px bg-[#1C1C1E]"
    >
      {weekDays.map((day) => (
        <motion.div
          key={day}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#2C2C2E] p-2 text-sm font-medium text-[#98989D]"
        >
          {day}
        </motion.div>
      ))}
      {Array.from({ length: 42 }).map((_, i) => {
        const currentDate = addDays(startDate, i)
        const dayEvents = events.filter(
          (event) =>
            format(event.date, "yyyy-MM-dd") ===
            format(currentDate, "yyyy-MM-dd")
        )
        const isCurrentMonth = format(currentDate, "MM") === format(date, "MM")
        const isSelected = selectedDate && format(currentDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
        const isTodayDate = isToday(currentDate)

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
              }
            }}
            className={cn(
              "relative min-h-[120px] p-2 transition-all duration-200 cursor-pointer overflow-hidden",
              isCurrentMonth ? "bg-[#0d0d0d]" : "bg-[#1a1a1a]",
              isSelected 
                ? "bg-[#0A84FF]/10 ring-2 ring-[#0A84FF]" 
                : "hover:bg-[#2C2C2E]",
              isTodayDate && !isSelected && "ring-2 ring-[#FF453A]"
            )}
            onClick={() => onDateSelect && onDateSelect(currentDate)}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={`date-${isSelected}`}
                initial={{ scale: 0.9 }}
                animate={{ 
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }
                }}
                exit={{ scale: 0.9 }}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors",
                  isCurrentMonth ? "text-[#FFFFFF] font-medium" : "text-[#666666]",
                  dayEvents.length > 0 && !isSelected && !isTodayDate && "bg-[#0A84FF]/20 text-[#0A84FF]",
                  isSelected && "bg-[#0A84FF] text-white",
                  isTodayDate && !isSelected && "bg-[#FF453A]/20 text-[#FF453A]"
                )}
              >
                {format(currentDate, "d")}
              </motion.div>
            </AnimatePresence>
            <motion.div 
              className="mt-1 space-y-1"
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {dayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { 
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  className={cn(
                    "cursor-pointer rounded px-1.5 py-0.5 text-xs transition-all",
                    event.type === "festival" && "bg-[#32D74B]/20 text-[#32D74B] hover:bg-[#32D74B]/30",
                    event.type === "birthday" && "bg-[#BF5AF2]/20 text-[#BF5AF2] hover:bg-[#BF5AF2]/30",
                    event.type === "meeting" && "bg-[#0A84FF]/20 text-[#0A84FF] hover:bg-[#0A84FF]/30"
                  )}
                >
                  {event.time && <span className="mr-1">{event.time}</span>}
                  {event.title}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
