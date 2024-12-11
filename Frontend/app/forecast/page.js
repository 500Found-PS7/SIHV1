"use client";

import React, { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, parse } from 'date-fns';
import { Calendar } from "../component/calendar/calendar";
import { FullPageLoader } from "../component/Loader";

function ForecastContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateString = searchParams.get('date');

  const [selectedDate, setSelectedDate] = useState(() => {
    if (!dateString) return new Date();
    try {
      return parse(dateString, 'yyyy-MM-dd', new Date());
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date();
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDateSelect = (date) => {
    setIsLoading(true);
    setSelectedDate(date);
    const formattedDate = format(date, 'yyyy-MM-dd');
    router.push(`/chart?date=${formattedDate}`);
  };

  // Clean up loading state if navigation takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {isLoading && <FullPageLoader />}
      <div className="h-screen">
        <h1 className="text-3xl sm:text-4xl font-bold py-4 text-white text-center">
          Select Date for Load Forecast
        </h1>
        
        <div className="h-[calc(100vh-8rem)]">
          <Calendar onDateSelect={handleDateSelect} />
        </div>
      </div>
    </div>
  );
}

export default function ForecastPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <ForecastContent />
    </Suspense>
  );
}