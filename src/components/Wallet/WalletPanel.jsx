import React from 'react';
import useTradingStore from '../../store/tradingStore';

const WalletPanel = () => {
  const { balances, setIsDepositModalOpen } = useTradingStore();

  const displayBalances = [
    { code: 'Credo', symbol: 'C', balance: balances.EUR || 258.65 },
    { code: 'Bitcoin', symbol: 'B', balance: balances.USD || 150.50 },
  ];

  return (
    <div className="border-b border-[#1e2433] px-4 py-3">
      <h3 className="text-gray-400 text-xs font-semibold mb-3 uppercase tracking-wider">BALANCES</h3>
      
      {displayBalances.map((item, index) => (
        <div key={index} className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2">
            <span className="text-blue-400">{item.symbol}</span>
            <span className="text-gray-300 text-sm">{item.code}</span>
          </div>
          <span className="text-white font-mono text-sm">{item.balance.toFixed(2)}</span>
        </div>
      ))}
      
      <button 
        onClick={() => setIsDepositModalOpen(true)}
        className="w-full mt-3 py-2 text-xs text-gray-400 border border-[#1e2433] rounded hover:border-gray-500 hover:text-white transition-colors"
      >
        Deposit/Withdrawal
      </button>
    </div>
  );
};

export default WalletPanel;
