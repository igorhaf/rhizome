import React from 'react';
import { Node } from '../../types/flow';
import SidebarBase from './SidebarBase';

interface SpreadsheetNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const SpreadsheetNodeSidebar: React.FC<SpreadsheetNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  const spreadsheetConfig = {
    fileType: node.data.spreadsheetConfig?.fileType || 'xlsx',
    operationType: node.data.spreadsheetConfig?.operationType || 'read',
    sheetName: node.data.spreadsheetConfig?.sheetName || '',
    range: node.data.spreadsheetConfig?.range || '',
    format: node.data.spreadsheetConfig?.format || 'none',
  };

  return (
    <SidebarBase title="Configuração da Planilha" onClose={onClose}>
      <label className="text-xs text-gray-400">Nome</label>
      <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={node.data.label || ''}
        onChange={e => onUpdate({
          ...node,
          data: { ...node.data, label: e.target.value }
        })}
        placeholder="Minha Planilha"
      />
      <label className="text-xs text-gray-400">Tipo de Arquivo</label>
      <select
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
        value={spreadsheetConfig.fileType}
        onChange={e => onUpdate({
          ...node,
          data: {
            ...node.data,
            spreadsheetConfig: {
              ...spreadsheetConfig,
              fileType: e.target.value as 'xlsx' | 'xls' | 'csv' | 'ods'
            }
          }
        })}
      >
        <option value="xlsx">Excel (.xlsx)</option>
        <option value="xls">Excel (.xls)</option>
        <option value="csv">CSV (.csv)</option>
        <option value="ods">OpenDocument (.ods)</option>
      </select>
      <label className="text-xs text-gray-400">Operação</label>
      <select
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
        value={spreadsheetConfig.operationType}
        onChange={e => onUpdate({
          ...node,
          data: {
            ...node.data,
            spreadsheetConfig: {
              ...spreadsheetConfig,
              operationType: e.target.value as 'read' | 'write' | 'append' | 'update'
            }
          }
        })}
      >
        <option value="read">Ler</option>
        <option value="write">Escrever</option>
        <option value="append">Adicionar</option>
        <option value="update">Atualizar</option>
      </select>
      <label className="text-xs text-gray-400">Nome da Planilha</label>
      <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={spreadsheetConfig.sheetName}
        onChange={e => onUpdate({
          ...node,
          data: {
            ...node.data,
            spreadsheetConfig: {
              ...spreadsheetConfig,
              sheetName: e.target.value
            }
          }
        })}
        placeholder="Sheet1"
      />
      <label className="text-xs text-gray-400">Intervalo</label>
      <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={spreadsheetConfig.range}
        onChange={e => onUpdate({
          ...node,
          data: {
            ...node.data,
            spreadsheetConfig: {
              ...spreadsheetConfig,
              range: e.target.value
            }
          }
        })}
        placeholder="A1:D10"
      />
      <label className="text-xs text-gray-400">Formato</label>
      <select
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
        value={spreadsheetConfig.format}
        onChange={e => onUpdate({
          ...node,
          data: {
            ...node.data,
            spreadsheetConfig: {
              ...spreadsheetConfig,
              format: e.target.value as 'none' | 'number' | 'currency' | 'date' | 'percentage'
            }
          }
        })}
      >
        <option value="none">Nenhum</option>
        <option value="number">Número</option>
        <option value="currency">Moeda</option>
        <option value="date">Data</option>
        <option value="percentage">Porcentagem</option>
      </select>
      <label className="text-xs font-medium mt-1 text-gray-400">Notas</label>
      <textarea
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={node.data.notes || ''}
        onChange={e => onUpdate({
          ...node,
          data: { ...node.data, notes: e.target.value }
        })}
        placeholder="Adicione notas sobre esta planilha..."
      />
    </SidebarBase>
  );
};

export default SpreadsheetNodeSidebar; 