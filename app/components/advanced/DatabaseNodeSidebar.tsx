import React from 'react';
import { Node } from '../../types/flow';
import SidebarBase from './SidebarBase';

interface DatabaseNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const DatabaseNodeSidebar: React.FC<DatabaseNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  const databaseConfig = {
    type: node.data.databaseConfig?.type || 'postgres',
    query: node.data.databaseConfig?.query || '',
  };

  return (
    <SidebarBase title="Configuração do Banco de Dados" onClose={onClose}>
      <label className="text-xs text-gray-400">Nome</label>
      <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={node.data.label || ''}
        onChange={e => onUpdate({
          ...node,
          data: { ...node.data, label: e.target.value }
        })}
        placeholder="Nome do banco"
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
      <label className="text-xs text-gray-400">Tipo de Banco</label>
      <select
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
        value={databaseConfig.type}
        onChange={e => onUpdate({
          ...node,
          data: {
            ...node.data,
            databaseConfig: {
              ...databaseConfig,
              type: e.target.value as 'postgres' | 'mysql' | 'sqlite' | 'mongodb'
            }
          }
        })}
      >
        <option value="postgres">PostgreSQL</option>
        <option value="mysql">MySQL</option>
        <option value="sqlite">SQLite</option>
        <option value="mongodb">MongoDB</option>
      </select>
      <label className="text-xs text-gray-400">Query SQL</label>
      <textarea
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={databaseConfig.query}
        onChange={e => onUpdate({
          ...node,
          data: {
            ...node.data,
            databaseConfig: {
              ...databaseConfig,
              query: e.target.value
            }
          }
        })}
        placeholder="SELECT * FROM users WHERE id = ?"
        rows={4}
      />
      <label className="text-xs text-gray-400">Timeout (ms)</label>
      <input
        type="number"
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={node.data.timeout || 30000}
        onChange={e => onUpdate({
          ...node,
          data: { ...node.data, timeout: parseInt(e.target.value) }
        })}
        min="0"
        step="1000"
      />
      <label className="text-xs font-medium mt-1 text-gray-400">Notas</label>
      <textarea
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={node.data.notes || ''}
        onChange={e => onUpdate({
          ...node,
          data: { ...node.data, notes: e.target.value }
        })}
        placeholder="Adicione notas sobre este banco..."
      />
    </SidebarBase>
  );
};

export default DatabaseNodeSidebar; 