"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { World } from "@/components/ui/globe";
import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";
import { globeConfig, sampleArcs } from "@/app/component/globeConfig";

export default function GlobePage() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Globe View</h1>
          <p className="text-zinc-400 mt-1">Interactive 3D visualization of global load distribution</p>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#2C2C2E] to-[#3C3C3E]">
          <Globe2 className="w-6 h-6 text-emerald-500" />
        </div>
      </div>

      {/* Main Globe Card */}
      <Card className="p-6 bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border-0">
        <div className="h-[800px] w-full relative bg-[#0B1120] rounded-lg overflow-hidden">
          <World 
            globeConfig={globeConfig}
            data={sampleArcs}
            onLocationSelect={setSelectedLocation}
          />
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Morning Peak", value: "20.5 MW", time: "06:00 - 09:00", change: "+2.3%" },
          { label: "Afternoon Peak", value: "21.2 MW", time: "12:00 - 15:00", change: "+1.8%" },
          { label: "Evening Peak", value: "22.8 MW", time: "18:00 - 21:00", change: "+3.2%" },
          { label: "Night Load", value: "17.5 MW", time: "22:00 - 05:00", change: "-1.5%" }
        ].map((stat, index) => (
          <Card key={index} className="p-4 bg-gradient-to-br from-[#2C2C2E] to-[#3C3C3E] hover:from-[#3C3C3E] hover:to-[#4C4C4E] transition-all duration-300">
            <h3 className="text-zinc-400 text-sm font-medium">{stat.label}</h3>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-emerald-500 text-sm font-medium">{stat.change}</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">{stat.time}</p>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
