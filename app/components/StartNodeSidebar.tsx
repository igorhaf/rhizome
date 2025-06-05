import React from 'react';
import { Node } from '../types/flow';
import SidebarBase from './advanced/SidebarBase';

interface StartNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const StartNodeSidebar: React.FC<StartNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  return (
    <SidebarBase title="Configuração do Início" onClose={onClose}>
      <label className="text-xs text-gray-400">Nome</label>
      <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={node.data.label || ''}
        onChange={e => onUpdate({
          ...node,
          data: { ...node.data, label: e.target.value }
        })}
        placeholder="Meu Início"
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
      <label className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-[#222] bg-[#23272e] text-blue-500 focus:ring-blue-500"
          checked={!!node.data.active}
          onChange={e => onUpdate({
            ...node,
            data: { ...node.data, active: e.target.checked }
          })}
        />
        Ativo
      </label>
      <label className="text-xs font-medium mt-1 text-gray-400">Notas</label>
      <textarea
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={node.data.notes || ''}
        onChange={e => onUpdate({
          ...node,
          data: { ...node.data, notes: e.target.value }
        })}
        placeholder="Adicione notas sobre este nó..."
      />
    </SidebarBase>
  );
};

export default StartNodeSidebar; 