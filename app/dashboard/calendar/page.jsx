"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/app/component/calendar/calendar";
import { DayView } from "@/app/component/calendar/day-view";
import { WeekView } from "@/app/component/calendar/week-view";
import { YearView } from "@/app/component/calendar/year-view";
import { CalendarDays, Calendar as CalendarIcon, CalendarRange } from "lucide-react";

const viewOptions = [
  { id: "day", label: "Day", icon: CalendarIcon },
  { id: "week", label: "Week", icon: CalendarRange },
  { id: "year", label: "Year", icon: CalendarDays },
];

// Sample events data
const events = [
  {
    id: 1,
    title: "Peak Load Expected",
    date: new Date(),
    time: "14:00",
    type: "meeting",
  },
  {
    id: 2,
    title: "Maintenance Window",
    date: new Date(),
    time: "16:00",
    type: "festival",
  },
  // Add more events as needed
];

export default function CalendarPage() {
  const [view, setView] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderView = () => {
    switch (view) {
      case "day":
        return <DayView date={selectedDate} events={events} />;
      case "week":
        return <WeekView date={selectedDate} events={events} />;
      case "year":
        return <YearView date={selectedDate} events={events} />;
      default:
        return <DayView date={selectedDate} events={events} />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Calendar</h2>
        <p className="text-zinc-400">View and manage load events</p>
      </div>

      <Card className="p-6 bg-[#1C1C1E] border-0">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {viewOptions.map((option) => (
              <Button
                key={option.id}
                onClick={() => setView(option.id)}
                variant={view === option.id ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <option.icon className="w-4 h-4" />
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-[300px,1fr]">
          <Card className="p-4 bg-[#2C2C2E] border-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
            />
          </Card>
          <Card className="p-4 bg-[#2C2C2E] border-0">
            {renderView()}
          </Card>
        </div>
      </Card>
    </div>
  );
} 