import React from 'react';
import { Tooltip } from 'antd';
import {
  LineChartOutlined,
  SettingOutlined,
  FullscreenOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { BiCandles } from 'react-icons/bi';
import useTradingStore from '../../store/tradingStore';

const ChartToolbar = ({ onToggleIndicators }) => {
  const { chartType, setChartType } = useTradingStore();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#0d111a] border-b border-[#1e2433]">
      {/* Left - Chart Type Buttons */}
      <div className="flex items-center gap-1">
        <button
          className={`px-3 py-1 text-xs rounded ${
            chartType === 'candlestick' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'
          }`}
        >
          PRICE
        </button>
        <button className="px-3 py-1 text-xs text-gray-500 hover:text-white rounded">
          DEPTH
        </button>
        <div className="w-px h-4 bg-[#1e2433] mx-2" />
        <button className="px-2 py-1 text-xs text-gray-500 hover:text-white">P</button>
        <button className="px-2 py-1 text-xs text-gray-500 hover:text-white">D</button>
      </div>

      {/* Center - Chart Type Icons */}
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
      </div>

      {/* Right - Tools */}
      <div className="flex items-center gap-2">
        <button className="p-1 text-gray-500 hover:text-white">
          <MinusOutlined className="text-xs" />
        </button>
        <button className="p-1 text-gray-500 hover:text-white">
          <PlusOutlined className="text-xs" />
        </button>
        <Tooltip title="Settings">
          <button className="p-1 text-gray-500 hover:text-white">
            <SettingOutlined />
          </button>
        </Tooltip>
        <Tooltip title="Fullscreen">
          <button className="p-1 text-gray-500 hover:text-white">
            <FullscreenOutlined />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ChartToolbar;
