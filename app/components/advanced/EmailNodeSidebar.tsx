import React from 'react';
import { Node } from '../../types/flow';
import SidebarBase from './SidebarBase';

interface EmailNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const EmailNodeSidebar: React.FC<EmailNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  const data = node.data || {};
  return (
    <SidebarBase title="Configurações de Email" onClose={onClose}>
      <label className="text-xs text-gray-400">Nome</label>
      <input className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.label || ''} onChange={e => onUpdate({ ...node, data: { ...data, label: e.target.value } })} placeholder="Nome do email" />
      <label className="text-xs text-gray-400">De</label>
      <input className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.from || ''} onChange={e => onUpdate({ ...node, data: { ...data, from: e.target.value } })} placeholder="remetente@exemplo.com" />
      <label className="text-xs text-gray-400">Para</label>
      <input className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.to || ''} onChange={e => onUpdate({ ...node, data: { ...data, to: e.target.value } })} placeholder="destinatario@exemplo.com" />
      <label className="text-xs text-gray-400">Assunto</label>
      <input className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.subject || ''} onChange={e => onUpdate({ ...node, data: { ...data, subject: e.target.value } })} placeholder="Assunto do email" />
      <label className="text-xs text-gray-400">Tipo de Conteúdo</label>
      <select className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.contentType || 'html'} onChange={e => onUpdate({ ...node, data: { ...data, contentType: e.target.value } })}>
        <option value="html">HTML</option>
        <option value="text">Texto Simples</option>
        <option value="template">Template</option>
      </select>
      <label className="text-xs text-gray-400">Prioridade</label>
      <select className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.priority || 'normal'} onChange={e => onUpdate({ ...node, data: { ...data, priority: e.target.value } })}>
        <option value="high">Alta</option>
        <option value="normal">Normal</option>
        <option value="low">Baixa</option>
      </select>
      <label className="text-xs text-gray-400">Timeout (ms)</label>
      <input type="number" className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.timeout || 30000} onChange={e => onUpdate({ ...node, data: { ...data, timeout: parseInt(e.target.value) } })} min="0" step="1000" />
      <label className="text-xs text-gray-400">Tentativas</label>
      <input type="number" className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.retryCount || 0} onChange={e => onUpdate({ ...node, data: { ...data, retryCount: parseInt(e.target.value) } })} min="0" step="1" />
      <label className="text-xs text-gray-400">Intervalo entre Tentativas (ms)</label>
      <input type="number" className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.retryInterval || 1000} onChange={e => onUpdate({ ...node, data: { ...data, retryInterval: parseInt(e.target.value) } })} min="0" step="1000" />
      <label className="text-xs text-gray-400">Notas</label>
      <textarea className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.notes || ''} onChange={e => onUpdate({ ...node, data: { ...data, notes: e.target.value } })} placeholder="Adicione notas sobre este email..." />
    </SidebarBase>
  );
};

export default EmailNodeSidebar; 