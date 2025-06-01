import React, { useState } from 'react';

type DatabaseType = 'postgresql' | 'mysql' | 'mongodb' | 'sqlite';

interface DatabaseConfig {
  type: DatabaseType;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

// Add new interface for query config
interface DatabaseQueryConfig {
  inputs: { name: string; type: string }[];
  outputs: { name: string; returnType: string }[];
  query: string;
}

// Update onSave prop type
interface DatabaseQueryModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (config: DatabaseQueryConfig) => void;
  inline?: boolean;
}

const DatabaseQueryModal: React.FC<DatabaseQueryModalProps> = ({ open, onClose, onSave, inline }) => {
  if (!open) return null;

  // Tela única: edição de consulta SQL, entradas e saídas
  const [inputs, setInputs] = useState([
    { name: 'user_id', type: 'Número' },
    { name: 'status', type: 'Texto' },
  ]);
  const [outputs, setOutputs] = useState([
    { name: 'lista_pedidos', returnType: 'Lista de registros' },
  ]);
  const [query, setQuery] = useState<string>(
    'SELECT td, descricao, valor_total\nFROM pedidos\nWHERE usuario_id = :user_id\nAND status = :status'
  );

  const handleAddInput = () => setInputs([...inputs, { name: '', type: 'Texto' }]);
  const handleRemoveInput = (idx: number) => setInputs(inputs.filter((_, i) => i !== idx));
  const handleInputChange = (idx: number, field: 'name' | 'type', value: string) => setInputs(inputs.map((input, i) => i === idx ? { ...input, [field]: value } : input));
  const handleAddOutput = () => setOutputs([...outputs, { name: '', returnType: 'Texto' }]);
  const handleRemoveOutput = (idx: number) => setOutputs(outputs.filter((_, i) => i !== idx));
  const handleOutputChange = (idx: number, field: 'name' | 'returnType', value: string) => setOutputs(outputs.map((output, i) => i === idx ? { ...output, [field]: value } : output));
  const handleSave = () => { if (onSave) onSave({ inputs, outputs, query }); onClose(); };

  const content = (
    <div className="w-full flex flex-col gap-8 p-0">
      {/* Entradas da Consulta */}
      <div className="mb-5 w-full">
        <div className="font-semibold mb-1 text-gray-200 text-sm">Entradas da Consulta</div>
        <div className="text-gray-400 text-xs mb-2">Variáveis que serão usadas como parâmetros na consulta.</div>
        <table className="w-full text-xs border border-[#222] mb-2 rounded overflow-hidden">
          <thead>
            <tr className="bg-[#23272e] border-b border-[#222]">
              <th className="py-1 px-2 text-left font-medium text-gray-400">Nome</th>
              <th className="py-1 px-2 text-left font-medium text-gray-400">Tipo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((input, idx) => (
              <tr key={idx} className="border-b border-[#23272e]">
                <td className="py-1 px-2">
                  <input
                    className="border border-[#222] rounded px-2 py-1.5 w-full bg-[#23272e] text-gray-100 placeholder-gray-500 text-sm focus:outline-none"
                    value={input.name}
                    onChange={e => handleInputChange(idx, 'name', e.target.value)}
                    placeholder="Nome"
                  />
                </td>
                <td className="py-1 px-2">
                  <select
                    className="border border-[#222] rounded px-2 py-1.5 w-full bg-[#23272e] text-gray-100 text-sm focus:outline-none"
                    value={input.type}
                    onChange={e => handleInputChange(idx, 'type', e.target.value)}
                  >
                    <option value="Texto">Texto</option>
                    <option value="Número">Número</option>
                  </select>
                </td>
                <td className="py-1 px-2">
                  {inputs.length > 1 && (
                    <button className="text-red-500 text-lg" onClick={() => handleRemoveInput(idx)}>×</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="flex items-center text-blue-500 hover:underline text-xs mt-1" onClick={handleAddInput}>
          <span className="text-lg mr-1">+</span> Adicionar Entrada
        </button>
      </div>
      {/* Consulta SQL */}
      <div className="mb-5 w-full">
        <div className="font-semibold mb-1 text-gray-200 text-sm">Consulta SQL</div>
        <div className="text-gray-400 text-xs mb-2">Escreva a consulta, utilizando os nomes das variáveis de entrada precedidos por dois pontos (:)</div>
        <div className="flex gap-2 w-full">
          <textarea
            className="border border-[#222] rounded px-2 py-1.5 w-full min-w-0 font-mono text-blue-200 bg-[#181c23] text-sm focus:outline-none"
            rows={5}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>
      {/* Variáveis de Saída */}
      <div className="mb-5 w-full">
        <div className="font-semibold mb-1 text-gray-200 text-sm">Variáveis de Saida</div>
        <div className="text-gray-400 text-xs mb-2">Defina como os dados retornados pela consulta serão armazenados.</div>
        <table className="w-full text-xs border border-[#222] mb-2 rounded overflow-hidden">
          <thead>
            <tr className="bg-[#23272e] border-b border-[#222]">
              <th className="py-1 px-2 text-left font-medium text-gray-400">Nome da variável</th>
              <th className="py-1 px-2 text-left font-medium text-gray-400">Tipo de retorno</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {outputs.map((output, idx) => (
              <tr key={idx} className="border-b border-[#23272e]">
                <td className="py-1 px-2">
                  <input
                    className="border border-[#222] rounded px-2 py-1.5 w-full bg-[#23272e] text-gray-100 placeholder-gray-500 text-sm focus:outline-none"
                    value={output.name}
                    onChange={e => handleOutputChange(idx, 'name', e.target.value)}
                    placeholder="Nome da variável"
                  />
                </td>
                <td className="py-1 px-2">
                  <input
                    className="border border-[#222] rounded px-2 py-1.5 w-full bg-[#23272e] text-gray-100 placeholder-gray-500 text-sm focus:outline-none"
                    value={output.returnType}
                    onChange={e => handleOutputChange(idx, 'returnType', e.target.value)}
                    placeholder="Tipo de retorno"
                  />
                </td>
                <td className="py-1 px-2">
                  {outputs.length > 1 && (
                    <button className="text-red-500 text-lg" onClick={() => handleRemoveOutput(idx)}>×</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="flex items-center text-blue-500 hover:underline text-xs mt-1" onClick={handleAddOutput}>
          <span className="text-lg mr-1">+</span> Adicionar Saida
        </button>
      </div>
      <div className="flex justify-end gap-2 mt-6 w-full">
        <button className="px-4 py-2 rounded bg-[#23272e] text-gray-300 border border-[#222] hover:bg-[#181c23] text-sm" onClick={onClose}>Cancelar</button>
        <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm" onClick={handleSave}>Salvar</button>
      </div>
    </div>
  );

  if (inline) {
    return content;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-[#23272e] rounded-lg p-8 w-[600px] max-w-full shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Configuração da Consulta de Dados</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-400 text-lg px-1">×</button>
        </div>
        {content}
      </div>
    </div>
  );
};

export default DatabaseQueryModal; 