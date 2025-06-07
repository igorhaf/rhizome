import React from 'react';
import { Handle, Position } from 'reactflow';
import { ScheduleNodeIcon } from '../icons/ScheduleNodeIcon';

const ScheduleNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md border-2 border-stone-400">
      <Handle type="target" position={Position.Top} className="handle-extended" style={{ top: -8 }} />
      <Handle type="source" position={Position.Bottom} className="handle-extended" style={{ bottom: -8 }} />
      <div className="flex items-center">
        <ScheduleNodeIcon />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">
            {data.scheduleType === 'interval'
              ? `${data.interval} ${data.intervalUnit}`
              : data.cronExpression || data.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleNode; 