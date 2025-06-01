import React, { useState } from 'react';
import { Node } from '../../types/flow';

interface WebhookConfigPanelProps {
  node: Node;
  onClose: () => void;
}

const WebhookConfigPanel: React.FC<WebhookConfigPanelProps> = ({ node, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'monitoring'>('basic');
  const [localData, setLocalData] = useState(node.data);

  const updateNodeData = (newData: any) => {
    setLocalData(newData);
    // Disparar evento para atualizar o nó
    const event = new CustomEvent('updateNodeData', {
      detail: { nodeId: node.id, data: newData }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 p-4">
        <h2 className="text-lg font-medium text-gray-200">Webhook Configuration</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-700 p-4">
        <button
          className={`px-3 py-1 text-sm font-medium ${
            activeTab === 'basic'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Settings
        </button>
        <button
          className={`px-3 py-1 text-sm font-medium ${
            activeTab === 'advanced'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced
        </button>
        <button
          className={`px-3 py-1 text-sm font-medium ${
            activeTab === 'monitoring'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('monitoring')}
        >
          Monitoring
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">
                Webhook URL
              </label>
              <input
                type="text"
                value={localData.webhookUrl || ''}
                onChange={(e) => {
                  updateNodeData({
                    ...localData,
                    webhookUrl: e.target.value
                  });
                }}
                className="w-full rounded bg-[#1e2228] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="https://api.example.com/webhook"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">
                HTTP Method
              </label>
              <select
                value={localData.httpMethod || 'POST'}
                onChange={(e) => {
                  updateNodeData({
                    ...localData,
                    httpMethod: e.target.value
                  });
                }}
                className="w-full rounded bg-[#1e2228] px-3 py-2 text-sm text-gray-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">
                Headers
              </label>
              <textarea
                value={localData.headers || ''}
                onChange={(e) => {
                  updateNodeData({
                    ...localData,
                    headers: e.target.value
                  });
                }}
                className="w-full rounded bg-[#1e2228] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="Content-Type: application/json"
                rows={3}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">
                Payload
              </label>
              <textarea
                value={localData.payload || ''}
                onChange={(e) => {
                  updateNodeData({
                    ...localData,
                    payload: e.target.value
                  });
                }}
                className="w-full rounded bg-[#1e2228] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="{ 'key': 'value' }"
                rows={3}
              />
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">
                Timeout (ms)
              </label>
              <input
                type="number"
                value={localData.timeout || 5000}
                onChange={(e) => {
                  updateNodeData({
                    ...localData,
                    timeout: parseInt(e.target.value)
                  });
                }}
                className="w-full rounded bg-[#1e2228] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">
                Retry Count
              </label>
              <input
                type="number"
                value={localData.retryCount || 0}
                onChange={(e) => {
                  updateNodeData({
                    ...localData,
                    retryCount: parseInt(e.target.value)
                  });
                }}
                className="w-full rounded bg-[#1e2228] px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">
                Retry Interval (ms)
              </label>
              <input
                type="number"
                value={localData.retryInterval || 1000}
                onChange={(e) => {
                  updateNodeData({
                    ...localData,
                    retryInterval: parseInt(e.target.value)
                  });
                }}
                className="w-full rounded bg-[#1e2228] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="1000"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebhookConfigPanel; 