import React, { useState } from 'react';
import { Table, Tabs, Input, Button, Tag, Progress, Select } from 'antd';
import ReactECharts from 'echarts-for-react';
import { 
  SearchOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  SwapOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  WalletOutlined,
  HistoryOutlined,
  PieChartOutlined,
  LineChartOutlined,
  RiseOutlined,
  FallOutlined,
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
            <div className="h-full overflow-auto">
              {/* Analytics Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Portfolio Analytics</h3>
                  <p className="text-sm text-gray-500">Detailed breakdown of your portfolio performance</p>
                </div>
                <Select
                  defaultValue="30d"
                  style={{ width: 150 }}
                  options={[
                    { value: '7d', label: 'Last 7 Days' },
                    { value: '30d', label: 'Last 30 Days' },
                    { value: '90d', label: 'Last 90 Days' },
                    { value: '1y', label: 'Last Year' },
                    { value: 'all', label: 'All Time' },
                  ]}
                />
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-[#0d111a] rounded-lg p-4 border border-[#1e2433]">
                  <div className="text-gray-500 text-xs mb-1">Total Portfolio Value</div>
                  <div className="text-2xl font-bold text-white font-mono">
                    ${showBalances ? totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '••••••'}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <RiseOutlined className="text-green-500 text-xs" />
                    <span className="text-green-500 text-xs">+12.5%</span>
                    <span className="text-gray-500 text-xs">vs last month</span>
                  </div>
                </div>

                <div className="bg-[#0d111a] rounded-lg p-4 border border-[#1e2433]">
                  <div className="text-gray-500 text-xs mb-1">Total Profit/Loss</div>
                  <div className="text-2xl font-bold text-green-500 font-mono">
                    {showBalances ? '+$2,456.78' : '••••••'}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <RiseOutlined className="text-green-500 text-xs" />
                    <span className="text-green-500 text-xs">+8.3%</span>
                    <span className="text-gray-500 text-xs">ROI</span>
                  </div>
                </div>

                <div className="bg-[#0d111a] rounded-lg p-4 border border-[#1e2433]">
                  <div className="text-gray-500 text-xs mb-1">Best Performer</div>
                  <div className="text-2xl font-bold text-white">XAU</div>
                  <div className="flex items-center gap-1 mt-1">
                    <RiseOutlined className="text-green-500 text-xs" />
                    <span className="text-green-500 text-xs">+15.2%</span>
                    <span className="text-gray-500 text-xs">this month</span>
                  </div>
                </div>

                <div className="bg-[#0d111a] rounded-lg p-4 border border-[#1e2433]">
                  <div className="text-gray-500 text-xs mb-1">Worst Performer</div>
                  <div className="text-2xl font-bold text-white">XAG</div>
                  <div className="flex items-center gap-1 mt-1">
                    <FallOutlined className="text-red-500 text-xs" />
                    <span className="text-red-500 text-xs">-3.2%</span>
                    <span className="text-gray-500 text-xs">this month</span>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Portfolio Value Chart */}
                <div className="bg-[#0d111a] rounded-lg p-4 border border-[#1e2433]">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Portfolio Value Over Time</h4>
                    <LineChartOutlined className="text-gray-500" />
                  </div>
                  <ReactECharts
                    option={{
                      tooltip: {
                        trigger: 'axis',
                        backgroundColor: 'rgba(21, 25, 36, 0.95)',
                        borderColor: '#1e2433',
                        textStyle: { color: '#e5e7eb' },
                      },
                      grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        top: '10%',
                        containLabel: true,
                      },
                      xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['Nov 5', 'Nov 10', 'Nov 15', 'Nov 20', 'Nov 25', 'Nov 30', 'Dec 4'],
                        axisLine: { lineStyle: { color: '#1e2433' } },
                        axisLabel: { color: '#9ca3af' },
                      },
                      yAxis: {
                        type: 'value',
                        axisLine: { show: false },
                        axisLabel: { color: '#9ca3af', formatter: (value) => '$' + value },
                        splitLine: { lineStyle: { color: '#1e2433' } },
                      },
                      series: [{
                        data: [25000, 26500, 25800, 28000, 27500, 29000, totalBalance],
                        type: 'line',
                        smooth: true,
                        lineStyle: { color: '#2962ff', width: 2 },
                        areaStyle: {
                          color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                              { offset: 0, color: 'rgba(41, 98, 255, 0.3)' },
                              { offset: 1, color: 'rgba(41, 98, 255, 0.05)' },
                            ],
                          },
                        },
                        showSymbol: false,
                      }],
                    }}
                    style={{ height: 250 }}
                  />
                </div>

                {/* Asset Allocation Pie Chart */}
                <div className="bg-[#0d111a] rounded-lg p-4 border border-[#1e2433]">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-medium">Asset Allocation</h4>
                    <PieChartOutlined className="text-gray-500" />
                  </div>
                  <ReactECharts
                    option={{
                      tooltip: {
                        trigger: 'item',
                        backgroundColor: 'rgba(21, 25, 36, 0.95)',
                        borderColor: '#1e2433',
                        textStyle: { color: '#e5e7eb' },
                        formatter: (params) => params.name + ': $' + params.value + ' (' + params.percent + '%)',
                      },
                      legend: {
                        orient: 'vertical',
                        right: '5%',
                        top: 'center',
                        textStyle: { color: '#9ca3af' },
                      },
                      series: [{
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['35%', '50%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                          borderRadius: 4,
                          borderColor: '#0d111a',
                          borderWidth: 2,
                        },
                        label: { show: false },
                        emphasis: {
                          label: { show: false },
                        },
                        data: portfolioData
                          .filter(item => item.valueInUSD > 0)
                          .sort((a, b) => b.valueInUSD - a.valueInUSD)
                          .slice(0, 6)
                          .map((item, index) => ({
                            value: Math.round(item.valueInUSD * 100) / 100,
                            name: item.code,
                            itemStyle: {
                              color: ['#2962ff', '#26a69a', '#f59e0b', '#ef5350', '#8b5cf6', '#ec4899'][index],
                            },
                          })),
                      }],
                    }}
                    style={{ height: 250 }}
                  />
                </div>
              </div>

              {/* Performance Table */}
              <div className="bg-[#0d111a] rounded-lg p-4 border border-[#1e2433]">
                <h4 className="text-white font-medium mb-4">Asset Performance</h4>
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-gray-500 text-xs border-b border-[#1e2433]">
                        <th className="text-left py-3 px-2">Asset</th>
                        <th className="text-right py-3 px-2">Holdings</th>
                        <th className="text-right py-3 px-2">Value</th>
                        <th className="text-right py-3 px-2">Allocation</th>
                        <th className="text-right py-3 px-2">24h Change</th>
                        <th className="text-right py-3 px-2">7d Change</th>
                        <th className="text-right py-3 px-2">30d Change</th>
                        <th className="text-right py-3 px-2">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData
                        .filter(item => item.valueInUSD > 0)
                        .sort((a, b) => b.valueInUSD - a.valueInUSD)
                        .map((item, index) => {
                          const allocation = totalBalance > 0 ? (item.valueInUSD / totalBalance) * 100 : 0;
                          const change7d = (Math.random() * 10 - 3).toFixed(2);
                          const change30d = (Math.random() * 20 - 5).toFixed(2);
                          const pnl = (item.valueInUSD * (Math.random() * 0.2 - 0.05)).toFixed(2);
                          
                          return (
                            <tr key={item.code} className="border-b border-[#1e2433] hover:bg-[#151924]">
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-[#1e2433] flex items-center justify-center text-sm">
                                    {item.icon}
                                  </div>
                                  <div>
                                    <div className="text-white font-medium text-sm">{item.code}</div>
                                    <div className="text-xs text-gray-500">{item.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="text-right py-3 px-2 font-mono text-white text-sm">
                                {showBalances ? item.balance.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '••••'}
                              </td>
                              <td className="text-right py-3 px-2 font-mono text-white text-sm">
                                {showBalances ? `$${item.valueInUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••'}
                              </td>
                              <td className="text-right py-3 px-2">
                                <div className="flex items-center justify-end gap-2">
                                  <Progress 
                                    percent={allocation} 
                                    showInfo={false} 
                                    strokeColor="#2962ff"
                                    trailColor="#1e2433"
                                    size="small"
                                    style={{ width: 60 }}
                                  />
                                  <span className="text-gray-400 text-xs w-12 text-right">{allocation.toFixed(1)}%</span>
                                </div>
                              </td>
                              <td className={`text-right py-3 px-2 font-mono text-sm ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                              </td>
                              <td className={`text-right py-3 px-2 font-mono text-sm ${parseFloat(change7d) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {parseFloat(change7d) >= 0 ? '+' : ''}{change7d}%
                              </td>
                              <td className={`text-right py-3 px-2 font-mono text-sm ${parseFloat(change30d) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {parseFloat(change30d) >= 0 ? '+' : ''}{change30d}%
                              </td>
                              <td className={`text-right py-3 px-2 font-mono text-sm ${parseFloat(pnl) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {showBalances ? (parseFloat(pnl) >= 0 ? '+$' : '-$') + Math.abs(parseFloat(pnl)).toLocaleString() : '••••'}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly Summary */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-[#0d111a] rounded-lg p-4 border border-[#1e2433]">
                  <h4 className="text-white font-medium mb-3">Monthly Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Total Deposits</span>
                      <span className="text-green-500 font-mono text-sm">+$7,500.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Total Withdrawals</span>
                      <span className="text-red-500 font-mono text-sm">-$2,100.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Trading P&L</span>
                      <span className="text-green-500 font-mono text-sm">+$456.78</span>
                    </div>
                    <div className="flex justify-between border-t border-[#1e2433] pt-3">
                      <span className="text-white text-sm font-medium">Net Change</span>
                      <span className="text-green-500 font-mono text-sm font-medium">+$5,856.78</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0d111a] rounded-lg p-4 border border-[#1e2433]">
                  <h4 className="text-white font-medium mb-3">Trading Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Total Trades</span>
                      <span className="text-white font-mono text-sm">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Win Rate</span>
                      <span className="text-green-500 font-mono text-sm">64.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Avg Trade Size</span>
                      <span className="text-white font-mono text-sm">$523.40</span>
                    </div>
                    <div className="flex justify-between border-t border-[#1e2433] pt-3">
                      <span className="text-white text-sm font-medium">Best Trade</span>
                      <span className="text-green-500 font-mono text-sm font-medium">+$1,245.00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0d111a] rounded-lg p-4 border border-[#1e2433]">
                  <h4 className="text-white font-medium mb-3">Risk Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Sharpe Ratio</span>
                      <span className="text-white font-mono text-sm">1.42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Max Drawdown</span>
                      <span className="text-red-500 font-mono text-sm">-8.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Volatility</span>
                      <span className="text-yellow-500 font-mono text-sm">Medium</span>
                    </div>
                    <div className="flex justify-between border-t border-[#1e2433] pt-3">
                      <span className="text-white text-sm font-medium">Risk Score</span>
                      <span className="text-green-500 font-mono text-sm font-medium">7.2/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
