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
import { SpreadsheetNodeIcon } from './icons/SpreadsheetNodeIcon';

interface ToolbarProps {
  onNodeSelect: (type: NodeType) => void;
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
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <rect x="4" y="4" width="12" height="12" rx="3" fill="#10b981"/>
      <path d="M8 8h4v4H8z" fill="#fff"/>
    </svg>
  ),
  email: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#3b82f6"/></svg>,
  webhook: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="#f59e42"/>
      <path d="M6 10a4 4 0 0 1 8 0" stroke="#fff" strokeWidth="1.5"/>
    </svg>
  ),
  spreadsheet: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="#10b981"/></svg>,
  warning: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><polygon points="10,2 18,18 2,18" fill="#facc15" stroke="#b45309" strokeWidth="1.5"/><text x="10" y="15" textAnchor="middle" fontSize="12" fill="#b45309" fontWeight="bold">!</text></svg>,
};

const Toolbar: React.FC<ToolbarProps> = ({ onNodeSelect }) => {
  const handleDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type }));
  };

  return (
    <div className="w-16 h-full bg-[#181a1b] border-r border-[#23272e] flex flex-col items-center py-4 gap-2">
      <button
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        onClick={() => onNodeSelect('start')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'start')}
        title="Start Node"
      >
        <StartNodeIcon />
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        onClick={() => onNodeSelect('end')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'end')}
        title="End Node"
      >
        <EndNodeIcon />
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        onClick={() => onNodeSelect('funcion')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'funcion')}
        title="Function Node"
      >
        <FunctionNodeIcon />
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        onClick={() => onNodeSelect('email')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'email')}
        title="Email Node"
      >
        <EmailNodeIcon />
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        onClick={() => onNodeSelect('webhook')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'webhook')}
        title="Webhook Node"
      >
        <WebhookNodeIcon />
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        onClick={() => onNodeSelect('decision')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'decision')}
        title="Decision Node"
      >
        <DecisionNodeIcon />
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        onClick={() => onNodeSelect('loop')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'loop')}
        title="Loop Node"
      >
        <LoopNodeIcon />
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        onClick={() => onNodeSelect('subprocess')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'subprocess')}
        title="Subprocess Node"
      >
        <SubprocessNodeIcon />
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        onClick={() => onNodeSelect('Database')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'Database')}
        title="Database Node"
      >
        <DatabaseNodeIcon />
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        onClick={() => onNodeSelect('api')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'api')}
        title="API Node"
      >
        <ApiNodeIcon />
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        onClick={() => onNodeSelect('spreadsheet')}
        draggable
        onDragStart={(e) => handleDragStart(e, 'spreadsheet')}
        title="Spreadsheet Node"
      >
        <SpreadsheetNodeIcon />
      </button>
    </div>
  );
};

export default Toolbar;