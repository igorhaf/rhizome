import React from 'react';
import { Node } from '../../types/flow';
import { ScheduleNodeIcon } from '../icons/ScheduleNodeIcon';

interface ScheduleNodeProps {
  data: Node['data'];
  isConnectable: boolean;
}

const ScheduleNode: React.FC<ScheduleNodeProps> = ({ data, isConnectable }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
        <ScheduleNodeIcon />
      </div>
      <div className="mt-2 text-sm font-medium text-white">{data.label}</div>
      {data.scheduleType && (
        <div className="mt-1 text-xs text-gray-300">
          {data.scheduleType === 'interval' 
            ? `${data.interval} ${data.intervalUnit}`
            : data.cronExpression}
        </div>
      )}
    </div>
  );
};

export default ScheduleNode; 