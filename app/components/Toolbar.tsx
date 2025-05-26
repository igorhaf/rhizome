'use client';

import React, { useState } from 'react';
import { NodeType } from '../types/flow';

interface ToolbarProps {
  onNodeSelect: (type: NodeType) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onNodeSelect }) => {
  const [draggedNode, setDraggedNode] = useState<NodeType | null>(null);
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({
    Basic: true,
    Logic: true,
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

  const groups = [
    { name: 'Basic', iconClosed: '📁', iconOpen: '📂' },
    { name: 'Logic', iconClosed: '📁', iconOpen: '📂' },
    { name: 'Advanced', iconClosed: '📁', iconOpen: '📂' },
  ];

  const toggleFolder = (group: string) => {
    setOpenFolders((prev) => ({ ...prev, [group]: !prev[group] }));
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

  return (
    <div className="bg-white border-r border-gray-200 p-4 w-64 h-full overflow-y-auto text-gray-900">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Components</h2>
      <div className="mb-4 ml-2">
        <ul className="text-sm select-none">
          {groups.map((group) => (
            <li key={group.name} className="mb-1">
              <button
                type="button"
                className="flex items-center gap-1 font-semibold focus:outline-none hover:text-blue-600"
                onClick={() => toggleFolder(group.name)}
              >
                <span>{openFolders[group.name] ? group.iconOpen : group.iconClosed}</span>
                <span>{group.name}</span>
              </button>
              {openFolders[group.name] && (
                <ul className="ml-6 mt-1">
                  {nodeTypes.filter((n) => n.group === group.name).map((node) => (
                    <li key={node.type} className="flex items-center gap-2 py-1 cursor-pointer hover:text-blue-600"
                        onClick={() => onNodeSelect(node.type)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, node.type)}
                        onDragEnd={handleDragEnd}
                    >
                      <span className="text-base">{node.icon}</span>
                      <span>{node.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Toolbar; 