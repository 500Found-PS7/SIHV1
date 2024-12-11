'use client';

import { useState, useEffect } from 'react';
import { generateInsights } from '@/lib/gemini';

export function DataInsights({ data, type = "general", className = "" }) {
  const [insights, setInsights] = useState('Loading insights...');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchInsights() {
      if (!data) {
        setInsights('No data available for analysis');
        setIsLoading(false);
        return;
      }

      try {
        const result = await generateInsights(data, type);
        if (isMounted) {
          setInsights(result || 'No insights available');
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch insights:', err);
          setError(err.message);
          setInsights('Unable to generate insights at the moment.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    setIsLoading(true);
    setError(null);
    fetchInsights();

    return () => {
      isMounted = false;
    };
  }, [data, type]);

  if (isLoading) {
    return (
      <div className={`bg-black/30 backdrop-blur-sm rounded-lg p-4 text-white ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <p>Analyzing data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-black/30 backdrop-blur-sm rounded-lg p-4 ${className}`}>
        <p className="text-red-400">{insights}</p>
        <p className="text-red-400/70 text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className={`bg-black/30 backdrop-blur-sm rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-2 text-white">AI Analysis</h3>
      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
        <div className="prose prose-invert">
          <p className="text-gray-200 whitespace-pre-line">{insights}</p>
        </div>
      </div>
    </div>
  );
}