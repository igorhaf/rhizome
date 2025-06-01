import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { StartNodeIcon } from '../icons/StartNodeIcon';

interface StartNodeProps {
  data: {
    label: string;
    active?: boolean;
  };
}

const StartNode: React.FC<StartNodeProps> = ({ data }) => {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-[#1e2228] border-2 ${data.active ? 'border-green-500' : 'border-gray-500'}`}>
      <div className="flex items-center">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-[#23272e]">
          <StartNodeIcon />
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold text-white">{data.label}</div>
          <div className="text-gray-400 text-sm">{data.active ? 'Ativo' : 'Inativo'}</div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
};

export default memo(StartNode); 