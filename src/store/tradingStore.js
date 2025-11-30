import { create } from 'zustand';

// Forex pairs data
const forexPairs = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', pip: 0.0001 },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', pip: 0.0001 },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', pip: 0.01 },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', pip: 0.0001 },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', pip: 0.0001 },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', pip: 0.0001 },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', pip: 0.0001 },
  { symbol: 'EUR/GBP', name: 'Euro / British Pound', pip: 0.0001 },
  { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', pip: 0.01 },
  { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', pip: 0.01 },
  { symbol: 'XAU/USD', name: 'Gold / US Dollar', pip: 0.01 },
  { symbol: 'XAG/USD', name: 'Silver / US Dollar', pip: 0.001 },
];

// Generate random price data
const generateCandleData = (basePrice, count = 500) => {
  const data = [];
  let currentPrice = basePrice;
  const now = Date.now();
  const interval = 60 * 1000; // 1 minute

  for (let i = count; i >= 0; i--) {
    const time = Math.floor((now - i * interval) / 1000);
    const volatility = basePrice * 0.001;
    const open = currentPrice;
    const change = (Math.random() - 0.5) * volatility * 2;
    const high = open + Math.abs(change) + Math.random() * volatility;
    const low = open - Math.abs(change) - Math.random() * volatility;
    const close = open + change;
    
    data.push({
      time,
      open: parseFloat(open.toFixed(5)),
      high: parseFloat(high.toFixed(5)),
      low: parseFloat(low.toFixed(5)),
      close: parseFloat(close.toFixed(5)),
      volume: Math.floor(Math.random() * 10000) + 1000,
    });
    
    currentPrice = close;
  }
  
  return data;
};

// Generate order book data
const generateOrderBook = (currentPrice, pip) => {
  const bids = [];
  const asks = [];
  
  for (let i = 1; i <= 15; i++) {
    const bidPrice = currentPrice - (i * pip * (Math.random() * 5 + 1));
    const askPrice = currentPrice + (i * pip * (Math.random() * 5 + 1));
    const bidVolume = Math.floor(Math.random() * 1000000) + 100000;
    const askVolume = Math.floor(Math.random() * 1000000) + 100000;
    
    bids.push({
      price: parseFloat(bidPrice.toFixed(5)),
      volume: bidVolume,
      total: 0,
    });
    
    asks.push({
      price: parseFloat(askPrice.toFixed(5)),
      volume: askVolume,
      total: 0,
    });
  }
  
  // Sort bids descending, asks ascending
  bids.sort((a, b) => b.price - a.price);
  asks.sort((a, b) => a.price - b.price);
  
  // Calculate totals
  let bidTotal = 0;
  let askTotal = 0;
  bids.forEach(bid => {
    bidTotal += bid.volume;
    bid.total = bidTotal;
  });
  asks.forEach(ask => {
    askTotal += ask.volume;
    ask.total = askTotal;
  });
  
  return { bids, asks };
};

// Generate recent trades
const generateTrades = (currentPrice, pip) => {
  const trades = [];
  const now = Date.now();
  
  for (let i = 0; i < 50; i++) {
    const isBuy = Math.random() > 0.5;
    const priceChange = (Math.random() - 0.5) * pip * 20;
    const price = currentPrice + priceChange;
    const volume = Math.floor(Math.random() * 100000) + 10000;
    
    trades.push({
      id: i,
      time: new Date(now - i * Math.random() * 60000).toLocaleTimeString(),
      price: parseFloat(price.toFixed(5)),
      volume,
      side: isBuy ? 'buy' : 'sell',
    });
  }
  
  return trades;
};

// Initial prices for each pair
const initialPrices = {
  'EUR/USD': 1.0850,
  'GBP/USD': 1.2650,
  'USD/JPY': 149.50,
  'USD/CHF': 0.8850,
  'AUD/USD': 0.6550,
  'USD/CAD': 1.3650,
  'NZD/USD': 0.6050,
  'EUR/GBP': 0.8580,
  'EUR/JPY': 162.20,
  'GBP/JPY': 189.10,
  'XAU/USD': 2050.00,
  'XAG/USD': 24.50,
};

const useTradingStore = create((set, get) => ({
  // Current symbol
  currentSymbol: 'EUR/USD',
  forexPairs,
  
  // Chart settings
  chartType: 'candlestick',
  timeframe: '1m',
  
  // Price data
  candleData: generateCandleData(initialPrices['EUR/USD']),
  currentPrice: initialPrices['EUR/USD'],
  previousPrice: initialPrices['EUR/USD'],
  dailyHigh: initialPrices['EUR/USD'] * 1.005,
  dailyLow: initialPrices['EUR/USD'] * 0.995,
  dailyChange: 0.0012,
  dailyChangePercent: 0.11,
  
  // Order book
  orderBook: generateOrderBook(initialPrices['EUR/USD'], 0.0001),
  
  // Recent trades
  recentTrades: generateTrades(initialPrices['EUR/USD'], 0.0001),
  
  // Wallet balances
  balances: {
    USD: 10000.00,
    EUR: 5000.00,
    GBP: 3000.00,
    JPY: 500000.00,
    AUD: 4000.00,
    CAD: 4500.00,
    CHF: 3500.00,
    NZD: 3000.00,
    XAU: 2.5,
    XAG: 100.00,
  },
  
  // Open orders
  openOrders: [],
  
  // Order history
  orderHistory: [],
  
  // Indicators
  activeIndicators: [],
  
  // Drawing tools
  activeDrawingTool: null,
  drawings: [],
  
  // UI State
  isMobileMenuOpen: false,
  activeTab: 'trade',
  isDepositModalOpen: false,
  isWithdrawModalOpen: false,
  
  // Actions
  setCurrentSymbol: (symbol) => {
    const pair = forexPairs.find(p => p.symbol === symbol);
    const basePrice = initialPrices[symbol] || 1.0000;
    
    set({
      currentSymbol: symbol,
      candleData: generateCandleData(basePrice),
      currentPrice: basePrice,
      previousPrice: basePrice,
      dailyHigh: basePrice * 1.005,
      dailyLow: basePrice * 0.995,
      dailyChange: (Math.random() - 0.5) * 0.01,
      dailyChangePercent: (Math.random() - 0.5) * 2,
      orderBook: generateOrderBook(basePrice, pair?.pip || 0.0001),
      recentTrades: generateTrades(basePrice, pair?.pip || 0.0001),
    });
  },
  
  setChartType: (chartType) => set({ chartType }),
  
  setTimeframe: (timeframe) => set({ timeframe }),
  
  updatePrice: () => {
    const { currentPrice, currentSymbol, candleData } = get();
    const pair = forexPairs.find(p => p.symbol === currentSymbol);
    const pip = pair?.pip || 0.0001;
    const volatility = currentPrice * 0.0002;
    const change = (Math.random() - 0.5) * volatility;
    const newPrice = currentPrice + change;
    
    // Update last candle
    const updatedCandleData = [...candleData];
    const lastCandle = { ...updatedCandleData[updatedCandleData.length - 1] };
    lastCandle.close = parseFloat(newPrice.toFixed(5));
    lastCandle.high = Math.max(lastCandle.high, newPrice);
    lastCandle.low = Math.min(lastCandle.low, newPrice);
    updatedCandleData[updatedCandleData.length - 1] = lastCandle;
    
    set({
      previousPrice: currentPrice,
      currentPrice: parseFloat(newPrice.toFixed(5)),
      candleData: updatedCandleData,
      orderBook: generateOrderBook(newPrice, pip),
    });
  },
  
  addNewCandle: () => {
    const { currentPrice, candleData } = get();
    const lastCandle = candleData[candleData.length - 1];
    const newTime = lastCandle.time + 60; // Add 1 minute
    
    const newCandle = {
      time: newTime,
      open: currentPrice,
      high: currentPrice,
      low: currentPrice,
      close: currentPrice,
      volume: 0,
    };
    
    set({
      candleData: [...candleData.slice(1), newCandle],
    });
  },
  
  addTrade: (trade) => {
    const { recentTrades } = get();
    set({
      recentTrades: [trade, ...recentTrades.slice(0, 49)],
    });
  },
  
  placeOrder: (order) => {
    const { openOrders, balances, currentPrice } = get();
    const newOrder = {
      id: Date.now(),
      ...order,
      status: 'open',
      createdAt: new Date().toISOString(),
      filledAt: null,
    };
    
    // Check if it's a market order
    if (order.type === 'market') {
      newOrder.status = 'filled';
      newOrder.filledAt = new Date().toISOString();
      newOrder.filledPrice = currentPrice;
      
      // Update balances (simplified)
      const baseCurrency = order.symbol.split('/')[0];
      const quoteCurrency = order.symbol.split('/')[1];
      
      if (order.side === 'buy') {
        const cost = order.amount * currentPrice;
        if (balances[quoteCurrency] >= cost) {
          set({
            balances: {
              ...balances,
              [quoteCurrency]: balances[quoteCurrency] - cost,
              [baseCurrency]: (balances[baseCurrency] || 0) + order.amount,
            },
            orderHistory: [newOrder, ...get().orderHistory],
          });
        }
      } else {
        if (balances[baseCurrency] >= order.amount) {
          const proceeds = order.amount * currentPrice;
          set({
            balances: {
              ...balances,
              [baseCurrency]: balances[baseCurrency] - order.amount,
              [quoteCurrency]: (balances[quoteCurrency] || 0) + proceeds,
            },
            orderHistory: [newOrder, ...get().orderHistory],
          });
        }
      }
    } else {
      set({
        openOrders: [...openOrders, newOrder],
      });
    }
  },
  
  cancelOrder: (orderId) => {
    const { openOrders } = get();
    set({
      openOrders: openOrders.filter(order => order.id !== orderId),
    });
  },
  
  toggleIndicator: (indicator) => {
    const { activeIndicators } = get();
    if (activeIndicators.includes(indicator)) {
      set({ activeIndicators: activeIndicators.filter(i => i !== indicator) });
    } else {
      set({ activeIndicators: [...activeIndicators, indicator] });
    }
  },
  
  setActiveDrawingTool: (tool) => set({ activeDrawingTool: tool }),
  
  addDrawing: (drawing) => {
    const { drawings } = get();
    set({ drawings: [...drawings, drawing] });
  },
  
  removeDrawing: (id) => {
    const { drawings } = get();
    set({ drawings: drawings.filter(d => d.id !== id) });
  },
  
  clearDrawings: () => set({ drawings: [] }),
  
  setIsMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setIsDepositModalOpen: (isOpen) => set({ isDepositModalOpen: isOpen }),
  
  setIsWithdrawModalOpen: (isOpen) => set({ isWithdrawModalOpen: isOpen }),
}));

export default useTradingStore;
