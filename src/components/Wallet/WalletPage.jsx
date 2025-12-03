import React, { useState } from 'react';
import { Table, Tabs, Input, Button, Tag, Progress } from 'antd';
import { 
  SearchOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  SwapOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  WalletOutlined,
  HistoryOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import useTradingStore from '../../store/tradingStore';

const WalletPage = () => {
  const { balances, setIsDepositModalOpen } = useTradingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [hideSmallBalances, setHideSmallBalances] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [activeTab, setActiveTab] = useState('assets');

  // Currency data with icons and prices
  const currencies = [
    { code: 'USD', name: 'US Dollar', icon: '$', price: 1.00, change: 0 },
    { code: 'EUR', name: 'Euro', icon: '€', price: 1.085, change: 0.12 },
    { code: 'GBP', name: 'British Pound', icon: '£', price: 1.265, change: -0.08 },
    { code: 'JPY', name: 'Japanese Yen', icon: '¥', price: 0.0067, change: 0.15 },
    { code: 'AUD', name: 'Australian Dollar', icon: 'A$', price: 0.655, change: 0.22 },
    { code: 'CAD', name: 'Canadian Dollar', icon: 'C$', price: 0.732, change: -0.05 },
    { code: 'CHF', name: 'Swiss Franc', icon: 'Fr', price: 1.128, change: 0.03 },
    { code: 'NZD', name: 'New Zealand Dollar', icon: 'NZ$', price: 0.605, change: 0.18 },
    { code: 'XAU', name: 'Gold (oz)', icon: '🥇', price: 2050.00, change: 0.45 },
    { code: 'XAG', name: 'Silver (oz)', icon: '🥈', price: 24.50, change: -0.32 },
  ];

  // Calculate portfolio data
  const portfolioData = currencies.map(currency => {
    const balance = balances[currency.code] || 0;
    const valueInUSD = balance * currency.price;
    return {
      ...currency,
      balance,
      valueInUSD,
    };
  }).filter(item => !hideSmallBalances || item.valueInUSD > 1);

  // Filter by search
  const filteredData = portfolioData.filter(item => 
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals
  const totalBalance = portfolioData.reduce((sum, item) => sum + item.valueInUSD, 0);
  const topAssets = [...portfolioData].sort((a, b) => b.valueInUSD - a.valueInUSD).slice(0, 3);

  // Transaction history mock data
  const transactions = [
    { id: 1, type: 'deposit', currency: 'USD', amount: 5000, status: 'completed', date: '2024-12-04 14:30', txId: 'TXN001234' },
    { id: 2, type: 'withdraw', currency: 'EUR', amount: 500, status: 'completed', date: '2024-12-03 10:15', txId: 'TXN001233' },
    { id: 3, type: 'trade', currency: 'GBP', amount: 200, status: 'completed', date: '2024-12-02 09:45', txId: 'TXN001232' },
    { id: 4, type: 'deposit', currency: 'USD', amount: 2500, status: 'pending', date: '2024-12-01 16:20', txId: 'TXN001231' },
    { id: 5, type: 'withdraw', currency: 'JPY', amount: 50000, status: 'completed', date: '2024-11-30 11:00', txId: 'TXN001230' },
    { id: 6, type: 'trade', currency: 'XAU', amount: 0.5, status: 'completed', date: '2024-11-29 15:30', txId: 'TXN001229' },
  ];

  // Asset columns
  const assetColumns = [
    {
      title: 'Asset',
      dataIndex: 'code',
      key: 'asset',
      render: (code, record) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1e2433] flex items-center justify-center text-lg">
            {record.icon}
          </div>
          <div>
            <div className="text-white font-medium">{code}</div>
            <div className="text-xs text-gray-500">{record.name}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right',
      render: (balance, record) => (
        <span className="font-mono text-white">
          {showBalances ? balance.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '••••••'}
        </span>
      ),
    },
    {
      title: 'Value (USD)',
      dataIndex: 'valueInUSD',
      key: 'value',
      align: 'right',
      sorter: (a, b) => a.valueInUSD - b.valueInUSD,
      render: (value) => (
        <span className="font-mono text-white">
          {showBalances ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
        </span>
      ),
    },
    {
      title: '24h Change',
      dataIndex: 'change',
      key: 'change',
      align: 'right',
      render: (change) => (
        <span className={`font-mono ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-2">
          <Button 
            size="small" 
            type="primary"
            onClick={() => setIsDepositModalOpen(true)}
          >
            Deposit
          </Button>
          <Button 
            size="small"
            onClick={() => setIsDepositModalOpen(true)}
          >
            Withdraw
          </Button>
        </div>
      ),
    },
  ];

  // Transaction columns
  const transactionColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const config = {
          deposit: { color: 'green', icon: <ArrowDownOutlined />, label: 'Deposit' },
          withdraw: { color: 'red', icon: <ArrowUpOutlined />, label: 'Withdraw' },
          trade: { color: 'blue', icon: <SwapOutlined />, label: 'Trade' },
        };
        const { color, icon, label } = config[type] || {};
        return (
          <Tag color={color} icon={icon}>
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount, record) => (
        <span className={`font-mono ${record.type === 'deposit' ? 'text-green-500' : record.type === 'withdraw' ? 'text-red-500' : 'text-white'}`}>
          {record.type === 'deposit' ? '+' : record.type === 'withdraw' ? '-' : ''}{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Transaction ID',
      dataIndex: 'txId',
      key: 'txId',
      render: (txId) => (
        <span className="text-xs text-gray-500 font-mono">{txId}</span>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0e17]">
      {/* Portfolio Overview Header */}
      <div className="p-6 border-b border-[#1e2433]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400 text-sm">Total Portfolio Value</span>
              <button 
                onClick={() => setShowBalances(!showBalances)}
                className="text-gray-500 hover:text-white"
              >
                {showBalances ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </button>
            </div>
            <h1 className="text-3xl font-bold text-white font-mono">
              {showBalances ? `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-green-500 text-sm">+$234.56 (1.23%)</span>
              <span className="text-gray-500 text-xs">24h</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="primary" 
              icon={<ArrowDownOutlined />}
              onClick={() => setIsDepositModalOpen(true)}
            >
              Deposit
            </Button>
            <Button 
              icon={<ArrowUpOutlined />}
              onClick={() => setIsDepositModalOpen(true)}
            >
              Withdraw
            </Button>
            <Button icon={<SwapOutlined />}>
              Transfer
            </Button>
          </div>
        </div>

        {/* Top Assets */}
        <div className="grid grid-cols-3 gap-4">
          {topAssets.map((asset, index) => (
            <div key={asset.code} className="bg-[#0d111a] rounded-lg p-4 border border-[#1e2433]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1e2433] flex items-center justify-center text-sm">
                    {asset.icon}
                  </div>
                  <span className="text-white font-medium">{asset.code}</span>
                </div>
                <span className={`text-xs ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {asset.change >= 0 ? '+' : ''}{asset.change}%
                </span>
              </div>
              <div className="text-lg font-mono text-white">
                {showBalances ? `$${asset.valueInUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
              </div>
              <div className="text-xs text-gray-500">
                {showBalances ? `${asset.balance.toLocaleString()} ${asset.code}` : '••••••'}
              </div>
              <Progress 
                percent={Math.round((asset.valueInUSD / totalBalance) * 100)} 
                showInfo={false}
                strokeColor={index === 0 ? '#2962ff' : index === 1 ? '#26a69a' : '#f59e0b'}
                trailColor="#1e2433"
                size="small"
                className="mt-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex-1 flex flex-col overflow-hidden p-6">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'assets',
              label: (
                <span className="flex items-center gap-2">
                  <WalletOutlined />
                  Assets
                </span>
              ),
            },
            {
              key: 'history',
              label: (
                <span className="flex items-center gap-2">
                  <HistoryOutlined />
                  Transaction History
                </span>
              ),
            },
            {
              key: 'analytics',
              label: (
                <span className="flex items-center gap-2">
                  <PieChartOutlined />
                  Analytics
                </span>
              ),
            },
          ]}
        />

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'assets' && (
            <div className="h-full flex flex-col">
              {/* Search and Filters */}
              <div className="flex items-center justify-between mb-4">
                <Input
                  placeholder="Search assets..."
                  prefix={<SearchOutlined className="text-gray-500" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: 250 }}
                />
                <label className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hideSmallBalances}
                    onChange={(e) => setHideSmallBalances(e.target.checked)}
                    className="rounded"
                  />
                  Hide small balances
                </label>
              </div>

              {/* Assets Table */}
              <div className="flex-1 overflow-auto">
                <Table
                  dataSource={filteredData}
                  columns={assetColumns}
                  rowKey="code"
                  pagination={false}
                  size="middle"
                  className="wallet-table"
                />
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="h-full overflow-auto">
              <Table
                dataSource={transactions}
                columns={transactionColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                size="middle"
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <PieChartOutlined className="text-6xl text-gray-600 mb-4" />
                <h3 className="text-white text-lg mb-2">Portfolio Analytics</h3>
                <p className="text-gray-500">Coming Soon - Detailed portfolio breakdown and performance metrics</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
