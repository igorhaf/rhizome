import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';

const END_COLOR = '#E57373';

const EndNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="rounded-lg shadow-md px-4 py-2 flex flex-col items-center border-2" style={{ background: '#23272e', borderColor: END_COLOR }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1" style={{ background: END_COLOR }}>
        <span className="text-white font-bold">⏹</span>
      </div>
      <div className="text-xs text-gray-200 font-semibold">{data.label || 'End'}</div>
      <Handle type="target" position={Position.Top} className="handle-extended" style={{ top: -8, background: END_COLOR }} />
      <Handle type="source" position={Position.Bottom} className="handle-extended" style={{ bottom: -8, background: END_COLOR }} />
    </div>
  );
};

export default EndNode; 