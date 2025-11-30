import React, { useState } from 'react';
import { Input, InputNumber, message } from 'antd';
import { 
  CreditCardOutlined, 
  WalletOutlined,
  CloseOutlined,
  CheckSquareOutlined 
} from '@ant-design/icons';
import useTradingStore from '../../store/tradingStore';

const DepositModal = () => {
  const { isDepositModalOpen, setIsDepositModalOpen } = useTradingStore();
  const [activeTab, setActiveTab] = useState('deposit');
  const [currency, setCurrency] = useState('BTC');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const currencies = [
    { code: 'BTC', name: 'Bitcoin' },
    { code: 'CRD', name: 'Credo' },
    { code: 'USD', name: 'US Dollar' },
  ];

  const paymentMethods = [
    { key: 'card', icon: <CreditCardOutlined className="text-2xl" />, label: 'Mastercard', last4: '4554' },
    { key: 'btc', icon: <WalletOutlined className="text-2xl" />, label: 'BTC Wallet', balance: '0.0456' },
  ];

  const handleDeposit = () => {
    if (!acceptTerms) {
      message.error('Please accept Terms & Conditions');
      return;
    }
    message.success(`Deposit initiated successfully!`);
    setIsDepositModalOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isDepositModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsDepositModalOpen(false)}
      />
      
      {/* Slide-in Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[380px] bg-[#0d111a] border-l border-[#1e2433] z-50 transform transition-transform duration-300 ease-out ${
          isDepositModalOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1e2433]">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`text-lg font-semibold transition-colors ${
                activeTab === 'deposit' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              DEPOSIT
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`text-lg font-semibold transition-colors ${
                activeTab === 'withdraw' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              WITHDRAWAL
            </button>
          </div>
          <button 
            onClick={() => setIsDepositModalOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 h-[calc(100%-60px)] overflow-y-auto">
          {/* Currency Tabs */}
          <div className="flex gap-2 mb-6">
            {currencies.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                  currency === c.code 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#1e2433] text-gray-400 hover:text-white'
                }`}
              >
                {c.code}
              </button>
            ))}
          </div>

          {/* Address Input */}
          <div className="mb-4">
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-[#151924] border-[#1e2433] text-white h-10"
            />
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <div className="relative">
              <Input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-[#151924] border-[#1e2433] text-white h-10 pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {currency === 'BTC' ? '₿' : '$'}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
              PAYMENT METHOD
            </h3>
            <div className="flex gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.key}
                  className="flex-1 p-4 bg-[#151924] border border-[#1e2433] rounded-lg cursor-pointer hover:border-blue-500/50 transition-colors"
                >
                  <div className="text-blue-400 mb-2">{method.icon}</div>
                  <p className="text-white text-sm font-medium">{method.label}</p>
                  <p className="text-cyan-400 text-xs">
                    {method.last4 ? `*${method.last4}` : method.balance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <div 
                onClick={() => setAcceptTerms(!acceptTerms)}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  acceptTerms 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border-[#1e2433] bg-[#151924]'
                }`}
              >
                {acceptTerms && <CheckSquareOutlined className="text-white text-xs" />}
              </div>
              <span className="text-gray-400 text-sm">Accept Terms & Conditions</span>
            </label>
          </div>

          {/* Deposit Button */}
          <button
            onClick={handleDeposit}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded font-semibold transition-colors"
          >
            DEPOSIT FUNDS
          </button>
        </div>
      </div>
    </>
  );
};

export default DepositModal;
