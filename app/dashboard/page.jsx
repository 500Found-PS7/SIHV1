"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import ChartComponent from "../chart/ChartComponent";
import AdditionalInsightsChart from "../chart/AdditionalInsightsChart";
import LongTermForecastChart from "../chart/LongTermForecastChart";
import { motion } from "framer-motion";
import { DateTimeRangePicker } from "@/components/ui/date-time-range";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
import { globeConfig, sampleArcs } from "@/app/component/globeConfig";
import { 
  Battery, 
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Globe as GlobeIcon
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, addHours } from "date-fns";
import { cn } from "@/lib/utils";

// Dynamically import the Globe component with SSR disabled
const World = dynamic(
  () => import('@/components/ui/globe').then((mod) => mod.World),
  { ssr: false }
);

const DashboardCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <Card className="relative p-6 bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border-0 overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
        {trend && (
          <div className="flex items-center mt-2">
            {trend === "up" ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-500" />
            )}
            <span className={`text-sm font-medium ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
      <div className="p-3 rounded-xl bg-gradient-to-br from-[#2C2C2E] to-[#3C3C3E]">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
    </div>
  </Card>
);

const TimeDisplay = () => {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-zinc-400" />
        <span className="text-lg font-medium text-white">--:--:--</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-5 h-5 text-blue-400" />
      <span className="text-lg font-medium text-white">
        {format(time, 'HH:mm:ss')}
      </span>
    </div>
  );
};

export default function DashboardPage() {
  // Initialize dates properly
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  });
  const [viewType, setViewType] = useState('5min');
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedArea, setSelectedArea] = useState(null);

  // Update date range based on view type
  useEffect(() => {
    const now = new Date();
    now.setMilliseconds(0); // Ensure consistent milliseconds
    
    switch(viewType) {
      case '5min':
        // Keep current selection
        break;
      case 'weekly':
        const weekStart = new Date(now);
        weekStart.setHours(0, 0, 0, 0);
        setStartDate(subDays(weekStart, 7));
        setEndDate(now);
        break;
      case 'monthly':
        setStartDate(startOfMonth(now));
        setEndDate(endOfMonth(now));
        break;
    }
  }, [viewType]);

  const handleStartDateChange = (date) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setSeconds(0, 0); // Reset seconds and milliseconds
      setStartDate(newDate);
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setSeconds(0, 0); // Reset seconds and milliseconds
      setEndDate(newDate);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(sectionId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="relative">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-zinc-400 font-medium">System Active</p>
            </div>
            <div className="w-px h-4 bg-zinc-800" />
            <TimeDisplay />
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-6">
          <Button 
            onClick={() => scrollToSection('overview')}
            className={cn(
              "bg-slate-900/80 hover:bg-slate-800/80 text-white transition-all duration-300",
              activeSection === 'overview' && "bg-blue-600/30 hover:bg-blue-600/40"
            )}
          >
            Overview
          </Button>
          <Button 
            onClick={() => scrollToSection('globe-view')}
            className={cn(
              "bg-slate-900/80 hover:bg-slate-800/80 text-white transition-all duration-300",
              activeSection === 'globe-view' && "bg-blue-600/30 hover:bg-blue-600/40"
            )}
          >
            <GlobeIcon className="w-4 h-4 mr-2" />
            Globe View
          </Button>
          <Button 
            onClick={() => scrollToSection('detailed-analysis')}
            className={cn(
              "bg-slate-900/80 hover:bg-slate-800/80 text-white transition-all duration-300",
              activeSection === 'detailed-analysis' && "bg-blue-600/30 hover:bg-blue-600/40"
            )}
          >
            Detailed Analysis
          </Button>
        </div>
      </div>

      {/* Overview Section */}
      <div id="overview">
        {/* Main Chart Section */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border-0">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Current Load Distribution</h3>
            <div className="mt-4">
              <DateTimeRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
              />
            </div>
          </div>
          <ChartComponent 
            startDate={startDate}
            endDate={endDate}
            viewType={viewType}
            onViewChange={setViewType}
          />
        </Card>
      </div>


      {/* Detailed Analysis Section */}
      <div id="detailed-analysis" className="grid gap-6">
        <div className="grid gap-6 grid-cols-1">
          {/* Short Term and Long Term Forecasts */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="p-6 bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border-0">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Short-term Forecast</h3>
                <p className="text-sm text-zinc-400 mt-1">Next 7 days prediction</p>
              </div>
              <ChartComponent chartType="shortTerm" />
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border-0">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Long-term Forecast</h3>
                <p className="text-sm text-zinc-400 mt-1">Monthly prediction trend</p>
              </div>
              <LongTermForecastChart date={selectedDate} />
            </Card>
          </div>

        

          {/* Influencing Factors */}
          <Card className="p-6 bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border-0">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Influencing Factors</h3>
              <p className="text-sm text-zinc-400 mt-1">Key factors affecting load patterns</p>
            </div>
            <AdditionalInsightsChart />
          </Card>

          {/* Daily Load Forecast */}
          <Card className="p-6 bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border-0">
            <h3 className="text-xl font-bold text-white mb-6">Daily Load Forecast</h3>
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Morning Peak", value: "20.5 MW", time: "06:00 - 09:00" },
                { label: "Afternoon Peak", value: "21.2 MW", time: "12:00 - 15:00" },
                { label: "Evening Peak", value: "22.8 MW", time: "18:00 - 21:00" },
                { label: "Night Load", value: "17.5 MW", time: "22:00 - 05:00" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-br from-[#2C2C2E] to-[#3C3C3E] hover:from-[#3C3C3E] hover:to-[#4C4C4E] transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-zinc-400 font-medium">{item.label}</span>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                  <p className="text-xs text-zinc-500">{item.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
} 