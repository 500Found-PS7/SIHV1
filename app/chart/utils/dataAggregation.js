import { format } from "date-fns";

export function aggregateWeeklyData(weekData) {
  return weekData.map(day => {
    const avgValues = calculateDayAverages(day.data);
    return {
      date: format(day.date, 'EEE dd/MM'),
      ...avgValues
    };
  });
}

export function aggregateMonthlyData(monthData) {
  return monthData.map(day => {
    const avgValues = calculateDayAverages(day.data);
    return {
      date: format(day.date, 'dd/MM'),
      ...avgValues
    };
  });
}

export function calculateDayAverages(dayData) {
  if (!dayData || dayData.length === 0) return {};
  
  const sum = dayData.reduce((acc, curr) => ({
    load: acc.load + curr.load,
    brpl: acc.brpl + curr.brpl,
    bypl: acc.bypl + curr.bypl,
    ndpl: acc.ndpl + curr.ndpl,
    ndmc: acc.ndmc + curr.ndmc,
    mes: acc.mes + curr.mes
  }), { load: 0, brpl: 0, bypl: 0, ndpl: 0, ndmc: 0, mes: 0 });

  const count = dayData.length;
  return {
    load: Math.round(sum.load / count),
    brpl: Math.round(sum.brpl / count),
    bypl: Math.round(sum.bypl / count),
    ndpl: Math.round(sum.ndpl / count),
    ndmc: Math.round(sum.ndmc / count),
    mes: Math.round(sum.mes / count)
  };
} 