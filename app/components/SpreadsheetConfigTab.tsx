import React from 'react';
import { Node } from '../types/flow';

interface SpreadsheetConfigTabProps {
  node: Node;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

const SpreadsheetConfigTab: React.FC<SpreadsheetConfigTabProps> = ({ node, setNodes }) => {
  const [localNode, setLocalNode] = React.useState<Node>(() => ({ ...node, id: node.id || '' }));

  const handleSave = () => {
    setNodes(nodes => nodes.map(n => n.id === localNode.id ? localNode : n));
  };

  return (
    <div className="flex flex-col h-full px-8 pt-8 pb-8 text-white overflow-auto bg-[#1e2228]">
      <h2 className="text-xl font-semibold mb-4">Configuração da Planilha</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Nome</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={localNode.data.label || ''}
            onChange={(e) => setLocalNode({
              ...localNode,
              data: { ...localNode.data, label: e.target.value }
            })}
            placeholder="Minha Planilha"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Tipo de Arquivo</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={localNode.data.spreadsheetConfig?.fileType || 'xlsx'}
            onChange={(e) => setLocalNode({
              ...localNode,
              data: {
                ...localNode.data,
                spreadsheetConfig: {
                  ...localNode.data.spreadsheetConfig,
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
          <label className="block text-sm font-medium text-gray-200 mb-1">Operação</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={localNode.data.spreadsheetConfig?.operationType || 'read'}
            onChange={(e) => setLocalNode({
              ...localNode,
              data: {
                ...localNode.data,
                spreadsheetConfig: {
                  ...localNode.data.spreadsheetConfig,
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
          <label className="block text-sm font-medium text-gray-200 mb-1">Nome da Planilha</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={localNode.data.spreadsheetConfig?.sheetName || ''}
            onChange={(e) => setLocalNode({
              ...localNode,
              data: {
                ...localNode.data,
                spreadsheetConfig: {
                  ...localNode.data.spreadsheetConfig,
                  sheetName: e.target.value
                }
              }
            })}
            placeholder="Sheet1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Intervalo</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={localNode.data.spreadsheetConfig?.range || ''}
            onChange={(e) => setLocalNode({
              ...localNode,
              data: {
                ...localNode.data,
                spreadsheetConfig: {
                  ...localNode.data.spreadsheetConfig,
                  range: e.target.value
                }
              }
            })}
            placeholder="A1:D10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Formato</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={localNode.data.spreadsheetConfig?.format || 'none'}
            onChange={(e) => setLocalNode({
              ...localNode,
              data: {
                ...localNode.data,
                spreadsheetConfig: {
                  ...localNode.data.spreadsheetConfig,
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
          <label className="block text-sm font-medium text-gray-200 mb-1">Notas</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            rows={3}
            value={localNode.data.notes || ''}
            onChange={(e) => setLocalNode({
              ...localNode,
              data: { ...localNode.data, notes: e.target.value }
            })}
            placeholder="Adicione notas sobre esta planilha..."
          />
        </div>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default SpreadsheetConfigTab; 