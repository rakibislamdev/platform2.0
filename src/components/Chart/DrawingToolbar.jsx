import React from 'react';
import {
  LeftOutlined,
} from '@ant-design/icons';

const DrawingToolbar = () => {
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
      <button className="p-1 bg-[#1e2433] text-gray-400 hover:text-white rounded-r">
        <LeftOutlined className="text-xs" />
      </button>
    </div>
  );
};

export default DrawingToolbar;
