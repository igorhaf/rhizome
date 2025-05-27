'use client';

import React, { useState, useCallback } from 'react';
import FlowCanvas from './components/FlowCanvas';
import Toolbar from './components/Toolbar';
import NodeSidebar from './components/NodeSidebar';
import EndNodeSidebar from './components/EndNodeSidebar';
import ActionNodeSidebar from './components/ActionNodeSidebar';
import DecisionNodeSidebar from './components/DecisionNodeSidebar';
import FunctionNodeSidebar from './components/advanced/FunctionNodeSidebar';
import EmailNodeSidebar from './components/advanced/EmailNodeSidebar';
import WebhookNodeSidebar from './components/advanced/WebhookNodeSidebar';
import { Node, Edge, NodeType } from './types/flow';

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const handleNodeAdd = (type: NodeType) => {
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
        ...(type === 'action' && {
          actionType: 'function',
          inputParams: '',
          timeout: 30,
          retryCount: 0,
          retryInterval: 5,
          isAsync: false,
          shouldLog: true,
        }),
      },
    };
    setNodes([...nodes, newNode]);
  };

  const handleNodeSelect = (node: Node) => {
    // Inicializa campos específicos baseado no tipo do nó
    const updatedNode = { ...node };
    if (node.type === 'end') {
      updatedNode.data = {
        ...updatedNode.data,
        returnStatus: updatedNode.data.returnStatus ?? 'success',
        returnCode: updatedNode.data.returnCode ?? 200,
        returnType: updatedNode.data.returnType ?? 'json',
        shouldLog: updatedNode.data.shouldLog ?? true
      };
    }
    if (node.type === 'action') {
      updatedNode.data = {
        ...updatedNode.data,
        actionType: updatedNode.data.actionType ?? 'function',
        inputParams: updatedNode.data.inputParams ?? '',
        timeout: updatedNode.data.timeout ?? 30,
        retryCount: updatedNode.data.retryCount ?? 0,
        retryInterval: updatedNode.data.retryInterval ?? 5,
        isAsync: updatedNode.data.isAsync ?? false,
        shouldLog: updatedNode.data.shouldLog ?? true
      };
    }
    if (node.type === 'decision') {
      updatedNode.data = {
        ...updatedNode.data,
        conditionExpression: updatedNode.data.conditionExpression ?? '',
        inputVars: updatedNode.data.inputVars ?? '',
        outputVars: updatedNode.data.outputVars ?? '',
        shouldLog: updatedNode.data.shouldLog ?? true
      };
    }
    setSelectedNode(updatedNode);
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
    <div className="flex h-screen bg-[#e5e7eb]">
      <div className="relative z-50">
        <Toolbar onNodeSelect={handleNodeAdd} />
      </div>
      <div className="flex-1 flex items-center justify-center relative bg-[#1e2228]">
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onNodeClick={handleNodeSelect}
        />
      </div>
      {selectedNode && (
        selectedNode.type === 'end' ? (
          <EndNodeSidebar
            node={selectedNode}
            onUpdate={handleNodeUpdate}
            onClose={() => setSelectedNode(null)}
          />
        ) : selectedNode.type === 'function' ? (
          <FunctionNodeSidebar
            node={selectedNode}
            onUpdate={handleNodeUpdate}
            onClose={() => setSelectedNode(null)}
          />
        ) : selectedNode.type === 'email' ? (
          <EmailNodeSidebar
            node={selectedNode}
            onUpdate={handleNodeUpdate}
            onClose={() => setSelectedNode(null)}
          />
        ) : selectedNode.type === 'webhook' ? (
          <WebhookNodeSidebar
            node={selectedNode}
            onUpdate={handleNodeUpdate}
            onClose={() => setSelectedNode(null)}
          />
        ) : selectedNode.type === 'decision' ? (
          <DecisionNodeSidebar
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
    </div>
  );
}
