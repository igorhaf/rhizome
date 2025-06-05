import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';

const SpreadsheetNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="rounded-lg shadow-md bg-[#23272e] border-2 border-[#10b981] px-4 py-2 flex flex-col items-center">
      <div className="w-8 h-8 rounded bg-[#10b981] flex items-center justify-center mb-1">
        <span className="text-white font-bold">📊</span>
      </div>
      <div className="text-xs text-gray-200 font-semibold">{data.label || 'Spreadsheet'}</div>
      <Handle type="target" position={Position.Top} style={{ background: '#10b981' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#10b981' }} />
    </div>
  );
};

export default SpreadsheetNode; 