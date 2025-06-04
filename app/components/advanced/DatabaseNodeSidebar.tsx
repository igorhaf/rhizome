import React from 'react';
import { Node } from '../../types/flow';

interface DatabaseNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const DatabaseNodeSidebar: React.FC<DatabaseNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  return (
    <div className="w-80 h-full bg-[#1e2228] border-l border-[#23272e] p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-white">Database Configuration</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.label || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, label: e.target.value }
            })}
            placeholder="My Database"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            rows={3}
            value={node.data.description || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, description: e.target.value }
            })}
            placeholder="Add a description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Database Type</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.databaseConfig?.type || 'postgres'}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                databaseConfig: {
                  ...node.data.databaseConfig,
                  type: e.target.value
                }
              }
            })}
          >
            <option value="postgres">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mongodb">MongoDB</option>
            <option value="sqlite">SQLite</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Host</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            value={node.data.databaseConfig?.host || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                databaseConfig: {
                  ...node.data.databaseConfig,
                  host: e.target.value
                }
              }
            })}
            placeholder="localhost"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Port</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            value={node.data.databaseConfig?.port || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                databaseConfig: {
                  ...node.data.databaseConfig,
                  port: parseInt(e.target.value)
                }
              }
            })}
            placeholder="5432"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Database Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            value={node.data.databaseConfig?.database || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                databaseConfig: {
                  ...node.data.databaseConfig,
                  database: e.target.value
                }
              }
            })}
            placeholder="mydb"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            value={node.data.databaseConfig?.username || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                databaseConfig: {
                  ...node.data.databaseConfig,
                  username: e.target.value
                }
              }
            })}
            placeholder="user"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            value={node.data.databaseConfig?.password || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                databaseConfig: {
                  ...node.data.databaseConfig,
                  password: e.target.value
                }
              }
            })}
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Query Interface</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            rows={5}
            value={node.data.queryInterface || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, queryInterface: e.target.value }
            })}
            placeholder="SELECT * FROM users WHERE id = ?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Timeout (ms)</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            value={node.data.timeout || 30000}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, timeout: parseInt(e.target.value) }
            })}
            min="0"
            step="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Retry Count</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.retryCount || 0}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, retryCount: parseInt(e.target.value) }
            })}
            min="0"
            step="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Retry Interval (ms)</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.retryInterval || 1000}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, retryInterval: parseInt(e.target.value) }
            })}
            min="0"
            step="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Notes</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            rows={3}
            value={node.data.notes || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, notes: e.target.value }
            })}
            placeholder="Add any additional notes about this database..."
          />
        </div>
      </div>
    </div>
  );
};

export default DatabaseNodeSidebar; 