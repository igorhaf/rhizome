import React, { useState } from 'react';
import { Node } from '../types/flow';
import DatabaseQueryModal from './DatabaseQueryModal';
import EmailNodeSidebar from './EmailNodeSidebar';
import SpreadsheetNodeSidebar from './SpreadsheetNodeSidebar';
import StartNodeSidebar from './StartNodeSidebar';
import WarningNodeSidebar from './panels/WarningNodeSidebar';
import ApiNodeSidebar from './advanced/ApiNodeSidebar';
import SidebarBase from './advanced/SidebarBase';

interface NodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const NodeSidebar: React.FC<NodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);

  const handleDatabaseQuery = (config: { inputs: { name: string; type: string }[]; outputs: { name: string; returnType: string }[]; query: string }) => {
    const databaseConfig = node.data.databaseConfig || {
      type: 'postgres',
      query: ''
    };

    onUpdate({
      ...node,
      data: {
        ...node.data,
        databaseConfig: {
          ...databaseConfig,
          query: config.query
        }
      }
    });
    setShowDatabaseModal(false);
  };

  if (node.type === 'api') {
    return <ApiNodeSidebar node={node} onUpdate={onUpdate} onClose={onClose} />;
  }

  if (node.type === 'email') {
    return <EmailNodeSidebar node={node} onUpdate={onUpdate} onClose={onClose} />;
  }

  if (node.type === 'spreadsheet') {
    return <SpreadsheetNodeSidebar node={node} onUpdate={onUpdate} onClose={onClose} />;
  }

  if (node.type === 'start') {
    return <StartNodeSidebar node={node} onUpdate={onUpdate} onClose={onClose} />;
  }

  if (node.type === 'warning') {
    return <WarningNodeSidebar data={node.data} onChange={newData => onUpdate({ ...node, data: { ...node.data, ...newData } })} />;
  }

  return (
    <SidebarBase title="Configuração do Nó" onClose={onClose}>
      <label className="text-xs text-gray-400">Nome</label>
      <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={node.data.label || ''}
        onChange={(e) => onUpdate({
          ...node,
          data: { ...node.data, label: e.target.value }
        })}
        placeholder="Nome do nó"
      />
      <label className="text-xs text-gray-400">Descrição</label>
      <textarea
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={node.data.description || ''}
        onChange={(e) => onUpdate({
          ...node,
          data: { ...node.data, description: e.target.value }
        })}
        placeholder="Adicione uma descrição..."
      />
    </SidebarBase>
  );
};

export default NodeSidebar; 