import React, { useState } from 'react';
import { InputNumber, Tabs, message } from 'antd';
import useTradingStore from '../../store/tradingStore';

const TradingPanel = () => {
  const { currentSymbol, currentPrice, placeOrder, openOrders } = useTradingStore();
  
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState(0);

  const [baseCurrency, quoteCurrency] = currentSymbol.split('/');
  const total = amount * currentPrice;

  const handleSubmit = () => {
    if (amount <= 0) {
      message.error('Please enter a valid amount');
      return;
    }

    placeOrder({
      symbol: currentSymbol,
      side,
      type: 'market',
      amount,
      price: currentPrice,
    });
    message.success(`${side.toUpperCase()} order placed!`);
    setAmount(0);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Buy/Sell Tabs */}
      <div className="flex border-b border-[#1e2433]">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            side === 'buy'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-500 hover:text-white'
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            side === 'sell'
              ? 'text-red-400 border-b-2 border-red-400'
              : 'text-gray-500 hover:text-white'
          }`}
        >
          SELL
        </button>
      </div>

      {/* Trading Form */}
      <div className="p-4 flex-1">
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1">Amount</label>
          <div className="relative">
            <InputNumber
              value={amount}
              onChange={setAmount}
              step={0.01}
              min={0}
              precision={2}
              className="w-full"
              controls={false}
              placeholder="0.00"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
              {baseCurrency}
            </span>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>Total ({quoteCurrency})</span>
          <span className="text-white font-mono">{total.toFixed(4)}</span>
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full py-2.5 rounded text-sm font-semibold transition-colors ${
            side === 'buy'
              ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          PLACE ORDER
        </button>
      </div>

      {/* Orders Section */}
      <div className="border-t border-[#1e2433] flex-1 flex flex-col min-h-0">
        <Tabs
          defaultActiveKey="orders"
          size="small"
          items={[
            {
              key: 'orders',
              label: 'ORDERS',
              children: (
                <div className="px-4 py-2 text-xs text-gray-500">
                  {openOrders.length === 0 ? 'No Orders to show' : `${openOrders.length} open orders`}
                </div>
              ),
            },
            {
              key: 'activity',
              label: 'ACTIVITY',
              children: (
                <div className="px-4 py-2 text-xs text-gray-500">
                  No recent activity
                </div>
              ),
            },
          ]}
          className="compact-tabs"
        />
      </div>
    </div>
  );
};

export default TradingPanel;
