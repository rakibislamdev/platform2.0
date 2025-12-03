import React, { useState } from 'react';
import { Input, Switch } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import useTradingStore from '../../store/tradingStore';

const indicators = [
  {
    category: 'Trend (Overlay)',
    items: [
      { id: 'sma', name: 'SMA', description: 'Simple Moving Average' },
      { id: 'ema', name: 'EMA', description: 'Exponential Moving Average' },
      { id: 'wma', name: 'WMA', description: 'Weighted Moving Average' },
      { id: 'bollinger', name: 'Bollinger Bands', description: 'Volatility bands' },
      { id: 'vwap', name: 'VWAP', description: 'Volume Weighted Average Price' },
      { id: 'keltner', name: 'Keltner Channels', description: 'Volatility envelope' },
      { id: 'donchian', name: 'Donchian Channels', description: 'High/Low channels' },
      { id: 'ichimoku', name: 'Ichimoku Cloud', description: 'Support/Resistance' },
      { id: 'parabolic', name: 'Parabolic SAR', description: 'Trend direction' },
    ],
  },
  {
    category: 'Oscillators (Sub-chart)',
    items: [
      { id: 'rsi', name: 'RSI', description: 'Relative Strength Index' },
      { id: 'macd', name: 'MACD', description: 'Moving Average Convergence' },
      { id: 'stochastic', name: 'Stochastic', description: 'Momentum oscillator' },
      { id: 'cci', name: 'CCI', description: 'Commodity Channel Index' },
      { id: 'williams', name: 'Williams %R', description: 'Momentum indicator' },
      { id: 'momentum', name: 'Momentum', description: 'Rate of price change' },
      { id: 'atr', name: 'ATR', description: 'Average True Range' },
      { id: 'mfi', name: 'MFI', description: 'Money Flow Index' },
    ],
  },
  {
    category: 'Volume',
    items: [
      { id: 'obv', name: 'OBV', description: 'On-Balance Volume' },
      { id: 'adl', name: 'A/D Line', description: 'Accumulation/Distribution' },
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

  const handleToggle = (e, id) => {
    e.stopPropagation();
    toggleIndicator(id);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Modal - Centered */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#151924] rounded-lg border border-[#1e2433] shadow-xl flex flex-col max-h-[60vh]">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e2433] flex-shrink-0">
            <h3 className="font-semibold text-white text-sm">Indicators</h3>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded transition-colors">
              <CloseOutlined />
            </button>
          </div>
          
          {/* Search - Fixed */}
          <div className="p-2.5 border-b border-[#1e2433] flex-shrink-0">
            <Input 
              prefix={<SearchOutlined className="text-gray-500" />} 
              placeholder="Search indicators..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="bg-[#0a0e17] border-[#1e2433] text-white"
              size="middle"
            />
          </div>
          
          {/* Active Indicators - Fixed */}
          {activeIndicators.length > 0 && (
            <div className="p-3 border-b border-[#1e2433] flex-shrink-0">
              <p className="text-xs text-gray-500 mb-2">Active ({activeIndicators.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {activeIndicators.map((id) => {
                  const indicator = indicators.flatMap((c) => c.items).find((i) => i.id === id);
                  return (
                    <span key={id} className="px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded flex items-center gap-1">
                      {indicator?.name || id}
                      <button onClick={(e) => handleToggle(e, id)} className="hover:text-white ml-1">
                        <CloseOutlined className="text-[10px]" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Indicator List - Scrollable */}
          <div className="overflow-y-auto flex-1 min-h-0">
            {filteredIndicators.map((category) => (
              <div key={category.category} className="py-2">
                <p className="px-4 py-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  {category.category}
                </p>
                {category.items.map((indicator) => (
                  <div 
                    key={indicator.id} 
                    className="flex items-center justify-between px-4 py-2 hover:bg-[#1e2433] cursor-pointer transition-colors"
                    onClick={(e) => handleToggle(e, indicator.id)}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-sm text-white">{indicator.name}</p>
                      <p className="text-xs text-gray-500 truncate">{indicator.description}</p>
                    </div>
                    <Switch 
                      size="small" 
                      checked={activeIndicators.includes(indicator.id)} 
                      onClick={(checked, e) => handleToggle(e, indicator.id)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default IndicatorPanel;
