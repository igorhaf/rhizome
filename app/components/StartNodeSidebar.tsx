import React, { useState, useEffect } from 'react';
import { Node } from '../types/flow';
import SidebarBase from './advanced/SidebarBase';

interface StartNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
  isClosing?: boolean;
}

const StartNodeSidebar: React.FC<StartNodeSidebarProps> = ({ node, onUpdate, onClose, isClosing: isClosingProp }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosingInternal, setIsClosingInternal] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const isClosing = isClosingProp !== undefined ? isClosingProp : isClosingInternal;

  // Função para sincronizar toggle do node e checkbox do sidebar
  const handleToggleActive = (value: boolean) => {
    onUpdate({
      ...node,
      data: { ...node.data, active: value }
    });
  };

  const handleClose = () => {
    if (isClosingProp !== undefined) {
      onClose();
    } else {
      setIsClosingInternal(true);
      setTimeout(() => {
        onClose();
      }, 300);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 50 }}>
      {/* Overlay com fade - apenas para o sidebar */}
      <div 
        className={`absolute top-0 right-0 bottom-0 w-96 bg-black transition-all duration-300 pointer-events-auto ${
          isClosing ? 'opacity-0' : 'opacity-50'
        }`}
        onClick={handleClose}
      />
      
      {/* Sidebar */}
      <aside
        className={`absolute top-0 right-0 h-full w-96 bg-[#1e1e1e] border-l border-[#222] p-6 flex flex-col pointer-events-auto
          transform transition-all duration-300 ease-in-out
          ${isClosing ? 'translate-x-full' : isVisible ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ 
          maxHeight: '100vh', 
          overflowY: 'auto',
          willChange: 'transform'
        }}
      >
        <div className="flex justify-between items-center mb-1 sticky top-0 bg-[#1e1e1e] z-10">
          <h3 className="text-base font-semibold text-gray-200">Configuração do Início</h3>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-red-400 text-lg px-1 transition-colors duration-150"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-2">
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
            <span>Status:</span>
            <button
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-150 ${node.data.active ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              onClick={() => handleToggleActive(!node.data.active)}
            >
              {node.data.active ? 'Ativo' : 'Inativo'}
            </button>
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
        </div>
        <style jsx>{`
          aside {
            transform-origin: right;
          }
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
    </div>
  );
};

export default StartNodeSidebar;