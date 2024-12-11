import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export function LoadChart({ data, viewType, itemVariants, aggregatedData }) {
  // Filter hourly data if needed
  const chartData = viewType === 'hourly' 
    ? data.filter(row => row.time.endsWith(':00'))
    : viewType === '5min' 
      ? data 
      : aggregatedData;

  return (
    <motion.div 
      variants={itemVariants}
      className="w-full"
      whileHover={{ scale: 1.01 }}
    >
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis 
            dataKey={viewType === '5min' || viewType === 'hourly' ? "time" : "date"}
            stroke="#fff"
            angle={viewType === '5min' ? 0 : -45}
            textAnchor="end"
            height={60}
            interval={viewType === 'hourly' ? 0 : 'preserveStartEnd'}
            tick={{ fill: '#fff' }}
          />
          <YAxis 
            stroke="#fff"
            label={{ 
              value: 'Load (MW)', 
              angle: -90, 
              position: 'insideLeft', 
              fill: '#fff' 
            }}
            tick={{ fill: '#fff' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#333', 
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              color: '#fff'
            }}
          />
          <Legend />
          
          <Line
            type="monotone"
            dataKey="load"
            stroke="#8884d8"
            name="Total Load"
            strokeWidth={2}
            dot={viewType !== '5min'}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="brpl"
            stroke="#82ca9d"
            name="BRPL"
            strokeWidth={1}
            dot={viewType !== '5min'}
          />
          <Line
            type="monotone"
            dataKey="bypl"
            stroke="#ffc658"
            name="BYPL"
            strokeWidth={1}
            dot={viewType !== '5min'}
          />
          <Line
            type="monotone"
            dataKey="ndpl"
            stroke="#ff8042"
            name="NDPL"
            strokeWidth={1}
            dot={viewType !== '5min'}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
} 