import React from 'react';
import { Node } from '../types/flow';
import { LoopData } from '../types/loop';

interface LoopConfigTabProps {
  node: Node;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

const LoopConfigTab: React.FC<LoopConfigTabProps> = ({ node, setNodes }) => {
  const data = node.data as LoopData;
  const [localNode, setLocalNode] = React.useState<Node>(() => ({ ...node, id: node.id || '' }));

  const handleTypeChange = (type: 'while' | 'for' | 'do-while') => {
    const updated: Node = {
      ...localNode,
      data: {
        ...localNode.data,
        type,
      },
    };
    setLocalNode(updated);
    setNodes(nodes => nodes.map(n => n.id === updated.id ? updated : n));
  };

  const handleConditionChange = (condition: string) => {
    const updated: Node = {
      ...localNode,
      data: {
        ...localNode.data,
        condition,
      },
    };
    setLocalNode(updated);
    setNodes(nodes => nodes.map(n => n.id === updated.id ? updated : n));
  };

  const handleIterationsChange = (iterations: number) => {
    const updated: Node = {
      ...localNode,
      data: {
        ...localNode.data,
        iterations,
      },
    };
    setLocalNode(updated);
    setNodes(nodes => nodes.map(n => n.id === updated.id ? updated : n));
  };

  return (
    <div className="p-4 space-y-6">
      {/* Cabeçalho com informações básicas */}
      <div className="border-b border-gray-600 pb-4">
        <h2 className="text-xl font-semibold text-white mb-2">Loop Configuration</h2>
        <p className="text-sm text-gray-400">Configure the loop behavior and conditions</p>
      </div>

      {/* Tipo do Loop */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Loop Type</label>
          <select
            value={data.type}
            onChange={(e) => handleTypeChange(e.target.value as 'while' | 'for' | 'do-while')}
            className="w-full rounded bg-[#1e2228] px-3 py-2 text-sm text-gray-200 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="while">While Loop</option>
            <option value="for">For Loop</option>
            <option value="do-while">Do-While Loop</option>
          </select>
          <p className="mt-1 text-xs text-gray-400">
            {data.type === 'while' && 'Executes while the condition is true'}
            {data.type === 'for' && 'Executes a specific number of times'}
            {data.type === 'do-while' && 'Executes at least once, then checks condition'}
          </p>
        </div>

        {/* Condição do Loop */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Condition</label>
          <div className="relative">
            <input
              type="text"
              value={data.condition}
              onChange={(e) => handleConditionChange(e.target.value)}
              placeholder={data.type === 'for' ? 'i < 10' : 'condition == true'}
              className="w-full rounded bg-[#1e2228] px-3 py-2 text-sm text-gray-200 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute right-2 top-2 text-xs text-gray-400">
              {data.type === 'for' ? 'e.g. i < 10' : 'e.g. condition == true'}
            </div>
          </div>
        </div>

        {/* Configurações específicas para For Loop */}
        {data.type === 'for' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Number of Iterations</label>
              <input
                type="number"
                value={data.iterations || 0}
                onChange={(e) => handleIterationsChange(parseInt(e.target.value))}
                min="0"
                className="w-full rounded bg-[#1e2228] px-3 py-2 text-sm text-gray-200 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="bg-[#23272e] p-3 rounded border border-gray-600">
              <h4 className="text-sm font-medium text-gray-200 mb-2">For Loop Structure</h4>
              <pre className="text-xs text-gray-400 bg-[#1e2228] p-2 rounded">
{`for (let i = 0; i < ${data.iterations || 0}; i++) {
  // Loop body
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Informações do Corpo do Loop */}
        <div className="bg-[#23272e] p-4 rounded border border-gray-600">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-200">Loop Body</h4>
            <span className="text-xs text-gray-400">{data.body?.length || 0} nodes</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-400">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <span>Start</span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Body Nodes</span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              <span>End</span>
            </div>
          </div>
        </div>

        {/* Dicas e Ajuda */}
        <div className="bg-[#23272e] p-4 rounded border border-gray-600">
          <h4 className="text-sm font-medium text-gray-200 mb-2">Tips</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Use clear and descriptive conditions</li>
            <li>• Consider using variables for dynamic conditions</li>
            <li>• Be careful with infinite loops</li>
            <li>• Use break conditions when necessary</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoopConfigTab; 