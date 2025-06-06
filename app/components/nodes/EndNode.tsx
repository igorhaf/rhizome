import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';

const EndNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="rounded-lg shadow-md bg-[#23272e] border-2 border-[#4b5563] px-4 py-2 flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-[#4b5563] flex items-center justify-center mb-1">
        <span className="text-white font-bold">⏹</span>
      </div>
      <div className="text-xs text-gray-200 font-semibold">{data.label || 'End'}</div>
      <Handle type="target" position={Position.Top} className="handle-extended" style={{ top: -8, background: '#4b5563' }} />
    </div>
  );
};

export default EndNode; 