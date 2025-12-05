import React, { useEffect, useRef, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Tooltip } from 'antd';
import useTradingStore from '../../store/tradingStore';
import chartService from '../../services/chartService';
import ChartToolbar from './ChartToolbar';
import IndicatorPanel from './IndicatorPanel';
import ChartSettings from './ChartSettings';
import DrawingToolbar from './DrawingToolbar';
import DepthChart from './DepthChart';

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
    chartDisplayMode,
    showPriceLine,
    showDepthOverlay,
    showPercentScale,
    togglePercentScale,
    showLogScale,
    toggleLogScale,
    autoScale,
    setAutoScale,
    orderBook,
    timeframe,
    setTimeframe,
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

  // Build series using chart service - include depth overlay if enabled
  const buildSeries = useMemo(() => {
    const series = chartService.buildAllSeries(chartType, currentSymbol, chartData, activeIndicators, chartSettings);
    
    // Add price line if enabled
    if (showPriceLine && chartDisplayMode === 'price') {
      series.push({
        name: 'Price Line',
        type: 'line',
        data: chartData.closes,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#fbbf24',
          width: 1,
          opacity: 0.5,
        },
        z: 5,
      });
    }
    
    // Add depth overlay visualization if enabled
    if (showDepthOverlay && orderBook) {
      const bidPrices = orderBook.bids.map(b => b.price);
      const askPrices = orderBook.asks.map(a => a.price);
      // This creates visual markers showing bid/ask levels
      series.push({
        name: 'Bid Levels',
        type: 'scatter',
        data: bidPrices.slice(0, 5).map((p, i) => [chartData.dates.length - 1, p]),
        symbol: 'triangle',
        symbolSize: 8,
        itemStyle: { color: '#26a69a', opacity: 0.6 },
        z: 10,
      });
      series.push({
        name: 'Ask Levels',
        type: 'scatter',
        data: askPrices.slice(0, 5).map((p, i) => [chartData.dates.length - 1, p]),
        symbol: 'triangle',
        symbolRotate: 180,
        symbolSize: 8,
        itemStyle: { color: '#ef5350', opacity: 0.6 },
        z: 10,
      });
    }
    
    return series;
  }, [chartData, chartType, currentSymbol, activeIndicators, chartSettings, showPriceLine, showDepthOverlay, orderBook, chartDisplayMode]);

  // Enhanced settings with scale options
  const enhancedSettings = useMemo(() => ({
    ...chartSettings,
    showLogScale,
    showPercentScale,
    autoScale,
  }), [chartSettings, showLogScale, showPercentScale, autoScale]);

  // Get chart options from service
  const options = useMemo(() => {
    const baseOptions = chartService.getChartOptions(chartData, buildSeries, enhancedSettings);
    
    // Apply logarithmic scale if enabled
    if (showLogScale) {
      baseOptions.yAxis[0].type = 'log';
      baseOptions.yAxis[0].logBase = 10;
    }
    
    // Apply percentage scale if enabled
    if (showPercentScale && chartData.closes.length > 0) {
      const basePrice = chartData.closes[0];
      baseOptions.yAxis[0].axisLabel.formatter = (value) => {
        const percent = ((value - basePrice) / basePrice * 100).toFixed(2);
        return `${percent}%`;
      };
    }
    
    // Apply auto scale
    if (autoScale) {
      baseOptions.yAxis[0].scale = true;
    }
    
    return baseOptions;
  }, [chartData, buildSeries, enhancedSettings, showLogScale, showPercentScale, autoScale]);

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
      
      {/* Price Info Bar - Only show for price mode */}
      {chartDisplayMode === 'price' && (
        <div className="flex items-center gap-4 px-4 py-1 text-xs border-b border-[#1e2433]">
          <span className="text-gray-400">Volume(20)</span>
          <span className="text-gray-300 font-mono">O {currentPrice?.toFixed(4)}</span>
          <span className="text-gray-300 font-mono">H {(currentPrice * 1.001)?.toFixed(4)}</span>
          <span className="text-gray-300 font-mono">L {(currentPrice * 0.999)?.toFixed(4)}</span>
          <span className="text-gray-300 font-mono">C {currentPrice?.toFixed(4)}</span>
        </div>
      )}
      
      {/* Chart Container - Price or Depth */}
      {chartDisplayMode === 'price' ? (
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
      ) : (
        <div className="flex-1">
          <DepthChart />
        </div>
      )}
      
      {/* Bottom Timeframe Bar */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-[#1e2433] text-xs">
        <div className="flex items-center gap-2">
          {['1h', '6h', '1d', '3d', '7d', '1m', '3m', '1y', '3y'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 rounded transition-colors ${
                timeframe === tf ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white hover:bg-[#1e2433]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Tooltip title="Percentage Scale - Show price changes as percentages">
            <button 
              onClick={togglePercentScale}
              className={`px-2 py-0.5 rounded transition-colors ${
                showPercentScale ? 'bg-blue-600 text-white' : 'hover:text-white hover:bg-[#1e2433]'
              }`}
            >
              %
            </button>
          </Tooltip>
          <Tooltip title="Logarithmic Scale - Better for viewing large price ranges">
            <button 
              onClick={toggleLogScale}
              className={`px-2 py-0.5 rounded transition-colors ${
                showLogScale ? 'bg-blue-600 text-white' : 'hover:text-white hover:bg-[#1e2433]'
              }`}
            >
              log
            </button>
          </Tooltip>
          <Tooltip title="Auto Scale - Automatically fit chart to visible data">
            <button 
              onClick={() => setAutoScale(!autoScale)}
              className={`px-2 py-0.5 rounded transition-colors ${
                autoScale ? 'bg-blue-600 text-white' : 'bg-[#1e2433] text-white hover:bg-[#2a3040]'
              }`}
            >
              Auto
            </button>
          </Tooltip>
          <span className="text-gray-400 ml-2">
            {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} (UTC)
          </span>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
