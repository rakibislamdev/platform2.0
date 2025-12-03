import React, { useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import useTradingStore from './store/tradingStore';
import { TradingChart } from './components/Chart';
import { SymbolSelector } from './components/Symbol';
import { TradingPanel } from './components/TradingPanel';
import { OrderBook } from './components/OrderBook';
import { RecentTrades } from './components/Trades';
import { WalletPanel, WalletPage } from './components/Wallet';
import { DepositModal } from './components/Modals';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import './App.css';

function App() {
  const { updatePrice, addNewCandle, setIsDepositModalOpen, activeTab, setActiveTab } = useTradingStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Real-time price updates
  useEffect(() => {
    const priceInterval = setInterval(() => {
      updatePrice();
    }, 1000);

    const candleInterval = setInterval(() => {
      addNewCandle();
    }, 60000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(candleInterval);
    };
  }, [updatePrice, addNewCandle]);

  const navItems = [
    { key: 'trade', label: 'TRADE' },
    { key: 'wallet', label: 'WALLET' },
    { key: 'settings', label: 'SETTINGS' },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#2962ff',
          colorBgContainer: '#0d111a',
          colorBgElevated: '#151924',
          colorBorder: '#1e2433',
          colorText: '#e5e7eb',
          colorTextSecondary: '#9ca3af',
          borderRadius: 4,
        },
      }}
    >
      <div className="h-screen w-screen bg-[#0a0e17] flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-12 bg-[#0d111a] border-b border-[#1e2433] flex items-center justify-between px-4 flex-shrink-0">
          {/* Left - Logo & Menu */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <MenuOutlined className="text-lg" />
            </button>
          </div>

          {/* Center - Navigation */}
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`text-sm font-medium transition-colors ${
                  activeTab === item.key
                    ? 'text-white border-b-2 border-blue-500 pb-1'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right - Deposit & User */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="px-4 py-1.5 bg-transparent border border-[#1e2433] text-gray-300 rounded text-sm hover:border-gray-500"
            >
              DEPOSIT/WITHDRAWAL
            </button>
            <button className="w-8 h-8 rounded-full bg-[#1e2433] flex items-center justify-center text-gray-400 hover:text-white">
              <UserOutlined />
            </button>
          </div>
        </header>

        {/* Main Content - Fixed Height, No Scroll */}
        <main className="flex-1 flex overflow-hidden">
          {activeTab === 'trade' && (
            <>
              {/* Left Sidebar */}
              <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} border-r border-[#1e2433] flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden`}>
                {/* Symbol Selector */}
                <SymbolSelector />
                
                {/* Wallet/Balances */}
                <WalletPanel />
                
                {/* Trading Panel */}
                <TradingPanel />
              </aside>

              {/* Center Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Chart Area */}
                <div className="flex-1 min-h-0">
                  <TradingChart />
                </div>
                
                {/* Bottom - Order Book & Trades */}
                <div className="h-[280px] flex border-t border-[#1e2433] flex-shrink-0">
                  <div className="flex-1 border-r border-[#1e2433]">
                    <OrderBook />
                  </div>
                  <div className="w-[320px]">
                    <RecentTrades />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'wallet' && (
            <WalletPage />
          )}

          {activeTab === 'settings' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl text-gray-600 mb-4">⚙️</div>
                <h3 className="text-white text-lg mb-2">Settings</h3>
                <p className="text-gray-500">Coming Soon - Account settings, preferences, and more</p>
              </div>
            </div>
          )}
        </main>
        
        {/* Modals */}
        <DepositModal />
      </div>
    </ConfigProvider>
  );
}

export default App;

