'use client';

import React from 'react';
import { NodeType } from '../types/flow';
import { StartNodeIcon } from './icons/StartNodeIcon';
import { EndNodeIcon } from './icons/EndNodeIcon';
import { FunctionNodeIcon } from './icons/FunctionNodeIcon';
import { EmailNodeIcon } from './icons/EmailNodeIcon';
import { WebhookNodeIcon } from './icons/WebhookNodeIcon';
import { DecisionNodeIcon } from './icons/DecisionNodeIcon';
import { LoopNodeIcon } from './icons/LoopNodeIcon';
import { SubprocessNodeIcon } from './icons/SubprocessNodeIcon';
import { DatabaseNodeIcon } from './icons/DatabaseNodeIcon';
import { ApiNodeIcon } from './icons/ApiNodeIcon';
import { ScheduleNodeIcon } from './icons/ScheduleNodeIcon';

interface ToolbarProps {
  onNodeSelect: (nodeData: Partial<import('../types/flow').Node>, position: { x: number; y: number }) => void;
}

// Novo tipo para grupos hierárquicos
interface Group {
  name: string;
  iconClosed: React.ReactNode;
  iconOpen: React.ReactNode;
  color: string;
  children?: Group[];
}

// SVGs para pasta e arquivos
const FolderClosedIcon = (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="text-gray-400" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 5.5A1.5 1.5 0 013.5 4h3.379a1.5 1.5 0 011.06.44l1.122 1.12A1.5 1.5 0 0010.121 6H16.5A1.5 1.5 0 0118 7.5v7A1.5 1.5 0 0116.5 16h-13A1.5 1.5 0 012 14.5v-9z" fill="#3c3c3c" stroke="#666"/>
  </svg>
);
const FolderOpenIcon = (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="text-gray-400" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 5.5A1.5 1.5 0 013.5 4h3.379a1.5 1.5 0 011.06.44l1.122 1.12A1.5 1.5 0 0010.121 6H16.5A1.5 1.5 0 0118 7.5v1.5H3.5A1.5 1.5 0 002 10.5v-5z" fill="#3c3c3c" stroke="#666"/>
    <path d="M3 10.5A1.5 1.5 0 014.5 9h13a1.5 1.5 0 011.415 2.01l-1.2 4A1.5 1.5 0 0116.28 16H4.5A1.5 1.5 0 013 14.5v-4z" fill="#23272e" stroke="#666"/>
  </svg>
);
const ChevronRight = (
  <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="text-gray-500"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const ChevronDown = (
  <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="text-gray-500"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// Ícones de arquivos (exemplo simplificado)
const icons: Record<string, React.ReactNode> = {
  start: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="3" fill="#2d7ff9"/><polygon points="8,7 14,10 8,13" fill="#fff"/></svg>,
  end: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="3" fill="#4b5563"/></svg>,
  decision: (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill="#eab308" />
      <text x="24" y="32" textAnchor="middle" fontSize="22" fill="#fff" fontWeight="bold">?</text>
    </svg>
  ),
  loop: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="6" fill="#38bdf8"/><path d="M8 10h4" stroke="#fff" strokeWidth="1.5"/></svg>,
  subprocess: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="3" fill="#bfa06a"/></svg>,
  data: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="3" fill="#a78bfa"/></svg>,
  api: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#38bdf8"/><circle cx="10" cy="10" r="4" fill="#fff" fillOpacity=".2"/></svg>,
  funcion: (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill="#10b981" />
      <rect x="18" y="18" width="12" height="12" rx="2" fill="#fff" />
    </svg>
  ),
  email: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#3b82f6"/></svg>,
  webhook: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 81" width="20" height="20" fill="currentColor">
      <path d="M59.165 62.735l1.967 2.483c3.4 3.469 9.202 3.66 12.836.414 3.801-3.374 3.967-9.008.4-12.509-3.5-3.438-9.501-3.756-12.769-.128-1.967 2.197-4 2.483-6.601 2.419l-20.17-.032c.433 9.04-3.134 14.642-10.235 15.979-6.935 1.305-13.303-2.069-15.57-8.244-2.567-7.003.6-12.605 9.735-17.06l-2.067-7.162C6.722 40.963-.712 50.193.054 60.57c.667 9.167 8.402 17.284 17.87 18.748 5.134.796 9.968-.032 14.436-2.451 5.768-3.119 9.101-8.053 10.668-14.132h16.136zm-6.301-36.318c.4-.987.8-1.782 1.1-2.61 1.034-2.992.4-5.698-1.6-8.117-2.434-2.96-6.735-4.043-10.369-2.706-3.668 1.337-6.034 4.807-5.868 8.594.167 3.883 2.867 7.321 7.068 8.021 2.5.414 3.734 1.528 4.867 3.502 3.301 5.825 6.768 11.554 10.202 17.347 8.235-5.22 15.036-5.061 20.104.382a12.41 12.41 0 0 1 .233 16.774c-5.034 5.666-11.802 5.888-19.537 1.114l-6.134 4.902c7.835 7.448 19.003 8.435 27.838 2.642 8.635-5.666 11.602-16.52 7.235-25.687-3.634-7.608-13.736-14.706-27.172-10.727l-7.968-13.432zm-10.702 7.13c-8.701-4.201-11.902-9.74-9.802-16.52 1.867-5.984 8.134-9.867 14.502-8.976 3.2.477 5.968 1.719 8.168 4.075 3.301 3.597 4.034 7.798 3.034 12.477l7.535 1.942c3.201-8.403-.567-18.207-8.768-23.236-8.568-5.252-19.637-4.169-26.905 2.673-3.801 3.565-5.868 7.926-6.368 12.987-.667 7.098 2.4 12.859 7.601 17.793l-8.268 13.178c-.733.064-1.2.064-1.666.128-5.401.732-9.235 5.347-8.335 10.026 1.033 5.315 6.101 8.562 11.269 7.257 5.501-1.369 8.435-6.43 6.368-11.65-.767-1.878-.3-3.087.667-4.551l10.969-17.602z"/>
    </svg>
  ),
  spreadsheet: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="#10b981"/></svg>,
  warning: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><polygon points="10,2 18,18 2,18" fill="#facc15" stroke="#b45309" strokeWidth="1.5"/><text x="10" y="15" textAnchor="middle" fontSize="12" fill="#b45309" fontWeight="bold">!</text></svg>,
};

const Toolbar: React.FC<ToolbarProps> = ({ onNodeSelect }) => {
  const [draggingType, setDraggingType] = React.useState<NodeType | null>(null);

  const handleDragStart = (e: React.DragEvent, type: NodeType) => {
    const data = {
      type,
      label: `${type} Node`,
      description: `A ${type} node`,
      ...(type === 'start' && { active: true }),
      ...(type === 'end' && { isFinal: true }),
      ...(type === 'decision' && { conditions: [] }),
      ...(type === 'loop' && { iterations: 1 }),
      ...(type === 'funcion' && { 
        inputParams: '',
        timeout: 30000,
        retryCount: 0,
        retryInterval: 1000,
        isAsync: false,
        shouldLog: true
      }),
      ...(type === 'email' && {
        to: '',
        subject: '',
        body: '',
        attachments: []
      }),
      ...(type === 'webhook' && {
        url: '',
        method: 'POST',
        headers: {},
        body: ''
      }),
      ...(type === 'api' && {
        url: '',
        method: 'GET',
        headers: {},
        body: '',
        timeout: 30000
      }),
      ...(type === 'spreadsheet' && {
        file: '',
        sheet: '',
        range: '',
        operation: 'read'
      })
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'copy';
    setDraggingType(type);
  };

  const handleDragEnd = () => {
    setDraggingType(null);
  };

  const nodeButtons = [
    { type: 'start', icon: <StartNodeIcon />, title: 'Start Node' },
    { type: 'end', icon: <EndNodeIcon />, title: 'End Node' },
    { type: 'decision', icon: <DecisionNodeIcon />, title: 'Decision Node' },
    { type: 'loop', icon: <LoopNodeIcon />, title: 'Loop Node' },
    { type: 'api', icon: <ApiNodeIcon />, title: 'API Node' },
    { type: 'webhook', icon: <WebhookNodeIcon />, title: 'Webhook Node' },
    { type: 'email', icon: <EmailNodeIcon />, title: 'Email Node' },
    { type: 'funcion', icon: <FunctionNodeIcon />, title: 'Function Node' },
    { type: 'subprocess', icon: <SubprocessNodeIcon />, title: 'Subprocess Node' },
    { type: 'Database', icon: <DatabaseNodeIcon />, title: 'Database Node' },
    { type: 'warning', icon: icons.warning, title: 'Warning Node' },
    { type: 'schedule', icon: <ScheduleNodeIcon />, title: 'Schedule Node' },
  ];

    return (
    <div className="w-12 h-full bg-[#181a1b] border-r border-[#23272e] flex flex-col items-center py-2 gap-1">
      {nodeButtons.map(({ type, icon, title }) => (
        <button
          key={type}
          className={`w-10 h-10 flex items-center justify-center rounded transition-colors duration-150 ${draggingType === type ? 'bg-blue-800' : 'hover:bg-[#23272e]'} text-white`}
                draggable
          onDragStart={e => handleDragStart(e, type as NodeType)}
                onDragEnd={handleDragEnd}
          title={title}
        >
          <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
        </button>
      ))}
    </div>
  );
};

export default Toolbar;