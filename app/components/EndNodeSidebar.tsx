import React, { useState } from 'react';
import { Node } from '../types/flow';

interface EndNodeSidebarProps {
  node: Node | null;
  onUpdate: (updated: Node) => void;
  onClose: () => void;
}

const EndNodeSidebar: React.FC<EndNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
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
    <aside
      className={`fixed top-0 right-0 h-full w-96 bg-[#1e1e1e] border-l border-[#222] p-6 z-50 flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ maxHeight: '100vh', overflowY: 'auto' }}
    >
      <div className="flex justify-between items-center mb-1 sticky top-0 bg-[#1e1e1e] z-10">
        <h3 className="text-base font-semibold text-gray-200">Configurações do Fim</h3>
        <button onClick={handleClose} className="text-gray-500 hover:text-red-400 text-lg px-1">×</button>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-400">Nome</label>
        <input
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
          value={data['label']}
          onChange={e => handleChange('label', e.target.value)}
        />
        <label className="text-xs text-gray-400">Descrição</label>
        <textarea
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
          value={data['description'] || ''}
          onChange={e => handleChange('description', e.target.value)}
        />
        <label className="text-xs text-gray-400">ID</label>
        <input className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-500 text-sm" value={localNode.id} readOnly />
        <label className="text-xs text-gray-400">Status de Retorno</label>
        <select
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
          value={data['returnStatus'] || 'success'}
          onChange={e => handleChange('returnStatus', e.target.value)}
        >
          <option value="success">Sucesso</option>
          <option value="error">Erro</option>
          <option value="warning">Aviso</option>
          <option value="info">Informação</option>
        </select>
        <label className="text-xs text-gray-400">Código de Retorno</label>
        <input
          type="number"
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
          value={data['returnCode'] || 200}
          onChange={e => handleChange('returnCode', parseInt(e.target.value))}
          min="100"
          max="599"
        />
        <label className="text-xs text-gray-400">Mensagem Final</label>
        <textarea
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
          value={data['finalMessage'] || ''}
          onChange={e => handleChange('finalMessage', e.target.value)}
          placeholder="Mensagem que será exibida ao finalizar o fluxo..."
        />
        <label className="text-xs text-gray-400">Tipo de Retorno</label>
        <select
          className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
          value={data['returnType'] || 'json'}
          onChange={e => handleChange('returnType', e.target.value)}
        >
          <option value="json">JSON</option>
          <option value="text">Texto</option>
          <option value="html">HTML</option>
          <option value="xml">XML</option>
          <option value="binary">Binário</option>
        </select>
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
    </aside>
  );
};

export default EndNodeSidebar; 