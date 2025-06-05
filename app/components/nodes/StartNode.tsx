import React from 'react';
import { Handle, Position } from 'reactflow';
import { StartNodeIcon } from '../icons/StartNodeIcon';

const StartNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <div className="flex items-center">
        <StartNodeIcon />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">{data.description}</div>
        </div>
      </div>
    </div>
  );
};

export default StartNode; 