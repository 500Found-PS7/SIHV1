import { DailyTable } from "./DailyTable";
import { HourlyTable } from "./HourlyTable";
import { WeeklyTable } from "./WeeklyTable";
import { MonthlyTable } from "./MonthlyTable";

export function TableView({ viewType, data, aggregatedData }) {
  switch (viewType) {
    case '5min':
      return <DailyTable data={data} />;
    case 'hourly':
      return <HourlyTable data={data} />;
    case 'weekly':
      return <WeeklyTable data={aggregatedData} />;
    case 'monthly':
      return <MonthlyTable data={aggregatedData} />;
    default:
      return <DailyTable data={data} />;
  }
} 