import React, { useState } from 'react';
import { Node } from '../types/flow';

interface EmailConfigTabProps {
  node: Node;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

const EmailConfigTab: React.FC<EmailConfigTabProps> = ({ node, setNodes }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'advanced'>('general');

  const handleUpdate = (updates: Partial<Node['data']>) => {
    setNodes(prevNodes => 
      prevNodes.map(n => 
        n.id === node.id 
          ? { ...n, data: { ...n.data, ...updates } }
          : n
      )
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#1e2228]">
      {/* Tabs */}
      <div className="flex border-b border-[#23272e]">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'general'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'content'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'advanced'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.label || ''}
                onChange={(e) => handleUpdate({ label: e.target.value })}
                placeholder="My Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">From</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.from || ''}
                onChange={(e) => handleUpdate({ from: e.target.value })}
                placeholder="sender@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">To</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.to || ''}
                onChange={(e) => handleUpdate({ to: e.target.value })}
                placeholder="recipient@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">CC</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.cc || ''}
                onChange={(e) => handleUpdate({ cc: e.target.value })}
                placeholder="cc@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">BCC</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.bcc || ''}
                onChange={(e) => handleUpdate({ bcc: e.target.value })}
                placeholder="bcc@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Reply To</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.replyTo || ''}
                onChange={(e) => handleUpdate({ replyTo: e.target.value })}
                placeholder="reply@example.com"
              />
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Subject</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.subject || ''}
                onChange={(e) => handleUpdate({ subject: e.target.value })}
                placeholder="Email Subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Content Type</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.contentType || 'html'}
                onChange={(e) => handleUpdate({ contentType: e.target.value as 'html' | 'text' | 'template' })}
              >
                <option value="html">HTML</option>
                <option value="text">Plain Text</option>
                <option value="template">Template</option>
              </select>
            </div>

            {node.data.contentType === 'template' && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Template ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                  value={node.data.templateId || ''}
                  onChange={(e) => handleUpdate({ templateId: e.target.value })}
                  placeholder="template_123"
                />
              </div>
            )}

            {node.data.contentType !== 'template' && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Body</label>
                <textarea
                  className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                  rows={10}
                  value={node.data.body || ''}
                  onChange={(e) => handleUpdate({ body: e.target.value })}
                  placeholder={node.data.contentType === 'html' ? '<html>...</html>' : 'Email body...'}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Attachments</label>
              <div className="space-y-2">
                {(node.data.attachments || []).map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                      value={attachment.name}
                      onChange={(e) => {
                        const newAttachments = [...(node.data.attachments || [])];
                        newAttachments[index] = { ...attachment, name: e.target.value };
                        handleUpdate({ attachments: newAttachments });
                      }}
                      placeholder="File name"
                    />
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                      value={attachment.path}
                      onChange={(e) => {
                        const newAttachments = [...(node.data.attachments || [])];
                        newAttachments[index] = { ...attachment, path: e.target.value };
                        handleUpdate({ attachments: newAttachments });
                      }}
                      placeholder="File path"
                    />
                    <button
                      className="px-3 py-2 text-red-400 hover:text-red-300"
                      onClick={() => {
                        const newAttachments = [...(node.data.attachments || [])];
                        newAttachments.splice(index, 1);
                        handleUpdate({ attachments: newAttachments });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white hover:bg-[#2c313a]"
                  onClick={() => {
                    const newAttachments = [...(node.data.attachments || []), { name: '', url: '', path: '' }];
                    handleUpdate({ attachments: newAttachments });
                  }}
                >
                  Add Attachment
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Priority</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.priority || 'normal'}
                onChange={(e) => handleUpdate({ priority: e.target.value as 'high' | 'normal' | 'low' })}
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
                onChange={(e) => handleUpdate({ timeout: parseInt(e.target.value) })}
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
                onChange={(e) => handleUpdate({ retryCount: parseInt(e.target.value) })}
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
                onChange={(e) => handleUpdate({ retryInterval: parseInt(e.target.value) })}
                min="0"
                step="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Track Opens</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.trackOpens ? 'true' : 'false'}
                onChange={(e) => handleUpdate({ trackOpens: e.target.value === 'true' })}
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
                onChange={(e) => handleUpdate({ trackClicks: e.target.value === 'true' })}
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
                onChange={(e) => handleUpdate({ notes: e.target.value })}
                placeholder="Add any additional notes about this email..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailConfigTab; 