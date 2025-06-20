import React from 'react';
import { Node } from '../../types/flow';
import EmailNodeSidebar from './EmailNodeSidebar';
import SpreadsheetNodeSidebar from './SpreadsheetNodeSidebar';

interface NodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const NodeSidebar: React.FC<NodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  if (!node) return null;

  switch (node.type) {
    case 'email':
      return <EmailNodeSidebar node={node} onUpdate={onUpdate} onClose={onClose} />;
    case 'spreadsheet':
      return <SpreadsheetNodeSidebar node={node} onUpdate={onUpdate} onClose={onClose} />;
    default:
      return (
        <div className="w-80 h-full bg-[#1e2228] border-l border-[#23272e] p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">Node Configuration</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.label || ''}
                onChange={(e) => onUpdate({
                  ...node,
                  data: { ...node.data, label: e.target.value }
                })}
                placeholder="Node Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
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
              <label className="block text-sm font-medium text-gray-200 mb-1">Timeout (ms)</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
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
                placeholder="Add any additional notes..."
              />
            </div>
          </div>
        </div>
      );
  }
};

export default NodeSidebar; 