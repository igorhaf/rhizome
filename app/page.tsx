'use client';

import React, { useState } from 'react';
import FlowCanvas from './components/FlowCanvas';
import Toolbar from './components/Toolbar';
import { Node, Edge, NodeType } from './types/flow';

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const handleNodeSelect = (type: NodeType) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type,
      position: { x: 400, y: 300 },
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        description: `This is a ${type} node`,
      },
    };
    setNodes([...nodes, newNode]);
  };

  const handleNodesChange = (newNodes: Node[]) => {
    setNodes(newNodes);
  };

  const handleEdgesChange = (newEdges: Edge[]) => {
    setEdges(newEdges);
  };

  return (
    <main className="flex h-screen bg-gray-50">
      <Toolbar onNodeSelect={handleNodeSelect} />
      <div className="flex-1 relative">
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
        />
      </div>
      {selectedNode && (
        <div className="w-64 bg-white border-l border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Properties</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Label</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => {
                  const updatedNodes = nodes.map((node) =>
                    node.id === selectedNode.id
                      ? {
                          ...node,
                          data: { ...node.data, label: e.target.value },
                        }
                      : node
                  );
                  setNodes(updatedNodes);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={selectedNode.data.description}
                onChange={(e) => {
                  const updatedNodes = nodes.map((node) =>
                    node.id === selectedNode.id
                      ? {
                          ...node,
                          data: { ...node.data, description: e.target.value },
                        }
                      : node
                  );
                  setNodes(updatedNodes);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
