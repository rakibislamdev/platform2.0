/**
 * ChartService - Encapsulates all chart functionality
 * Initialize once and use throughout the application
 */

class ChartService {
  constructor() {
    this.chartInstance = null;
    this.chartRef = null;
    this.config = {
      backgroundColor: '#0a0d12',
      upColor: '#26a69a',
      downColor: '#ef5350',
      lineColor: '#2962ff',
      gridLineColor: 'rgba(42, 46, 57, 0.5)',
      axisLabelColor: '#9ca3af',
      borderColor: '#1a1f2e',
    };
  }

  // Initialize chart with ref
  init(chartRef) {
    this.chartRef = chartRef;
    if (chartRef?.current) {
      this.chartInstance = chartRef.current.getEchartsInstance();
    }
    return this;
  }

  // Get chart instance
  getInstance() {
    if (this.chartRef?.current) {
      this.chartInstance = this.chartRef.current.getEchartsInstance();
    }
    return this.chartInstance;
  }

  // Resize chart
  resize() {
    const instance = this.getInstance();
    if (instance) {
      instance.resize();
    }
  }

  // ==================== INDICATOR CALCULATIONS ====================

  // Simple Moving Average (SMA)
  calculateSMA(data, period) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push('-');
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += data[i - j];
        }
        result.push((sum / period).toFixed(5));
      }
    }
    return result;
  }

  // Exponential Moving Average (EMA)
  calculateEMA(data, period) {
    const result = [];
    const multiplier = 2 / (period + 1);
    let ema = data[0];

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push('-');
        ema = (data[i] + ema * i) / (i + 1);
      } else {
        ema = (data[i] - ema) * multiplier + ema;
        result.push(ema.toFixed(5));
      }
    }
    return result;
  }

  // Weighted Moving Average (WMA)
  calculateWMA(data, period) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push('-');
      } else {
        let sum = 0;
        let weightSum = 0;
        for (let j = 0; j < period; j++) {
          const weight = period - j;
          sum += data[i - j] * weight;
          weightSum += weight;
        }
        result.push((sum / weightSum).toFixed(5));
      }
    }
    return result;
  }

  // Bollinger Bands
  calculateBollingerBands(data, period = 20, stdDev = 2) {
    const upper = [];
    const middle = [];
    const lower = [];

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        upper.push('-');
        middle.push('-');
        lower.push('-');
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += data[i - j];
        }
        const ma = sum / period;

        let variance = 0;
        for (let j = 0; j < period; j++) {
          variance += Math.pow(data[i - j] - ma, 2);
        }
        const std = Math.sqrt(variance / period);

        middle.push(ma.toFixed(5));
        upper.push((ma + stdDev * std).toFixed(5));
        lower.push((ma - stdDev * std).toFixed(5));
      }
    }
    return { upper, middle, lower };
  }

  // Relative Strength Index (RSI)
  calculateRSI(data, period = 14) {
    const result = [];
    const gains = [];
    const losses = [];

    for (let i = 1; i < data.length; i++) {
      const change = data[i] - data[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    for (let i = 0; i < data.length; i++) {
      if (i < period) {
        result.push('-');
      } else {
        let avgGain = 0;
        let avgLoss = 0;
        for (let j = i - period; j < i; j++) {
          avgGain += gains[j] || 0;
          avgLoss += losses[j] || 0;
        }
        avgGain /= period;
        avgLoss /= period;

        if (avgLoss === 0) {
          result.push(100);
        } else {
          const rs = avgGain / avgLoss;
          result.push((100 - 100 / (1 + rs)).toFixed(2));
        }
      }
    }
    return result;
  }

  // MACD (Moving Average Convergence Divergence)
  calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    const emaFast = this.calculateEMA(data, fastPeriod);
    const emaSlow = this.calculateEMA(data, slowPeriod);
    
    const macdLine = [];
    for (let i = 0; i < data.length; i++) {
      if (emaFast[i] === '-' || emaSlow[i] === '-') {
        macdLine.push('-');
      } else {
        macdLine.push(parseFloat(emaFast[i]) - parseFloat(emaSlow[i]));
      }
    }

    // Signal line is EMA of MACD line
    const validMacd = macdLine.filter(v => v !== '-');
    const signalLine = this.calculateEMA(validMacd, signalPeriod);
    
    // Pad signal line to match length
    const paddedSignal = [];
    let signalIndex = 0;
    for (let i = 0; i < data.length; i++) {
      if (macdLine[i] === '-') {
        paddedSignal.push('-');
      } else {
        paddedSignal.push(signalLine[signalIndex] || '-');
        signalIndex++;
      }
    }

    // Histogram
    const histogram = [];
    for (let i = 0; i < data.length; i++) {
      if (macdLine[i] === '-' || paddedSignal[i] === '-') {
        histogram.push('-');
      } else {
        histogram.push((parseFloat(macdLine[i]) - parseFloat(paddedSignal[i])).toFixed(6));
      }
    }

    return {
      macd: macdLine.map(v => v === '-' ? '-' : v.toFixed(6)),
      signal: paddedSignal,
      histogram
    };
  }

  // Stochastic Oscillator
  calculateStochastic(high, low, close, kPeriod = 14, dPeriod = 3) {
    const kValues = [];
    const dValues = [];

    for (let i = 0; i < close.length; i++) {
      if (i < kPeriod - 1) {
        kValues.push('-');
      } else {
        let highestHigh = -Infinity;
        let lowestLow = Infinity;
        for (let j = 0; j < kPeriod; j++) {
          highestHigh = Math.max(highestHigh, high[i - j]);
          lowestLow = Math.min(lowestLow, low[i - j]);
        }
        const k = ((close[i] - lowestLow) / (highestHigh - lowestLow)) * 100;
        kValues.push(k.toFixed(2));
      }
    }

    // %D is SMA of %K
    for (let i = 0; i < kValues.length; i++) {
      if (i < kPeriod + dPeriod - 2 || kValues[i] === '-') {
        dValues.push('-');
      } else {
        let sum = 0;
        let count = 0;
        for (let j = 0; j < dPeriod; j++) {
          if (kValues[i - j] !== '-') {
            sum += parseFloat(kValues[i - j]);
            count++;
          }
        }
        dValues.push(count > 0 ? (sum / count).toFixed(2) : '-');
      }
    }

    return { k: kValues, d: dValues };
  }

  // Commodity Channel Index (CCI)
  calculateCCI(high, low, close, period = 20) {
    const result = [];
    const typicalPrices = [];

    for (let i = 0; i < close.length; i++) {
      typicalPrices.push((high[i] + low[i] + close[i]) / 3);
    }

    for (let i = 0; i < close.length; i++) {
      if (i < period - 1) {
        result.push('-');
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += typicalPrices[i - j];
        }
        const sma = sum / period;

        let meanDeviation = 0;
        for (let j = 0; j < period; j++) {
          meanDeviation += Math.abs(typicalPrices[i - j] - sma);
        }
        meanDeviation /= period;

        const cci = (typicalPrices[i] - sma) / (0.015 * meanDeviation);
        result.push(cci.toFixed(2));
      }
    }
    return result;
  }

  // Williams %R
  calculateWilliamsR(high, low, close, period = 14) {
    const result = [];

    for (let i = 0; i < close.length; i++) {
      if (i < period - 1) {
        result.push('-');
      } else {
        let highestHigh = -Infinity;
        let lowestLow = Infinity;
        for (let j = 0; j < period; j++) {
          highestHigh = Math.max(highestHigh, high[i - j]);
          lowestLow = Math.min(lowestLow, low[i - j]);
        }
        const wr = ((highestHigh - close[i]) / (highestHigh - lowestLow)) * -100;
        result.push(wr.toFixed(2));
      }
    }
    return result;
  }

  // Momentum
  calculateMomentum(data, period = 10) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period) {
        result.push('-');
      } else {
        const momentum = data[i] - data[i - period];
        result.push(momentum.toFixed(6));
      }
    }
    return result;
  }

  // Average True Range (ATR)
  calculateATR(high, low, close, period = 14) {
    const trueRanges = [];
    const result = [];

    for (let i = 0; i < close.length; i++) {
      if (i === 0) {
        trueRanges.push(high[i] - low[i]);
      } else {
        const tr = Math.max(
          high[i] - low[i],
          Math.abs(high[i] - close[i - 1]),
          Math.abs(low[i] - close[i - 1])
        );
        trueRanges.push(tr);
      }
    }

    for (let i = 0; i < close.length; i++) {
      if (i < period - 1) {
        result.push('-');
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += trueRanges[i - j];
        }
        result.push((sum / period).toFixed(6));
      }
    }
    return result;
  }

  // On-Balance Volume (OBV)
  calculateOBV(close, volume) {
    const result = [];
    let obv = 0;

    for (let i = 0; i < close.length; i++) {
      if (i === 0) {
        obv = volume[i];
      } else if (close[i] > close[i - 1]) {
        obv += volume[i];
      } else if (close[i] < close[i - 1]) {
        obv -= volume[i];
      }
      result.push(obv);
    }
    return result;
  }

  // VWAP (Volume Weighted Average Price)
  calculateVWAP(high, low, close, volume) {
    const result = [];
    let cumulativeTPV = 0;
    let cumulativeVolume = 0;

    for (let i = 0; i < close.length; i++) {
      const typicalPrice = (high[i] + low[i] + close[i]) / 3;
      cumulativeTPV += typicalPrice * volume[i];
      cumulativeVolume += volume[i];
      result.push((cumulativeTPV / cumulativeVolume).toFixed(5));
    }
    return result;
  }

  // Money Flow Index (MFI)
  calculateMFI(high, low, close, volume, period = 14) {
    const result = [];
    const typicalPrices = [];
    const moneyFlows = [];

    for (let i = 0; i < close.length; i++) {
      const tp = (high[i] + low[i] + close[i]) / 3;
      typicalPrices.push(tp);
      moneyFlows.push(tp * volume[i]);
    }

    for (let i = 0; i < close.length; i++) {
      if (i < period) {
        result.push('-');
      } else {
        let positiveFlow = 0;
        let negativeFlow = 0;

        for (let j = i - period + 1; j <= i; j++) {
          if (typicalPrices[j] > typicalPrices[j - 1]) {
            positiveFlow += moneyFlows[j];
          } else {
            negativeFlow += moneyFlows[j];
          }
        }

        const mfi = negativeFlow === 0 ? 100 : 100 - (100 / (1 + positiveFlow / negativeFlow));
        result.push(mfi.toFixed(2));
      }
    }
    return result;
  }

  // Parabolic SAR
  calculateParabolicSAR(high, low, afStart = 0.02, afStep = 0.02, afMax = 0.2) {
    const result = [];
    let af = afStart;
    let ep = low[0];
    let sar = high[0];
    let isUpTrend = false;

    for (let i = 0; i < high.length; i++) {
      if (i < 2) {
        result.push('-');
        continue;
      }

      if (isUpTrend) {
        sar = sar + af * (ep - sar);
        sar = Math.min(sar, low[i - 1], low[i - 2]);
        if (high[i] > ep) {
          ep = high[i];
          af = Math.min(af + afStep, afMax);
        }
        if (low[i] < sar) {
          isUpTrend = false;
          sar = ep;
          ep = low[i];
          af = afStart;
        }
      } else {
        sar = sar + af * (ep - sar);
        sar = Math.max(sar, high[i - 1], high[i - 2]);
        if (low[i] < ep) {
          ep = low[i];
          af = Math.min(af + afStep, afMax);
        }
        if (high[i] > sar) {
          isUpTrend = true;
          sar = ep;
          ep = high[i];
          af = afStart;
        }
      }
      result.push(sar.toFixed(5));
    }
    return result;
  }

  // Ichimoku Cloud
  calculateIchimoku(high, low, close, tenkanPeriod = 9, kijunPeriod = 26, senkouBPeriod = 52) {
    const tenkanSen = [];
    const kijunSen = [];
    const senkouA = [];
    const senkouB = [];
    const chikouSpan = [];

    const calcMiddle = (arr, start, period) => {
      let highest = -Infinity;
      let lowest = Infinity;
      for (let i = start; i > start - period && i >= 0; i--) {
        highest = Math.max(highest, arr[i]);
        lowest = Math.min(lowest, arr[i]);
      }
      return (highest + lowest) / 2;
    };

    for (let i = 0; i < close.length; i++) {
      // Tenkan-sen
      if (i < tenkanPeriod - 1) {
        tenkanSen.push('-');
      } else {
        const highMid = calcMiddle(high, i, tenkanPeriod);
        const lowMid = calcMiddle(low, i, tenkanPeriod);
        tenkanSen.push(((highMid + lowMid) / 2).toFixed(5));
      }

      // Kijun-sen
      if (i < kijunPeriod - 1) {
        kijunSen.push('-');
      } else {
        const highMid = calcMiddle(high, i, kijunPeriod);
        const lowMid = calcMiddle(low, i, kijunPeriod);
        kijunSen.push(((highMid + lowMid) / 2).toFixed(5));
      }

      // Senkou Span A (displaced 26 periods ahead)
      if (tenkanSen[i] === '-' || kijunSen[i] === '-') {
        senkouA.push('-');
      } else {
        senkouA.push(((parseFloat(tenkanSen[i]) + parseFloat(kijunSen[i])) / 2).toFixed(5));
      }

      // Senkou Span B
      if (i < senkouBPeriod - 1) {
        senkouB.push('-');
      } else {
        const highMid = calcMiddle(high, i, senkouBPeriod);
        const lowMid = calcMiddle(low, i, senkouBPeriod);
        senkouB.push(((highMid + lowMid) / 2).toFixed(5));
      }

      // Chikou Span (current close, displayed 26 periods back)
      chikouSpan.push(close[i].toFixed(5));
    }

    return { tenkanSen, kijunSen, senkouA, senkouB, chikouSpan };
  }

  // Keltner Channels
  calculateKeltnerChannels(high, low, close, emaPeriod = 20, atrPeriod = 10, multiplier = 2) {
    const ema = this.calculateEMA(close, emaPeriod);
    const atr = this.calculateATR(high, low, close, atrPeriod);
    
    const upper = [];
    const middle = [];
    const lower = [];

    for (let i = 0; i < close.length; i++) {
      if (ema[i] === '-' || atr[i] === '-') {
        upper.push('-');
        middle.push('-');
        lower.push('-');
      } else {
        const emaVal = parseFloat(ema[i]);
        const atrVal = parseFloat(atr[i]);
        middle.push(emaVal.toFixed(5));
        upper.push((emaVal + multiplier * atrVal).toFixed(5));
        lower.push((emaVal - multiplier * atrVal).toFixed(5));
      }
    }

    return { upper, middle, lower };
  }

  // Donchian Channels
  calculateDonchianChannels(high, low, period = 20) {
    const upper = [];
    const middle = [];
    const lower = [];

    for (let i = 0; i < high.length; i++) {
      if (i < period - 1) {
        upper.push('-');
        middle.push('-');
        lower.push('-');
      } else {
        let highest = -Infinity;
        let lowest = Infinity;
        for (let j = 0; j < period; j++) {
          highest = Math.max(highest, high[i - j]);
          lowest = Math.min(lowest, low[i - j]);
        }
        upper.push(highest.toFixed(5));
        lower.push(lowest.toFixed(5));
        middle.push(((highest + lowest) / 2).toFixed(5));
      }
    }

    return { upper, middle, lower };
  }

  // Standard Deviation
  calculateStdDev(data, period = 20) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push('-');
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += data[i - j];
        }
        const mean = sum / period;

        let variance = 0;
        for (let j = 0; j < period; j++) {
          variance += Math.pow(data[i - j] - mean, 2);
        }
        result.push(Math.sqrt(variance / period).toFixed(6));
      }
    }
    return result;
  }

  // Accumulation/Distribution Line
  calculateADL(high, low, close, volume) {
    const result = [];
    let adl = 0;

    for (let i = 0; i < close.length; i++) {
      const mfm = ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i] || 1);
      const mfv = mfm * volume[i];
      adl += mfv;
      result.push(adl.toFixed(0));
    }
    return result;
  }

  // Legacy MA calculation (for backwards compatibility)
  calculateMA(data, period) {
    return this.calculateSMA(data, period);
  }

  // Format candle data for ECharts
  formatCandleData(candleData) {
    if (!candleData || candleData.length === 0) {
      return { dates: [], values: [], closeValues: [], volumes: [], ohlc: [], high: [], low: [], open: [] };
    }

    const dates = candleData.map((d) => {
      const date = new Date(d.time * 1000);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    });

    // OHLC data for candlestick [open, close, low, high]
    const values = candleData.map((d) => [d.open, d.close, d.low, d.high]);

    // Individual arrays for indicator calculations
    const open = candleData.map((d) => d.open);
    const high = candleData.map((d) => d.high);
    const low = candleData.map((d) => d.low);
    const closeValues = candleData.map((d) => d.close);
    const volume = candleData.map((d) => d.volume);

    // Raw OHLC
    const ohlc = candleData.map((d) => ({
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      time: d.time,
    }));

    // Volume data with colors
    const volumes = candleData.map((d) => ({
      value: d.volume,
      itemStyle: {
        color: d.close >= d.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
      },
    }));

    return { dates, values, closeValues, volumes, ohlc, high, low, open, volume };
  }

  // Calculate all indicators
  calculateIndicators(chartData) {
    const { closeValues, high, low, volume } = chartData;
    
    if (!closeValues || closeValues.length === 0) {
      return {};
    }

    return {
      // Moving Averages
      sma5: this.calculateSMA(closeValues, 5),
      sma10: this.calculateSMA(closeValues, 10),
      sma20: this.calculateSMA(closeValues, 20),
      sma50: this.calculateSMA(closeValues, 50),
      sma100: this.calculateSMA(closeValues, 100),
      sma200: this.calculateSMA(closeValues, 200),
      ema12: this.calculateEMA(closeValues, 12),
      ema26: this.calculateEMA(closeValues, 26),
      ema50: this.calculateEMA(closeValues, 50),
      wma14: this.calculateWMA(closeValues, 14),
      
      // Bollinger Bands
      bollinger: this.calculateBollingerBands(closeValues, 20, 2),
      
      // RSI
      rsi: this.calculateRSI(closeValues, 14),
      
      // MACD
      macd: this.calculateMACD(closeValues, 12, 26, 9),
      
      // Stochastic
      stochastic: this.calculateStochastic(high, low, closeValues, 14, 3),
      
      // CCI
      cci: this.calculateCCI(high, low, closeValues, 20),
      
      // Williams %R
      williams: this.calculateWilliamsR(high, low, closeValues, 14),
      
      // Momentum
      momentum: this.calculateMomentum(closeValues, 10),
      
      // ATR
      atr: this.calculateATR(high, low, closeValues, 14),
      
      // OBV
      obv: this.calculateOBV(closeValues, volume),
      
      // VWAP
      vwap: this.calculateVWAP(high, low, closeValues, volume),
      
      // MFI
      mfi: this.calculateMFI(high, low, closeValues, volume, 14),
      
      // Parabolic SAR
      parabolicSar: this.calculateParabolicSAR(high, low),
      
      // Ichimoku
      ichimoku: this.calculateIchimoku(high, low, closeValues),
      
      // Keltner Channels
      keltner: this.calculateKeltnerChannels(high, low, closeValues, 20, 10, 2),
      
      // Donchian Channels
      donchian: this.calculateDonchianChannels(high, low, 20),
      
      // Standard Deviation
      stddev: this.calculateStdDev(closeValues, 20),
      
      // ADL
      adl: this.calculateADL(high, low, closeValues, volume),
    };
  }

  // Build main price series based on chart type
  buildPriceSeries(chartType, symbol, values, closeValues) {
    if (chartType === 'candlestick') {
      return {
        name: symbol,
        type: 'candlestick',
        data: values,
        itemStyle: {
          color: this.config.upColor,
          color0: this.config.downColor,
          borderColor: this.config.upColor,
          borderColor0: this.config.downColor,
        },
      };
    } else if (chartType === 'line') {
      return {
        name: symbol,
        type: 'line',
        data: closeValues,
        smooth: true,
        lineStyle: {
          color: this.config.lineColor,
          width: 2,
        },
        itemStyle: {
          color: this.config.lineColor,
        },
        showSymbol: false,
      };
    } else if (chartType === 'area') {
      return {
        name: symbol,
        type: 'line',
        data: closeValues,
        smooth: true,
        lineStyle: {
          color: this.config.lineColor,
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(41, 98, 255, 0.4)' },
              { offset: 1, color: 'rgba(41, 98, 255, 0.05)' },
            ],
          },
        },
        itemStyle: {
          color: this.config.lineColor,
        },
        showSymbol: false,
      };
    }
    return null;
  }

  // Build volume series
  buildVolumeSeries(volumes) {
    return {
      name: 'Volume',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: volumes,
      barWidth: '60%',
    };
  }

  // Build indicator series
  buildIndicatorSeries(activeIndicators, indicators) {
    const series = [];

    // SMA indicators
    if (activeIndicators?.includes('sma')) {
      series.push(
        { name: 'SMA20', type: 'line', data: indicators.sma20, smooth: true, lineStyle: { color: '#f59e0b', width: 1 }, showSymbol: false },
        { name: 'SMA50', type: 'line', data: indicators.sma50, smooth: true, lineStyle: { color: '#ec4899', width: 1 }, showSymbol: false }
      );
    }

    // EMA indicators
    if (activeIndicators?.includes('ema')) {
      series.push(
        { name: 'EMA12', type: 'line', data: indicators.ema12, smooth: true, lineStyle: { color: '#22c55e', width: 1 }, showSymbol: false },
        { name: 'EMA26', type: 'line', data: indicators.ema26, smooth: true, lineStyle: { color: '#eab308', width: 1 }, showSymbol: false }
      );
    }

    // WMA indicator
    if (activeIndicators?.includes('wma')) {
      series.push(
        { name: 'WMA14', type: 'line', data: indicators.wma14, smooth: true, lineStyle: { color: '#06b6d4', width: 1 }, showSymbol: false }
      );
    }

    // Bollinger Bands
    if (activeIndicators?.includes('bollinger')) {
      series.push(
        { name: 'BB Upper', type: 'line', data: indicators.bollinger.upper, smooth: true, lineStyle: { color: '#9333ea', width: 1, type: 'dashed' }, showSymbol: false },
        { name: 'BB Middle', type: 'line', data: indicators.bollinger.middle, smooth: true, lineStyle: { color: '#9333ea', width: 1 }, showSymbol: false },
        { name: 'BB Lower', type: 'line', data: indicators.bollinger.lower, smooth: true, lineStyle: { color: '#9333ea', width: 1, type: 'dashed' }, showSymbol: false }
      );
    }

    // Parabolic SAR
    if (activeIndicators?.includes('parabolic')) {
      series.push({
        name: 'Parabolic SAR',
        type: 'scatter',
        data: indicators.parabolicSar,
        symbolSize: 4,
        itemStyle: { color: '#f472b6' },
      });
    }

    // Ichimoku Cloud
    if (activeIndicators?.includes('ichimoku')) {
      series.push(
        { name: 'Tenkan-sen', type: 'line', data: indicators.ichimoku.tenkanSen, smooth: true, lineStyle: { color: '#2962ff', width: 1 }, showSymbol: false },
        { name: 'Kijun-sen', type: 'line', data: indicators.ichimoku.kijunSen, smooth: true, lineStyle: { color: '#ef5350', width: 1 }, showSymbol: false },
        { name: 'Senkou A', type: 'line', data: indicators.ichimoku.senkouA, smooth: true, lineStyle: { color: '#26a69a', width: 1 }, showSymbol: false },
        { name: 'Senkou B', type: 'line', data: indicators.ichimoku.senkouB, smooth: true, lineStyle: { color: '#ef5350', width: 1 }, showSymbol: false,
          areaStyle: { color: 'rgba(38, 166, 154, 0.1)' }
        }
      );
    }

    // VWAP
    if (activeIndicators?.includes('vwap')) {
      series.push({
        name: 'VWAP',
        type: 'line',
        data: indicators.vwap,
        smooth: true,
        lineStyle: { color: '#00bcd4', width: 2 },
        showSymbol: false,
      });
    }

    // Keltner Channels
    if (activeIndicators?.includes('keltner')) {
      series.push(
        { name: 'Keltner Upper', type: 'line', data: indicators.keltner.upper, smooth: true, lineStyle: { color: '#ff9800', width: 1, type: 'dashed' }, showSymbol: false },
        { name: 'Keltner Middle', type: 'line', data: indicators.keltner.middle, smooth: true, lineStyle: { color: '#ff9800', width: 1 }, showSymbol: false },
        { name: 'Keltner Lower', type: 'line', data: indicators.keltner.lower, smooth: true, lineStyle: { color: '#ff9800', width: 1, type: 'dashed' }, showSymbol: false }
      );
    }

    // Donchian Channels
    if (activeIndicators?.includes('donchian')) {
      series.push(
        { name: 'Donchian Upper', type: 'line', data: indicators.donchian.upper, smooth: false, lineStyle: { color: '#4caf50', width: 1 }, showSymbol: false },
        { name: 'Donchian Middle', type: 'line', data: indicators.donchian.middle, smooth: false, lineStyle: { color: '#4caf50', width: 1, type: 'dashed' }, showSymbol: false },
        { name: 'Donchian Lower', type: 'line', data: indicators.donchian.lower, smooth: false, lineStyle: { color: '#4caf50', width: 1 }, showSymbol: false }
      );
    }

    // RSI - as overlay line (normalized to price range in tooltip)
    if (activeIndicators?.includes('rsi')) {
      series.push({
        name: 'RSI(14)',
        type: 'line',
        data: indicators.rsi,
        smooth: true,
        lineStyle: { color: '#a855f7', width: 1.5 },
        showSymbol: false,
        yAxisIndex: 0,
        tooltip: { valueFormatter: (value) => value?.toFixed(2) }
      });
    }

    // MACD - histogram and lines
    if (activeIndicators?.includes('macd')) {
      series.push(
        { name: 'MACD', type: 'line', data: indicators.macd.macd, smooth: true, lineStyle: { color: '#2962ff', width: 1 }, showSymbol: false },
        { name: 'Signal', type: 'line', data: indicators.macd.signal, smooth: true, lineStyle: { color: '#ef5350', width: 1 }, showSymbol: false }
      );
    }

    // Stochastic
    if (activeIndicators?.includes('stochastic')) {
      series.push(
        { name: 'Stoch %K', type: 'line', data: indicators.stochastic.k, smooth: true, lineStyle: { color: '#2962ff', width: 1 }, showSymbol: false },
        { name: 'Stoch %D', type: 'line', data: indicators.stochastic.d, smooth: true, lineStyle: { color: '#ef5350', width: 1 }, showSymbol: false }
      );
    }

    // CCI
    if (activeIndicators?.includes('cci')) {
      series.push({
        name: 'CCI(20)',
        type: 'line',
        data: indicators.cci,
        smooth: true,
        lineStyle: { color: '#00bcd4', width: 1 },
        showSymbol: false,
      });
    }

    // Williams %R
    if (activeIndicators?.includes('williams')) {
      series.push({
        name: 'Williams %R',
        type: 'line',
        data: indicators.williams,
        smooth: true,
        lineStyle: { color: '#ff9800', width: 1 },
        showSymbol: false,
      });
    }

    // Momentum
    if (activeIndicators?.includes('momentum')) {
      series.push({
        name: 'Momentum',
        type: 'line',
        data: indicators.momentum,
        smooth: true,
        lineStyle: { color: '#4caf50', width: 1 },
        showSymbol: false,
      });
    }

    // ATR
    if (activeIndicators?.includes('atr')) {
      series.push({
        name: 'ATR(14)',
        type: 'line',
        data: indicators.atr,
        smooth: true,
        lineStyle: { color: '#ff5722', width: 1 },
        showSymbol: false,
      });
    }

    // OBV
    if (activeIndicators?.includes('obv')) {
      series.push({
        name: 'OBV',
        type: 'line',
        data: indicators.obv,
        smooth: true,
        lineStyle: { color: '#9c27b0', width: 1 },
        showSymbol: false,
      });
    }

    // MFI
    if (activeIndicators?.includes('mfi')) {
      series.push({
        name: 'MFI(14)',
        type: 'line',
        data: indicators.mfi,
        smooth: true,
        lineStyle: { color: '#e91e63', width: 1 },
        showSymbol: false,
      });
    }

    // A/D Line
    if (activeIndicators?.includes('adl')) {
      series.push({
        name: 'A/D Line',
        type: 'line',
        data: indicators.adl,
        smooth: true,
        lineStyle: { color: '#607d8b', width: 1 },
        showSymbol: false,
      });
    }

    // Legacy support for old indicator names
    const legacyConfig = {
      MA5: { data: indicators.sma5, color: '#f59e0b' },
      MA10: { data: indicators.sma10, color: '#06b6d4' },
      MA20: { data: indicators.sma20, color: '#a855f7' },
      MA50: { data: indicators.sma50, color: '#ec4899' },
      EMA12: { data: indicators.ema12, color: '#22c55e' },
      EMA26: { data: indicators.ema26, color: '#eab308' },
    };

    activeIndicators?.forEach((indicator) => {
      if (legacyConfig[indicator]) {
        series.push({
          name: indicator,
          type: 'line',
          data: legacyConfig[indicator].data,
          smooth: true,
          lineStyle: { color: legacyConfig[indicator].color, width: 1 },
          showSymbol: false,
        });
      }
    });

    // BB legacy support
    if (activeIndicators?.includes('BB')) {
      series.push(
        { name: 'BB Upper', type: 'line', data: indicators.bollinger.upper, smooth: true, lineStyle: { color: '#9333ea', width: 1, type: 'dashed' }, showSymbol: false },
        { name: 'BB Middle', type: 'line', data: indicators.bollinger.middle, smooth: true, lineStyle: { color: '#9333ea', width: 1 }, showSymbol: false },
        { name: 'BB Lower', type: 'line', data: indicators.bollinger.lower, smooth: true, lineStyle: { color: '#9333ea', width: 1, type: 'dashed' }, showSymbol: false }
      );
    }

    return series;
  }

  // Build sub-chart indicators (RSI, MACD, Stochastic, etc.)
  buildSubChartIndicators(activeIndicators, indicators, chartData) {
    const subCharts = [];

    // RSI
    if (activeIndicators?.includes('rsi')) {
      subCharts.push({
        name: 'RSI',
        type: 'oscillator',
        data: indicators.rsi,
        color: '#a855f7',
        levels: [30, 70],
      });
    }

    // MACD
    if (activeIndicators?.includes('macd')) {
      subCharts.push({
        name: 'MACD',
        type: 'macd',
        macd: indicators.macd.macd,
        signal: indicators.macd.signal,
        histogram: indicators.macd.histogram,
      });
    }

    // Stochastic
    if (activeIndicators?.includes('stochastic')) {
      subCharts.push({
        name: 'Stochastic',
        type: 'oscillator',
        data: indicators.stochastic.k,
        data2: indicators.stochastic.d,
        color: '#2962ff',
        color2: '#ef5350',
        levels: [20, 80],
      });
    }

    // CCI
    if (activeIndicators?.includes('cci')) {
      subCharts.push({
        name: 'CCI',
        type: 'oscillator',
        data: indicators.cci,
        color: '#00bcd4',
        levels: [-100, 100],
      });
    }

    // Williams %R
    if (activeIndicators?.includes('williams')) {
      subCharts.push({
        name: 'Williams %R',
        type: 'oscillator',
        data: indicators.williams,
        color: '#ff9800',
        levels: [-80, -20],
      });
    }

    // Momentum
    if (activeIndicators?.includes('momentum')) {
      subCharts.push({
        name: 'Momentum',
        type: 'line',
        data: indicators.momentum,
        color: '#4caf50',
      });
    }

    // ATR
    if (activeIndicators?.includes('atr')) {
      subCharts.push({
        name: 'ATR',
        type: 'line',
        data: indicators.atr,
        color: '#ff5722',
      });
    }

    // OBV
    if (activeIndicators?.includes('obv')) {
      subCharts.push({
        name: 'OBV',
        type: 'line',
        data: indicators.obv,
        color: '#9c27b0',
      });
    }

    // MFI
    if (activeIndicators?.includes('mfi')) {
      subCharts.push({
        name: 'MFI',
        type: 'oscillator',
        data: indicators.mfi,
        color: '#e91e63',
        levels: [20, 80],
      });
    }

    // ADL
    if (activeIndicators?.includes('adl')) {
      subCharts.push({
        name: 'A/D Line',
        type: 'line',
        data: indicators.adl,
        color: '#607d8b',
      });
    }

    // Standard Deviation
    if (activeIndicators?.includes('stddev')) {
      subCharts.push({
        name: 'Std Dev',
        type: 'line',
        data: indicators.stddev,
        color: '#795548',
      });
    }

    return subCharts;
  }

  // Build all series
  buildAllSeries(chartType, symbol, chartData, activeIndicators, settings) {
    // Update config if settings provided
    if (settings) {
      this.updateConfig(settings);
    }
    
    const series = [];

    // Main price series
    const priceSeries = this.buildPriceSeries(
      chartType,
      symbol,
      chartData.values,
      chartData.closeValues
    );
    if (priceSeries) series.push(priceSeries);

    // Volume series (conditionally show based on settings)
    if (this.config.showVolume !== false) {
      series.push(this.buildVolumeSeries(chartData.volumes));
    }

    // Indicator series
    const indicators = this.calculateIndicators(chartData);
    series.push(...this.buildIndicatorSeries(activeIndicators, indicators));

    return series;
  }

  // Get sub-chart series for oscillators (RSI, MACD, etc.)
  getSubChartSeries(chartData, activeIndicators) {
    const indicators = this.calculateIndicators(chartData);
    return this.buildSubChartIndicators(activeIndicators, indicators, chartData);
  }

  // Update config with external settings
  updateConfig(settings) {
    if (settings) {
      this.config = {
        ...this.config,
        upColor: settings.upColor || this.config.upColor,
        downColor: settings.downColor || this.config.downColor,
        lineColor: settings.lineColor || this.config.lineColor,
        backgroundColor: settings.backgroundColor || this.config.backgroundColor,
        showGridLines: settings.showGridLines !== undefined ? settings.showGridLines : true,
        showVolume: settings.showVolume !== undefined ? settings.showVolume : true,
        crosshairStyle: settings.crosshairStyle || 'cross',
      };
    }
    return this;
  }

  // Get full chart options
  getChartOptions(chartData, series, settings) {
    // Apply settings if provided
    if (settings) {
      this.updateConfig(settings);
    }
    
    // Handle crosshair style - 'none' means no axis pointer
    const crosshairType = this.config.crosshairStyle === 'none' ? 'none' : (this.config.crosshairStyle || 'cross');
    const showAxisPointer = this.config.crosshairStyle !== 'none';
    
    return {
      animation: false,
      backgroundColor: this.config.backgroundColor,
      tooltip: {
        trigger: 'axis',
        show: showAxisPointer,
        axisPointer: {
          type: crosshairType,
          crossStyle: {
            color: 'rgba(41, 98, 255, 0.5)',
          },
          lineStyle: {
            color: 'rgba(41, 98, 255, 0.5)',
          },
        },
        backgroundColor: 'rgba(21, 25, 36, 0.95)',
        borderColor: this.config.borderColor,
        textStyle: {
          color: '#e5e7eb',
          fontSize: 12,
        },
      },
      axisPointer: {
        link: [{ xAxisIndex: 'all' }],
        label: {
          backgroundColor: this.config.borderColor,
        },
      },
      grid: [
        {
          left: '1%',
          right: '60px',
          top: '5%',
          height: '65%',
        },
        {
          left: '1%',
          right: '60px',
          top: '75%',
          height: '15%',
        },
      ],
      xAxis: [
        {
          type: 'category',
          data: chartData.dates,
          boundaryGap: true,
          axisLine: { lineStyle: { color: this.config.borderColor } },
          axisLabel: { color: this.config.axisLabelColor, fontSize: 11 },
          axisTick: { show: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax',
        },
        {
          type: 'category',
          gridIndex: 1,
          data: chartData.dates,
          boundaryGap: true,
          axisLine: { lineStyle: { color: this.config.borderColor } },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax',
        },
      ],
      yAxis: [
        {
          scale: true,
          position: 'right',
          axisLine: { lineStyle: { color: this.config.borderColor } },
          axisLabel: {
            color: this.config.axisLabelColor,
            fontSize: 11,
            formatter: (value) => value.toFixed(5),
          },
          splitLine: { 
            show: this.config.showGridLines !== false,
            lineStyle: { color: this.config.gridLineColor } 
          },
        },
        {
          scale: true,
          gridIndex: 1,
          position: 'right',
          axisLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 70,
          end: 100,
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          bottom: '2%',
          height: 20,
          start: 70,
          end: 100,
          borderColor: this.config.borderColor,
          backgroundColor: '#151924',
          fillerColor: 'rgba(41, 98, 255, 0.2)',
          handleStyle: {
            color: this.config.lineColor,
          },
          textStyle: {
            color: this.config.axisLabelColor,
          },
        },
      ],
      series: series,
    };
  }

  // Set chart options
  setOptions(options, notMerge = true) {
    const instance = this.getInstance();
    if (instance) {
      instance.setOption(options, notMerge);
    }
  }

  // Update chart theme
  setTheme(themeConfig) {
    this.config = { ...this.config, ...themeConfig };
  }

  // Dispose chart
  dispose() {
    const instance = this.getInstance();
    if (instance) {
      instance.dispose();
    }
    this.chartInstance = null;
    this.chartRef = null;
  }

  // Add drawing (line, trendline, etc.)
  addDrawing(type, points) {
    // Placeholder for drawing functionality
    console.log(`Adding ${type} drawing with points:`, points);
  }

  // Clear all drawings
  clearDrawings() {
    // Placeholder for clearing drawings
    console.log('Clearing all drawings');
  }

  // Get current zoom range
  getZoomRange() {
    const instance = this.getInstance();
    if (instance) {
      const option = instance.getOption();
      if (option.dataZoom && option.dataZoom[0]) {
        return {
          start: option.dataZoom[0].start,
          end: option.dataZoom[0].end,
        };
      }
    }
    return { start: 70, end: 100 };
  }

  // Set zoom range
  setZoomRange(start, end) {
    const instance = this.getInstance();
    if (instance) {
      instance.dispatchAction({
        type: 'dataZoom',
        start: start,
        end: end,
      });
    }
  }
}

// Export singleton instance
const chartService = new ChartService();
export default chartService;

// Also export the class for creating new instances if needed
export { ChartService };
