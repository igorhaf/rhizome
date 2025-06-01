import React from 'react';
import { Node } from '../../types/flow';

interface EmailNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const EmailNodeSidebar: React.FC<EmailNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  return (
    <div className="w-80 h-full bg-[#1e2228] border-l border-[#23272e] p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white">Email Configuration</h2>
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
            placeholder="My Email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">From</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.from || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, from: e.target.value }
            })}
            placeholder="sender@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">To</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.to || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, to: e.target.value }
            })}
            placeholder="recipient@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Subject</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.subject || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, subject: e.target.value }
            })}
            placeholder="Email Subject"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Content Type</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.contentType || 'html'}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, contentType: e.target.value as 'html' | 'text' | 'template' }
            })}
          >
            <option value="html">HTML</option>
            <option value="text">Plain Text</option>
            <option value="template">Template</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Priority</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.priority || 'normal'}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, priority: e.target.value as 'high' | 'normal' | 'low' }
            })}
          >
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
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
          <label className="block text-sm font-medium text-gray-200 mb-1">Track Opens</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.trackOpens ? 'true' : 'false'}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, trackOpens: e.target.value === 'true' }
            })}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Track Clicks</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.trackClicks ? 'true' : 'false'}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, trackClicks: e.target.value === 'true' }
            })}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
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
            placeholder="Add any additional notes about this email..."
          />
        </div>
      </div>
    </div>
  );
};

export default EmailNodeSidebar; 