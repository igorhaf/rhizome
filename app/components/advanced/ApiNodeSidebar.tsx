import React, { useState } from 'react';
import { Node } from '../../types/flow';
import SidebarBase from './SidebarBase';

interface ApiNodeSidebarProps {
  node: Node | null;
  onUpdate: (updated: Node) => void;
  onClose: () => void;
}

const ApiNodeSidebar: React.FC<ApiNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  const [localNode, setLocalNode] = useState<Node | null>(node);
  React.useEffect(() => { setLocalNode(node); }, [node]);
  if (!localNode) return null;
  const data = localNode.data || {};
  const handleChange = (field: string, value: any) => {
    const updated = { ...localNode, data: { ...localNode.data, [field]: value } };
    setLocalNode(updated);
    onUpdate(updated);
  };
  return (
    <SidebarBase title="Configurações de API" onClose={onClose}>
      <label className="text-xs text-gray-400">Nome</label>
      <input className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.label || ''} onChange={e => handleChange('label', e.target.value)} placeholder="Nome do nó" />
      <label className="text-xs text-gray-400">Descrição</label>
      <textarea className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.description || ''} onChange={e => handleChange('description', e.target.value)} placeholder="Adicione uma descrição..." />
      <label className="text-xs text-gray-400">ID</label>
      <input className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-500 text-sm" value={localNode.id} readOnly />
      <label className="text-xs text-gray-400">URL da API</label>
      <input className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.apiUrl || ''} onChange={e => handleChange('apiUrl', e.target.value)} placeholder="https://api.exemplo.com/endpoint" />
      <label className="text-xs text-gray-400">Método HTTP</label>
      <select className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.httpMethod || 'GET'} onChange={e => handleChange('httpMethod', e.target.value)}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
      <label className="text-xs text-gray-400">Headers</label>
      <textarea className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.headers || ''} onChange={e => handleChange('headers', e.target.value)} placeholder={"Content-Type: application/json\nAuthorization: Bearer ..."} />
      <label className="text-xs text-gray-400">Payload</label>
      <textarea className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.payload || ''} onChange={e => handleChange('payload', e.target.value)} placeholder={"{ 'id': 123, 'status': 'ok' }"} />
      <label className="text-xs text-gray-400">Tipo de Autenticação</label>
      <select className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.authType || 'none'} onChange={e => handleChange('authType', e.target.value)}>
        <option value="none">Nenhuma</option>
            <option value="basic">Basic Auth</option>
            <option value="bearer">Bearer Token</option>
            <option value="apiKey">API Key</option>
          </select>
      {data.authType === 'basic' && (<><label className="text-xs text-gray-400">Usuário</label><input className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.authUsername || ''} onChange={e => handleChange('authUsername', e.target.value)} placeholder="Usuário" /><label className="text-xs text-gray-400">Senha</label><input type="password" className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.authPassword || ''} onChange={e => handleChange('authPassword', e.target.value)} placeholder="••••••••" /></>)}
      {data.authType === 'bearer' && (<><label className="text-xs text-gray-400">Token</label><input type="password" className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.authToken || ''} onChange={e => handleChange('authToken', e.target.value)} placeholder="••••••••" /></>)}
      {data.authType === 'apiKey' && (<><label className="text-xs text-gray-400">Nome do Header</label><input className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.apiKey || ''} onChange={e => handleChange('apiKey', e.target.value)} placeholder="X-API-Key" /><label className="text-xs text-gray-400">Valor do API Key</label><input type="password" className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.apiKeyValue || ''} onChange={e => handleChange('apiKeyValue', e.target.value)} placeholder="••••••••" /><label className="text-xs text-gray-400">Local do API Key</label><select className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.apiKeyLocation || 'header'} onChange={e => handleChange('apiKeyLocation', e.target.value)}><option value="header">Header</option><option value="query">Query Parameter</option></select></>)}
      <label className="text-xs text-gray-400">Timeout (ms)</label>
      <input type="number" className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none" value={data.timeout || 30000} onChange={e => handleChange('timeout', parseInt(e.target.value))} min="0" step="1000" />
      <label className="text-xs font-medium mt-1 text-gray-400">Notas</label>
      <textarea className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none" value={data.notes || ''} onChange={e => handleChange('notes', e.target.value)} placeholder="Adicione notas sobre este nó..." />
    </SidebarBase>
  );
};

export default ApiNodeSidebar; 