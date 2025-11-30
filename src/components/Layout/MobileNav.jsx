import React from 'react';
import { Drawer } from 'antd';
import {
  HomeOutlined,
  LineChartOutlined,
  WalletOutlined,
  HistoryOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import useTradingStore from '../../store/tradingStore';

const MobileNav = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen, activeTab, setActiveTab } = useTradingStore();

  const menuItems = [
    { key: 'trade', icon: <LineChartOutlined />, label: 'Trade' },
    { key: 'markets', icon: <HomeOutlined />, label: 'Markets' },
    { key: 'wallet', icon: <WalletOutlined />, label: 'Wallet' },
    { key: 'history', icon: <HistoryOutlined />, label: 'History' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    { key: 'help', icon: <QuestionCircleOutlined />, label: 'Help' },
  ];

  const bottomNavItems = [
    { key: 'trade', icon: <LineChartOutlined />, label: 'Trade' },
    { key: 'markets', icon: <HomeOutlined />, label: 'Markets' },
    { key: 'wallet', icon: <WalletOutlined />, label: 'Wallet' },
    { key: 'history', icon: <HistoryOutlined />, label: 'History' },
  ];

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">AT</span>
              </div>
              <span className="text-white font-bold">AroTrader</span>
            </div>
          </div>
        }
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        size="default"
        closeIcon={<CloseOutlined className="text-gray-400" />}
        className="mobile-drawer"
        styles={{
          header: { 
            background: '#151924', 
            borderBottom: '1px solid #1a1f2e' 
          },
          body: { 
            background: '#151924', 
            padding: 0 
          },
          wrapper: {
            width: 280,
          },
        }}
      >
        <div className="py-4">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${
                activeTab === item.key
                  ? 'bg-accent-blue/20 text-accent-blue border-r-2 border-accent-blue'
                  : 'text-gray-400 hover:text-white hover:bg-dark-200'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-100 bg-dark-300">
          <button className="w-full py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Deposit Funds
          </button>
        </div>
      </Drawer>

      {/* Bottom Navigation (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-300 border-t border-dark-100 z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex-1 flex flex-col items-center py-3 transition-all ${
                activeTab === item.key
                  ? 'text-accent-blue'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
