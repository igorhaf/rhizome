import React from 'react';
import { Handle, Position } from 'reactflow';
import { DatabaseNodeIcon } from '../icons/DatabaseNodeIcon';

const DATABASE_COLOR = '#D4A5A5';

const DatabaseNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md border-2" style={{ borderColor: DATABASE_COLOR }}>
      <Handle type="target" position={Position.Top} className="handle-extended" style={{ top: -8, background: DATABASE_COLOR }} />
      <Handle type="source" position={Position.Bottom} className="handle-extended" style={{ bottom: -8, background: DATABASE_COLOR }} />
      <div className="flex items-center">
        <DatabaseNodeIcon color={DATABASE_COLOR} />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">{data.description}</div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseNode; 