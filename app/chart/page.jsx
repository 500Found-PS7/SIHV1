'use client';

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { format, parse } from 'date-fns';
import dynamic from 'next/dynamic';
import { FullPageLoader, Loader } from "../component/Loader";
import { generateHourlyData, calculateDailyStats } from '@/lib/utils';
import { DataInsights } from '@/app/component/DataInsights';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

const CurrentLoadChart = dynamic(() => import('./CurrentLoadChart'), { 
  loading: () => <Loader />,
  ssr: false 
});
const ShortTermForecastChart = dynamic(() => import('./ShortTermForecastChart'), { 
  loading: () => <Loader />,
  ssr: false 
});
const LongTermForecastChart = dynamic(() => import('./LongTermForecastChart'), { 
  loading: () => <Loader />,
  ssr: false 
});
const AdditionalInsightsChart = dynamic(() => import('./AdditionalInsightsChart'), { 
  loading: () => <Loader />,
  ssr: false 
});

function ChartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateString = searchParams.get('date');
  const [isLoading, setIsLoading] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const [selectedDate, setSelectedDate] = useState(() => {
    if (!dateString) return new Date();
    try {
      return parse(dateString, 'yyyy-MM-dd', new Date());
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date();
    }
  });

  const [hourlyData, setHourlyData] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const data = generateHourlyData(selectedDate);
    setHourlyData(data);
    setStats(calculateDailyStats(data));
  }, [selectedDate]);

  const formattedDate = format(selectedDate, 'MMMM d, yyyy');

  useEffect(() => {
    if (dateString) {
      try {
        const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
        setSelectedDate(parsedDate);
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [dateString]);

  // Scroll to section handler
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle dialog open/close with scroll
  const handleDialogChange = (open) => {
    setShowInsights(open);
    if (open) {
      setTimeout(() => {
        const insightsElement = document.getElementById('insights-content');
        if (insightsElement) {
          insightsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  if (!stats) return <Loader />;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen p-4 sm:p-6 md:p-8">
      {isLoading && <FullPageLoader />}
      <div className="max-w-7xl mx-auto">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white text-center">
            Electricity Load Forecast
          </h1>
          <div className="bg-blue-500/20 backdrop-blur-sm p-4 rounded-lg border border-blue-500/30">
            <p className="text-base sm:text-lg font-semibold mb-2 text-blue-200">Selected Date</p>
            <p className="text-lg sm:text-xl text-white mb-4">{formattedDate}</p>
            <div className="flex justify-center gap-4 mt-2">
              <Dialog onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg flex items-center gap-2">
                    <span className="material-icons text-xl">insights</span>
                    AI Analysis
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] bg-gray-900/95 backdrop-blur-md border border-blue-500/30 shadow-2xl max-h-[80vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white mb-2">
                      AI Insights for {formattedDate}
                    </DialogTitle>
                    <DialogDescription className="text-blue-200">
                      Detailed analysis of electricity load patterns and trends
                    </DialogDescription>
                  </DialogHeader>
                  <div 
                    id="insights-content" 
                    className="mt-4 p-4 bg-black/20 rounded-lg overflow-y-auto custom-scrollbar"
                  >
                    <DataInsights 
                      data={{
                        hourlyData,
                        stats,
                        date: format(selectedDate, 'MMMM d, yyyy')
                      }}
                      type="general"
                    />
                  </div>
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button variant="outline" className="bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-500/50">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <div className="flex gap-2">
                <Button 
                  onClick={() => scrollToSection('current-load')}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-white"
                >
                  Current Load
                </Button>
                <Button 
                  onClick={() => scrollToSection('forecasts')}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-white"
                >
                  Forecasts
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div id="current-load" className="bg-black/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-xl border border-blue-500/30 scroll-mt-20">
            <CurrentLoadChart date={selectedDate} data={hourlyData} />
          </div>

          <div id="forecasts" className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-mt-20">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-xl border border-blue-500/30">
              <ShortTermForecastChart date={selectedDate} data={hourlyData} />
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-xl border border-blue-500/30">
              <LongTermForecastChart date={selectedDate} data={hourlyData} />
            </div>
          </div>
        </div>

        <div id="additional-insights" className="bg-black/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-xl border border-blue-500/30 scroll-mt-20">
          <AdditionalInsightsChart />
        </div>
      </div>
    </div>
  );
}

export default function Chart() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <ChartContent />
    </Suspense>
  );
}