import React from 'react';
import { Node } from '../../types/flow';
import SidebarBase from './SidebarBase';

interface SubprocessNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const SubprocessNodeSidebar: React.FC<SubprocessNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  return (
    <SidebarBase title="Configuração do Subprocesso" onClose={onClose}>
      <label className="text-xs text-gray-400">Nome</label>
      <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={node.data.label || ''}
        onChange={e => onUpdate({
          ...node,
          data: { ...node.data, label: e.target.value }
        })}
        placeholder="Nome do subprocesso"
      />
      <label className="text-xs text-gray-400">Descrição</label>
      <textarea
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={node.data.description || ''}
        onChange={e => onUpdate({
          ...node,
          data: { ...node.data, description: e.target.value }
        })}
        placeholder="Adicione uma descrição..."
      />
      <label className="text-xs font-medium mt-1 text-gray-400">Notas</label>
      <textarea
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={node.data.notes || ''}
        onChange={e => onUpdate({
          ...node,
          data: { ...node.data, notes: e.target.value }
        })}
        placeholder="Adicione notas sobre este subprocesso..."
      />
      <label className="text-xs text-gray-400">ID</label>
      <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-500 text-sm"
        value={node.id}
        readOnly
      />
    </SidebarBase>
  );
};

export default SubprocessNodeSidebar; 