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
import DatabaseQueryModal from './components/DatabaseQueryModal';
import QueryInterfaceModal from './components/QueryInterfaceModal';
import LoopConfigTab from './components/LoopConfigTab';
import WebhookConfigTab from './components/WebhookConfigTab';
import ApiConfigTab from './components/ApiConfigTab';
import FunctionConfigTab from './components/FunctionConfigTab';
import EmailConfigTab from './components/EmailConfigTab';
import { Node, Edge, NodeType } from './types/flow';
import { DecisionNodeIcon } from './components/FlowEdge';
import WebhookNode from './components/nodes/WebhookNode';
import WebhookConfigPanel from './components/panels/WebhookConfigPanel';
import DatabaseNodeSidebar from './components/advanced/DatabaseNodeSidebar';
import LoopNodeSidebar from './components/advanced/LoopNodeSidebar';
import ApiNodeSidebar from './components/advanced/ApiNodeSidebar';
import { DecisionNodeIcon as DecisionNodeIconNew } from './components/icons/DecisionNodeIcon';
import { DatabaseNodeIcon } from './components/icons/DatabaseNodeIcon';
import { LoopNodeIcon } from './components/icons/LoopNodeIcon';
import { WebhookNodeIcon } from './components/icons/WebhookNodeIcon';
import { ApiNodeIcon } from './components/icons/ApiNodeIcon';
import { FunctionNodeIcon } from './components/icons/FunctionNodeIcon';
import { EmailNodeIcon } from './components/icons/EmailNodeIcon';

// Definição do tipo de aba
interface Tab {
  id: string;
  label: string;
  type: string;
  content: Node | null;
  mode: 'canvas' | 'screen';
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

// Componente para configuração do banco de dados na aba
const DatabaseConfigTab: React.FC<{ node: Node; setNodes: React.Dispatch<React.SetStateAction<Node[]>> }> = ({ node, setNodes }) => {
  const [showQuery, setShowQuery] = React.useState(true);
  const [localNode, setLocalNode] = React.useState<Node>(() => ({ ...node, id: node.id || '' }));

  const handleSaveQueryConfig = (config: any) => {
    const updated: Node = {
      ...localNode,
      id: localNode.id || '',
      data: {
        ...localNode.data,
        databaseConfig: config,
      },
    };
    setLocalNode(updated);
    setNodes(nodes => nodes.map(n => n.id === updated.id ? updated : n));
    setShowQuery(false);
  };
  const handleSaveInterfaceConfig = (interfaceConfig: any) => {
    const updated: Node = {
      ...localNode,
      id: localNode.id || '',
      data: {
        ...localNode.data,
        queryInterface: interfaceConfig,
      },
    };
    setLocalNode(updated);
    setNodes(nodes => nodes.map(n => n.id === updated.id ? updated : n));
  };

  return (
    <div className="flex flex-col h-full px-8 pt-8 pb-8 text-white overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Configuração do Banco de Dados</h2>
      {showQuery ? (
        <DatabaseQueryModal
          open={true}
          onClose={() => {}}
          inline={true}
        />
      ) : (
        <QueryInterfaceModal
          open={true}
          onClose={() => setShowQuery(true)}
          onSave={handleSaveInterfaceConfig}
          inline={true}
        />
      )}
    </div>
  );
};

// Componente de configuração inline para nó Decision
const DecisionConfigTab: React.FC<{ node: Node; setNodes: React.Dispatch<React.SetStateAction<Node[]>> }> = ({ node, setNodes }) => {
  type DecisionNodeData = typeof node.data & { 
    inputVars?: { name: string; type: string }[]; 
    conditions?: { field: string; operator: string; value: string }[];
    outputVars?: { name: string; type: string }[];
  };
  const data = node.data as DecisionNodeData;
  const [localNode, setLocalNode] = React.useState<Node>(() => ({ ...node, id: node.id || '' }));
  const [inputVars, setInputVars] = React.useState<{ name: string; type: string }[]>(data.inputVars || []);
  const [conditions, setConditions] = React.useState<{ field: string; operator: string; value: string }[]>(data.conditions || []);
  const [outputVars, setOutputVars] = React.useState<{ name: string; type: string }[]>(data.outputVars || []);

  const handleSave = () => {
    const updated: Node = {
      ...localNode,
      data: {
        ...(localNode.data as any),
        inputVars,
        conditions,
        outputVars,
      },
    };
    setLocalNode(updated);
    setNodes(nodes => nodes.map(n => n.id === updated.id ? updated : n));
  };

  return (
    <div className="flex flex-col h-full px-8 pt-8 pb-8 text-white overflow-auto bg-[#1e2228]">
      <h2 className="text-xl font-semibold mb-4">Configuração de Decisão</h2>
      
      {/* Variáveis de Entrada */}
      <div className="mb-6">
        <div className="font-semibold mb-1 text-gray-200 text-sm">Variáveis de Entrada</div>
        <div className="flex flex-col gap-2">
          {inputVars.map((v, i) => (
            <div key={i} className="flex flex-wrap gap-2 items-center w-full">
              <input
                className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-100 text-sm focus:outline-none flex-1 min-w-0"
                value={v.name}
                onChange={e => {
                  const newVars = [...inputVars];
                  newVars[i].name = e.target.value;
                  setInputVars(newVars);
                }}
                placeholder="Nome"
              />
              <input
                className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-100 text-sm focus:outline-none flex-1 min-w-0"
                value={v.type}
                onChange={e => {
                  const newVars = [...inputVars];
                  newVars[i].type = e.target.value;
                  setInputVars(newVars);
                }}
                placeholder="Tipo"
              />
              <button className="text-red-500 text-lg flex-none" onClick={() => setInputVars(inputVars.filter((_, idx: number) => idx !== i))}>×</button>
            </div>
          ))}
          <button className="flex items-center text-blue-500 hover:underline text-xs mt-1" onClick={() => setInputVars([...inputVars, { name: '', type: '' }])}>
            <span className="text-lg mr-1">+</span> Adicionar Variável de Entrada
          </button>
        </div>
      </div>

      {/* Condições */}
      <div className="mb-6">
        <div className="font-semibold mb-1 text-gray-200 text-sm">Condições</div>
        <div className="flex flex-col gap-2">
          {conditions.map((c, i) => (
            <div key={i} className="flex flex-wrap gap-2 items-center w-full">
              <input
                className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-100 text-sm focus:outline-none flex-1 min-w-0"
                value={c.field}
                onChange={e => {
                  const newConditions = [...conditions];
                  newConditions[i].field = e.target.value;
                  setConditions(newConditions);
                }}
                placeholder="Campo"
              />
              <select
                className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-100 text-sm focus:outline-none flex-none"
                value={c.operator}
                onChange={e => {
                  const newConditions = [...conditions];
                  newConditions[i].operator = e.target.value;
                  setConditions(newConditions);
                }}
                style={{ minWidth: 70 }}
              >
                <option value="==">==</option>
                <option value="!=">!=</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
                <option value="contains">contém</option>
              </select>
              <input
                className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-100 text-sm focus:outline-none flex-1 min-w-0"
                value={c.value}
                onChange={e => {
                  const newConditions = [...conditions];
                  newConditions[i].value = e.target.value;
                  setConditions(newConditions);
                }}
                placeholder="Valor"
              />
              <button className="text-red-500 text-lg flex-none" onClick={() => setConditions(conditions.filter((_, idx: number) => idx !== i))}>×</button>
            </div>
          ))}
          <button className="flex items-center text-blue-500 hover:underline text-xs mt-1" onClick={() => setConditions([...conditions, { field: '', operator: '==', value: '' }])}>
            <span className="text-lg mr-1">+</span> Adicionar Condição
          </button>
        </div>
      </div>

      {/* Variáveis de Saída */}
      <div className="mb-6">
        <div className="font-semibold mb-1 text-gray-200 text-sm">Variáveis de Saída</div>
        <div className="flex flex-col gap-2">
          {outputVars.map((v, i) => (
            <div key={i} className="flex flex-wrap gap-2 items-center w-full">
              <input
                className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-100 text-sm focus:outline-none flex-1 min-w-0"
                value={v.name}
                onChange={e => {
                  const newVars = [...outputVars];
                  newVars[i].name = e.target.value;
                  setOutputVars(newVars);
                }}
                placeholder="Nome"
              />
              <input
                className="border border-[#222] rounded px-2 py-1.5 bg-[#23272e] text-gray-100 text-sm focus:outline-none flex-1 min-w-0"
                value={v.type}
                onChange={e => {
                  const newVars = [...outputVars];
                  newVars[i].type = e.target.value;
                  setOutputVars(newVars);
                }}
                placeholder="Tipo"
              />
              <button className="text-red-500 text-lg flex-none" onClick={() => setOutputVars(outputVars.filter((_, idx: number) => idx !== i))}>×</button>
            </div>
          ))}
          <button className="flex items-center text-blue-500 hover:underline text-xs mt-1" onClick={() => setOutputVars([...outputVars, { name: '', type: '' }])}>
            <span className="text-lg mr-1">+</span> Adicionar Variável de Saída
          </button>
        </div>
      </div>

      <button className="border border-[#222] rounded px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm self-start" onClick={handleSave}>
        Salvar
      </button>
    </div>
  );
};

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Sistema de abas
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'main', label: 'Main', type: 'main', content: null, mode: 'canvas' },
  ]);
  const [activeTab, setActiveTab] = useState('main');

  // Handler para abrir subprocesso ou config de nó em nova aba
  const handleNodeDoubleClick = (node: Node) => {
    if (node.type === 'subprocess' || node.type === 'Database' || node.type === 'decision' || node.type === 'loop' || node.type === 'webhook' || node.type === 'api' || node.type === 'funcion' || node.type === 'email') {
      // Se já existe uma aba para esse nó, ativa
      const existing = tabs.find(tab => tab.id === node.id && tab.type === (node.type === 'decision' ? 'decision-config' : node.type === 'subprocess' ? 'subprocess' : node.type === 'loop' ? 'loop' : node.type === 'webhook' ? 'webhook' : node.type === 'api' ? 'api' : node.type === 'funcion' ? 'function' : node.type === 'email' ? 'email' : 'database'));
      if (node.type === 'Database' || node.type === 'decision' || node.type === 'loop' || node.type === 'webhook' || node.type === 'api' || node.type === 'funcion' || node.type === 'email') setSelectedNode(null); // Garante que não há sidebar na aba de config
      if (existing) {
        setActiveTab(existing.id);
      } else {
        setTabs([
          ...tabs,
          {
            id: node.id,
            label: node.data.label || (node.type === 'subprocess' ? 'Subprocesso' : node.type === 'Database' ? 'Database' : node.type === 'loop' ? 'Loop' : node.type === 'webhook' ? 'Webhook' : node.type === 'api' ? 'API' : node.type === 'funcion' ? 'Function' : node.type === 'email' ? 'Email' : 'Decision'),
            type: node.type === 'decision' ? 'decision-config' : node.type === 'subprocess' ? 'subprocess' : node.type === 'loop' ? 'loop' : node.type === 'webhook' ? 'webhook' : node.type === 'api' ? 'api' : node.type === 'funcion' ? 'function' : node.type === 'email' ? 'email' : 'database',
            content: node,
            mode: 'screen',
          },
        ]);
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
        <div className="flex-1 h-full overflow-hidden bg-[#1e2228]">
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onNodeClick={handleNodeClick}
            selectedNode={selectedNode}
            selectedEdgeId={selectedEdgeId}
            onEdgeSelect={handleEdgeSelect}
            setSelectedNode={setSelectedNode}
            onNodeDoubleClick={handleNodeDoubleClick}
          />
        </div>
      );
    }

    if (tab.type === 'subprocess') {
      return (
        <div className="flex items-center justify-center h-full text-2xl text-white">
          eu sou um subprocesso
        </div>
      );
    }

    if (tab.type === 'database') {
      return (
        <div className="flex-1 h-full overflow-y-auto bg-[#1e2228]">
          <DatabaseConfigTab node={tab.content as Node} setNodes={setNodes} />
        </div>
      );
    }

    if (tab.type === 'decision-config') {
      return (
        <div className="flex-1 h-full overflow-y-auto bg-[#1e2228]">
          <DecisionConfigTab node={tab.content as Node} setNodes={setNodes} />
        </div>
      );
    }

    if (tab.type === 'loop') {
      return (
        <div className="flex-1 h-full overflow-y-auto bg-[#1e2228]">
          <LoopConfigTab node={tab.content as Node} setNodes={setNodes} />
        </div>
      );
    }

    if (tab.type === 'webhook') {
      return (
        <div className="flex-1 h-full overflow-y-auto bg-[#1e2228]">
          <WebhookConfigTab node={tab.content as Node} setNodes={setNodes} />
        </div>
      );
    }

    if (tab.type === 'api') {
      return (
        <div className="flex-1 h-full overflow-y-auto bg-[#1e2228]">
          <ApiConfigTab node={tab.content as Node} setNodes={setNodes} />
        </div>
      );
    }

    if (tab.type === 'function') {
      return (
        <div className="flex-1 h-full overflow-y-auto bg-[#1e2228]">
          <FunctionConfigTab node={tab.content as Node} setNodes={setNodes} />
        </div>
      );
    }

    if (tab.type === 'email') {
      return (
        <div className="flex-1 h-full overflow-y-auto bg-[#1e2228]">
          <EmailConfigTab node={tab.content as Node} setNodes={setNodes} />
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
          timeout: 5000,
          retryCount: 0,
          retryInterval: 1000,
          inputParams: '',
          notes: '',
        }),
        ...(type === 'loop' && {
          type: 'while',
          condition: '',
          iterations: 0,
          body: [],
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

  // Determina se a aba ativa é canvas
  const activeTabObj = tabs.find(t => t.id === activeTab);
  const isCanvasTab = activeTabObj?.mode === 'canvas';

  // Handler global para deletar nó ou aresta selecionada
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNode) {
          // Remove o nó e todas as edges ligadas a ele
          setNodes(prevNodes => prevNodes.filter(n => n.id !== selectedNode.id));
          setEdges(prevEdges => prevEdges.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
          setSelectedNode(null);
        } else if (selectedEdgeId) {
          // Remove apenas a edge selecionada
          setEdges(prevEdges => prevEdges.filter(e => e.id !== selectedEdgeId));
          setSelectedEdgeId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, selectedEdgeId]);

  const DecisionIcon = DecisionNodeIcon;

  // Renderiza o painel lateral
  const renderSidePanel = () => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case 'webhook':
        return (
          <WebhookConfigPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        );
      // ... outros casos ...
      default:
        return null;
    }
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
            let icon = null;
            if (tab.id === 'main') icon = StartIcon;
            else if (tab.type === 'subprocess') icon = SubprocessIcon;
            else if (tab.type === 'decision-config') icon = DecisionIcon;
            else if (tab.type === 'loop') icon = SubprocessIcon;
            else icon = SubprocessIcon;
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
                    {icon}
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
      {/* Sidebar direito só aparece se a aba ativa for CANVAS */}
      {isCanvasTab && selectedNode && (
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
            canClose={true}
          />
        )
      )}
      {renderSidePanel()}
    </div>
  );
}
