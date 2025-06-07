import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';

const FUNCTION_COLOR = '#38C6AC';

const FunctionNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="rounded-lg shadow-md bg-[#23272e] border-2 px-4 py-2 flex flex-col items-center relative" style={{ borderColor: FUNCTION_COLOR }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1" style={{ background: FUNCTION_COLOR }}>
        <span className="text-white font-bold">ƒ</span>
      </div>
      <div className="text-xs text-gray-200 font-semibold">{data.label || 'Function'}</div>
      {/* Handles colados do lado de fora */}
      <Handle type="target" position={Position.Top} className="handle-extended" style={{ top: -8, background: FUNCTION_COLOR }} />
      <Handle type="source" position={Position.Bottom} className="handle-extended" style={{ bottom: -8, background: FUNCTION_COLOR }} />
    </div>
  );
};

export default FunctionNode; 