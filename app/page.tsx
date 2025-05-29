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

// Definição do tipo de aba
interface Tab {
  id: string;
  label: string;
  type: string;
  content: Node | null;
}

// SVGs dos ícones (agora com azul VSCode)
const VSCodeBlue = '#007acc';
const StartIcon = (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" fill={VSCodeBlue} />
    <polygon points="16,16 36,24 16,32" fill="#fff" />
  </svg>
);
const SubprocessIcon = (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" fill="#f59e42" />
    <rect x="18" y="25" width="12" height="2" rx="1" fill="#fff" />
  </svg>
);

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Sistema de abas
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'main', label: 'Main', type: 'main', content: null },
  ]);
  const [activeTab, setActiveTab] = useState('main');

  // Handler para abrir subprocesso em nova aba
  const handleNodeDoubleClick = (node: Node) => {
    if (node.type === 'subprocess') {
      // Se já existe uma aba para esse subprocesso, ativa
      const existing = tabs.find(tab => tab.id === node.id);
      if (existing) {
        setActiveTab(existing.id);
      } else {
        setTabs([...tabs, { id: node.id, label: node.data.label || 'Subprocesso', type: 'subprocess', content: node }]);
        setActiveTab(node.id);
      }
    }
  };

  // Handler para fechar aba
  const handleCloseTab = (tabId: string) => {
    if (tabId === 'main') return;
    const idx = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    // Se a aba fechada era a ativa, ativa a anterior ou main
    if (activeTab === tabId) {
      if (newTabs[idx - 1]) setActiveTab(newTabs[idx - 1].id);
      else setActiveTab('main');
    }
  };

  // Renderiza conteúdo da aba
  const renderTabContent = () => {
    const tab = tabs.find(t => t.id === activeTab);
    if (!tab) return null;
    if (tab.type === 'main') {
      return (
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
          onNodeClick={handleNodeSelect}
          selectedNode={selectedNode}
          selectedEdgeId={selectedEdgeId}
          onEdgeSelect={handleEdgeSelect}
          setSelectedNode={setSelectedNode}
          // Adiciona handler de duplo clique
          onNodeDoubleClick={handleNodeDoubleClick}
        />
      );
    }
    if (tab.type === 'subprocess') {
      return (
        <div className="flex items-center justify-center h-full text-2xl text-white">
          eu sou um subprocesso
        </div>
      );
    }
    return null;
  };

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
        ...(type === 'funcion' && {
          inputParams: '',
          timeout: 30000,
          retryCount: 0,
          retryInterval: 1000,
          isAsync: false,
          shouldLog: true,
          notes: '',
        }),
        ...(type === 'email' && {
          to: '',
          subject: '',
          body: '',
          inputParams: '',
          notes: '',
        }),
        ...(type === 'webhook' && {
          webhookUrl: '',
          httpMethod: 'POST',
          headers: '',
          payload: '',
          inputParams: '',
          notes: '',
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
    if (node.type === 'decision') {
      updatedNode.data = {
        ...updatedNode.data,
        conditionExpression: updatedNode.data.conditionExpression ?? '',
        inputVars: updatedNode.data.inputVars ?? '',
        outputVars: updatedNode.data.outputVars ?? '',
        shouldLog: updatedNode.data.shouldLog ?? true
      };
    }
    if (node.type === 'funcion') {
      updatedNode.data = {
        ...updatedNode.data,
        inputParams: updatedNode.data.inputParams ?? '',
        timeout: updatedNode.data.timeout ?? 30000,
        retryCount: updatedNode.data.retryCount ?? 0,
        retryInterval: updatedNode.data.retryInterval ?? 1000,
        isAsync: updatedNode.data.isAsync ?? false,
        shouldLog: updatedNode.data.shouldLog ?? true,
        notes: updatedNode.data.notes ?? '',
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
    setSelectedEdgeId(null);
  };

  const handleEdgeSelect = (edgeId: string | null) => {
    setSelectedEdgeId(edgeId);
    setSelectedNode(null);
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
      <div className="flex-1 flex flex-col relative bg-[#1e2228]">
        {/* Tabs no topo */}
        <div className="flex items-center h-9 bg-[#181a1b] border-b border-[#23272e] px-1 gap-0 select-none" style={{ minHeight: 36 }}>
          {tabs.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            return (
              <React.Fragment key={tab.id}>
                {/* Divisória à esquerda de todas as abas, exceto a primeira */}
                {idx > 0 && (
                  <div style={{ width: 1, height: 36, background: '#2a2d2e', margin: 0 }} />
                )}
                {/* Aba */}
                <div
                  className={`relative group flex items-center h-9 min-h-[36px] max-h-[36px] px-3 cursor-pointer text-sm font-medium transition-colors duration-100
                    ${isActive
                      ? 'bg-[#1e2228] text-white border-b-2'
                      : 'bg-transparent text-[#bfbfbf] hover:bg-[#181a1b] hover:text-white'}
                  `}
                  style={{
                    userSelect: 'none',
                    minWidth: 80,
                    height: '36px',
                    borderRadius: 0,
                    border: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottomColor: isActive ? VSCodeBlue : 'transparent',
                    marginTop: 0,
                    marginBottom: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {/* Ícone */}
                  <span className="mr-2 flex items-center">
                    {tab.id === 'main' ? StartIcon : SubprocessIcon}
                  </span>
                  <span className="truncate max-w-[120px]">{tab.label}</span>
                  {/* X só aparece em abas não-main, sempre visível na ativa, só on hover na inativa */}
                  {tab.id !== 'main' && (
                    <button
                      className={`ml-2 text-[#bfbfbf] text-xs transition-opacity duration-100
                        ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                        hover:text-[${VSCodeBlue}]`}
                      onClick={e => { e.stopPropagation(); handleCloseTab(tab.id); }}
                      style={{ fontSize: 16, lineHeight: 1 }}
                      tabIndex={-1}
                      title="Fechar aba"
                    >×</button>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        {/* Conteúdo da aba ativa */}
        <div className="flex-1 relative">
          {renderTabContent()}
        </div>
      </div>
      {selectedNode && (
        selectedNode.type === 'end' ? (
          <EndNodeSidebar
            node={selectedNode}
            onUpdate={handleNodeUpdate}
            onClose={() => setSelectedNode(null)}
          />
        ) : selectedNode.type === 'funcion' ? (
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
