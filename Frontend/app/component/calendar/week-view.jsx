import { motion } from "framer-motion"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

export function WeekView({ date, events }) {
  const weekStart = startOfWeek(date)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="flex flex-col bg-[#1C1C1E]">
      <div className="flex border-b border-[#2C2C2E]">
        <div className="w-20" />
        {weekDays.map((day, index) => (
          <motion.div
            key={day.toString()}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex-1 text-center py-2 text-[#FFFFFF]"
          >
            <div className="text-sm font-medium">
              {format(day, "EEE")}
            </div>
            <div className="text-sm text-[#98989D]">
              {format(day, "d")}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col">
        {hours.map((hour) => {
          const timeString = `${hour.toString().padStart(2, '0')}:00`

          return (
            <motion.div
              key={hour}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: hour * 0.01 }}
              className="group flex min-h-[60px]"
            >
              <div className="w-20 py-2 text-sm text-[#98989D]">
                {timeString}
              </div>
              <div className="flex flex-1">
                {weekDays.map((day) => {
                  const dayEvents = events.filter(event => {
                    if (!event.time) return false
                    const [eventHour] = event.time.split(':')
                    return isSameDay(event.date, day) && parseInt(eventHour) === hour
                  })

                  return (
                    <motion.div
                      key={day.toString()}
                      className={cn(
                        "flex-1 border-l border-[#2C2C2E] pl-2 py-1",
                        "group-hover:bg-[#2C2C2E]/50 transition-colors duration-200"
                      )}
                    >
                      {dayEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ 
                            scale: 1.02,
                            transition: { duration: 0.2 }
                          }}
                          className={cn(
                            "rounded px-2 py-1 mb-1 cursor-pointer text-xs",
                            event.type === "festival" && "bg-[#32D74B]/20 text-[#32D74B]",
                            event.type === "birthday" && "bg-[#BF5AF2]/20 text-[#BF5AF2]",
                            event.type === "meeting" && "bg-[#0A84FF]/20 text-[#0A84FF]"
                          )}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="opacity-75">{event.time}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
} 