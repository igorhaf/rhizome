import React from 'react';
import { Node } from '../../types/flow';

interface ApiNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const ApiNodeSidebar: React.FC<ApiNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  return (
    <div className="w-80 h-full bg-[#1e2228] border-l border-[#23272e] p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white">API Configuration</h2>
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
            placeholder="My API"
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
          <label className="block text-sm font-medium text-gray-200 mb-1">API URL</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.apiUrl || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, apiUrl: e.target.value }
            })}
            placeholder="https://api.example.com/endpoint"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">HTTP Method</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.httpMethod || 'GET'}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, httpMethod: e.target.value }
            })}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Auth Type</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.authType || 'none'}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, authType: e.target.value as 'none' | 'basic' | 'bearer' | 'apiKey' | 'oauth2' }
            })}
          >
            <option value="none">None</option>
            <option value="basic">Basic Auth</option>
            <option value="bearer">Bearer Token</option>
            <option value="apiKey">API Key</option>
            <option value="oauth2">OAuth 2.0</option>
          </select>
        </div>

        {node.data.authType === 'basic' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.authUsername || ''}
                onChange={(e) => onUpdate({
                  ...node,
                  data: { ...node.data, authUsername: e.target.value }
                })}
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.authPassword || ''}
                onChange={(e) => onUpdate({
                  ...node,
                  data: { ...node.data, authPassword: e.target.value }
                })}
                placeholder="••••••••"
              />
            </div>
          </>
        )}

        {node.data.authType === 'bearer' && (
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Token</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
              value={node.data.authToken || ''}
              onChange={(e) => onUpdate({
                ...node,
                data: { ...node.data, authToken: e.target.value }
              })}
              placeholder="••••••••"
            />
          </div>
        )}

        {node.data.authType === 'apiKey' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">API Key Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.apiKey || ''}
                onChange={(e) => onUpdate({
                  ...node,
                  data: { ...node.data, apiKey: e.target.value }
                })}
                placeholder="X-API-Key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">API Key Value</label>
              <input
                type="password"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.apiKeyValue || ''}
                onChange={(e) => onUpdate({
                  ...node,
                  data: { ...node.data, apiKeyValue: e.target.value }
                })}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">API Key Location</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.apiKeyLocation || 'header'}
                onChange={(e) => onUpdate({
                  ...node,
                  data: { ...node.data, apiKeyLocation: e.target.value as 'header' | 'query' }
                })}
              >
                <option value="header">Header</option>
                <option value="query">Query Parameter</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Body Type</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.bodyType || 'none'}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, bodyType: e.target.value as 'none' | 'raw' | 'form-data' | 'x-www-form-urlencoded' }
            })}
          >
            <option value="none">None</option>
            <option value="raw">Raw</option>
            <option value="form-data">Form Data</option>
            <option value="x-www-form-urlencoded">x-www-form-urlencoded</option>
          </select>
        </div>

        {node.data.bodyType === 'raw' && (
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Raw Body</label>
            <textarea
              className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
              rows={5}
              value={node.data.rawBody || ''}
              onChange={(e) => onUpdate({
                ...node,
                data: { ...node.data, rawBody: e.target.value }
              })}
              placeholder="{\n  \"key\": \"value\"\n}"
            />
          </div>
        )}

        {(node.data.bodyType === 'form-data' || node.data.bodyType === 'x-www-form-urlencoded') && (
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Form Data</label>
            <div className="space-y-2">
              {(node.data.formData || []).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={item.key}
                    onChange={(e) => {
                      const newFormData = [...(node.data.formData || [])];
                      newFormData[index] = { ...item, key: e.target.value };
                      onUpdate({
                        ...node,
                        data: { ...node.data, formData: newFormData }
                      });
                    }}
                    placeholder="Key"
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={item.value}
                    onChange={(e) => {
                      const newFormData = [...(node.data.formData || [])];
                      newFormData[index] = { ...item, value: e.target.value };
                      onUpdate({
                        ...node,
                        data: { ...node.data, formData: newFormData }
                      });
                    }}
                    placeholder="Value"
                  />
                  <button
                    className="px-3 py-2 text-red-400 hover:text-red-300"
                    onClick={() => {
                      const newFormData = [...(node.data.formData || [])];
                      newFormData.splice(index, 1);
                      onUpdate({
                        ...node,
                        data: { ...node.data, formData: newFormData }
                      });
                    }}
                  >
                    {'×'}
                  </button>
                </div>
              ))}
              <button
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white hover:bg-[#2c313a]"
                onClick={() => {
                  const newFormData = [...(node.data.formData || []), { key: '', value: '' }];
                  onUpdate({
                    ...node,
                    data: { ...node.data, formData: newFormData }
                  });
                }}
              >
                Add Field
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Headers</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            rows={3}
            value={node.data.headers || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, headers: e.target.value }
            })}
            placeholder="Content-Type: application/json\nAccept: application/json"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Pre-request Script</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            rows={5}
            value={node.data.preRequestScript || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, preRequestScript: e.target.value }
            })}
            placeholder="// Add any pre-request logic here"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Tests</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            rows={5}
            value={node.data.tests || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, tests: e.target.value }
            })}
            placeholder="// Add any test assertions here"
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
          <label className="block text-sm font-medium text-gray-200 mb-1">Follow Redirects</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.followRedirects ? 'true' : 'false'}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, followRedirects: e.target.value === 'true' }
            })}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">SSL Verification</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.sslVerification ? 'true' : 'false'}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, sslVerification: e.target.value === 'true' }
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
            placeholder="Add any additional notes about this API..."
          />
        </div>
      </div>
    </div>
  );
};

export default ApiNodeSidebar; 