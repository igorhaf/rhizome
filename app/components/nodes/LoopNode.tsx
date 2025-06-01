import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { LoopData } from '../../types/loop';

const LoopNode: React.FC<NodeProps<LoopData>> = ({ data, selected }) => {
  return (
    <div
      className={`relative min-w-[200px] rounded-lg border-2 ${
        selected ? 'border-blue-500' : 'border-gray-600'
      } bg-[#2a2d35] p-4 shadow-lg`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400"
      />

      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 rounded-full bg-blue-500" />
          <span className="text-sm font-medium text-gray-200">{data.label}</span>
        </div>
        <select
          value={data.type}
          onChange={(e) => {
            // TODO: Implement type change handler
          }}
          className="rounded bg-[#1e2228] px-2 py-1 text-xs text-gray-300"
        >
          <option value="while">While</option>
          <option value="for">For</option>
          <option value="do-while">Do-While</option>
        </select>
      </div>

      {/* Condition */}
      <div className="mb-3">
        <label className="mb-1 block text-xs text-gray-400">Condition</label>
        <input
          type="text"
          value={data.condition}
          onChange={(e) => {
            // TODO: Implement condition change handler
          }}
          placeholder="Enter condition..."
          className="w-full rounded bg-[#1e2228] px-3 py-2 text-sm text-gray-200 placeholder-gray-500"
        />
      </div>

      {/* Iterations (only for 'for' loops) */}
      {data.type === 'for' && (
        <div className="mb-3">
          <label className="mb-1 block text-xs text-gray-400">Iterations</label>
          <input
            type="number"
            value={data.iterations || 0}
            onChange={(e) => {
              // TODO: Implement iterations change handler
            }}
            className="w-full rounded bg-[#1e2228] px-3 py-2 text-sm text-gray-200"
          />
        </div>
      )}

      {/* Body Preview */}
      <div className="rounded bg-[#1e2228] p-2">
        <div className="text-xs text-gray-400">Body Nodes: {data.body.length}</div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400"
      />
    </div>
  );
};

export default memo(LoopNode); 