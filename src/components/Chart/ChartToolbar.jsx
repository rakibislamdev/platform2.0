import React from 'react';
import { Tooltip } from 'antd';
import {
  LineChartOutlined,
  SettingOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  PlusOutlined,
  MinusOutlined,
  AreaChartOutlined,
} from '@ant-design/icons';
import { BiCandles } from 'react-icons/bi';
import { TbChartLine } from 'react-icons/tb';
import useTradingStore from '../../store/tradingStore';
import chartService from '../../services/chartService';

const ChartToolbar = ({ onToggleIndicators, onToggleSettings, showSettings, onToggleFullscreen, isFullscreen }) => {
  const { 
    chartType, 
    setChartType, 
    activeIndicators,
    chartDisplayMode,
    setChartDisplayMode,
    showPriceLine,
    togglePriceLine,
    showDepthOverlay,
    toggleDepthOverlay,
  } = useTradingStore();

  const handleZoomIn = () => {
    const currentZoom = chartService.getZoomRange();
    const range = currentZoom.end - currentZoom.start;
    const newRange = Math.max(range * 0.7, 5); // Zoom in by 30%, minimum 5% range
    const center = (currentZoom.start + currentZoom.end) / 2;
    const newStart = Math.max(0, center - newRange / 2);
    const newEnd = Math.min(100, center + newRange / 2);
    chartService.setZoomRange(newStart, newEnd);
  };

  const handleZoomOut = () => {
    const currentZoom = chartService.getZoomRange();
    const range = currentZoom.end - currentZoom.start;
    const newRange = Math.min(range * 1.4, 100); // Zoom out by 40%, maximum 100% range
    const center = (currentZoom.start + currentZoom.end) / 2;
    const newStart = Math.max(0, center - newRange / 2);
    const newEnd = Math.min(100, center + newRange / 2);
    chartService.setZoomRange(newStart, newEnd);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#0d111a] border-b border-[#1e2433]">
      {/* Left - Chart Type Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setChartDisplayMode('price')}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            chartDisplayMode === 'price' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white hover:bg-[#1e2433]'
          }`}
        >
          PRICE
        </button>
        <button 
          onClick={() => setChartDisplayMode('depth')}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            chartDisplayMode === 'depth' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white hover:bg-[#1e2433]'
          }`}
        >
          DEPTH
        </button>
        <div className="w-px h-4 bg-[#1e2433] mx-2" />
        <Tooltip title="Price Line Overlay">
          <button 
            onClick={togglePriceLine}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              showPriceLine ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white hover:bg-[#1e2433]'
            }`}
          >
            P
          </button>
        </Tooltip>
        <Tooltip title="Depth Overlay">
          <button 
            onClick={toggleDepthOverlay}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              showDepthOverlay ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white hover:bg-[#1e2433]'
            }`}
          >
            D
          </button>
        </Tooltip>
      </div>

      {/* Center - Chart Type Icons & Indicators */}
      <div className="flex items-center gap-2">
        <Tooltip title="Line Chart">
          <button
            onClick={() => setChartType('line')}
            className={`p-1.5 rounded ${
              chartType === 'line' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            <LineChartOutlined />
          </button>
        </Tooltip>
        <Tooltip title="Area Chart">
          <button
            onClick={() => setChartType('area')}
            className={`p-1.5 rounded ${
              chartType === 'area' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            <AreaChartOutlined />
          </button>
        </Tooltip>
        <Tooltip title="Candlestick">
          <button
            onClick={() => setChartType('candlestick')}
            className={`p-1.5 rounded ${
              chartType === 'candlestick' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            <BiCandles />
          </button>
        </Tooltip>
        
        <div className="w-px h-4 bg-[#1e2433] mx-2" />
        
        {/* Indicators Button */}
        <Tooltip title="Indicators">
          <button
            onClick={onToggleIndicators}
            className={`p-1.5 rounded flex items-center gap-1 ${
              activeIndicators?.length > 0 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            <TbChartLine className="text-lg" />
            {activeIndicators?.length > 0 && (
              <span className="text-xs bg-cyan-500 px-1.5 rounded-full">{activeIndicators.length}</span>
            )}
          </button>
        </Tooltip>
      </div>

      {/* Right - Tools */}
      <div className="flex items-center gap-2">
        <Tooltip title="Zoom Out">
          <button onClick={handleZoomOut} className="p-1 text-gray-500 hover:text-white">
            <MinusOutlined className="text-xs" />
          </button>
        </Tooltip>
        <Tooltip title="Zoom In">
          <button onClick={handleZoomIn} className="p-1 text-gray-500 hover:text-white">
            <PlusOutlined className="text-xs" />
          </button>
        </Tooltip>
        <Tooltip title="Settings">
          <button 
            onClick={onToggleSettings}
            className={`p-1 ${showSettings ? 'text-blue-500' : 'text-gray-500 hover:text-white'}`}
          >
            <SettingOutlined />
          </button>
        </Tooltip>
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          <button onClick={onToggleFullscreen} className="p-1 text-gray-500 hover:text-white">
            {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ChartToolbar;
