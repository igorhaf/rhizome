import React, { useState } from 'react';
import { Node } from '../types/flow';
import DatabaseQueryModal from './DatabaseQueryModal';
import QueryInterfaceModal from './QueryInterfaceModal';

interface NodeSidebarProps {
  node: Node | null;
  onUpdate: (updated: Node) => void;
  onClose: () => void;
  canClose?: boolean;
}

const NodeSidebar: React.FC<NodeSidebarProps> = ({ node, onUpdate, onClose, canClose }) => {
  const [localNode, setLocalNode] = useState<Node | null>(node);
  const [visible, setVisible] = useState(false);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [showInterfaceModal, setShowInterfaceModal] = useState(false);

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

  const handleSaveQueryConfig = (config: any) => {
    const updated = {
      ...localNode,
      data: {
        ...localNode.data,
        databaseConfig: config,
      },
    };
    setLocalNode(updated);
    onUpdate(updated);
    setShowQueryModal(false);
    setTimeout(() => setShowInterfaceModal(true), 200); // Pequeno delay para UX
  };

  const handleSaveInterfaceConfig = (interfaceConfig: any) => {
    const updated = {
      ...localNode,
      data: {
        ...localNode.data,
        queryInterface: interfaceConfig,
      },
    };
    setLocalNode(updated);
    onUpdate(updated);
    setShowInterfaceModal(false);
  };

  return (
    <>
      <aside
        className={`fixed top-0 right-0 h-full w-96 bg-[#1e1e1e] border-l border-[#222] p-6 z-50 flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${visible ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ maxHeight: '100vh', overflowY: 'auto' }}
      >
        <div className="flex justify-between items-center mb-1 sticky top-0 bg-[#1e1e1e] z-10">
          <h3 className="text-base font-semibold text-gray-200">Propriedades do Nó</h3>
          {canClose !== false && (
            <button onClick={handleClose} className="text-gray-500 hover:text-red-400 text-lg px-1">×</button>
          )}
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
          <label className="text-xs font-medium mt-1 text-gray-400">Variáveis de saída</label>
          <textarea
            className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
            value={data['outputs'] || ''}
            onChange={e => handleChange('outputs', e.target.value)}
            placeholder="Ex: resultado, status, mensagem..."
          />
          <label className="text-xs font-medium mt-1 text-gray-400">Notas</label>
          <textarea
            className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
            value={data['notes'] || ''}
            onChange={e => handleChange('notes', e.target.value)}
          />
          <label className="text-xs text-gray-400">ID</label>
          <input className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-500 text-sm" value={localNode.id} readOnly />
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
      <DatabaseQueryModal 
        open={showQueryModal} 
        onClose={() => setShowQueryModal(false)}
        onSave={handleSaveQueryConfig}
      />
      <QueryInterfaceModal
        open={showInterfaceModal}
        onClose={() => setShowInterfaceModal(false)}
        onSave={handleSaveInterfaceConfig}
      />
    </>
  );
};

export default NodeSidebar; 