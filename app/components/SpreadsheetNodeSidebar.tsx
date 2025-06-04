import React from 'react';
import { Node } from '../types/flow';

interface SpreadsheetNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const SpreadsheetNodeSidebar: React.FC<SpreadsheetNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  const spreadsheetConfig = node.data.spreadsheetConfig || {
    fileType: 'xlsx',
    operationType: 'read',
    sheetName: '',
    range: '',
    format: 'none'
  };

  return (
    <div className="w-80 h-full bg-[#1e2228] border-l border-[#23272e] p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-white">Configuração da Planilha</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Nome</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={node.data.label || ''}
            onChange={(e) => onUpdate({
              ...node,
              data: { ...node.data, label: e.target.value }
            })}
            placeholder="Minha Planilha"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Tipo de Arquivo</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={spreadsheetConfig.fileType}
            onChange={(e) => onUpdate({
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Operação</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={spreadsheetConfig.operationType}
            onChange={(e) => onUpdate({
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Nome da Planilha</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            value={spreadsheetConfig.sheetName}
            onChange={(e) => onUpdate({
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Intervalo</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
            value={spreadsheetConfig.range}
            onChange={(e) => onUpdate({
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Formato</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={spreadsheetConfig.format}
            onChange={(e) => onUpdate({
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Notas</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white font-mono text-sm"
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

export default SpreadsheetNodeSidebar; 