import React, { useState } from 'react';
import { Input, Switch } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import useTradingStore from '../../store/tradingStore';

const indicators = [
  {
    category: 'Trend',
    items: [
      { id: 'sma', name: 'Simple Moving Average (SMA)', description: 'Average price over a period' },
      { id: 'ema', name: 'Exponential Moving Average (EMA)', description: 'Weighted average giving more weight to recent prices' },
      { id: 'wma', name: 'Weighted Moving Average (WMA)', description: 'Weighted average with custom weights' },
      { id: 'bollinger', name: 'Bollinger Bands', description: 'Volatility bands around a moving average' },
      { id: 'ichimoku', name: 'Ichimoku Cloud', description: 'Multiple indicators showing support, resistance, and trend' },
      { id: 'parabolic', name: 'Parabolic SAR', description: 'Stop and reverse indicator for trend direction' },
    ],
  },
  {
    category: 'Momentum',
    items: [
      { id: 'rsi', name: 'Relative Strength Index (RSI)', description: 'Momentum oscillator measuring speed and change' },
      { id: 'macd', name: 'MACD', description: 'Trend-following momentum indicator' },
      { id: 'stochastic', name: 'Stochastic Oscillator', description: 'Momentum indicator comparing closing price to range' },
      { id: 'cci', name: 'Commodity Channel Index (CCI)', description: 'Identifies cyclical trends' },
      { id: 'williams', name: 'Williams %R', description: 'Momentum indicator similar to Stochastic' },
      { id: 'momentum', name: 'Momentum', description: 'Rate of price change' },
    ],
  },
  {
    category: 'Volume',
    items: [
      { id: 'obv', name: 'On-Balance Volume (OBV)', description: 'Cumulative volume indicator' },
      { id: 'vwap', name: 'VWAP', description: 'Volume Weighted Average Price' },
      { id: 'adl', name: 'Accumulation/Distribution', description: 'Volume-based indicator' },
      { id: 'mfi', name: 'Money Flow Index (MFI)', description: 'Volume-weighted RSI' },
    ],
  },
  {
    category: 'Volatility',
    items: [
      { id: 'atr', name: 'Average True Range (ATR)', description: 'Measures market volatility' },
      { id: 'stddev', name: 'Standard Deviation', description: 'Statistical measure of volatility' },
      { id: 'keltner', name: 'Keltner Channels', description: 'Volatility-based envelope' },
      { id: 'donchian', name: 'Donchian Channels', description: 'High and low over a period' },
    ],
  },
];

const IndicatorPanel = ({ onClose }) => {
  const { activeIndicators, toggleIndicator } = useTradingStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIndicators = indicators.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((category) => category.items.length > 0);

  return (
    <div className="absolute top-14 right-4 z-30 w-80 max-h-[500px] bg-dark-300 rounded-lg border border-dark-100 shadow-xl overflow-hidden fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-100">
        <h3 className="font-semibold text-white">Indicators</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white rounded transition-colors"
        >
          <CloseOutlined />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-dark-100">
        <Input
          prefix={<SearchOutlined className="text-gray-500" />}
          placeholder="Search indicators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-dark-200"
        />
      </div>

      {/* Active Indicators */}
      {activeIndicators.length > 0 && (
        <div className="p-3 border-b border-dark-100">
          <p className="text-xs text-gray-500 mb-2">Active Indicators</p>
          <div className="flex flex-wrap gap-2">
            {activeIndicators.map((id) => {
              const indicator = indicators
                .flatMap((c) => c.items)
                .find((i) => i.id === id);
              return (
                <span
                  key={id}
                  className="px-2 py-1 text-xs bg-accent-blue/20 text-accent-blue rounded-full flex items-center gap-1"
                >
                  {indicator?.name.split('(')[0].trim()}
                  <button
                    onClick={() => toggleIndicator(id)}
                    className="hover:text-white"
                  >
                    <CloseOutlined className="text-[10px]" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Indicator List */}
      <div className="overflow-y-auto max-h-[300px]">
        {filteredIndicators.map((category) => (
          <div key={category.category} className="py-2">
            <p className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {category.category}
            </p>
            {category.items.map((indicator) => (
              <div
                key={indicator.id}
                className="flex items-center justify-between px-4 py-2 hover:bg-dark-200 cursor-pointer transition-colors"
                onClick={() => toggleIndicator(indicator.id)}
              >
                <div className="flex-1 pr-4">
                  <p className="text-sm text-white">{indicator.name}</p>
                  <p className="text-xs text-gray-500 truncate">{indicator.description}</p>
                </div>
                <Switch
                  size="small"
                  checked={activeIndicators.includes(indicator.id)}
                  onChange={() => toggleIndicator(indicator.id)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndicatorPanel;
