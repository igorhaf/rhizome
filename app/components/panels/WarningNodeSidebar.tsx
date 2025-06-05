import React from 'react';
import SidebarBase from '../advanced/SidebarBase';

interface WarningNodeSidebarProps {
  data: {
    label: string;
    message?: string;
    severity?: 'info' | 'warning' | 'critical';
    color?: string;
    docLink?: string;
    showOnStart?: boolean;
    iconType?: 'exclamation' | 'alert' | 'flag';
    action?: string;
    owner?: string;
    deadline?: string;
  };
  onChange: (data: any) => void;
}

const severityOptions = [
  { value: 'info', label: 'Informativo' },
  { value: 'warning', label: 'Atenção' },
  { value: 'critical', label: 'Crítico' },
];

const iconOptions = [
  { value: 'exclamation', label: 'Ponto de Exclamação' },
  { value: 'alert', label: 'Triângulo de Alerta' },
  { value: 'flag', label: 'Bandeira' },
];

const renderIcon = (iconType: string, color: string) => {
  switch (iconType) {
    case 'alert':
      return (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="mr-2">
          <polygon points="12,3 22,21 2,21" fill={color} stroke="#b45309" strokeWidth="2"/>
          <text x="12" y="18" textAnchor="middle" fontSize="16" fill="#b45309" fontWeight="bold">!</text>
        </svg>
      );
    case 'flag':
      return (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="mr-2">
          <rect x="5" y="5" width="14" height="18" rx="3" fill={color} stroke="#b45309" strokeWidth="2"/>
          <text x="12" y="18" textAnchor="middle" fontSize="16" fill="#b45309" fontWeight="bold">⚑</text>
        </svg>
      );
    default:
      return (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="mr-2">
          <circle cx="12" cy="12" r="12" fill={color} />
          <text x="12" y="18" textAnchor="middle" fontSize="16" fill="#b45309" fontWeight="bold">!</text>
        </svg>
      );
  }
};

const WarningNodeSidebar: React.FC<WarningNodeSidebarProps> = ({ data, onChange }) => {
  return (
    <SidebarBase title={<span className="flex items-center">{renderIcon(data.iconType || 'exclamation', data.color || '#facc15')}Configuração de Warning</span>} onClose={() => onChange({ ...data, _close: true })}>
      <label className="text-xs text-gray-400">Título</label>
      <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={data.label}
        onChange={e => onChange({ ...data, label: e.target.value })}
        placeholder="Título do alerta"
      />
      <label className="text-xs text-gray-400">Mensagem de Alerta</label>
      <textarea
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={data.message || ''}
        onChange={e => onChange({ ...data, message: e.target.value })}
        placeholder="Descreva o alerta..."
        rows={3}
      />
      <label className="text-xs text-gray-400">Severidade</label>
      <select
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
        value={data.severity || 'warning'}
        onChange={e => onChange({ ...data, severity: e.target.value })}
      >
        {severityOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <label className="text-xs text-gray-400">Cor de Destaque</label>
      <input
        type="color"
        className="w-10 h-8 border-2 border-[#333] rounded"
        value={data.color || '#facc15'}
        onChange={e => onChange({ ...data, color: e.target.value })}
      />
      <label className="text-xs text-gray-400">Ícone</label>
      <select
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
        value={data.iconType || 'exclamation'}
        onChange={e => onChange({ ...data, iconType: e.target.value })}
      >
        {iconOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <label className="text-xs text-gray-400">Responsável</label>
      <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={data.owner || ''}
        onChange={e => onChange({ ...data, owner: e.target.value })}
        placeholder="Nome do responsável"
      />
      <label className="text-xs text-gray-400">Prazo</label>
      <input
        type="date"
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 text-sm focus:outline-none"
        value={data.deadline || ''}
        onChange={e => onChange({ ...data, deadline: e.target.value })}
      />
      <label className="text-xs text-gray-400">Ação Sugerida</label>
      <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={data.action || ''}
        onChange={e => onChange({ ...data, action: e.target.value })}
        placeholder="Descreva a ação sugerida"
      />
      <label className="text-xs text-gray-400">Link de Documentação (opcional)</label>
      <input
        className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
        value={data.docLink || ''}
        onChange={e => onChange({ ...data, docLink: e.target.value })}
        placeholder="https://..."
      />
      <label className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-[#222] bg-[#23272e] text-blue-500 focus:ring-blue-500"
          checked={!!data.showOnStart}
          onChange={e => onChange({ ...data, showOnStart: e.target.checked })}
        />
        Mostrar alerta no início do fluxo
      </label>
      <button
        className="px-3 py-1.5 rounded bg-yellow-400 text-yellow-900 text-xs font-semibold hover:bg-yellow-300 w-fit self-end mb-2"
        onClick={() => navigator.clipboard.writeText(data.message || '')}
        type="button"
      >
        Copiar mensagem
      </button>
      <div className="mt-6 p-3 rounded bg-[#23272e] border border-[#333]">
        <div className="font-bold text-yellow-400 mb-1">Preview:</div>
        <div className={`text-sm ${data.severity === 'critical' ? 'text-red-400' : data.severity === 'info' ? 'text-blue-400' : 'text-yellow-300'}`}>
          {renderIcon(data.iconType || 'exclamation', data.color || '#facc15')}
          <span className="font-bold ml-2">{data.label}</span>
          <div className="mt-1">{data.message || 'Atenção: configure a mensagem de alerta.'}</div>
          {data.action && <div className="mt-1 text-xs text-yellow-200">Ação sugerida: <span className="font-semibold">{data.action}</span></div>}
          {data.owner && <div className="mt-1 text-xs text-yellow-200">Responsável: <span className="font-semibold">{data.owner}</span></div>}
          {data.deadline && <div className="mt-1 text-xs text-yellow-200">Prazo: <span className="font-semibold">{data.deadline}</span></div>}
          {data.docLink && <div className="mt-1 text-xs"><a href={data.docLink} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">Documentação</a></div>}
        </div>
      </div>
    </SidebarBase>
  );
};

export default WarningNodeSidebar; 