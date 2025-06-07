import React from 'react';
import { Handle, Position } from 'reactflow';
import { ApiNodeIcon } from '../icons/ApiNodeIcon';

const API_COLOR = '#669BBC';

const ApiNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md border-2" style={{ borderColor: API_COLOR }}>
      <Handle type="target" position={Position.Top} className="handle-extended" style={{ top: -8, background: API_COLOR }} />
      <Handle type="source" position={Position.Bottom} className="handle-extended" style={{ bottom: -8, background: API_COLOR }} />
      <div className="flex items-center">
        <ApiNodeIcon color={API_COLOR} />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">{data.description}</div>
        </div>
      </div>
    </div>
  );
};

export default ApiNode; 