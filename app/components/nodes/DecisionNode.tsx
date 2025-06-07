import React from 'react';
import { Handle, Position } from 'reactflow';
import { DecisionNodeIcon } from '../icons/DecisionNodeIcon';

const DECISION_COLOR = '#4DA8DA';

const DecisionNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md border-2" style={{ borderColor: DECISION_COLOR }}>
      <Handle type="target" position={Position.Top} className="handle-extended" style={{ top: -8, background: DECISION_COLOR }} />
      <Handle type="source" position={Position.Bottom} className="handle-extended" style={{ bottom: -8, background: DECISION_COLOR }} />
      <div className="flex items-center">
        <DecisionNodeIcon color={DECISION_COLOR} />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">{data.description}</div>
        </div>
      </div>
    </div>
  );
};

export default DecisionNode; 