import React, { useState } from 'react';
import { Node } from '../types/flow';

interface FunctionConfigTabProps {
  node: Node;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

const FunctionConfigTab: React.FC<FunctionConfigTabProps> = ({ node, setNodes }) => {
  const [localNode, setLocalNode] = useState<Node>(() => ({ ...node }));
  const [activeTab, setActiveTab] = useState<'code' | 'inputs' | 'outputs' | 'tests' | 'settings'>('code');

  const handleSave = () => {
    setNodes(nodes => nodes.map(n => n.id === localNode.id ? localNode : n));
  };

  return (
    <div className="flex flex-col h-full bg-[#1e2228]">
      {/* Tabs de navegação */}
      <div className="flex border-b border-[#23272e]">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'code' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('code')}
        >
          Code
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'inputs' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('inputs')}
        >
          Inputs
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'outputs' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('outputs')}
        >
          Outputs
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
        {activeTab === 'code' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Function Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.label || ''}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, label: e.target.value }
                })}
                placeholder="My Function"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Language</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.functionType || 'javascript'}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, functionType: e.target.value as 'javascript' | 'python' }
                })}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Code</label>
              <textarea
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
                rows={15}
                value={localNode.data.functionCode || ''}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, functionCode: e.target.value }
                })}
                placeholder={localNode.data.functionType === 'javascript' 
                  ? '// Write your JavaScript code here...\n// Access inputs via context.inputs\n// Return outputs via return statement'
                  : '# Write your Python code here...\n# Access inputs via context.inputs\n# Return outputs via return statement'
                }
              />
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
                placeholder="Describe what this function does..."
              />
            </div>
          </div>
        )}

        {activeTab === 'inputs' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              {(localNode.data.functionInputs || []).map((input: any, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={input.name}
                    onChange={(e) => {
                      const newInputs = [...(localNode.data.functionInputs || [])];
                      newInputs[index].name = e.target.value;
                      setLocalNode({
                        ...localNode,
                        data: { ...localNode.data, functionInputs: newInputs }
                      });
                    }}
                    placeholder="Input name"
                  />
                  <select
                    className="w-32 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={input.type}
                    onChange={(e) => {
                      const newInputs = [...(localNode.data.functionInputs || [])];
                      newInputs[index].type = e.target.value;
                      setLocalNode({
                        ...localNode,
                        data: { ...localNode.data, functionInputs: newInputs }
                      });
                    }}
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="object">Object</option>
                    <option value="array">Array</option>
                  </select>
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={input.description || ''}
                    onChange={(e) => {
                      const newInputs = [...(localNode.data.functionInputs || [])];
                      newInputs[index].description = e.target.value;
                      setLocalNode({
                        ...localNode,
                        data: { ...localNode.data, functionInputs: newInputs }
                      });
                    }}
                    placeholder="Description"
                  />
                  <button
                    className="px-3 py-2 text-red-500 hover:text-red-600"
                    onClick={() => {
                      const newInputs = (localNode.data.functionInputs || []).filter((_, i) => i !== index);
                      setLocalNode({
                        ...localNode,
                        data: { ...localNode.data, functionInputs: newInputs }
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
                  const newInputs = [...(localNode.data.functionInputs || []), { name: '', type: 'string', description: '' }];
                  setLocalNode({
                    ...localNode,
                    data: { ...localNode.data, functionInputs: newInputs }
                  });
                }}
              >
                + Add Input
              </button>
            </div>
          </div>
        )}

        {activeTab === 'outputs' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              {(localNode.data.functionOutputs || []).map((output: any, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={output.name}
                    onChange={(e) => {
                      const newOutputs = [...(localNode.data.functionOutputs || [])];
                      newOutputs[index].name = e.target.value;
                      setLocalNode({
                        ...localNode,
                        data: { ...localNode.data, functionOutputs: newOutputs }
                      });
                    }}
                    placeholder="Output name"
                  />
                  <select
                    className="w-32 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={output.type}
                    onChange={(e) => {
                      const newOutputs = [...(localNode.data.functionOutputs || [])];
                      newOutputs[index].type = e.target.value;
                      setLocalNode({
                        ...localNode,
                        data: { ...localNode.data, functionOutputs: newOutputs }
                      });
                    }}
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="object">Object</option>
                    <option value="array">Array</option>
                  </select>
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                    value={output.description || ''}
                    onChange={(e) => {
                      const newOutputs = [...(localNode.data.functionOutputs || [])];
                      newOutputs[index].description = e.target.value;
                      setLocalNode({
                        ...localNode,
                        data: { ...localNode.data, functionOutputs: newOutputs }
                      });
                    }}
                    placeholder="Description"
                  />
                  <button
                    className="px-3 py-2 text-red-500 hover:text-red-600"
                    onClick={() => {
                      const newOutputs = (localNode.data.functionOutputs || []).filter((_, i) => i !== index);
                      setLocalNode({
                        ...localNode,
                        data: { ...localNode.data, functionOutputs: newOutputs }
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
                  const newOutputs = [...(localNode.data.functionOutputs || []), { name: '', type: 'string', description: '' }];
                  setLocalNode({
                    ...localNode,
                    data: { ...localNode.data, functionOutputs: newOutputs }
                  });
                }}
              >
                + Add Output
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Tests</label>
              <textarea
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
                rows={10}
                value={localNode.data.functionTests || ''}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, functionTests: e.target.value }
                })}
                placeholder={localNode.data.functionType === 'javascript'
                  ? '// Write your test cases here...\n// Example:\n// test("should transform input correctly", () => {\n//   const result = runFunction({ input: "test" });\n//   expect(result.output).toBe("transformed");\n// });'
                  : '# Write your test cases here...\n# Example:\n# def test_transform_input():\n#     result = run_function({"input": "test"})\n#     assert result["output"] == "transformed"'
                }
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
                value={localNode.data.functionTimeout || 30000}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, functionTimeout: parseInt(e.target.value) }
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
                value={localNode.data.functionRetryCount || 0}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, functionRetryCount: parseInt(e.target.value) }
                })}
                min="0"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Retry Interval (ms)</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.functionRetryInterval || 1000}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, functionRetryInterval: parseInt(e.target.value) }
                })}
                min="0"
                step="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Async Execution</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.functionIsAsync ? 'true' : 'false'}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, functionIsAsync: e.target.value === 'true' }
                })}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Log Execution</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={localNode.data.functionShouldLog ? 'true' : 'false'}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, functionShouldLog: e.target.value === 'true' }
                })}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Notes</label>
              <textarea
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                rows={3}
                value={localNode.data.functionNotes || ''}
                onChange={(e) => setLocalNode({
                  ...localNode,
                  data: { ...localNode.data, functionNotes: e.target.value }
                })}
                placeholder="Add any additional notes about this function..."
              />
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

export default FunctionConfigTab; 