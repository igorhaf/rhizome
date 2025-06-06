import React, { useState } from 'react';
import { Node } from '../../types/flow';
import SidebarBase from './SidebarBase';

interface LoopNodeSidebarProps {
  node: Node | null;
  onUpdate: (updated: Node) => void;
  onClose: () => void;
}

const LoopNodeSidebar: React.FC<LoopNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  const [localNode, setLocalNode] = useState<Node | null>(node);
  const [showParams, setShowParams] = useState(false);

  React.useEffect(() => { setLocalNode(node); }, [node]);
  if (!localNode) return null;
  const data = localNode.data || {};
  const handleChange = (field: string, value: any) => {
    const updated = { ...localNode, data: { ...localNode.data, [field]: value } };
    setLocalNode(updated);
    onUpdate(updated);
  };

  return (
    <SidebarBase title="Configuração do Loop" onClose={onClose}>
      <label className="text-xs text-gray-400">Nome</label>
          <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={data.label || ''}
        onChange={e => handleChange('label', e.target.value)}
        placeholder="Nome do loop"
          />
      <label className="text-xs text-gray-400">Descrição</label>
          <textarea
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={data.description || ''}
        onChange={e => handleChange('description', e.target.value)}
        placeholder="Adicione uma descrição..."
          />
      <label className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-[#222] bg-[#23272e] text-blue-500 focus:ring-blue-500"
          checked={!!data.shouldLog}
          onChange={e => handleChange('shouldLog', e.target.checked)}
        />
        Registrar no Log
      </label>
      <label className="text-xs font-medium mt-1 text-gray-400">Notas</label>
          <textarea
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={data.notes || ''}
        onChange={e => handleChange('notes', e.target.value)}
        placeholder="Adicione notas sobre este loop..."
          />
      <label className="text-xs text-gray-400">ID</label>
          <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-500 text-sm"
        value={localNode.id}
        readOnly
      />
      <button
        className="px-3 py-1.5 rounded bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 w-fit self-end mb-2"
        onClick={() => setShowParams(true)}
        type="button"
      >
        Parâmetros/Regras
      </button>
      {/* Modal de parâmetros/regras pode ser implementado aqui, se necessário */}
    </SidebarBase>
  );
};

export default LoopNodeSidebar; 