import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import useTradingStore from '../../store/tradingStore';

const DepthChart = () => {
  const { orderBook, currentPrice, currentSymbol } = useTradingStore();

  const options = useMemo(() => {
    if (!orderBook) return {};

    // Prepare bid data (accumulated from high to low price)
    const bids = [...orderBook.bids].sort((a, b) => b.price - a.price);
    const bidData = [];
    let bidAccum = 0;
    for (let i = bids.length - 1; i >= 0; i--) {
      bidAccum += bids[i].volume;
      bidData.unshift([bids[i].price, bidAccum]);
    }

    // Prepare ask data (accumulated from low to high price)
    const asks = [...orderBook.asks].sort((a, b) => a.price - b.price);
    const askData = [];
    let askAccum = 0;
    for (const ask of asks) {
      askAccum += ask.volume;
      askData.push([ask.price, askAccum]);
    }

    return {
      animation: true,
      backgroundColor: '#0a0e17',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        backgroundColor: 'rgba(21, 25, 36, 0.95)',
        borderColor: '#1e2433',
        textStyle: {
          color: '#e5e7eb',
          fontSize: 12,
        },
        formatter: (params) => {
          if (params[0]) {
            const price = params[0].data[0].toFixed(5);
            const volume = params[0].data[1].toLocaleString();
            const side = params[0].seriesName;
            return `${side}<br/>Price: ${price}<br/>Total: ${volume}`;
          }
          return '';
        },
      },
      grid: {
        left: '3%',
        right: '60px',
        top: '10%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#1e2433' } },
        axisLabel: { 
          color: '#9ca3af', 
          fontSize: 11,
          formatter: (value) => value.toFixed(4),
        },
        splitLine: { 
          show: true,
          lineStyle: { color: 'rgba(42, 46, 57, 0.3)' },
        },
      },
      yAxis: {
        type: 'value',
        position: 'right',
        axisLine: { lineStyle: { color: '#1e2433' } },
        axisLabel: { 
          color: '#9ca3af', 
          fontSize: 11,
          formatter: (value) => {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
            return value;
          },
        },
        splitLine: { 
          show: true,
          lineStyle: { color: 'rgba(42, 46, 57, 0.3)' },
        },
      },
      series: [
        {
          name: 'Bids',
          type: 'line',
          data: bidData,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: '#26a69a',
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
                { offset: 0, color: 'rgba(38, 166, 154, 0.4)' },
                { offset: 1, color: 'rgba(38, 166, 154, 0.05)' },
              ],
            },
          },
        },
        {
          name: 'Asks',
          type: 'line',
          data: askData,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: '#ef5350',
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
                { offset: 0, color: 'rgba(239, 83, 80, 0.4)' },
                { offset: 1, color: 'rgba(239, 83, 80, 0.05)' },
              ],
            },
          },
        },
        // Current price marker line
        {
          name: 'Current Price',
          type: 'line',
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: {
              color: '#fbbf24',
              type: 'dashed',
              width: 1,
            },
            data: [
              { xAxis: currentPrice },
            ],
            label: {
              show: true,
              formatter: '{c}',
              color: '#fbbf24',
            },
          },
          data: [],
        },
      ],
    };
  }, [orderBook, currentPrice]);

  return (
    <div className="w-full h-full bg-[#0a0e17] flex flex-col">
      {/* Depth Chart Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e2433]">
        <div className="flex items-center gap-4">
          <span className="text-white font-medium">{currentSymbol} Market Depth</span>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-[#26a69a]" />
              <span className="text-gray-400">Bids</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-[#ef5350]" />
              <span className="text-gray-400">Asks</span>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Mid Price: <span className="text-yellow-400">{currentPrice?.toFixed(5)}</span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="flex-1">
        <ReactECharts
          option={options}
          style={{ width: '100%', height: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
      
      {/* Depth Stats */}
      <div className="flex items-center justify-around px-4 py-2 border-t border-[#1e2433] text-xs">
        <div className="text-center">
          <div className="text-gray-500">Total Bids</div>
          <div className="text-[#26a69a] font-mono">
            {orderBook?.bids.reduce((sum, b) => sum + b.volume, 0).toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">Spread</div>
          <div className="text-yellow-400 font-mono">
            {orderBook && (orderBook.asks[0]?.price - orderBook.bids[0]?.price).toFixed(5)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">Total Asks</div>
          <div className="text-[#ef5350] font-mono">
            {orderBook?.asks.reduce((sum, a) => sum + a.volume, 0).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepthChart;
