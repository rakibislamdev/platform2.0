import React from 'react';
import { 
  MenuOutlined, 
  UserOutlined, 
  SettingOutlined, 
  BellOutlined,
  WalletOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import { Dropdown, Avatar } from 'antd';
import useTradingStore from '../../store/tradingStore';

const Header = () => {
  const { setIsMobileMenuOpen, setIsDepositModalOpen } = useTradingStore();

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'wallet',
      icon: <WalletOutlined />,
      label: 'Wallet',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const notifications = [
    { id: 1, title: 'Price Alert', message: 'EUR/USD reached 1.0850', time: '2m ago', read: false },
    { id: 2, title: 'Order Filled', message: 'Buy order for GBP/USD executed', time: '15m ago', read: false },
    { id: 3, title: 'Margin Call', message: 'Your margin level is at 120%', time: '1h ago', read: true },
  ];

  return (
    <header className="h-16 bg-dark-300 border-b border-dark-100 flex items-center justify-between px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-dark-200 transition-colors"
        >
          <MenuOutlined className="text-xl" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
            <span className="text-white font-bold text-lg">AT</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white font-bold text-lg">AroTrader</h1>
            <p className="text-gray-500 text-xs">Forex Trading Platform</p>
          </div>
        </div>
      </div>

      {/* Center Navigation (Desktop) */}
      <nav className="hidden lg:flex items-center gap-1">
        {['Trade', 'Markets', 'Portfolio', 'News', 'Academy'].map((item, index) => (
          <button
            key={item}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              index === 0
                ? 'bg-accent-blue text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-200'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Deposit Button */}
        <button
          onClick={() => setIsDepositModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <WalletOutlined />
          Deposit
        </button>

        {/* Notifications */}
        <Dropdown
          menu={{
            items: notifications.map(n => ({
              key: n.id,
              label: (
                <div className="py-1 max-w-[250px]">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium text-sm ${n.read ? 'text-gray-400' : 'text-white'}`}>
                      {n.title}
                    </span>
                    <span className="text-xs text-gray-500">{n.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{n.message}</p>
                </div>
              ),
            })),
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-dark-200 transition-colors relative">
            <BellOutlined className="text-xl" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full" />
          </button>
        </Dropdown>

        {/* User Menu */}
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-dark-200 transition-colors">
            <Avatar 
              size={36} 
              className="bg-gradient-to-br from-accent-blue to-accent-purple"
              icon={<UserOutlined />}
            />
            <div className="hidden md:block text-left">
              <p className="text-white text-sm font-medium">Trader</p>
              <p className="text-gray-500 text-xs">Pro Account</p>
            </div>
          </button>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
