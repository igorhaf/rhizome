import React, { useState } from 'react';

interface QueryInput {
  name: string;
  type: 'Texto' | 'Número';
}

interface QueryOutput {
  name: string;
  returnType: string;
}

interface QueryInterfaceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const QueryInterfaceModal: React.FC<QueryInterfaceModalProps> = ({ open, onClose, onSave }) => {
  const [inputs, setInputs] = useState<QueryInput[]>([
    { name: 'user_id', type: 'Número' },
    { name: 'status', type: 'Texto' },
  ]);
  const [outputs, setOutputs] = useState<QueryOutput[]>([
    { name: 'lista_pedidos', returnType: 'Lista de registros' },
  ]);
  const [query, setQuery] = useState<string>(
    'SELECT td, descricao, valor_total\nFROM pedidos\nWHERE usuario_id = :user_id\nAND status = :status'
  );

  if (!open) return null;

  const handleAddInput = () => {
    setInputs([...inputs, { name: '', type: 'Texto' }]);
  };

  const handleRemoveInput = (idx: number) => {
    setInputs(inputs.filter((_, i) => i !== idx));
  };

  const handleInputChange = (idx: number, field: keyof QueryInput, value: string) => {
    setInputs(inputs.map((input, i) => i === idx ? { ...input, [field]: value } : input));
  };

  const handleAddOutput = () => {
    setOutputs([...outputs, { name: '', returnType: 'Texto' }]);
  };

  const handleRemoveOutput = (idx: number) => {
    setOutputs(outputs.filter((_, i) => i !== idx));
  };

  const handleOutputChange = (idx: number, field: keyof QueryOutput, value: string) => {
    setOutputs(outputs.map((output, i) => i === idx ? { ...output, [field]: value } : output));
  };

  const handleSave = () => {
    onSave({ inputs, outputs, query });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-[#23272e] rounded-lg shadow-xl w-[600px] max-w-full p-8 relative border border-[#222]">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold text-gray-200">Consulta de Dados</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-400 text-xl px-1">×</button>
        </div>

        {/* Entradas da Consulta */}
        <div className="mb-5">
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
                      onChange={e => handleInputChange(idx, 'type', e.target.value as QueryInput['type'])}
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
        <div className="mb-5">
          <div className="font-semibold mb-1 text-gray-200 text-sm">Consulta SQL</div>
          <div className="text-gray-400 text-xs mb-2">Escreva a consulta, utilizando os nomes das variáveis de entrada precedidos por dois pontos (:)</div>
          <div className="flex gap-2">
            <textarea
              className="border border-[#222] rounded px-2 py-1.5 w-full font-mono text-blue-200 bg-[#181c23] text-sm focus:outline-none"
              rows={5}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <button className="border border-[#222] rounded px-3 py-1.5 bg-[#23272e] text-gray-200 hover:bg-[#181c23] text-xs">Validar Sintaxe</button>
              <button className="border border-[#222] rounded px-3 py-1.5 bg-[#23272e] text-gray-200 hover:bg-[#181c23] text-xs">Testar com dados simulados</button>
            </div>
          </div>
        </div>

        {/* Variáveis de Saída */}
        <div className="mb-5">
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

        <div className="flex justify-end gap-2 mt-6">
          <button className="px-4 py-2 rounded bg-[#23272e] text-gray-300 border border-[#222] hover:bg-[#181c23] text-sm" onClick={onClose}>Cancelar</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default QueryInterfaceModal; 