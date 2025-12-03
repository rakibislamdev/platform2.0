import React, { useState } from 'react';
import { Switch, Select, Input, Button, Divider, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  GlobalOutlined,
  SafetyOutlined,
  ApiOutlined,
  MobileOutlined,
  MailOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  
  // Profile settings
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    country: 'US',
    timezone: 'America/New_York',
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    loginAlerts: true,
    withdrawalConfirmation: true,
  });

  // Trading preferences
  const [trading, setTrading] = useState({
    defaultLeverage: '10',
    confirmOrders: true,
    soundAlerts: true,
    autoClosePositions: false,
    defaultOrderType: 'market',
    riskWarnings: true,
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    orderFilled: true,
    orderCancelled: true,
    depositWithdrawal: true,
    systemUpdates: false,
    marketNews: true,
    promotions: false,
  });

  // Display settings
  const [display, setDisplay] = useState({
    theme: 'dark',
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'comma',
  });

  const handleSave = () => {
    message.success('Settings saved successfully!');
  };

  const sections = [
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    { key: 'security', label: 'Security', icon: <LockOutlined /> },
    { key: 'trading', label: 'Trading', icon: <ApiOutlined /> },
    { key: 'notifications', label: 'Notifications', icon: <BellOutlined /> },
    { key: 'display', label: 'Display', icon: <GlobalOutlined /> },
  ];

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
            <Input
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              prefix={<UserOutlined className="text-gray-500" />}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
            <Input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              prefix={<MailOutlined className="text-gray-500" />}
              suffix={<CheckCircleOutlined className="text-green-500" />}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
            <Input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              prefix={<MobileOutlined className="text-gray-500" />}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Country</label>
            <Select
              value={profile.country}
              onChange={(value) => setProfile({ ...profile, country: value })}
              style={{ width: '100%' }}
              options={[
                { value: 'US', label: 'United States' },
                { value: 'UK', label: 'United Kingdom' },
                { value: 'CA', label: 'Canada' },
                { value: 'AU', label: 'Australia' },
                { value: 'DE', label: 'Germany' },
                { value: 'FR', label: 'France' },
                { value: 'JP', label: 'Japan' },
                { value: 'SG', label: 'Singapore' },
              ]}
            />
          </div>
        </div>
      </div>

      <Divider className="border-[#1e2433]" />

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Account Verification</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircleOutlined className="text-green-500 text-lg" />
              </div>
              <div>
                <div className="text-white font-medium">Email Verified</div>
                <div className="text-xs text-gray-500">Your email has been verified</div>
              </div>
            </div>
            <span className="text-green-500 text-sm">Verified</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <ExclamationCircleOutlined className="text-yellow-500 text-lg" />
              </div>
              <div>
                <div className="text-white font-medium">Identity Verification (KYC)</div>
                <div className="text-xs text-gray-500">Complete KYC to unlock higher limits</div>
              </div>
            </div>
            <Button size="small" type="primary">Verify Now</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center">
                <MobileOutlined className="text-gray-500 text-lg" />
              </div>
              <div>
                <div className="text-white font-medium">Phone Verification</div>
                <div className="text-xs text-gray-500">Add extra security with phone verification</div>
              </div>
            </div>
            <Button size="small">Add Phone</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Password</h3>
        <div className="p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1e2433] flex items-center justify-center">
                <KeyOutlined className="text-gray-400 text-lg" />
              </div>
              <div>
                <div className="text-white font-medium">Change Password</div>
                <div className="text-xs text-gray-500">Last changed 30 days ago</div>
              </div>
            </div>
            <Button>Change</Button>
          </div>
        </div>
      </div>

      <Divider className="border-[#1e2433]" />

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
        <div className="p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1e2433] flex items-center justify-center">
                <SafetyOutlined className="text-gray-400 text-lg" />
              </div>
              <div>
                <div className="text-white font-medium">Google Authenticator</div>
                <div className="text-xs text-gray-500">Add an extra layer of security</div>
              </div>
            </div>
            <Switch
              checked={security.twoFactorEnabled}
              onChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
            />
          </div>
        </div>
      </div>

      <Divider className="border-[#1e2433]" />

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Security Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Login Alerts</div>
              <div className="text-xs text-gray-500">Get notified of new login activity</div>
            </div>
            <Switch
              checked={security.loginAlerts}
              onChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Withdrawal Confirmation</div>
              <div className="text-xs text-gray-500">Require email confirmation for withdrawals</div>
            </div>
            <Switch
              checked={security.withdrawalConfirmation}
              onChange={(checked) => setSecurity({ ...security, withdrawalConfirmation: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Anti-Phishing Code</div>
              <div className="text-xs text-gray-500">Set a code to identify official emails</div>
            </div>
            <Button size="small">Setup</Button>
          </div>
        </div>
      </div>

      <Divider className="border-[#1e2433]" />

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <GlobalOutlined className="text-green-500 text-lg" />
              </div>
              <div>
                <div className="text-white font-medium">Chrome on Windows</div>
                <div className="text-xs text-gray-500">New York, US • Current session</div>
              </div>
            </div>
            <span className="text-green-500 text-sm">Active</span>
          </div>
          <Button danger className="w-full">Log Out All Other Sessions</Button>
        </div>
      </div>
    </div>
  );

  const renderTradingSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Order Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Default Order Type</div>
              <div className="text-xs text-gray-500">Set your preferred order type</div>
            </div>
            <Select
              value={trading.defaultOrderType}
              onChange={(value) => setTrading({ ...trading, defaultOrderType: value })}
              style={{ width: 150 }}
              options={[
                { value: 'market', label: 'Market' },
                { value: 'limit', label: 'Limit' },
                { value: 'stop', label: 'Stop' },
              ]}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Default Leverage</div>
              <div className="text-xs text-gray-500">Set your default leverage for trades</div>
            </div>
            <Select
              value={trading.defaultLeverage}
              onChange={(value) => setTrading({ ...trading, defaultLeverage: value })}
              style={{ width: 150 }}
              options={[
                { value: '1', label: '1x' },
                { value: '2', label: '2x' },
                { value: '5', label: '5x' },
                { value: '10', label: '10x' },
                { value: '20', label: '20x' },
                { value: '50', label: '50x' },
                { value: '100', label: '100x' },
              ]}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Order Confirmation</div>
              <div className="text-xs text-gray-500">Show confirmation dialog before placing orders</div>
            </div>
            <Switch
              checked={trading.confirmOrders}
              onChange={(checked) => setTrading({ ...trading, confirmOrders: checked })}
            />
          </div>
        </div>
      </div>

      <Divider className="border-[#1e2433]" />

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Risk Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Risk Warnings</div>
              <div className="text-xs text-gray-500">Show warnings for high-risk trades</div>
            </div>
            <Switch
              checked={trading.riskWarnings}
              onChange={(checked) => setTrading({ ...trading, riskWarnings: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Auto-Close Positions</div>
              <div className="text-xs text-gray-500">Automatically close positions at margin limit</div>
            </div>
            <Switch
              checked={trading.autoClosePositions}
              onChange={(checked) => setTrading({ ...trading, autoClosePositions: checked })}
            />
          </div>
        </div>
      </div>

      <Divider className="border-[#1e2433]" />

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Sound & Alerts</h3>
        <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
          <div>
            <div className="text-white font-medium">Sound Alerts</div>
            <div className="text-xs text-gray-500">Play sounds for order executions</div>
          </div>
          <Switch
            checked={trading.soundAlerts}
            onChange={(checked) => setTrading({ ...trading, soundAlerts: checked })}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Trading Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Price Alerts</div>
              <div className="text-xs text-gray-500">Get notified when prices hit your targets</div>
            </div>
            <Switch
              checked={notifications.priceAlerts}
              onChange={(checked) => setNotifications({ ...notifications, priceAlerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Order Filled</div>
              <div className="text-xs text-gray-500">Notify when your orders are executed</div>
            </div>
            <Switch
              checked={notifications.orderFilled}
              onChange={(checked) => setNotifications({ ...notifications, orderFilled: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Order Cancelled</div>
              <div className="text-xs text-gray-500">Notify when orders are cancelled</div>
            </div>
            <Switch
              checked={notifications.orderCancelled}
              onChange={(checked) => setNotifications({ ...notifications, orderCancelled: checked })}
            />
          </div>
        </div>
      </div>

      <Divider className="border-[#1e2433]" />

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Account Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Deposit & Withdrawal</div>
              <div className="text-xs text-gray-500">Notify on deposit/withdrawal status changes</div>
            </div>
            <Switch
              checked={notifications.depositWithdrawal}
              onChange={(checked) => setNotifications({ ...notifications, depositWithdrawal: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">System Updates</div>
              <div className="text-xs text-gray-500">Get notified about platform updates</div>
            </div>
            <Switch
              checked={notifications.systemUpdates}
              onChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
            />
          </div>
        </div>
      </div>

      <Divider className="border-[#1e2433]" />

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Marketing</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Market News</div>
              <div className="text-xs text-gray-500">Receive market analysis and news</div>
            </div>
            <Switch
              checked={notifications.marketNews}
              onChange={(checked) => setNotifications({ ...notifications, marketNews: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Promotions</div>
              <div className="text-xs text-gray-500">Receive promotional offers and updates</div>
            </div>
            <Switch
              checked={notifications.promotions}
              onChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDisplaySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Theme</div>
              <div className="text-xs text-gray-500">Choose your preferred theme</div>
            </div>
            <Select
              value={display.theme}
              onChange={(value) => setDisplay({ ...display, theme: value })}
              style={{ width: 150 }}
              options={[
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
                { value: 'system', label: 'System' },
              ]}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Language</div>
              <div className="text-xs text-gray-500">Select your preferred language</div>
            </div>
            <Select
              value={display.language}
              onChange={(value) => setDisplay({ ...display, language: value })}
              style={{ width: 150 }}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Español' },
                { value: 'fr', label: 'Français' },
                { value: 'de', label: 'Deutsch' },
                { value: 'ja', label: '日本語' },
                { value: 'zh', label: '中文' },
                { value: 'ko', label: '한국어' },
              ]}
            />
          </div>
        </div>
      </div>

      <Divider className="border-[#1e2433]" />

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Regional Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Display Currency</div>
              <div className="text-xs text-gray-500">Currency for displaying values</div>
            </div>
            <Select
              value={display.currency}
              onChange={(value) => setDisplay({ ...display, currency: value })}
              style={{ width: 150 }}
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
                { value: 'JPY', label: 'JPY (¥)' },
                { value: 'BTC', label: 'BTC (₿)' },
              ]}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Date Format</div>
              <div className="text-xs text-gray-500">How dates are displayed</div>
            </div>
            <Select
              value={display.dateFormat}
              onChange={(value) => setDisplay({ ...display, dateFormat: value })}
              style={{ width: 150 }}
              options={[
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
              ]}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0d111a] rounded-lg border border-[#1e2433]">
            <div>
              <div className="text-white font-medium">Number Format</div>
              <div className="text-xs text-gray-500">Thousands separator style</div>
            </div>
            <Select
              value={display.numberFormat}
              onChange={(value) => setDisplay({ ...display, numberFormat: value })}
              style={{ width: 150 }}
              options={[
                { value: 'comma', label: '1,234.56' },
                { value: 'period', label: '1.234,56' },
                { value: 'space', label: '1 234.56' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'security':
        return renderSecuritySection();
      case 'trading':
        return renderTradingSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'display':
        return renderDisplaySection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0a0e17]">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-[#1e2433] p-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === section.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-[#1e2433] hover:text-white'
              }`}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </nav>

        <Divider className="border-[#1e2433] my-4" />

        <div className="space-y-2">
          <Button block type="text" danger className="text-left justify-start">
            Delete Account
          </Button>
          <Button block type="text" className="text-left justify-start text-gray-400">
            Help & Support
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#1e2433] flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white capitalize">{activeSection}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {activeSection === 'profile' && 'Manage your personal information and verification'}
              {activeSection === 'security' && 'Secure your account with authentication options'}
              {activeSection === 'trading' && 'Configure your trading preferences'}
              {activeSection === 'notifications' && 'Control how you receive notifications'}
              {activeSection === 'display' && 'Customize your display preferences'}
            </p>
          </div>
          <Button type="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
