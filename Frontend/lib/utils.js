import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Constants
export const PEAK_THRESHOLD = 15000; // MW
export const PEAK_HOURS_MORNING = { start: 9, end: 12 };
export const PEAK_HOURS_EVENING = { start: 18, end: 21 };

// Shared load calculation function
export function calculateLoadForHour(hour, date) {
  const isHighDemand = (hour >= PEAK_HOURS_MORNING.start && hour <= PEAK_HOURS_MORNING.end) || 
                      (hour >= PEAK_HOURS_EVENING.start && hour <= PEAK_HOURS_EVENING.end);
  
  // Base load varies by time of day using a sine wave pattern
  const baseLoad = 13000 + Math.sin(hour * Math.PI / 12) * 3000;
  
  // Add peak demand
  const peakLoad = isHighDemand ? 2000 : 0;
  
  // Add day-of-week factor (higher on weekdays)
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const weekendReduction = isWeekend ? 0.85 : 1;
  
  return Math.round((baseLoad + peakLoad) * weekendReduction);
}

// Calculate price based on load
export function calculatePriceForLoad(load, daysToTarget = 0) {
  const basePrice = 3 + (load > PEAK_THRESHOLD ? 2 : 0) + (load / PEAK_THRESHOLD);
  
  // Term ahead price is 95% of base price
  const termAheadPrice = Number((basePrice * 0.95).toFixed(2));
  
  // Future price increases by 10% per day
  const futureFactor = 1 + (daysToTarget * 0.1);
  const realTimePrice = Number((termAheadPrice * futureFactor).toFixed(2));
  
  return {
    termAheadPrice,
    realTimePrice,
    saving: Number((realTimePrice - termAheadPrice).toFixed(2))
  };
}

// Generate hourly data for a specific date
export function generateHourlyData(targetDate, baseDate = new Date()) {
  const daysToTarget = Math.round((targetDate - baseDate) / (1000 * 60 * 60 * 24));
  const data = [];

  for (let hour = 0; hour < 24; hour++) {
    const load = calculateLoadForHour(hour, targetDate);
    const prices = calculatePriceForLoad(load, daysToTarget);
    
    data.push({
      timeSlot: `${hour.toString().padStart(2, '0')}:00`,
      load,
      ...prices
    });
  }

  return data;
}

// Calculate daily statistics
export function calculateDailyStats(data) {
  const totalLoad = data.reduce((sum, item) => sum + item.load, 0);
  const peakLoad = Math.max(...data.map(item => item.load));
  const avgLoad = Math.round(totalLoad / data.length);
  
  const avgTermAhead = Number((data.reduce((sum, item) => sum + item.termAheadPrice, 0) / data.length).toFixed(2));
  const avgRealTime = Number((data.reduce((sum, item) => sum + item.realTimePrice, 0) / data.length).toFixed(2));
  
  const totalSavings = data.reduce((total, slot) => {
    return total + (slot.saving * (slot.load / 1000));
  }, 0);

  return {
    totalLoad,
    peakLoad,
    avgLoad,
    avgTermAhead,
    avgRealTime,
    totalSavings: Math.round(totalSavings)
  };
}
