import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  CloudServerOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

// Check if forex market is open (24/5 - Sunday 5PM EST to Friday 5PM EST)
const getMarketStatus = () => {
  const now = new Date();
  
  // Convert to EST/EDT
  const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = estTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = estTime.getHours();
  const minutes = estTime.getMinutes();
  
  // Check active sessions
  const activeSessions = [];
  
  // Sydney session (crosses midnight) - 5PM - 2AM EST
  if (hour >= 17 || hour < 2) activeSessions.push('Sydney');
  // Tokyo session (crosses midnight) - 7PM - 4AM EST
  if (hour >= 19 || hour < 4) activeSessions.push('Tokyo');
  // London session - 3AM - 12PM EST
  if (hour >= 3 && hour < 12) activeSessions.push('London');
  // New York session - 8AM - 5PM EST
  if (hour >= 8 && hour < 17) activeSessions.push('New York');
  
  // Market is closed on weekends
  // Closed: Friday 5PM EST to Sunday 5PM EST
  let isOpen = true;
  let statusMessage = '';
  
  if (day === 6) {
    // Saturday - always closed
    isOpen = false;
    statusMessage = 'Opens Sunday 5:00 PM EST';
  } else if (day === 0 && hour < 17) {
    // Sunday before 5PM - closed
    isOpen = false;
    const hoursUntilOpen = 17 - hour;
    statusMessage = `Opens in ${hoursUntilOpen}h ${60 - minutes}m`;
  } else if (day === 5 && hour >= 17) {
    // Friday after 5PM - closed
    isOpen = false;
    statusMessage = 'Opens Sunday 5:00 PM EST';
  } else {
    isOpen = true;
    statusMessage = activeSessions.length > 0 
      ? `${activeSessions.join(' & ')} Session${activeSessions.length > 1 ? 's' : ''}`
      : 'Market Open';
  }
  
  return {
    isOpen,
    message: statusMessage,
    activeSessions,
    currentTime: estTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    timezone: 'EST',
  };
};

const LoginPage = ({ onLogin }) => {
  // Market status state
  const [marketStatus, setMarketStatus] = useState(getMarketStatus());

  // Update market status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketStatus(getMarketStatus());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const [formData, setFormData] = useState({
    login: '',
    server: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.login || !formData.server || !formData.password) {
      message.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store auth data
    localStorage.setItem('authData', JSON.stringify({
      login: formData.login,
      server: formData.server,
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
    }));

    setIsLoading(false);
    message.success('Login successful!');
    onLogin();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#030508]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-green-600/30 to-blue-600/30 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-cyan-500/20 to-green-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-blue-900/10 to-cyan-900/10 blur-[150px]" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Candlestick Chart Pattern - Left */}
        <svg className="absolute left-10 bottom-20 w-72 h-48 opacity-10" viewBox="0 0 300 200">
          <g className="animate-pulse" style={{ animationDuration: '3s' }}>
            <line x1="30" y1="40" x2="30" y2="150" stroke="#22c55e" strokeWidth="1" />
            <rect x="22" y="60" width="16" height="50" fill="#22c55e" />
            <line x1="70" y1="30" x2="70" y2="140" stroke="#ef4444" strokeWidth="1" />
            <rect x="62" y="50" width="16" height="60" fill="#ef4444" />
            <line x1="110" y1="50" x2="110" y2="160" stroke="#22c55e" strokeWidth="1" />
            <rect x="102" y="70" width="16" height="55" fill="#22c55e" />
            <line x1="150" y1="25" x2="150" y2="120" stroke="#22c55e" strokeWidth="1" />
            <rect x="142" y="40" width="16" height="50" fill="#22c55e" />
            <line x1="190" y1="45" x2="190" y2="135" stroke="#ef4444" strokeWidth="1" />
            <rect x="182" y="60" width="16" height="45" fill="#ef4444" />
            <line x1="230" y1="35" x2="230" y2="125" stroke="#22c55e" strokeWidth="1" />
            <rect x="222" y="50" width="16" height="50" fill="#22c55e" />
          </g>
        </svg>
        
        {/* Candlestick Chart Pattern - Right */}
        <svg className="absolute right-10 top-20 w-72 h-48 opacity-10" viewBox="0 0 300 200">
          <g className="animate-pulse" style={{ animationDuration: '4s' }}>
            <line x1="30" y1="50" x2="30" y2="140" stroke="#ef4444" strokeWidth="1" />
            <rect x="22" y="65" width="16" height="40" fill="#ef4444" />
            <line x1="70" y1="40" x2="70" y2="150" stroke="#22c55e" strokeWidth="1" />
            <rect x="62" y="55" width="16" height="55" fill="#22c55e" />
            <line x1="110" y1="30" x2="110" y2="120" stroke="#22c55e" strokeWidth="1" />
            <rect x="102" y="45" width="16" height="45" fill="#22c55e" />
            <line x1="150" y1="60" x2="150" y2="150" stroke="#ef4444" strokeWidth="1" />
            <rect x="142" y="80" width="16" height="50" fill="#ef4444" />
            <line x1="190" y1="25" x2="190" y2="115" stroke="#22c55e" strokeWidth="1" />
            <rect x="182" y="40" width="16" height="48" fill="#22c55e" />
          </g>
        </svg>

        {/* Floating Currency Symbols */}
        <div className="absolute top-20 left-20 text-5xl text-white/[0.03] font-bold animate-pulse" style={{ animationDuration: '5s' }}>$</div>
        <div className="absolute top-40 right-32 text-6xl text-white/[0.03] font-bold animate-pulse" style={{ animationDuration: '6s' }}>€</div>
        <div className="absolute bottom-32 left-40 text-5xl text-white/[0.03] font-bold animate-pulse" style={{ animationDuration: '4s' }}>£</div>
        <div className="absolute bottom-20 right-20 text-6xl text-white/[0.03] font-bold animate-pulse" style={{ animationDuration: '7s' }}>¥</div>
        <div className="absolute top-1/2 left-10 text-4xl text-white/[0.03] font-bold animate-pulse" style={{ animationDuration: '5.5s' }}>₿</div>
        <div className="absolute top-1/3 right-10 text-4xl text-white/[0.03] font-bold animate-pulse" style={{ animationDuration: '4.5s' }}>₽</div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-500/50 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}

        {/* Glowing Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-green-500/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Glow Effect Behind Card */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-xl rounded-3xl transform scale-105" />
        
        <div className="relative bg-[#0a0e17]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Top Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          
          {/* Card Content */}
          <div className="p-8 md:p-10">
            {/* Logo & Title */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 via-blue-500 to-cyan-500 mb-4 shadow-lg shadow-green-500/25">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="8" width="3" height="8" rx="0.5" fill="currentColor" />
                  <line x1="5.5" y1="5" x2="5.5" y2="8" />
                  <line x1="5.5" y1="16" x2="5.5" y2="19" />
                  <rect x="10.5" y="10" width="3" height="6" rx="0.5" fill="none" />
                  <line x1="12" y1="7" x2="12" y2="10" />
                  <line x1="12" y1="16" x2="12" y2="20" />
                  <rect x="17" y="6" width="3" height="10" rx="0.5" fill="currentColor" />
                  <line x1="18.5" y1="3" x2="18.5" y2="6" />
                  <line x1="18.5" y1="16" x2="18.5" y2="19" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">PIPX</h1>
              <p className="text-gray-500 text-sm">Access Global Forex Markets</p>
              {/* Live Market Indicator */}
              <div className="flex flex-col items-center gap-1 mt-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    {marketStatus.isOpen ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    )}
                  </span>
                  <span className={`text-xs ${marketStatus.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                    {marketStatus.isOpen ? 'Markets Open' : 'Markets Closed'}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500">
                  {marketStatus.message} • {marketStatus.currentTime} {marketStatus.timezone}
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Login Field */}
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm ${focusedField === 'login' ? 'opacity-100' : ''}`} />
                <div className="relative bg-[#0d1320] rounded-xl border border-white/5 overflow-hidden">
                  <div className="flex items-center px-4">
                    <UserOutlined className={`text-lg transition-colors duration-300 ${focusedField === 'login' ? 'text-blue-500' : 'text-gray-600'}`} />
                    <input
                      type="text"
                      placeholder="Login ID"
                      value={formData.login}
                      onChange={(e) => handleChange('login', e.target.value)}
                      onFocus={() => setFocusedField('login')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent border-none px-3 py-4 text-white placeholder-gray-600 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Server Field */}
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm ${focusedField === 'server' ? 'opacity-100' : ''}`} />
                <div className="relative bg-[#0d1320] rounded-xl border border-white/5 overflow-hidden">
                  <div className="flex items-center px-4">
                    <CloudServerOutlined className={`text-lg transition-colors duration-300 ${focusedField === 'server' ? 'text-purple-500' : 'text-gray-600'}`} />
                    <input
                      type="text"
                      placeholder="Server Address"
                      value={formData.server}
                      onChange={(e) => handleChange('server', e.target.value)}
                      onFocus={() => setFocusedField('server')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent border-none px-3 py-4 text-white placeholder-gray-600 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm ${focusedField === 'password' ? 'opacity-100' : ''}`} />
                <div className="relative bg-[#0d1320] rounded-xl border border-white/5 overflow-hidden">
                  <div className="flex items-center px-4">
                    <LockOutlined className={`text-lg transition-colors duration-300 ${focusedField === 'password' ? 'text-cyan-500' : 'text-gray-600'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent border-none px-3 py-4 text-white placeholder-gray-600 focus:outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-600 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center text-sm">
                <label className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors">
                  <input type="checkbox" className="rounded bg-[#0d1320] border-white/10" />
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-4 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {/* Button Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                
                {/* Button Content */}
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <LoadingOutlined className="animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </span>
              </button>
            </form>

            {/* Live Market Ticker */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="flex items-center justify-center gap-1 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-500">Live Markets</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-[#0d1320]/80 rounded-lg p-2 text-center border border-white/5">
                  <div className="text-gray-500">EUR/USD</div>
                  <div className="text-green-400 font-mono">1.0892</div>
                  <div className="text-green-500 text-[10px]">+0.15%</div>
                </div>
                <div className="bg-[#0d1320]/80 rounded-lg p-2 text-center border border-white/5">
                  <div className="text-gray-500">GBP/USD</div>
                  <div className="text-red-400 font-mono">1.2654</div>
                  <div className="text-red-500 text-[10px]">-0.08%</div>
                </div>
                <div className="bg-[#0d1320]/80 rounded-lg p-2 text-center border border-white/5">
                  <div className="text-gray-500">USD/JPY</div>
                  <div className="text-green-400 font-mono">149.85</div>
                  <div className="text-green-500 text-[10px]">+0.22%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Gradient Line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-gray-600 text-xs">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>256-bit SSL Encryption</span>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
