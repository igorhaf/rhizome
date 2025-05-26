'use client';

import React, { useState } from 'react';
import { NodeType } from '../types/flow';

interface ToolbarProps {
  onNodeSelect: (type: NodeType) => void;
}

// Novo tipo para grupos hierárquicos
interface Group {
  name: string;
  iconClosed: string;
  iconOpen: string;
  color: string;
  children?: Group[];
}

const Toolbar: React.FC<ToolbarProps> = ({ onNodeSelect }) => {
  const [draggedNode, setDraggedNode] = useState<NodeType | null>(null);
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({
    Basic: true,
    'Basic/Logic': true,
    Advanced: true,
  });

  const nodeTypes: { type: NodeType; label: string; icon: string; group: string }[] = [
    { type: 'start', label: 'Start', icon: '▶️', group: 'Basic' },
    { type: 'end', label: 'End', icon: '⏹️', group: 'Basic' },
    { type: 'action', label: 'Action', icon: '⚡', group: 'Logic' },
    { type: 'decision', label: 'Decision', icon: '❓', group: 'Logic' },
    { type: 'loop', label: 'Loop', icon: '🔄', group: 'Logic' },
    { type: 'subprocess', label: 'Subprocess', icon: '📦', group: 'Advanced' },
    { type: 'data', label: 'Data', icon: '💾', group: 'Advanced' },
    { type: 'api', label: 'API', icon: '🌐', group: 'Advanced' },
  ];

  // Grupos hierárquicos
  const groups: Group[] = [
    {
      name: 'Basic',
      iconClosed: '',
      iconOpen: '',
      color: 'text-yellow-400',
      children: [
        {
          name: 'Logic',
          iconClosed: '',
          iconOpen: '',
          color: 'text-blue-400',
        },
      ],
    },
    {
      name: 'Advanced',
      iconClosed: '',
      iconOpen: '',
      color: 'text-green-400',
    },
  ];

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleDragStart = (e: React.DragEvent, type: NodeType) => {
    setDraggedNode(type);
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create a custom drag image
    const dragImage = document.createElement('div');
    dragImage.className = 'fixed -left-1000 top-0';
    dragImage.innerHTML = `
      <div class="bg-gray-700 text-white p-2 rounded shadow-lg flex items-center gap-2">
        <span class="text-xl">${nodeTypes.find(n => n.type === type)?.icon}</span>
        <span>${nodeTypes.find(n => n.type === type)?.label}</span>
      </div>
    `;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Remove the drag image after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragEnd = () => {
    setDraggedNode(null);
  };

  // Função recursiva para renderizar grupos e subgrupos
  const renderGroup = (group: Group, parentPath = '') => {
    const path = parentPath ? `${parentPath}/${group.name}` : group.name;
    const isOpen = openFolders[path];
    // Itens deste grupo
    const items = nodeTypes.filter((n) => n.group === group.name);
    return (
      <li key={path}>
        <button
          type="button"
          className={`flex items-center gap-2 w-full px-3 py-1.5 text-left hover:bg-[#23272e] ${isOpen ? 'bg-[#23272e]' : ''}`}
          onClick={() => toggleFolder(path)}
        >
          <span className={`${group.color} flex items-center justify-center w-5 h-5 text-lg font-normal`}>{isOpen ? group.iconOpen : group.iconClosed}</span>
          <span className="font-semibold text-gray-100">{group.name}</span>
        </button>
        {isOpen && (
          <ul className="mt-1 border-l border-[#222] pl-4">
            {items.map((node) => (
              <li
                key={node.type}
                className="flex items-center gap-2 py-1 px-1 rounded cursor-pointer hover:bg-[#264f78] hover:text-blue-200 text-gray-300"
                onClick={() => onNodeSelect(node.type)}
                draggable
                onDragStart={(e) => handleDragStart(e, node.type)}
                onDragEnd={handleDragEnd}
              >
                <span className="flex items-center justify-center w-5 h-5 text-base">{node.icon}</span>
                <span className="text-sm font-normal">{node.label}</span>
              </li>
            ))}
            {/* Renderiza subgrupos, se houver */}
            {group.children && group.children.map((child) => renderGroup(child, path))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="bg-[#1e1e1e] border-r border-[#222] p-0 w-60 h-full overflow-y-auto text-gray-200 select-none text-[15px] font-mono">
      <div className="px-4 py-3 border-b border-[#222] text-xs uppercase tracking-widest text-gray-400 font-bold">Explorer</div>
      <ul className="mt-2">
        {groups.map((group) => renderGroup(group))}
      </ul>
    </div>
  );
};

export default Toolbar; 