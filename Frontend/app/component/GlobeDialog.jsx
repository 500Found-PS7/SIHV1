import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export function GlobeDialog({ setSelectedArea, selectedDate }) {
  const router = useRouter();

  const handleClick = () => {
    const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    router.push(`/forecast?date=${formattedDate}`);
  };

  return (
    <Button 
      variant="outline" 
      className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300"
      onClick={handleClick}
    >
      Explore Forecast
    </Button>
  );
}