import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea
} from "recharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { format, addMinutes, parseISO, differenceInMinutes } from "date-fns";

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

// Generate 5-minute interval data
const generate5MinData = (startDate, endDate, seed = Date.now()) => {
  const minutesDiff = differenceInMinutes(endDate, startDate);
  const intervals = Math.floor(minutesDiff / 5);
  
  const random = (min, max, seed) => {
    const x = Math.sin(seed) * 10000;
    return ((x - Math.floor(x)) * (max - min) + min);
  };

  return Array.from({ length: intervals }, (_, index) => {
    const currentTime = addMinutes(startDate, index * 5);
    const hour = currentTime.getHours();
    
    // Base load calculation similar to duck curve
    let baseLoad;
    if (hour >= 0 && hour < 4) {
      baseLoad = 10000 + random(-500, 500, seed + index);
    } else if (hour >= 4 && hour < 7) {
      baseLoad = 10000 + (hour - 4) * 1500 + random(-300, 300, seed + index);
    } else if (hour >= 7 && hour < 16) {
      const solarEffect = Math.sin((hour - 7) * Math.PI / 9) * 3000;
      baseLoad = 14500 - solarEffect + random(-500, 500, seed + index);
    } else if (hour >= 16 && hour < 20) {
      const rampSeverity = (hour - 16) / 4;
      baseLoad = 14000 + rampSeverity * 3000 + random(-300, 300, seed + index);
    } else {
      const decline = (hour - 20) / 4;
      baseLoad = 17000 - decline * 7000 + random(-500, 500, seed + index);
    }

    // Solar generation
    const solarHour = hour >= 6 && hour <= 18;
    const solarPeak = Math.sin((hour - 6) * Math.PI / 12);
    const solarOutput = solarHour ? 6000 * solarPeak * random(0.8, 1.2, seed + index + 24) : 0;

    return {
      time: format(currentTime, 'HH:mm'),
      timestamp: currentTime.toISOString(),
      load: Math.round(baseLoad),
      solar: Math.round(solarOutput),
      isOverload: baseLoad > 15000
    };
  });
};

const aggregateData = (data, viewType) => {
  if (viewType === '5min') return data;

  const aggregated = data.reduce((acc, entry) => {
    const date = parseISO(entry.timestamp);
    const key = viewType === 'weekly' 
      ? format(date, 'yyyy-MM-dd')
      : format(date, 'yyyy-MM');

    if (!acc[key]) {
      acc[key] = {
        timestamp: entry.timestamp,
        load: entry.load,
        solar: entry.solar,
        count: 1,
        maxLoad: entry.load,
        minLoad: entry.load
      };
    } else {
      acc[key].load += entry.load;
      acc[key].solar += entry.solar;
      acc[key].count += 1;
      acc[key].maxLoad = Math.max(acc[key].maxLoad, entry.load);
      acc[key].minLoad = Math.min(acc[key].minLoad, entry.load);
    }
    return acc;
  }, {});

  return Object.values(aggregated).map(entry => ({
    ...entry,
    load: Math.round(entry.load / entry.count),
    solar: Math.round(entry.solar / entry.count),
    isOverload: entry.maxLoad > 15000
  }));
};

// Generate prediction data for short-term forecast
const generatePredictionData = (lastDataPoint, hoursAhead = 24) => {
  const predictions = [];
  const baseLoad = lastDataPoint.load;
  const startTime = parseISO(lastDataPoint.timestamp);

  for (let i = 1; i <= hoursAhead * 12; i++) { // 5-minute intervals for 24 hours
    const currentTime = addMinutes(startTime, i * 5);
    const hour = currentTime.getHours();
    
    // Prediction algorithm with uncertainty
    let predictedLoad = baseLoad;
    
    // Add time-of-day effect
    if (hour >= 6 && hour < 10) { // Morning ramp
      predictedLoad *= 1.2;
    } else if (hour >= 10 && hour < 16) { // Midday solar dip
      predictedLoad *= 0.85;
    } else if (hour >= 16 && hour < 20) { // Evening peak
      predictedLoad *= 1.3;
    } else { // Night time
      predictedLoad *= 0.7;
    }

    // Add some randomness for uncertainty
    const uncertainty = (Math.random() - 0.5) * 0.1 * predictedLoad;
    predictedLoad += uncertainty;

    predictions.push({
      time: format(currentTime, 'HH:mm'),
      timestamp: currentTime.toISOString(),
      load: Math.round(predictedLoad),
      isPrediction: true,
      uncertainty: Math.abs(uncertainty)
    });
  }

  return predictions;
};

export default function ChartComponent({ 
  startDate, 
  endDate, 
  viewType = '5min',
  chartType,
  onViewChange 
}) {
  const [data, setData] = useState([]);
  const [predictionData, setPredictionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      if (chartType === "shortTerm") {
        // For short-term prediction, generate last 6 hours of historical data
        const historicalEnd = new Date();
        const historicalStart = addMinutes(historicalEnd, -360); // 6 hours ago
        const historicalData = generate5MinData(historicalStart, historicalEnd);
        
        // Generate 24 hours of prediction data
        const predictions = generatePredictionData(historicalData[historicalData.length - 1]);
        
        // Combine historical and prediction data
        setData([...historicalData, ...predictions]);
      } else {
        const rawData = generate5MinData(startDate, endDate);
        const processedData = aggregateData(rawData, viewType);
        setData(processedData);
      }
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, viewType, chartType]);

  const formatXAxis = (timestamp) => {
    if (chartType === "shortTerm") {
      return format(parseISO(timestamp), 'HH:mm');
    }
    switch(viewType) {
      case '5min':
        return format(parseISO(timestamp), 'HH:mm');
      case 'weekly':
        return format(parseISO(timestamp), 'EEE');
      case 'monthly':
        return format(parseISO(timestamp), 'MMM d');
      default:
        return timestamp;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      {/* View Selection Buttons - Only show if not short term prediction */}
      {!chartType && (
        <div className="flex gap-2">
          <Button
            onClick={() => onViewChange('5min')}
            className={`${viewType === '5min' ? 'bg-blue-500' : 'bg-blue-500/20'} hover:bg-blue-500/30 text-white`}
          >
            5 Min
          </Button>
          <Button
            onClick={() => onViewChange('weekly')}
            className={`${viewType === 'weekly' ? 'bg-blue-500' : 'bg-blue-500/20'} hover:bg-blue-500/30 text-white`}
          >
            Weekly
          </Button>
          <Button
            onClick={() => onViewChange('monthly')}
            className={`${viewType === 'monthly' ? 'bg-blue-500' : 'bg-blue-500/20'} hover:bg-blue-500/30 text-white`}
          >
            Monthly
          </Button>
        </div>
      )}

      {/* Chart */}
      <motion.div 
        variants={itemVariants}
        className="w-full"
        whileHover={{ scale: 1.01 }}
      >
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#fff"
              tickFormatter={formatXAxis}
            />
            <YAxis 
              stroke="#fff"
              label={{ 
                value: 'Load (MW)', 
                angle: -90, 
                position: 'insideLeft', 
                fill: '#fff' 
              }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#333', 
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              labelFormatter={(timestamp) => format(parseISO(timestamp), 'MMM d, yyyy HH:mm')}
            />
            <Legend />
            <ReferenceLine 
              y={15000} 
              stroke="#ff4d4f" 
              strokeDasharray="3 3" 
              label={{ value: "Threshold (15000 MW)", fill: "#ff4d4f", position: "right" }} 
            />
            
            {/* Historical Data Line */}
            <Line
              type="monotone"
              dataKey="load"
              stroke={chartType === "shortTerm" ? "#8884d8" : "#8884d8"}
              name={chartType === "shortTerm" ? "Historical Load" : "Load"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            {/* Solar Line */}
            <Line
              type="monotone"
              dataKey="solar"
              stroke="#ffd700"
              name="Solar Generation"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            {/* Prediction Line (only for short-term) */}
            {chartType === "shortTerm" && (
              <Line
                type="monotone"
                dataKey="load"
                stroke="#4CAF50"
                name="Predicted Load"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                strokeDasharray="5 5"
                connectNulls
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}