import React from 'react';
import { Node } from '../types/flow';

interface EmailNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const EmailNodeSidebar: React.FC<EmailNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  const emailConfig = node.data.emailConfig || {
    to: '',
    subject: '',
    body: '',
    attachments: []
  };

  return (
    <div className="w-80 h-full bg-[#1e2228] border-l border-[#23272e] p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white">Configuração do Email</h2>
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
            placeholder="Meu Email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Para</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={emailConfig.to}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                emailConfig: {
                  ...emailConfig,
                  to: e.target.value
                }
              }
            })}
            placeholder="destinatario@exemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Assunto</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={emailConfig.subject}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                emailConfig: {
                  ...emailConfig,
                  subject: e.target.value
                }
              }
            })}
            placeholder="Assunto do email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Corpo</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            rows={5}
            value={emailConfig.body}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                emailConfig: {
                  ...emailConfig,
                  body: e.target.value
                }
              }
            })}
            placeholder="Conteúdo do email..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Anexos</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={emailConfig.attachments?.join(', ') || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: {
                ...node.data,
                emailConfig: {
                  ...emailConfig,
                  attachments: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }
              }
            })}
            placeholder="caminho/do/arquivo1.pdf, caminho/do/arquivo2.jpg"
          />
        </div>

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
    </div>
  );
};

export default EmailNodeSidebar; 