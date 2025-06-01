import React, { useState } from 'react';
import { Node } from '../types/flow';

interface WebhookConfigTabProps {
  node: Node;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

const WebhookConfigTab: React.FC<WebhookConfigTabProps> = ({ node, setNodes }) => {
  const [localNode, setLocalNode] = useState<Node>(() => ({ ...node }));
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'monitoring'>('basic');

  const handleSave = () => {
    setNodes(nodes => nodes.map(n => n.id === localNode.id ? localNode : n));
  };

  return (
    <div className="flex flex-col h-full bg-[#1e2228]">
      {/* Tabs de navegação */}
      <div className="flex border-b border-[#23272e]">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'basic' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Settings
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'advanced' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'monitoring' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('monitoring')}
        >
          Monitoring
        </button>
      </div>

      {/* Conteúdo das tabs */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Webhook URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.webhookUrl || ''}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, webhookUrl: e.target.value }
                })}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">HTTP Method</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.httpMethod || 'POST'}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, httpMethod: e.target.value }
                })}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Headers</label>
              <textarea
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
                rows={4}
                value={localNode.data.headers || ''}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, headers: e.target.value }
                })}
                placeholder="Content-Type: application/json&#10;Authorization: Bearer token"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Payload</label>
              <textarea
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
                rows={6}
                value={localNode.data.payload || ''}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, payload: e.target.value }
                })}
                placeholder="{&#10;  &quot;key&quot;: &quot;value&quot;&#10;}"
              />
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Timeout (ms)</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.timeout || 5000}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, timeout: parseInt(e.target.value) }
                })}
                min="0"
                step="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Retry Count</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.retryCount || 0}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, retryCount: parseInt(e.target.value) }
                })}
                min="0"
                max="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Retry Interval (ms)</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.retryInterval || 1000}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, retryInterval: parseInt(e.target.value) }
                })}
                min="0"
                step="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Input Parameters</label>
              <textarea
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
                rows={4}
                value={localNode.data.inputParams || ''}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, inputParams: e.target.value }
                })}
                placeholder="param1, param2, param3"
              />
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Response Status</label>
              <div className="px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white">
                {localNode.data.responseStatus || 'Not executed yet'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Last Execution</label>
              <div className="px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white">
                {localNode.data.lastExecution || 'Never'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Execution Count</label>
              <div className="px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white">
                {localNode.data.executionCount || 0}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Average Response Time</label>
              <div className="px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white">
                {localNode.data.avgResponseTime || 'N/A'} ms
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botão de salvar */}
      <div className="p-4 border-t border-[#23272e]">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default WebhookConfigTab; 