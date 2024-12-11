import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchLoadData } from "@/lib/utils/loadData";
import { LoadingSpinner } from "./components/shared/LoadingSpinner";
import { ErrorDisplay } from "./components/shared/ErrorDisplay";
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval 
} from "date-fns";

import { DateControls } from "./components/controls/DateControls";
import { TimeNavigation } from "./components/controls/TimeNavigation";
import { ViewControls } from "./components/controls/ViewControls";
import { LoadChart } from "./components/chart/LoadChart";
import { TableView } from "./components/tables/TableView";
import { LoadStats } from "./components/stats/LoadStats";
import { 
  aggregateWeeklyData, 
  aggregateMonthlyData 
} from "./utils/dataAggregation";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

export default function ChartComponent({ 
  startDate, 
  endDate, 
  viewType = '5min',
  chartType,
  onViewChange 
}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(startDate);
  const [aggregatedData, setAggregatedData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  // Add fetchAndProcessData function
  const fetchAndProcessData = async () => {
    let fetchedData = [];

    if (viewType === 'weekly') {
      // Fetch data for each day of the week
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = endOfWeek(selectedDate);
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      for (const day of days) {
        const dayData = await fetchLoadData(day);
        fetchedData.push({
          date: day,
          data: dayData
        });
      }

      // Aggregate weekly data
      const weeklyData = aggregateWeeklyData(fetchedData);
      setAggregatedData(weeklyData);
      
    } else if (viewType === 'monthly') {
      // Fetch data for each day of the month
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      for (const day of days) {
        const dayData = await fetchLoadData(day);
        fetchedData.push({
          date: day,
          data: dayData
        });
      }

      // Aggregate monthly data
      const monthlyData = aggregateMonthlyData(fetchedData);
      setAggregatedData(monthlyData);

    } else {
      // Default 5min view with interpolated data
      const dailyData = await fetchLoadData(selectedDate, viewType);
      setData(dailyData);
    }
  };

  useEffect(() => {
    setSelectedDate(startDate);
  }, [startDate]);

  useEffect(() => {
    async function loadData() {
      if (!selectedDate) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        await fetchAndProcessData();
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to fetch load data');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [selectedDate, viewType]);

  const handleTimeChange = (hours) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(newDate.getHours() + hours);
    setSelectedDate(newDate);
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => handleDateChange(0)} />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4 text-white"
    >
      <DateControls 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
      />

      <LoadStats 
        data={viewType === 'hourly' 
          ? data.filter(row => row.time.endsWith(':00'))
          : viewType === '5min' 
            ? data 
            : aggregatedData
        } 
      />

      {viewType === '5min' && (
        <TimeNavigation onTimeChange={handleTimeChange} />
      )}

      <ViewControls 
        viewType={viewType}
        onViewChange={onViewChange}
        showTable={showTable}
        onToggleTable={() => setShowTable(!showTable)}
      />

      {showTable ? (
        <TableView 
          viewType={viewType} 
          data={data} 
          aggregatedData={aggregatedData} 
        />
      ) : (
        <LoadChart 
          data={data} 
          viewType={viewType} 
          itemVariants={itemVariants}
          aggregatedData={aggregatedData}
        />
      )}
    </motion.div>
  );
}