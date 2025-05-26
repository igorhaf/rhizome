'use client';

import React, { useState } from 'react';
import { NodeType } from '../types/flow';

interface ToolbarProps {
  onNodeSelect: (type: NodeType) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onNodeSelect }) => {
  const [draggedNode, setDraggedNode] = useState<NodeType | null>(null);

  const nodeTypes: { type: NodeType; label: string; icon: string }[] = [
    { type: 'start', label: 'Start', icon: '▶️' },
    { type: 'end', label: 'End', icon: '⏹️' },
    { type: 'action', label: 'Action', icon: '⚡' },
    { type: 'decision', label: 'Decision', icon: '❓' },
    { type: 'loop', label: 'Loop', icon: '🔄' },
    { type: 'subprocess', label: 'Subprocess', icon: '📦' },
    { type: 'data', label: 'Data', icon: '💾' },
    { type: 'api', label: 'API', icon: '🌐' },
  ];

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
    <div className="bg-gray-800 border-r border-gray-700 p-4 w-64 h-full overflow-y-auto text-white">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">Components</h2>
      <div className="space-y-2">
        {nodeTypes.map((node) => (
          <button
            key={node.type}
            className={`w-full flex items-center gap-2 p-3 rounded transition-all duration-200 ${
              draggedNode === node.type
                ? 'bg-gray-600 scale-95'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => onNodeSelect(node.type)}
            draggable
            onDragStart={(e) => handleDragStart(e, node.type)}
            onDragEnd={handleDragEnd}
          >
            <span className="text-xl">{node.icon}</span>
            <span className="font-medium">{node.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar; 