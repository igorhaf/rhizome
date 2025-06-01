import React, { useState } from 'react';
import { Node } from '../types/flow';

interface ApiConfigTabProps {
  node: Node;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

const ApiConfigTab: React.FC<ApiConfigTabProps> = ({ node, setNodes }) => {
  const [localNode, setLocalNode] = useState<Node>(() => ({ ...node }));
  const [activeTab, setActiveTab] = useState<'request' | 'auth' | 'headers' | 'body' | 'tests' | 'settings'>('request');

  const handleSave = () => {
    setNodes(nodes => nodes.map(n => n.id === localNode.id ? localNode : n));
  };

  return (
    <div className="flex flex-col h-full bg-[#1e2228]">
      {/* Tabs de navegação */}
      <div className="flex border-b border-[#23272e]">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'request' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('request')}
        >
          Request
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'auth' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('auth')}
        >
          Auth
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'headers' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('headers')}
        >
          Headers
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'body' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('body')}
        >
          Body
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'tests' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('tests')}
        >
          Tests
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'settings' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Conteúdo das tabs */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'request' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Request Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.label || ''}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, label: e.target.value }
                })}
                placeholder="My API Request"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.apiUrl || ''}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, apiUrl: e.target.value }
                })}
                placeholder="https://api.example.com/endpoint"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Method</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.httpMethod || 'GET'}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, httpMethod: e.target.value }
                })}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
                <option value="HEAD">HEAD</option>
                <option value="OPTIONS">OPTIONS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                rows={3}
                value={localNode.data.description || ''}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, description: e.target.value }
                })}
                placeholder="Describe your API request..."
              />
            </div>
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Auth Type</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.authType || 'none'}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, authType: e.target.value }
                })}
              >
                <option value="none">No Auth</option>
                <option value="basic">Basic Auth</option>
                <option value="bearer">Bearer Token</option>
                <option value="apiKey">API Key</option>
                <option value="oauth2">OAuth 2.0</option>
              </select>
            </div>

            {localNode.data.authType === 'basic' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Username</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={localNode.data.authUsername || ''}
                    onChange={(e) => setLocalNode({
                      ...localNode,
                      data: { ...localNode.data, authUsername: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={localNode.data.authPassword || ''}
                    onChange={(e) => setLocalNode({
                      ...localNode,
                      data: { ...localNode.data, authPassword: e.target.value }
                    })}
                  />
                </div>
              </>
            )}

            {localNode.data.authType === 'bearer' && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Token</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                  value={localNode.data.authToken || ''}
                  onChange={(e) => setLocalNode({
                    ...localNode,
                    data: { ...localNode.data, authToken: e.target.value }
                  })}
                />
              </div>
            )}

            {localNode.data.authType === 'apiKey' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Key</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={localNode.data.apiKey || ''}
                    onChange={(e) => setLocalNode({
                      ...localNode,
                      data: { ...localNode.data, apiKey: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Value</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={localNode.data.apiKeyValue || ''}
                    onChange={(e) => setLocalNode({
                      ...localNode,
                      data: { ...localNode.data, apiKeyValue: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Add to</label>
                  <select
                    className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={localNode.data.apiKeyLocation || 'header'}
                    onChange={(e) => setLocalNode({
                      ...localNode,
                      data: { ...localNode.data, apiKeyLocation: e.target.value }
                    })}
                  >
                    <option value="header">Header</option>
                    <option value="query">Query Params</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              {(localNode.data.headers || []).map((header: any, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={header.key}
                    onChange={(e) => {
                      const newHeaders = [...(localNode.data.headers || [])];
                      newHeaders[index].key = e.target.value;
                      setLocalNode({
                        ...localNode,
                        data: { ...localNode.data, headers: newHeaders }
                      });
                    }}
                    placeholder="Header name"
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={header.value}
                    onChange={(e) => {
                      const newHeaders = [...(localNode.data.headers || [])];
                      newHeaders[index].value = e.target.value;
                      setLocalNode({
                        ...localNode,
                        data: { ...localNode.data, headers: newHeaders }
                      });
                    }}
                    placeholder="Header value"
                  />
                  <button
                    className="px-3 py-2 text-red-500 hover:text-red-600"
                    onClick={() => {
                      const newHeaders = (localNode.data.headers || []).filter((_, i) => i !== index);
                      setLocalNode({
                        ...localNode,
                        data: { ...localNode.data, headers: newHeaders }
                      });
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                className="px-4 py-2 text-blue-500 hover:text-blue-600 text-sm"
                onClick={() => {
                  const newHeaders = [...(localNode.data.headers || []), { key: '', value: '' }];
                  setLocalNode({
                    ...localNode,
                    data: { ...localNode.data, headers: newHeaders }
                  });
                }}
              >
                + Add Header
              </button>
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Body Type</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.bodyType || 'none'}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, bodyType: e.target.value }
                })}
              >
                <option value="none">None</option>
                <option value="raw">Raw</option>
                <option value="form-data">Form Data</option>
                <option value="x-www-form-urlencoded">x-www-form-urlencoded</option>
              </select>
            </div>

            {localNode.data.bodyType === 'raw' && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Raw Body</label>
                <textarea
                  className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
                  rows={10}
                  value={localNode.data.rawBody || ''}
                  onChange={(e) => setLocalNode({
                    ...localNode,
                    data: { ...localNode.data, rawBody: e.target.value }
                  })}
                  placeholder="Enter raw body content..."
                />
              </div>
            )}

            {(localNode.data.bodyType === 'form-data' || localNode.data.bodyType === 'x-www-form-urlencoded') && (
              <div className="flex flex-col gap-2">
                {(localNode.data.formData || []).map((field: any, index: number) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                      value={field.key}
                      onChange={(e) => {
                        const newFormData = [...(localNode.data.formData || [])];
                        newFormData[index].key = e.target.value;
                        setLocalNode({
                          ...localNode,
                          data: { ...localNode.data, formData: newFormData }
                        });
                      }}
                      placeholder="Field name"
                    />
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                      value={field.value}
                      onChange={(e) => {
                        const newFormData = [...(localNode.data.formData || [])];
                        newFormData[index].value = e.target.value;
                        setLocalNode({
                          ...localNode,
                          data: { ...localNode.data, formData: newFormData }
                        });
                      }}
                      placeholder="Field value"
                    />
                    <button
                      className="px-3 py-2 text-red-500 hover:text-red-600"
                      onClick={() => {
                        const newFormData = (localNode.data.formData || []).filter((_, i) => i !== index);
                        setLocalNode({
                          ...localNode,
                          data: { ...localNode.data, formData: newFormData }
                        });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  className="px-4 py-2 text-blue-500 hover:text-blue-600 text-sm"
                  onClick={() => {
                    const newFormData = [...(localNode.data.formData || []), { key: '', value: '' }];
                    setLocalNode({
                      ...localNode,
                      data: { ...localNode.data, formData: newFormData }
                    });
                  }}
                >
                  + Add Field
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Pre-request Script</label>
              <textarea
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
                rows={6}
                value={localNode.data.preRequestScript || ''}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, preRequestScript: e.target.value }
                })}
                placeholder="// Write your pre-request script here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Tests</label>
              <textarea
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
                rows={6}
                value={localNode.data.tests || ''}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, tests: e.target.value }
                })}
                placeholder="// Write your tests here..."
              />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Timeout (ms)</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.timeout || 30000}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, timeout: parseInt(e.target.value) }
                })}
                min="0"
                step="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Follow Redirects</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.followRedirects ? 'true' : 'false'}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, followRedirects: e.target.value === 'true' }
                })}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">SSL Verification</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.sslVerification ? 'true' : 'false'}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, sslVerification: e.target.value === 'true' }
                })}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
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

export default ApiConfigTab; 