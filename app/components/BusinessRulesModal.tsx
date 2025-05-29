import React, { useState, useRef, useEffect } from 'react';

interface Condition {
  field: string;
  operator: string;
  value: string;
}

interface BusinessRulesData {
  conditions: Condition[];
  inputVars: string;
  outputVars: string;
  testWithSimData: boolean;
  notes: string;
}

interface BusinessRulesModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: BusinessRulesData) => void;
  initialData?: Partial<BusinessRulesData>;
  blockName: string;
  blockId: string;
  blockDescription?: string;
}

const OPERATORS = ['==', '!=', '>', '>=', '<', '<=', 'in', 'not in'];

const BusinessRulesModal: React.FC<BusinessRulesModalProps> = ({ open, onClose, onSave, initialData, blockName, blockId, blockDescription }) => {
  const [conditions, setConditions] = useState<Condition[]>(initialData?.conditions || [
    { field: '', operator: '==', value: '' },
  ]);
  const [inputVars, setInputVars] = useState(initialData?.inputVars || '');
  const [outputVars, setOutputVars] = useState(initialData?.outputVars || '');
  const [testWithSimData, setTestWithSimData] = useState(initialData?.testWithSimData ?? true);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [description, setDescription] = useState(blockDescription || '');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (overlayRef.current && e.target === overlayRef.current) {
        onClose();
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  const handleConditionChange = (idx: number, field: keyof Condition, value: string) => {
    setConditions(conditions.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const handleAddCondition = () => {
    setConditions([...conditions, { field: '', operator: '==', value: '' }]);
  };

  const handleRemoveCondition = (idx: number) => {
    setConditions(conditions.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    onSave({
      conditions,
      inputVars,
      outputVars,
      testWithSimData,
      notes,
    });
    onClose();
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#181b20] rounded-xl shadow-2xl w-full max-w-md p-8 relative border border-[#23272e]" style={{ minWidth: 380 }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-2xl">×</button>
        <div className="flex flex-col gap-3">
          <label className="text-xs text-gray-400">Nome do bloco</label>
          <input
            className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
            value={blockName}
            readOnly
          />
          <label className="text-xs text-gray-400">Descrição</label>
          <textarea
            className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder=""
          />
          <label className="text-xs text-gray-400">Condições</label>
          {conditions.map((cond, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input
                className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-100 text-sm focus:outline-none w-32"
                value={cond.field}
                onChange={e => handleConditionChange(idx, 'field', e.target.value)}
                placeholder="Campo"
              />
              <select
                className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-100 text-sm focus:outline-none w-16"
                value={cond.operator}
                onChange={e => handleConditionChange(idx, 'operator', e.target.value)}
              >
                {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
              </select>
              <input
                className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-100 text-sm focus:outline-none w-32"
                value={cond.value}
                onChange={e => handleConditionChange(idx, 'value', e.target.value)}
                placeholder="Valor"
              />
              <button className="text-red-500 text-lg px-1" onClick={() => handleRemoveCondition(idx)} title="Remover">×</button>
            </div>
          ))}
          <button className="flex items-center text-blue-500 hover:underline text-xs mt-1 mb-2 w-fit" onClick={handleAddCondition}>
            <span className="text-lg mr-1">+</span> Adicionar Condição
          </button>
          <label className="text-xs text-gray-400">Variáveis de Entrada</label>
          <input
            className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
            value={inputVars}
            onChange={e => setInputVars(e.target.value)}
            placeholder=""
          />
          <label className="text-xs text-gray-400">Variáveis de Saída</label>
          <input
            className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
            value={outputVars}
            onChange={e => setOutputVars(e.target.value)}
            placeholder=""
          />
          <label className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-[#222] bg-[#23272e] text-blue-500 focus:ring-blue-500"
              checked={testWithSimData}
              onChange={e => setTestWithSimData(e.target.checked)}
            />
            Testar Condição com Dados Simulados
          </label>
          <label className="text-xs text-gray-400">Notas</label>
          <textarea
            className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
          <label className="text-xs text-gray-400">ID</label>
          <input
            className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-500 text-sm"
            value={blockId}
            readOnly
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button className="px-4 py-2 rounded bg-[#23272e] text-gray-300 border border-[#222] hover:bg-[#181c23] text-sm" onClick={onClose}>Cancelar</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default BusinessRulesModal; 