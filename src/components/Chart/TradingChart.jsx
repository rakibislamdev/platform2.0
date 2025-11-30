import React, { useEffect, useRef, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import useTradingStore from '../../store/tradingStore';
import ChartToolbar from './ChartToolbar';
import IndicatorPanel from './IndicatorPanel';
import DrawingToolbar from './DrawingToolbar';

const TradingChart = () => {
  const chartRef = useRef(null);
  const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);

  const {
    candleData,
    chartType,
    currentSymbol,
    currentPrice,
    previousPrice,
    activeIndicators,
  } = useTradingStore();

  // Calculate Simple Moving Average
  const calculateMA = (data, period) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push('-');
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += data[i - j];
        }
        result.push((sum / period).toFixed(5));
      }
    }
    return result;
  };

  // Calculate Exponential Moving Average
  const calculateEMA = (data, period) => {
    const result = [];
    const multiplier = 2 / (period + 1);
    let ema = data[0];
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push('-');
        ema = (data[i] + ema * i) / (i + 1);
      } else {
        ema = (data[i] - ema) * multiplier + ema;
        result.push(ema.toFixed(5));
      }
    }
    return result;
  };

  // Format data for ECharts
  const chartData = useMemo(() => {
    if (!candleData || candleData.length === 0) return { dates: [], values: [], volumes: [] };

    const dates = candleData.map((d) => {
      const date = new Date(d.time * 1000);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    });

    // OHLC data for candlestick
    const values = candleData.map((d) => [d.open, d.close, d.low, d.high]);
    
    // Close prices for line/area
    const closeValues = candleData.map((d) => d.close);

    // Volume data
    const volumes = candleData.map((d) => ({
      value: d.volume,
      itemStyle: {
        color: d.close >= d.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
      },
    }));

    // Calculate MA indicators
    const ma5 = calculateMA(closeValues, 5);
    const ma10 = calculateMA(closeValues, 10);
    const ma20 = calculateMA(closeValues, 20);
    const ma50 = calculateMA(closeValues, 50);
    const ema12 = calculateEMA(closeValues, 12);
    const ema26 = calculateEMA(closeValues, 26);

    return { dates, values, closeValues, volumes, ma5, ma10, ma20, ma50, ema12, ema26 };
  }, [candleData]);

  // Build series based on chart type and indicators
  const buildSeries = useMemo(() => {
    const series = [];

    // Main price series
    if (chartType === 'candlestick') {
      series.push({
        name: currentSymbol,
        type: 'candlestick',
        data: chartData.values,
        itemStyle: {
          color: '#26a69a',
          color0: '#ef5350',
          borderColor: '#26a69a',
          borderColor0: '#ef5350',
        },
      });
    } else if (chartType === 'line') {
      series.push({
        name: currentSymbol,
        type: 'line',
        data: chartData.closeValues,
        smooth: true,
        lineStyle: {
          color: '#2962ff',
          width: 2,
        },
        itemStyle: {
          color: '#2962ff',
        },
        showSymbol: false,
      });
    } else if (chartType === 'area') {
      series.push({
        name: currentSymbol,
        type: 'line',
        data: chartData.closeValues,
        smooth: true,
        lineStyle: {
          color: '#2962ff',
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(41, 98, 255, 0.4)' },
              { offset: 1, color: 'rgba(41, 98, 255, 0.05)' },
            ],
          },
        },
        itemStyle: {
          color: '#2962ff',
        },
        showSymbol: false,
      });
    }

    // Volume series
    series.push({
      name: 'Volume',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: chartData.volumes,
      barWidth: '60%',
    });

    // Add indicator series
    if (activeIndicators?.includes('MA5')) {
      series.push({
        name: 'MA5',
        type: 'line',
        data: chartData.ma5,
        smooth: true,
        lineStyle: { color: '#f59e0b', width: 1 },
        showSymbol: false,
      });
    }
    if (activeIndicators?.includes('MA10')) {
      series.push({
        name: 'MA10',
        type: 'line',
        data: chartData.ma10,
        smooth: true,
        lineStyle: { color: '#06b6d4', width: 1 },
        showSymbol: false,
      });
    }
    if (activeIndicators?.includes('MA20')) {
      series.push({
        name: 'MA20',
        type: 'line',
        data: chartData.ma20,
        smooth: true,
        lineStyle: { color: '#a855f7', width: 1 },
        showSymbol: false,
      });
    }
    if (activeIndicators?.includes('MA50')) {
      series.push({
        name: 'MA50',
        type: 'line',
        data: chartData.ma50,
        smooth: true,
        lineStyle: { color: '#ec4899', width: 1 },
        showSymbol: false,
      });
    }
    if (activeIndicators?.includes('EMA12')) {
      series.push({
        name: 'EMA12',
        type: 'line',
        data: chartData.ema12,
        smooth: true,
        lineStyle: { color: '#22c55e', width: 1 },
        showSymbol: false,
      });
    }
    if (activeIndicators?.includes('EMA26')) {
      series.push({
        name: 'EMA26',
        type: 'line',
        data: chartData.ema26,
        smooth: true,
        lineStyle: { color: '#eab308', width: 1 },
        showSymbol: false,
      });
    }

    return series;
  }, [chartData, chartType, currentSymbol, activeIndicators]);

  // ECharts options
  const options = useMemo(() => ({
    animation: false,
    backgroundColor: '#0a0d12',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: 'rgba(41, 98, 255, 0.5)',
        },
        lineStyle: {
          color: 'rgba(41, 98, 255, 0.5)',
        },
      },
      backgroundColor: 'rgba(21, 25, 36, 0.95)',
      borderColor: '#1a1f2e',
      textStyle: {
        color: '#e5e7eb',
        fontSize: 12,
      },
    },
    axisPointer: {
      link: [{ xAxisIndex: 'all' }],
      label: {
        backgroundColor: '#1a1f2e',
      },
    },
    grid: [
      {
        left: '10%',
        right: '10%',
        top: '5%',
        height: '65%',
      },
      {
        left: '10%',
        right: '10%',
        top: '75%',
        height: '15%',
      },
    ],
    xAxis: [
      {
        type: 'category',
        data: chartData.dates,
        boundaryGap: true,
        axisLine: { lineStyle: { color: '#1a1f2e' } },
        axisLabel: { color: '#9ca3af', fontSize: 11 },
        axisTick: { show: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
      },
      {
        type: 'category',
        gridIndex: 1,
        data: chartData.dates,
        boundaryGap: true,
        axisLine: { lineStyle: { color: '#1a1f2e' } },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
      },
    ],
    yAxis: [
      {
        scale: true,
        position: 'right',
        axisLine: { lineStyle: { color: '#1a1f2e' } },
        axisLabel: { 
          color: '#9ca3af', 
          fontSize: 11,
          formatter: (value) => value.toFixed(5),
        },
        splitLine: { lineStyle: { color: 'rgba(42, 46, 57, 0.5)' } },
      },
      {
        scale: true,
        gridIndex: 1,
        position: 'right',
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 70,
        end: 100,
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        bottom: '2%',
        height: 20,
        start: 70,
        end: 100,
        borderColor: '#1a1f2e',
        backgroundColor: '#151924',
        fillerColor: 'rgba(41, 98, 255, 0.2)',
        handleStyle: {
          color: '#2962ff',
        },
        textStyle: {
          color: '#9ca3af',
        },
      },
    ],
    series: buildSeries,
  }), [chartData, buildSeries]);

  // Handle chart resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full bg-[#0a0e17] overflow-hidden flex flex-col">
      {/* Chart Toolbar */}
      <ChartToolbar onToggleIndicators={() => setShowIndicatorPanel(!showIndicatorPanel)} />
      
      {/* Drawing Toolbar - Left side */}
      <DrawingToolbar />
      
      {/* Indicator Panel */}
      {showIndicatorPanel && (
        <IndicatorPanel onClose={() => setShowIndicatorPanel(false)} />
      )}
      
      {/* Price Info Bar */}
      <div className="flex items-center gap-4 px-4 py-1 text-xs border-b border-[#1e2433]">
        <span className="text-gray-400">Volume(20)</span>
        <span className="text-gray-300 font-mono">O {currentPrice?.toFixed(4)}</span>
        <span className="text-gray-300 font-mono">H {(currentPrice * 1.001)?.toFixed(4)}</span>
        <span className="text-gray-300 font-mono">L {(currentPrice * 0.999)?.toFixed(4)}</span>
        <span className="text-gray-300 font-mono">C {currentPrice?.toFixed(4)}</span>
      </div>
      
      {/* Chart Container */}
      <div className="flex-1 relative">
        <ReactECharts
          ref={chartRef}
          option={options}
          style={{ width: '100%', height: '100%' }}
          opts={{ renderer: 'canvas' }}
          notMerge={true}
        />
        
        {/* Real-time Price Label on Chart */}
        <div 
          className={`absolute right-0 z-20 px-2 py-0.5 text-xs font-mono ${
            currentPrice >= previousPrice 
              ? 'bg-cyan-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
          style={{ top: '30%', transform: 'translateY(-50%)' }}
        >
          {currentPrice?.toFixed(5)}
        </div>
      </div>
      
      {/* Bottom Timeframe Bar */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-[#1e2433] text-xs">
        <div className="flex items-center gap-2">
          {['1h', '6h', '1d', '3d', '7d', '1m', '3m', '1y', '3y'].map((tf) => (
            <button
              key={tf}
              className={`px-2 py-0.5 rounded ${
                tf === '1h' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          <span>%</span>
          <span>log</span>
          <button className="px-2 py-0.5 bg-[#1e2433] rounded text-white">Auto</button>
          <span className="text-gray-400">15.0011 (UTC)</span>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
