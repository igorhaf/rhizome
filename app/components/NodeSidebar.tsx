import React, { useState } from 'react';
import { Node } from '../types/flow';
import DatabaseQueryModal from './DatabaseQueryModal';
import EmailNodeSidebar from './EmailNodeSidebar';
import SpreadsheetNodeSidebar from './SpreadsheetNodeSidebar';
import StartNodeSidebar from './StartNodeSidebar';
import WarningNodeSidebar from './panels/WarningNodeSidebar';
import ApiNodeSidebar from './advanced/ApiNodeSidebar';

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
    <div className="w-80 h-full bg-[#1e2228] border-l border-[#23272e] p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white">Configuração do Nó</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Nome</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.label || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, label: e.target.value }
            })}
            placeholder="Nome do nó"
          />
        </div>

        {node.type === 'database' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Tipo de Banco</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={node.data.databaseConfig?.type || 'postgres'}
                onChange={(e) => {
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
                        type: e.target.value as 'postgres' | 'mysql' | 'sqlite' | 'mongodb'
                      }
                    }
                  });
                }}
              >
                <option value="postgres">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="sqlite">SQLite</option>
                <option value="mongodb">MongoDB</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Consulta</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                  value={node.data.databaseConfig?.query || ''}
                  readOnly
                  placeholder="SELECT * FROM table"
                />
                <button
                  onClick={() => setShowDatabaseModal(true)}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Editar
                </button>
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Notas</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
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

      <DatabaseQueryModal
        open={showDatabaseModal}
        onSave={handleDatabaseQuery}
        onClose={() => setShowDatabaseModal(false)}
      />
    </div>
  );
};

export default NodeSidebar; 