import React, { useMemo } from "react";
import { useRouter } from 'next/navigation';
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
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { format } from 'date-fns';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const generateRandomData = (date) => {
  const seed = date.getTime();
  const random = (min, max, seed) => {
    const x = Math.sin(seed) * 10000;
    return ((x - Math.floor(x)) * (max - min) + min);
  };

  return Array.from({ length: 24 }, (_, hour) => {
    // Duck curve characteristics
    let baseLoad;
    if (hour >= 0 && hour < 4) {
      // Early morning - low demand
      baseLoad = 10000 + random(-500, 500, seed + hour);
    } else if (hour >= 4 && hour < 7) {
      // Morning ramp up
      baseLoad = 10000 + (hour - 4) * 1500 + random(-300, 300, seed + hour);
    } else if (hour >= 7 && hour < 16) {
      // Daytime solar generation causing "belly" of duck
      const solarEffect = Math.sin((hour - 7) * Math.PI / 9) * 3000;
      baseLoad = 14500 - solarEffect + random(-500, 500, seed + hour);
    } else if (hour >= 16 && hour < 20) {
      // Evening ramp (neck of the duck)
      const rampSeverity = (hour - 16) / 4; // 0 to 1
      baseLoad = 14000 + rampSeverity * 3000 + random(-300, 300, seed + hour);
    } else {
      // Late evening decline
      const decline = (hour - 20) / 4; // 0 to 1
      baseLoad = 17000 - decline * 7000 + random(-500, 500, seed + hour);
    }

    // Solar generation
    const solarHour = hour >= 6 && hour <= 18;
    const solarPeak = Math.sin((hour - 6) * Math.PI / 12);
    const solarOutput = solarHour ? 6000 * solarPeak * random(0.8, 1.2, seed + hour + 24) : 0;

    // Final load calculation
    const load = Math.round(baseLoad);

    return {
      time: `${hour}:00`,
      load,
      solar: Math.round(solarOutput),
      isOverload: load > 15000
    };
  });
};

export default function CurrentLoadChart({ date }) {
  const router = useRouter();
  const newDelhiDuckCurveData = useMemo(() => generateRandomData(date), [date]);
  const averageLoad = Math.round(newDelhiDuckCurveData.reduce((sum, data) => sum + data.load, 0) / newDelhiDuckCurveData.length);
  const overloadTimes = newDelhiDuckCurveData.filter(data => data.isOverload);

  const handleResolve = (time, load) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    router.push(`/resolve?date=${formattedDate}&time=${time}&load=${load}`);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full h-full"
    >
      <motion.h2 
        className="text-center text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-white"
        variants={itemVariants}
      >
        Electricity Load - Duck Curve Effect
      </motion.h2>
      <motion.p 
        className="text-center text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-white"
        variants={itemVariants}
      >
        Average Load: {averageLoad} MW
      </motion.p>
      
      {overloadTimes.length > 0 && (
        <motion.div 
          className="mb-4 p-4 border-2 border-red-500 rounded-lg"
          variants={itemVariants}
        >
          <h3 className="text-lg font-bold text-white mb-2">Peak Load Times</h3>
          <div className="grid gap-2">
            {overloadTimes.map((data, index) => (
              <div key={index} className="flex items-center justify-between bg-red-500/10 p-2 rounded">
                <div>
                  <span className="text-white font-medium">{data.time}</span>
                  <span className="ml-4 text-red-400">{data.load} MW</span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleResolve(data.time, data.load)}
                >
                  Resolve
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      
      <motion.div 
        className="w-full"
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
      >
        <ResponsiveContainer width="100%" height={400} minWidth={300}>
          <LineChart data={newDelhiDuckCurveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="time" stroke="#fff" />
            <YAxis yAxisId="left" stroke="#fff" />
            <YAxis yAxisId="right" orientation="right" stroke="#fff" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#333', 
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <ReferenceLine y={15000} yAxisId="left" stroke="#ff4d4f" strokeDasharray="3 3" label={{ value: "Threshold (15000 MW)", fill: "#ff4d4f", position: "right" }} />
            {overloadTimes.map((data, index) => (
              <ReferenceArea
                key={index}
                x1={data.time}
                x2={data.time}
                yAxisId="left"
                fill="#ff4d4f"
                fillOpacity={0.1}
              />
            ))}
            <Line 
              type="monotone" 
              dataKey="load" 
              yAxisId="left"
              name="Load (MW)"
              stroke="#8884d8" 
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.isOverload) {
                  return (
                    <svg x={cx - 5} y={cy - 5} width={10} height={10}>
                      <circle cx="5" cy="5" r="4" fill="#ff4d4f" stroke="#fff" />
                    </svg>
                  );
                }
                return null;
              }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="solar" 
              yAxisId="right"
              name="Solar Generation (W)"
              stroke="#ffc658" 
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}

