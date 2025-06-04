import React from 'react';

interface WarningNodeSidebarProps {
  data: {
    label: string;
    message?: string;
  };
  onChange: (data: { label: string; message?: string }) => void;
}

const WarningNodeSidebar: React.FC<WarningNodeSidebarProps> = ({ data, onChange }) => {
  return (
    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
      <h2 className="text-lg font-bold text-yellow-700 mb-4 flex items-center">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="mr-2">
          <polygon points="12,3 22,21 2,21" fill="#facc15" stroke="#b45309" strokeWidth="2"/>
          <text x="12" y="18" textAnchor="middle" fontSize="16" fill="#b45309" fontWeight="bold">!</text>
        </svg>
        Configuração de Warning
      </h2>
      <div className="mb-4">
        <label className="block text-yellow-800 font-semibold mb-1">Título</label>
        <input
          type="text"
          className="w-full border border-yellow-400 rounded px-2 py-1 text-yellow-900 bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={data.label}
          onChange={e => onChange({ ...data, label: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-yellow-800 font-semibold mb-1">Mensagem de Alerta</label>
        <textarea
          className="w-full border border-yellow-400 rounded px-2 py-1 text-yellow-900 bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={data.message || ''}
          onChange={e => onChange({ ...data, message: e.target.value })}
          rows={4}
        />
      </div>
    </div>
  );
};

export default WarningNodeSidebar; 