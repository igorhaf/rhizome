import React, { useState } from 'react';
import { Node } from '../types/flow';
import SidebarBase from './advanced/SidebarBase';

interface ActionNodeSidebarProps {
  node: Node | null;
  onUpdate: (updated: Node) => void;
  onClose: () => void;
}

const ActionNodeSidebar: React.FC<ActionNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  const [localNode, setLocalNode] = useState<Node | null>(node);
  const [visible, setVisible] = useState(false);

  React.useEffect(() => {
    setLocalNode(node);
    setTimeout(() => setVisible(true), 10);
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

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 200);
  };

  return (
    <SidebarBase title="Configuração da Ação" onClose={handleClose}>
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-400">Nome</label>
        <input
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
          value={data['label'] || ''}
          onChange={e => handleChange('label', e.target.value)}
          placeholder="Nome da ação"
        />
        <label className="text-xs text-gray-400">Descrição</label>
        <textarea
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
          value={data['description'] || ''}
          onChange={e => handleChange('description', e.target.value)}
          placeholder="Adicione uma descrição..."
        />
        <label className="text-xs text-gray-400">ID</label>
        <input 
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-500 text-sm" 
          value={localNode.id} 
          readOnly 
        />
        <label className="text-xs text-gray-400">Tipo de Ação</label>
        <select
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
          value={data['actionType'] || 'function'}
          onChange={e => handleChange('actionType', e.target.value)}
        >
          <option value="function">Função</option>
          <option value="api">API</option>
          <option value="database">Banco de Dados</option>
          <option value="file">Arquivo</option>
          <option value="email">Email</option>
          <option value="notification">Notificação</option>
        </select>
        <label className="text-xs text-gray-400">Parâmetros de Entrada</label>
        <textarea
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
          value={data['inputParams'] || ''}
          onChange={e => handleChange('inputParams', e.target.value)}
          placeholder="Ex: { 'param1': 'valor1', 'param2': 'valor2' }"
        />
        <label className="text-xs text-gray-400">Timeout (ms)</label>
        <input
          type="number"
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
          value={data['timeout'] || 30000}
          onChange={e => handleChange('timeout', parseInt(e.target.value))}
          min="0"
        />
        <label className="text-xs text-gray-400">Tentativas</label>
        <input
          type="number"
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
          value={data['retryCount'] || 0}
          onChange={e => handleChange('retryCount', parseInt(e.target.value))}
          min="0"
          max="5"
        />
        <label className="text-xs text-gray-400">Intervalo entre Tentativas (ms)</label>
        <input
          type="number"
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
          value={data['retryInterval'] || 1000}
          onChange={e => handleChange('retryInterval', parseInt(e.target.value))}
          min="0"
        />
        <label className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-[#222] bg-[#23272e] text-blue-500 focus:ring-blue-500"
            checked={!!data['isAsync']}
            onChange={e => handleChange('isAsync', e.target.checked)}
          />
          Execução Assíncrona
        </label>
        <label className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-[#222] bg-[#23272e] text-blue-500 focus:ring-blue-500"
            checked={!!data['shouldLog']}
            onChange={e => handleChange('shouldLog', e.target.checked)}
          />
          Registrar no Log
        </label>
        <label className="text-xs font-medium mt-1 text-gray-400">Notas</label>
        <textarea
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
          value={data['notes'] || ''}
          onChange={e => handleChange('notes', e.target.value)}
        />
      </div>
      <style jsx>{`
        aside::-webkit-scrollbar {
          width: 7px;
        }
        aside::-webkit-scrollbar-thumb {
          background: #23272e;
          border-radius: 4px;
        }
        aside:hover::-webkit-scrollbar-thumb {
          background: #333842;
        }
        aside::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </SidebarBase>
  );
};

export default ActionNodeSidebar; 