import React from 'react';
import { Node } from '../types/flow';

interface StartNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const StartNodeSidebar: React.FC<StartNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  return (
    <div className="w-80 h-full bg-[#1e2228] border-l border-[#23272e] p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-white">Configuração do Início</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Nome</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.label || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, label: e.target.value }
            })}
            placeholder="Meu Início"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Descrição</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            rows={3}
            value={node.data.description || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, description: e.target.value }
            })}
            placeholder="Adicione uma descrição..."
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-200">Ativo</label>
          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
            <input
              type="checkbox"
              className="absolute w-6 h-6 transition duration-100 ease-in-out transform bg-[#23272e] border-2 rounded-full appearance-none cursor-pointer peer border-[#333] checked:translate-x-full checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              checked={node.data.active || false}
              onChange={(e) => onUpdate({
                ...node,
                data: { ...node.data, active: e.target.checked }
              })}
            />
            <label
              className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                node.data.active ? 'bg-blue-500' : 'bg-[#333]'
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Notas</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            rows={3}
            value={node.data.notes || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, notes: e.target.value }
            })}
            placeholder="Adicione notas sobre este nó..."
          />
        </div>
      </div>
    </div>
  );
};

export default StartNodeSidebar; 