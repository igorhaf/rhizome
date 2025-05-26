import React, { useState } from 'react';
import { Node } from '../types/flow';

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
    setTimeout(() => onClose(), 300);
  };

  return (
    <aside
      className={`fixed top-0 right-0 h-full w-96 bg-gray-800 border-l border-gray-700 shadow-lg p-6 z-50 flex flex-col gap-4
        transform transition-transform duration-300 ease-in-out
        ${visible ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-white">Configurações da Ação</h3>
        <button onClick={handleClose} className="text-gray-400 hover:text-red-400 text-2xl">×</button>
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
        <input 
          className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-300" 
          value={localNode.type} 
          readOnly 
        />
        <label className="text-sm font-medium text-gray-200">ID</label>
        <input 
          className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-gray-300" 
          value={localNode.id} 
          readOnly 
        />
        <label className="text-sm font-medium text-gray-200">Tipo de Ação</label>
        <select
          className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
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
        <label className="text-sm font-medium text-gray-200">Parâmetros de Entrada</label>
        <textarea
          className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white placeholder-gray-400"
          value={data['inputParams'] || ''}
          onChange={e => handleChange('inputParams', e.target.value)}
          placeholder="Ex: { 'param1': 'valor1', 'param2': 'valor2' }"
        />
        <label className="text-sm font-medium text-gray-200">Timeout (ms)</label>
        <input
          type="number"
          className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
          value={data['timeout'] || 30000}
          onChange={e => handleChange('timeout', parseInt(e.target.value))}
          min="0"
        />
        <label className="text-sm font-medium text-gray-200">Tentativas</label>
        <input
          type="number"
          className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
          value={data['retryCount'] || 0}
          onChange={e => handleChange('retryCount', parseInt(e.target.value))}
          min="0"
          max="5"
        />
        <label className="text-sm font-medium text-gray-200">Intervalo entre Tentativas (ms)</label>
        <input
          type="number"
          className="border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
          value={data['retryInterval'] || 1000}
          onChange={e => handleChange('retryInterval', parseInt(e.target.value))}
          min="0"
        />
        <label className="flex items-center gap-2 mt-2 text-gray-200">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
            checked={!!data['isAsync']}
            onChange={e => handleChange('isAsync', e.target.checked)}
          />
          Execução Assíncrona
        </label>
        <label className="flex items-center gap-2 mt-2 text-gray-200">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
            checked={!!data['shouldLog']}
            onChange={e => handleChange('shouldLog', e.target.checked)}
          />
          Registrar no Log
        </label>
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

export default ActionNodeSidebar; 