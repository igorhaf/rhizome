import React from 'react';
import { Node } from '../../types/flow';

interface SpreadsheetNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const SpreadsheetNodeSidebar: React.FC<SpreadsheetNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  return (
    <div className="w-80 h-full bg-[#1e2228] border-l border-[#23272e] p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white">Spreadsheet Configuration</h2>
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
            placeholder="My Spreadsheet"
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
          <label className="block text-sm font-medium text-gray-200 mb-1">File Type</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.spreadsheetConfig?.fileType || 'xlsx'}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                spreadsheetConfig: {
                  ...node.data.spreadsheetConfig,
                  fileType: e.target.value
                }
              }
            })}
          >
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="xls">Excel (.xls)</option>
            <option value="csv">CSV (.csv)</option>
            <option value="ods">OpenDocument (.ods)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Operation Type</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.spreadsheetConfig?.operationType || 'read'}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                spreadsheetConfig: {
                  ...node.data.spreadsheetConfig,
                  operationType: e.target.value
                }
              }
            })}
          >
            <option value="read">Read</option>
            <option value="write">Write</option>
            <option value="append">Append</option>
            <option value="update">Update</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Sheet Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.spreadsheetConfig?.sheetName || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                spreadsheetConfig: {
                  ...node.data.spreadsheetConfig,
                  sheetName: e.target.value
                }
              }
            })}
            placeholder="Sheet1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Range</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.spreadsheetConfig?.range || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                spreadsheetConfig: {
                  ...node.data.spreadsheetConfig,
                  range: e.target.value
                }
              }
            })}
            placeholder="A1:D10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Headers</label>
          <div className="space-y-2">
            {(node.data.spreadsheetConfig?.headers || []).map((header, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                  value={header}
                  onChange={(e) => {
                    const newHeaders = [...(node.data.spreadsheetConfig?.headers || [])];
                    newHeaders[index] = e.target.value;
                    onUpdate({
                      ...node,
                      data: {
                        ...node.data,
                        spreadsheetConfig: {
                          ...node.data.spreadsheetConfig,
                          headers: newHeaders
                        }
                      }
                    });
                  }}
                  placeholder="Column Header"
                />
                <button
                  className="px-3 py-2 text-red-400 hover:text-red-300"
                  onClick={() => {
                    const newHeaders = [...(node.data.spreadsheetConfig?.headers || [])];
                    newHeaders.splice(index, 1);
                    onUpdate({
                      ...node,
                      data: {
                        ...node.data,
                        spreadsheetConfig: {
                          ...node.data.spreadsheetConfig,
                          headers: newHeaders
                        }
                      }
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
                const newHeaders = [...(node.data.spreadsheetConfig?.headers || []), ''];
                onUpdate({
                  ...node,
                  data: {
                    ...node.data,
                    spreadsheetConfig: {
                      ...node.data.spreadsheetConfig,
                      headers: newHeaders
                    }
                  }
                });
              }}
            >
              Add Header
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Data</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            rows={5}
            value={node.data.spreadsheetConfig?.data || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                spreadsheetConfig: {
                  ...node.data.spreadsheetConfig,
                  data: e.target.value
                }
              }
            })}
            placeholder="Enter data in JSON format..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Formula</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.spreadsheetConfig?.formula || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                spreadsheetConfig: {
                  ...node.data.spreadsheetConfig,
                  formula: e.target.value
                }
              }
            })}
            placeholder="=SUM(A1:A10)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Format</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.spreadsheetConfig?.format || 'none'}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                spreadsheetConfig: {
                  ...node.data.spreadsheetConfig,
                  format: e.target.value
                }
              }
            })}
          >
            <option value="none">None</option>
            <option value="number">Number</option>
            <option value="currency">Currency</option>
            <option value="date">Date</option>
            <option value="percentage">Percentage</option>
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
          <label className="block text-sm font-medium text-gray-200 mb-1">Notes</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            rows={3}
            value={node.data.notes || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, notes: e.target.value }
            })}
            placeholder="Add any additional notes about this spreadsheet..."
          />
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetNodeSidebar; 