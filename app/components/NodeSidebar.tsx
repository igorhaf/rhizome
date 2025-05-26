import React, { useState } from 'react';
import { Node } from '../types/flow';

interface NodeSidebarProps {
  node: Node | null;
  onUpdate: (updated: Node) => void;
  onClose: () => void;
}

const NodeSidebar: React.FC<NodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  const [localNode, setLocalNode] = useState<Node | null>(node);

  React.useEffect(() => {
    setLocalNode(node);
  }, [node]);

  if (!localNode) return null;

  const data = localNode.data || {};

  const handleChange = (field: string, value: any) => {
    const updated = {
      ...localNode,
      data: {
        ...localNode.data,
        [field]: value,
      },
    };
    setLocalNode(updated);
    onUpdate(updated);
  };

  return (
    <aside className="fixed top-0 right-0 h-full w-96 bg-gray-800 border-l border-gray-700 shadow-lg p-6 z-50 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-white">Propriedades do Nó</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-red-400 text-2xl">×</button>
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-200">Nome</label>
        <input
          className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white placeholder-gray-400"
          value={data['label']}
          onChange={e => handleChange('label', e.target.value)}
        />
        <label className="text-sm font-medium text-gray-200">Descrição</label>
        <textarea
          className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white placeholder-gray-400"
          value={data['description'] || ''}
          onChange={e => handleChange('description', e.target.value)}
        />
        <label className="text-sm font-medium text-gray-200">Tipo</label>
        <input className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-300" value={localNode.type} readOnly />
        <label className="text-sm font-medium text-gray-200">ID</label>
        <input className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-300" value={localNode.id} readOnly />
        <label className="text-sm font-medium text-gray-200">Cor</label>
        <input
          type="color"
          className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
          value={data['color'] || '#ffffff'}
          onChange={e => handleChange('color', e.target.value)}
        />
        <label className="flex items-center gap-2 mt-2 text-gray-200">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
            checked={!!data['active']}
            onChange={e => handleChange('active', e.target.checked)}
          />
          Ativo
        </label>
        <label className="text-sm font-medium mt-2 text-gray-200">Variáveis de saída</label>
        <textarea
          className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white placeholder-gray-400"
          value={data['outputs'] || ''}
          onChange={e => handleChange('outputs', e.target.value)}
          placeholder="Ex: resultado, status, mensagem..."
        />
        <label className="text-sm font-medium mt-2 text-gray-200">Notas</label>
        <textarea
          className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white placeholder-gray-400"
          value={data['notes'] || ''}
          onChange={e => handleChange('notes', e.target.value)}
        />
      </div>
    </aside>
  );
};

export default NodeSidebar; 