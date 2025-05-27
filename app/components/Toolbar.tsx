'use client';

import React, { useState } from 'react';
import { NodeType } from '../types/flow';

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
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 5.5A1.5 1.5 0 013.5 4h3.379a1.5 1.5 0 011.06.44l1.122 1.12A1.5 1.5 0 0010.121 6H16.5A1.5 1.5 0 0118 7.5v7A1.5 1.5 0 0116.5 16h-13A1.5 1.5 0 012 14.5v-9z" fill="#3c3c3c" stroke="#666"/>
  </svg>
);
const FolderOpenIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400" xmlns="http://www.w3.org/2000/svg">
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
  decision: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="10" width="12" height="6" rx="2" fill="#e11d48"/><rect x="4" y="4" width="12" height="6" rx="2" fill="#fff" fillOpacity=".2"/></svg>,
  loop: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="6" fill="#38bdf8"/><path d="M8 10h4" stroke="#fff" strokeWidth="1.5"/></svg>,
  subprocess: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="3" fill="#bfa06a"/></svg>,
  data: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="3" fill="#a78bfa"/></svg>,
  api: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#38bdf8"/><circle cx="10" cy="10" r="4" fill="#fff" fillOpacity=".2"/></svg>,
};

const Toolbar: React.FC<ToolbarProps> = ({ onNodeSelect }) => {
  const [draggedNode, setDraggedNode] = useState<NodeType | null>(null);
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({
    Basic: true,
    'Basic/Logic': true,
    Advanced: true,
  });

  const nodeTypes: { type: NodeType; label: string; icon: string; group: string }[] = [
    { type: 'start', label: 'Start', icon: 'start', group: 'Basic' },
    { type: 'end', label: 'End', icon: 'end', group: 'Basic' },
    { type: 'decision', label: 'Decision', icon: 'decision', group: 'Logic' },
    { type: 'loop', label: 'Loop', icon: 'loop', group: 'Logic' },
    { type: 'subprocess', label: 'Subprocess', icon: 'subprocess', group: 'Advanced' },
    { type: 'data', label: 'Data', icon: 'data', group: 'Advanced' },
    { type: 'api', label: 'API', icon: 'api', group: 'Advanced' },
    { type: 'function', label: 'Função', icon: 'function', group: 'Advanced' },
    { type: 'email', label: 'E-mail', icon: 'email', group: 'Advanced' },
    { type: 'webhook', label: 'Webhook', icon: 'webhook', group: 'Advanced' },
  ];

  // Grupos hierárquicos
  const groups: Group[] = [
    {
      name: 'Basic',
      iconClosed: FolderClosedIcon,
      iconOpen: FolderOpenIcon,
      color: '',
      children: [
        {
          name: 'Logic',
          iconClosed: FolderClosedIcon,
          iconOpen: FolderOpenIcon,
          color: '',
        },
      ],
    },
    {
      name: 'Advanced',
      iconClosed: FolderClosedIcon,
      iconOpen: FolderOpenIcon,
      color: '',
    },
  ];

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleDragStart = (e: React.DragEvent, type: NodeType) => {
    setDraggedNode(type);
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedNode(null);
  };

  // Função recursiva para renderizar grupos e subgrupos
  const renderGroup = (group: Group, parentPath = '', depth = 0, isLast = false) => {
    const path = parentPath ? `${parentPath}/${group.name}` : group.name;
    const isOpen = openFolders[path];
    const items = nodeTypes.filter((n) => n.group === group.name);
    return (
      <li key={path} className="relative">
        {/* Linha vertical (guide) para subníveis */}
        {depth > 0 && (
          <span
            className="absolute left-0 top-0 h-full border-l border-[#333]"
            style={{ left: `${(depth - 1) * 16 + 10}px`, width: '1px' }}
            aria-hidden="true"
          />
        )}
        <div
          className="flex items-center w-full py-1.5 cursor-pointer hover:bg-[#23272e] select-none"
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          <span onClick={() => toggleFolder(path)} className="flex items-center mr-1">
            {isOpen ? ChevronDown : ChevronRight}
          </span>
          <span onClick={() => toggleFolder(path)} className="flex items-center mr-2">
            {isOpen ? group.iconOpen : group.iconClosed}
          </span>
          <span onClick={() => toggleFolder(path)} className="font-semibold text-gray-300 text-[15px]">{group.name}</span>
        </div>
        {isOpen && (
          <ul className="">
            {items.map((node, idx) => (
              <li
                key={node.type}
                className="flex items-center gap-2 py-1 px-1 rounded cursor-pointer hover:bg-[#264f78] hover:text-blue-200 text-gray-300"
                style={{ paddingLeft: `${(depth + 1) * 16 + 12}px` }}
                onClick={() => onNodeSelect(node.type)}
                draggable
                onDragStart={(e) => handleDragStart(e, node.type)}
                onDragEnd={handleDragEnd}
              >
                {/* Linha vertical para arquivos, se não for o último */}
                {depth > 0 && idx !== items.length - 1 && (
                  <span
                    className="absolute left-0 top-0 h-full border-l border-[#333]"
                    style={{ left: `${depth * 16 + 10}px`, width: '1px' }}
                    aria-hidden="true"
                  />
                )}
                <span className="flex items-center justify-center w-5 h-5">{icons[node.icon]}</span>
                <span className="text-sm font-normal text-gray-300">{node.label}</span>
              </li>
            ))}
            {group.children?.map((child, idx) => renderGroup(child, path, depth + 1, idx === ((group.children?.length ?? 0) - 1)))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="bg-[#1e1e1e] border-r border-[#222] p-0 w-60 h-full overflow-y-auto text-gray-300 select-none text-[15px] font-mono relative">
      <div className="px-4 py-3 border-b border-[#222] text-xs uppercase tracking-widest text-gray-400 font-bold sticky top-0 bg-[#1e1e1e] z-10">EXPLORER</div>
      <ul className="mt-2">
        {groups.map((group) => renderGroup(group))}
      </ul>
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 7px;
        }
        div::-webkit-scrollbar-thumb {
          background: #23272e;
          border-radius: 4px;
        }
        div:hover::-webkit-scrollbar-thumb {
          background: #333842;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default Toolbar; 