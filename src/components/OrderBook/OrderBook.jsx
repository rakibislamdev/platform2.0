import React from 'react';
import { PlusOutlined, MinusOutlined, ExpandOutlined } from '@ant-design/icons';
import useTradingStore from '../../store/tradingStore';

const OrderBook = () => {
  const { orderBook, currentSymbol } = useTradingStore();
  const { bids, asks } = orderBook;

  const formatPrice = (price) => {
    if (currentSymbol.includes('JPY')) return price.toFixed(3);
    return price.toFixed(6);
  };

  const formatVolume = (volume) => {
    return volume.toFixed(6);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0e17] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e2433]">
        <h3 className="font-semibold text-white text-sm">ORDER BOOK</h3>
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-500 hover:text-white">
            <MinusOutlined className="text-xs" />
          </button>
          <button className="p-1 text-gray-500 hover:text-white">
            <ExpandOutlined className="text-xs" />
          </button>
          <button className="p-1 text-gray-500 hover:text-white">
            <PlusOutlined className="text-xs" />
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-6 gap-1 px-4 py-1.5 text-[10px] text-gray-500 border-b border-[#1e2433]">
        <span>Market Size</span>
        <span className="text-right">Price (CRD)</span>
        <span className="text-right">My Size</span>
        <span className="text-right">My Size</span>
        <span className="text-right">Price (CRD)</span>
        <span className="text-right">Market Size</span>
      </div>

      {/* Order Book Grid - Bids and Asks side by side */}
      <div className="flex-1 overflow-y-auto">
        {Array.from({ length: 15 }).map((_, index) => {
          const bid = bids[index];
          const ask = asks[index];
          return (
            <div key={index} className="grid grid-cols-6 gap-1 px-4 py-0.5 text-[11px] hover:bg-[#151924]">
              {/* Left side - Bids */}
              <span className="text-gray-400 font-mono">{bid ? formatVolume(bid.volume / 100000) : '-'}</span>
              <span className="text-cyan-400 font-mono text-right">{bid ? formatPrice(bid.price) : '-'}</span>
              <span className="text-gray-600 text-right">-</span>
              
              {/* Right side - Asks */}
              <span className="text-gray-600 text-right">-</span>
              <span className="text-red-400 font-mono text-right">{ask ? formatPrice(ask.price) : '-'}</span>
              <span className="text-gray-400 font-mono text-right">{ask ? formatVolume(ask.volume / 100000) : '-'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderBook;
