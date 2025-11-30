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

  // Calculate Simple Moving Average
  calculateMA(data, period) {
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

  // Calculate Exponential Moving Average
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

  // Calculate Bollinger Bands
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

  // Calculate RSI
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

  // Format candle data for ECharts
  formatCandleData(candleData) {
    if (!candleData || candleData.length === 0) {
      return { dates: [], values: [], closeValues: [], volumes: [], ohlc: [] };
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

    // Close prices for line/area and indicators
    const closeValues = candleData.map((d) => d.close);

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

    return { dates, values, closeValues, volumes, ohlc };
  }

  // Calculate all indicators
  calculateIndicators(closeValues) {
    return {
      ma5: this.calculateMA(closeValues, 5),
      ma10: this.calculateMA(closeValues, 10),
      ma20: this.calculateMA(closeValues, 20),
      ma50: this.calculateMA(closeValues, 50),
      ema12: this.calculateEMA(closeValues, 12),
      ema26: this.calculateEMA(closeValues, 26),
      rsi14: this.calculateRSI(closeValues, 14),
      bollinger: this.calculateBollingerBands(closeValues, 20, 2),
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
    const indicatorConfig = {
      MA5: { data: indicators.ma5, color: '#f59e0b' },
      MA10: { data: indicators.ma10, color: '#06b6d4' },
      MA20: { data: indicators.ma20, color: '#a855f7' },
      MA50: { data: indicators.ma50, color: '#ec4899' },
      EMA12: { data: indicators.ema12, color: '#22c55e' },
      EMA26: { data: indicators.ema26, color: '#eab308' },
    };

    activeIndicators?.forEach((indicator) => {
      if (indicatorConfig[indicator]) {
        series.push({
          name: indicator,
          type: 'line',
          data: indicatorConfig[indicator].data,
          smooth: true,
          lineStyle: { color: indicatorConfig[indicator].color, width: 1 },
          showSymbol: false,
        });
      }
    });

    // Bollinger Bands
    if (activeIndicators?.includes('BB')) {
      series.push(
        {
          name: 'BB Upper',
          type: 'line',
          data: indicators.bollinger.upper,
          smooth: true,
          lineStyle: { color: '#9333ea', width: 1, type: 'dashed' },
          showSymbol: false,
        },
        {
          name: 'BB Middle',
          type: 'line',
          data: indicators.bollinger.middle,
          smooth: true,
          lineStyle: { color: '#9333ea', width: 1 },
          showSymbol: false,
        },
        {
          name: 'BB Lower',
          type: 'line',
          data: indicators.bollinger.lower,
          smooth: true,
          lineStyle: { color: '#9333ea', width: 1, type: 'dashed' },
          showSymbol: false,
        }
      );
    }

    return series;
  }

  // Build all series
  buildAllSeries(chartType, symbol, chartData, activeIndicators) {
    const series = [];

    // Main price series
    const priceSeries = this.buildPriceSeries(
      chartType,
      symbol,
      chartData.values,
      chartData.closeValues
    );
    if (priceSeries) series.push(priceSeries);

    // Volume series
    series.push(this.buildVolumeSeries(chartData.volumes));

    // Indicator series
    const indicators = this.calculateIndicators(chartData.closeValues);
    series.push(...this.buildIndicatorSeries(activeIndicators, indicators));

    return series;
  }

  // Get full chart options
  getChartOptions(chartData, series) {
    return {
      animation: false,
      backgroundColor: this.config.backgroundColor,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
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
          splitLine: { lineStyle: { color: this.config.gridLineColor } },
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
