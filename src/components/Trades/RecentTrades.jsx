import React, { useState } from 'react';
import useTradingStore from '../../store/tradingStore';

const RecentTrades = () => {
  const { recentTrades, currentSymbol } = useTradingStore();
  const [activeTab, setActiveTab] = useState('market');

  const formatPrice = (price) => {
    if (currentSymbol.includes('JPY')) return price.toFixed(3);
    return price.toFixed(6);
  };

  const formatVolume = (volume) => {
    return volume.toFixed(6);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0e17] overflow-hidden">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e2433]">
        <h3 className="font-semibold text-white text-sm">TRADES</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('market')}
            className={`px-2 py-0.5 text-[10px] rounded ${
              activeTab === 'market' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setActiveTab('yours')}
            className={`px-2 py-0.5 text-[10px] rounded ${
              activeTab === 'yours' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Yours
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-2 px-4 py-1.5 text-[10px] text-gray-500 border-b border-[#1e2433]">
        <span>Trade Size</span>
        <span className="text-right">Price(CRD)</span>
        <span className="text-right">Time</span>
      </div>

      {/* Trades List */}
      <div className="flex-1 overflow-y-auto">
        {recentTrades.map((trade, index) => (
          <div
            key={trade.id || index}
            className="grid grid-cols-3 gap-2 px-4 py-0.5 text-[11px] hover:bg-[#151924]"
          >
            <span className="font-mono text-gray-400">{formatVolume(trade.volume / 100000)}</span>
            <span className={`font-mono text-right ${trade.side === 'buy' ? 'text-cyan-400' : 'text-red-400'}`}>
              {formatPrice(trade.price)}
              <span className="ml-1">{trade.side === 'buy' ? '▲' : '▼'}</span>
            </span>
            <span className="text-gray-500 text-right">{trade.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTrades;
