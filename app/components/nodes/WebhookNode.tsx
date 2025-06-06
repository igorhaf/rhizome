import React from 'react';
import { Handle, Position } from 'reactflow';
import { WebhookNodeIcon } from '../icons/WebhookNodeIcon';

const WebhookNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <Handle type="target" position={Position.Top} className="handle-extended" style={{ top: -8 }} />
      <Handle type="source" position={Position.Bottom} className="handle-extended" style={{ bottom: -8 }} />
      <div className="flex items-center">
        <WebhookNodeIcon />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">{data.description}</div>
        </div>
      </div>
    </div>
  );
};

export default WebhookNode; 