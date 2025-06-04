import React from 'react';
import { Node } from '../../types/flow';
import SidebarBase from './SidebarBase';

interface LoopNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const LoopNodeSidebar: React.FC<LoopNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  const data = node.data || {};
  return (
    <SidebarBase title="Configurações de Loop" onClose={onClose}>
      <label className="text-xs text-gray-400">Nome</label>
      <input className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.label || ''} onChange={e => onUpdate({ ...node, data: { ...data, label: e.target.value } })} placeholder="Nome do loop" />
      <label className="text-xs text-gray-400">Descrição</label>
      <textarea className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.description || ''} onChange={e => onUpdate({ ...node, data: { ...data, description: e.target.value } })} placeholder="Adicione uma descrição..." />
      <label className="text-xs text-gray-400">Expressão de Condição</label>
      <textarea className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.conditionExpression || ''} onChange={e => onUpdate({ ...node, data: { ...data, conditionExpression: e.target.value } })} placeholder="i < 10" />
      <label className="text-xs text-gray-400">Variáveis de Entrada</label>
      <textarea className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.inputVars || ''} onChange={e => onUpdate({ ...node, data: { ...data, inputVars: e.target.value } })} placeholder="i = 0" />
      <label className="text-xs text-gray-400">Variáveis de Saída</label>
      <textarea className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.outputVars || ''} onChange={e => onUpdate({ ...node, data: { ...data, outputVars: e.target.value } })} placeholder="result = []" />
      <label className="text-xs text-gray-400">Timeout (ms)</label>
      <input type="number" className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.timeout || 30000} onChange={e => onUpdate({ ...node, data: { ...data, timeout: parseInt(e.target.value) } })} min="0" step="1000" />
      <label className="text-xs text-gray-400">Tentativas</label>
      <input type="number" className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.retryCount || 0} onChange={e => onUpdate({ ...node, data: { ...data, retryCount: parseInt(e.target.value) } })} min="0" step="1" />
      <label className="text-xs text-gray-400">Intervalo entre Tentativas (ms)</label>
      <input type="number" className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.retryInterval || 1000} onChange={e => onUpdate({ ...node, data: { ...data, retryInterval: parseInt(e.target.value) } })} min="0" step="1000" />
      <label className="text-xs text-gray-400">Notas</label>
      <textarea className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.notes || ''} onChange={e => onUpdate({ ...node, data: { ...data, notes: e.target.value } })} placeholder="Adicione notas sobre este loop..." />
    </SidebarBase>
  );
};

export default LoopNodeSidebar; 