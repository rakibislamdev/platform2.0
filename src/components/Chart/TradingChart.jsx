import React, { useEffect, useRef, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import useTradingStore from '../../store/tradingStore';
import chartService from '../../services/chartService';
import ChartToolbar from './ChartToolbar';
import IndicatorPanel from './IndicatorPanel';
import ChartSettings from './ChartSettings';
import DrawingToolbar from './DrawingToolbar';

const TradingChart = () => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    candleData,
    chartType,
    currentSymbol,
    currentPrice,
    previousPrice,
    activeIndicators,
    chartSettings,
  } = useTradingStore();

  // Handle fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Resize chart after fullscreen change
      setTimeout(() => chartService.resize(), 100);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Initialize chart service with ref
  useEffect(() => {
    if (chartRef.current) {
      chartService.init(chartRef);
    }
    return () => {
      // Cleanup if needed
    };
  }, []);

  // Format data using chart service
  const chartData = useMemo(() => {
    return chartService.formatCandleData(candleData);
  }, [candleData]);

  // Build series using chart service
  const buildSeries = useMemo(() => {
    return chartService.buildAllSeries(chartType, currentSymbol, chartData, activeIndicators, chartSettings);
  }, [chartData, chartType, currentSymbol, activeIndicators, chartSettings]);

  // Get chart options from service
  const options = useMemo(() => {
    return chartService.getChartOptions(chartData, buildSeries, chartSettings);
  }, [chartData, buildSeries, chartSettings]);

  // Handle chart resize
  useEffect(() => {
    const handleResize = () => {
      chartService.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0a0e17] overflow-hidden flex flex-col">
      {/* Chart Toolbar */}
      <ChartToolbar 
        onToggleIndicators={() => setShowIndicatorPanel(!showIndicatorPanel)}
        onToggleSettings={() => setShowSettingsPanel(!showSettingsPanel)}
        showSettings={showSettingsPanel}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
      />
      
      {/* Drawing Toolbar - Left side */}
      <DrawingToolbar />
      
      {/* Indicator Panel */}
      {showIndicatorPanel && (
        <IndicatorPanel onClose={() => setShowIndicatorPanel(false)} />
      )}
      
      {/* Settings Panel */}
      {showSettingsPanel && (
        <ChartSettings onClose={() => setShowSettingsPanel(false)} />
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
        
        {/* Real-time Price Label on Chart with horizontal line */}
        <div 
          className="absolute right-0 z-20 flex items-center"
          style={{ top: '30%', transform: 'translateY(-50%)', left: '0' }}
        >
          {/* Horizontal dashed line */}
          <div 
            className={`flex-1 border-t border-dashed ${
              currentPrice >= previousPrice 
                ? 'border-cyan-500' 
                : 'border-red-500'
            }`}
          />
          {/* Price label */}
          <div 
            className={`px-2 py-0.5 text-xs font-mono ${
              currentPrice >= previousPrice 
                ? 'bg-cyan-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {currentPrice?.toFixed(5)}
          </div>
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
