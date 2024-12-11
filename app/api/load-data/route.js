import { NextResponse } from 'next/server';
import axios from 'axios';
import { parse } from 'node-html-parser';
import { format, addMinutes } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');
    const interval = searchParams.get('interval') || '5min'; // Add interval parameter
    
    if (!dateStr) {
      return NextResponse.json(
        { error: 'Date parameter is required' }, 
        { status: 400 }
      );
    }

    const date = new Date(dateStr);
    const formattedDate = format(date, 'dd/MM/yyyy');

    console.log('Fetching data for date:', formattedDate);

    const response = await axios.get(
      `https://www.delhisldc.org/Loaddata.aspx?mode=${formattedDate}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        }
      }
    );

    const root = parse(response.data);
    const tables = root.querySelectorAll('table');
    const loadTable = tables.find(table => {
      const text = table.text.toLowerCase();
      return text.includes('time') && text.includes('delhi') && text.includes('brpl');
    });

    if (!loadTable) {
      console.log('No load table found');
      return NextResponse.json(
        { error: 'Could not find load data table' }, 
        { status: 404 }
      );
    }

    // Parse rows
    const rows = loadTable.querySelectorAll('tr');
    let data = rows
      .map(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 7) return null;

        const values = cells.map(cell => cell.text.trim());
        if (!values[0].match(/^\d{2}:\d{2}/)) return null;

        return {
          time: values[0],
          load: parseFloat(values[1]) || 0,
          brpl: parseFloat(values[2]) || 0,
          bypl: parseFloat(values[3]) || 0,
          ndpl: parseFloat(values[4]) || 0,
          ndmc: parseFloat(values[5]) || 0,
          mes: parseFloat(values[6]) || 0
        };
      })
      .filter(Boolean);

    // If 5min interval is requested, interpolate the data
    if (interval === '5min') {
      data = interpolateTo5MinIntervals(data);
    }

    if (data.length === 0) {
      console.log('No valid data found');
      return NextResponse.json(
        { error: 'No valid data found' }, 
        { status: 404 }
      );
    }

    console.log(`Found ${data.length} data points`);
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch load data', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}

function interpolateTo5MinIntervals(hourlyData) {
  if (hourlyData.length < 2) return hourlyData;

  const result = [];
  
  for (let i = 0; i < hourlyData.length - 1; i++) {
    const current = hourlyData[i];
    const next = hourlyData[i + 1];
    
    // Parse times
    const [currentHour, currentMin] = current.time.split(':').map(Number);
    const [nextHour, nextMin] = next.time.split(':').map(Number);
    
    // Create base date objects for calculation
    const currentTime = new Date(2024, 0, 1, currentHour, currentMin);
    const nextTime = new Date(2024, 0, 1, nextHour, nextMin);
    
    // Calculate number of 5-minute intervals
    const intervalCount = Math.floor((nextTime - currentTime) / (5 * 60 * 1000));
    
    // Add current hour data
    result.push(current);
    
    // Interpolate 5-minute intervals
    for (let j = 1; j < intervalCount; j++) {
      const ratio = j / intervalCount;
      const interpolatedTime = addMinutes(currentTime, j * 5);
      
      const interpolatedData = {
        time: format(interpolatedTime, 'HH:mm'),
        load: interpolate(current.load, next.load, ratio),
        brpl: interpolate(current.brpl, next.brpl, ratio),
        bypl: interpolate(current.bypl, next.bypl, ratio),
        ndpl: interpolate(current.ndpl, next.ndpl, ratio),
        ndmc: interpolate(current.ndmc, next.ndmc, ratio),
        mes: interpolate(current.mes, next.mes, ratio)
      };
      
      result.push(interpolatedData);
    }
  }
  
  // Add last data point
  result.push(hourlyData[hourlyData.length - 1]);
  
  return result;
}

function interpolate(start, end, ratio) {
  return Math.round(start + (end - start) * ratio);
} 