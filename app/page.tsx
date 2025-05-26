'use client';

import React, { useState } from 'react';
import FlowCanvas from './components/FlowCanvas';
import Toolbar from './components/Toolbar';
import NodeSidebar from './components/NodeSidebar';
import EndNodeSidebar from './components/EndNodeSidebar';
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
        ...(type === 'end' && {
          returnStatus: 'success',
          returnCode: 200,
          returnType: 'json',
          shouldLog: true,
        }),
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

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  const handleNodeUpdate = (updatedNode: Node) => {
    const newNodes = nodes.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    );
    setNodes(newNodes);
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
          onNodeClick={handleNodeClick}
        />
      </div>
      {selectedNode && (
        selectedNode.type === 'end' ? (
          <EndNodeSidebar
            node={selectedNode}
            onUpdate={handleNodeUpdate}
            onClose={() => setSelectedNode(null)}
          />
        ) : (
          <NodeSidebar
            node={selectedNode}
            onUpdate={handleNodeUpdate}
            onClose={() => setSelectedNode(null)}
          />
        )
      )}
    </main>
  );
}
