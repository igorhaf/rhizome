import React from 'react';

interface WarningNodeProps {
  data: {
    label: string;
    message?: string;
  };
  selected?: boolean;
}

const WarningNode: React.FC<WarningNodeProps> = ({ data, selected }) => {
  return (
    <div className={`rounded-lg border-2 p-4 bg-yellow-200 border-yellow-600 shadow-lg min-w-[120px] ${selected ? 'ring-2 ring-yellow-500' : ''}`}>
      <div className="flex items-center mb-2">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="mr-2">
          <polygon points="12,3 22,21 2,21" fill="#facc15" stroke="#b45309" strokeWidth="2"/>
          <text x="12" y="18" textAnchor="middle" fontSize="16" fill="#b45309" fontWeight="bold">!</text>
        </svg>
        <span className="font-bold text-yellow-800 text-lg">{data.label || 'Warning'}</span>
      </div>
      <div className="text-yellow-900 text-sm">
        {data.message || 'Atenção: configure a mensagem de alerta.'}
      </div>
    </div>
  );
};

export default WarningNode; 