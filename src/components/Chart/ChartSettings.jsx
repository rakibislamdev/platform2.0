import React, { useState, useEffect } from 'react';
import { Switch, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import useTradingStore from '../../store/tradingStore';

const defaultSettings = {
  showGridLines: true,
  showVolume: true,
  crosshairStyle: 'cross',
  upColor: '#26a69a',
  downColor: '#ef5350',
  lineColor: '#2962ff',
  backgroundColor: '#0a0e17',
  priceScale: 'normal',
  timeFormat: '24h',
  timezone: 'UTC',
};

const ChartSettings = ({ onClose }) => {
  const { 
    chartSettings, 
    updateChartSettings 
  } = useTradingStore();

  // Local state for temporary settings (until confirm is clicked)
  const [localSettings, setLocalSettings] = useState(() => ({
    ...defaultSettings,
    ...chartSettings,
  }));

  // Sync with store settings when opened
  useEffect(() => {
    setLocalSettings({
      ...defaultSettings,
      ...chartSettings,
    });
  }, [chartSettings]);

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleConfirm = () => {
    updateChartSettings(localSettings);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleReset = () => {
    setLocalSettings({ ...defaultSettings });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleCancel}
      />
      
      {/* Modal - Centered */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#151924] rounded-lg border border-[#1e2433] shadow-xl flex flex-col max-h-[70vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2433] flex-shrink-0">
            <h3 className="font-semibold text-white text-sm">Chart Settings</h3>
            <button onClick={handleCancel} className="p-1 text-gray-400 hover:text-white rounded transition-colors">
              <CloseOutlined />
            </button>
          </div>
          
          {/* Settings Content */}
          <div className="overflow-y-auto flex-1 p-4 space-y-4">
            {/* Display Section */}
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Display</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Show Grid Lines</span>
                  <Switch 
                    size="small" 
                    checked={localSettings.showGridLines} 
                    onChange={(checked) => handleChange('showGridLines', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Show Volume</span>
                  <Switch 
                    size="small" 
                    checked={localSettings.showVolume} 
                    onChange={(checked) => handleChange('showVolume', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Crosshair Style</span>
                  <Select
                    size="middle"
                    value={localSettings.crosshairStyle}
                    onChange={(value) => handleChange('crosshairStyle', value)}
                    style={{ width: 130 }}
                    options={[
                      { value: 'cross', label: 'Cross' },
                      { value: 'line', label: 'Line' },
                      { value: 'shadow', label: 'Shadow' },
                      { value: 'none', label: 'None' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Colors Section */}
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Colors</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Up Candle</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={localSettings.upColor}
                      onChange={(e) => handleChange('upColor', e.target.value)}
                      className="w-8 h-6 rounded border border-[#1e2433] cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 font-mono">{localSettings.upColor}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Down Candle</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={localSettings.downColor}
                      onChange={(e) => handleChange('downColor', e.target.value)}
                      className="w-8 h-6 rounded border border-[#1e2433] cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 font-mono">{localSettings.downColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Line Color</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={localSettings.lineColor}
                      onChange={(e) => handleChange('lineColor', e.target.value)}
                      className="w-8 h-6 rounded border border-[#1e2433] cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 font-mono">{localSettings.lineColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Background</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={localSettings.backgroundColor}
                      onChange={(e) => handleChange('backgroundColor', e.target.value)}
                      className="w-8 h-6 rounded border border-[#1e2433] cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 font-mono">{localSettings.backgroundColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scale Section */}
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Scale</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Price Scale</span>
                  <Select
                    size="middle"
                    value={localSettings.priceScale}
                    onChange={(value) => handleChange('priceScale', value)}
                    style={{ width: 130 }}
                    options={[
                      { value: 'normal', label: 'Normal' },
                      { value: 'logarithmic', label: 'Logarithmic' },
                      { value: 'percentage', label: 'Percentage' },
                    ]}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Time Format</span>
                  <Select
                    size="middle"
                    value={localSettings.timeFormat}
                    onChange={(value) => handleChange('timeFormat', value)}
                    style={{ width: 130 }}
                    options={[
                      { value: '12h', label: '12 Hour' },
                      { value: '24h', label: '24 Hour' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Timezone Section */}
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Timezone</p>
              
              <Select
                size="middle"
                value={localSettings.timezone}
                onChange={(value) => handleChange('timezone', value)}
                style={{ width: '100%' }}
                options={[
                  { value: 'UTC', label: 'UTC' },
                  { value: 'local', label: 'Local Time' },
                  { value: 'America/New_York', label: 'New York (EST)' },
                  { value: 'Europe/London', label: 'London (GMT)' },
                  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
                  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
                ]}
              />
            </div>

            {/* Reset Button */}
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="w-full py-2 text-sm text-gray-400 hover:text-white border border-[#1e2433] rounded hover:border-gray-500 transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>

          {/* Footer with Cancel and Confirm buttons */}
          <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-[#1e2433] flex-shrink-0">
            <button
              onClick={handleCancel}
              className="px-4 py-1.5 text-sm text-gray-400 hover:text-white border border-[#1e2433] rounded hover:border-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartSettings;
