import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { SearchOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import useTradingStore from '../../store/tradingStore';

const SymbolSelector = () => {
  const { 
    currentSymbol, 
    setCurrentSymbol, 
    forexPairs, 
    currentPrice,
    dailyHigh,
    dailyLow,
    dailyChange,
    dailyChangePercent 
  } = useTradingStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPairs = forexPairs.filter(pair =>
    pair.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSymbol = (symbol) => {
    setCurrentSymbol(symbol);
    setIsModalOpen(false);
    setSearchTerm('');
  };

  const isPositive = dailyChange >= 0;

  const formatPrice = (price) => {
    if (currentSymbol.includes('JPY')) return price.toFixed(3);
    if (currentSymbol.includes('XAU')) return price.toFixed(2);
    return price.toFixed(5);
  };

  return (
    <>
      {/* Symbol Display - Compact */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-3 border-b border-[#1e2433] cursor-pointer hover:bg-[#151924] transition-colors"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400 text-lg">C</span>
          <span className="text-white font-semibold">{currentSymbol}</span>
          <CaretDownOutlined className="text-gray-500 text-xs" />
        </div>
        
        {/* Price Info */}
        <div className="flex items-center gap-3 text-xs">
          <span className={`font-mono ${isPositive ? 'text-cyan-400' : 'text-red-400'}`}>
            {formatPrice(currentPrice)}
          </span>
          <span className={`flex items-center gap-0.5 ${isPositive ? 'text-cyan-400' : 'text-red-400'}`}>
            {isPositive ? <CaretUpOutlined /> : <CaretDownOutlined />}
            ({isPositive ? '+' : ''}{dailyChangePercent.toFixed(2)}%)
          </span>
        </div>
        
        {/* High/Low */}
        <div className="flex gap-4 mt-2 text-xs">
          <div>
            <span className="text-gray-500">HIGH </span>
            <span className="text-white font-mono">{formatPrice(dailyHigh)}</span>
          </div>
          <div>
            <span className="text-gray-500">LOW </span>
            <span className="text-white font-mono">{formatPrice(dailyLow)}</span>
          </div>
        </div>
      </div>

      {/* Symbol Selection Modal */}
      <Modal
        title="Select Trading Pair"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSearchTerm('');
        }}
        footer={null}
        width={400}
      >
        <Input
          prefix={<SearchOutlined className="text-gray-500" />}
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3"
        />
        <div className="max-h-[300px] overflow-y-auto">
          {filteredPairs.map(pair => (
            <div
              key={pair.symbol}
              onClick={() => handleSelectSymbol(pair.symbol)}
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                currentSymbol === pair.symbol 
                  ? 'bg-blue-600/20 text-blue-400' 
                  : 'hover:bg-[#1e2433] text-gray-300'
              }`}
            >
              <span className="font-medium">{pair.symbol}</span>
              <span className="text-xs text-gray-500">{pair.name}</span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default SymbolSelector;
