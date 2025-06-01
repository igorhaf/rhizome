import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Node } from '../../types/flow';

const WebhookNode: React.FC<NodeProps<Node>> = ({ data, selected }) => {
  const [localData, setLocalData] = useState(data.data);

  const updateNodeData = (newData: any) => {
    setLocalData(newData);
    // Disparar evento para atualizar o nó
    const event = new CustomEvent('updateNodeData', {
      detail: { nodeId: data.id, data: newData }
    });
    window.dispatchEvent(event);
  };

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
          <span className="text-sm font-medium text-gray-200">{localData.label}</span>
        </div>
      </div>

      {/* Description */}
      {localData.description && (
        <div className="mb-3">
          <p className="text-xs text-gray-400">{localData.description}</p>
        </div>
      )}

      {/* Properties */}
      <div className="rounded bg-[#1e2228] p-2">
        <div className="text-xs text-gray-400">
          {localData.webhookUrl && (
            <div className="mb-1">
              <span className="font-medium">URL:</span> {localData.webhookUrl}
            </div>
          )}
          {localData.httpMethod && (
            <div className="mb-1">
              <span className="font-medium">Method:</span> {localData.httpMethod}
            </div>
          )}
          {localData.timeout && (
            <div className="mb-1">
              <span className="font-medium">Timeout:</span> {localData.timeout}ms
            </div>
          )}
          {localData.retryCount !== undefined && (
            <div className="mb-1">
              <span className="font-medium">Retries:</span> {localData.retryCount}
            </div>
          )}
        </div>
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

export default memo(WebhookNode); 