'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Node, Edge, NodeType } from '../types/flow';
import FlowNode from './FlowNode';
import FlowEdge from './FlowEdge';
import WebhookNode from './nodes/WebhookNode';
import WarningNode from './nodes/WarningNode';
import { EmailNodeIcon } from './icons/EmailNodeIcon';
import { StartNodeIcon } from './icons/StartNodeIcon';
import { EndNodeIcon } from './icons/EndNodeIcon';
import { FunctionNodeIcon } from './icons/FunctionNodeIcon';
import { WebhookNodeIcon } from './icons/WebhookNodeIcon';
import { DecisionNodeIcon } from './icons/DecisionNodeIcon';
import { LoopNodeIcon } from './icons/LoopNodeIcon';
import { SubprocessNodeIcon } from './icons/SubprocessNodeIcon';
import { DatabaseNodeIcon } from './icons/DatabaseNodeIcon';
import { ApiNodeIcon } from './icons/ApiNodeIcon';
import { SpreadsheetNodeIcon } from './icons/SpreadsheetNodeIcon';
import { Node as FlowNodeType } from '../types/flow';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeChange,
  EdgeChange,
  ConnectionMode,
  Panel,
  useReactFlow,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import StartNode from './nodes/StartNode';
import EndNode from './nodes/EndNode';
import FunctionNode from './nodes/FunctionNode';
import EmailNode from './nodes/EmailNode';
import DecisionNode from './nodes/DecisionNode';
import LoopNode from './nodes/LoopNode';
import SubprocessNode from './nodes/SubprocessNode';
import DatabaseNode from './nodes/DatabaseNode';
import ApiNode from './nodes/ApiNode';
import SpreadsheetNode from './nodes/SpreadsheetNode';

interface FlowCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onConnect?: (connection: Connection) => void;
  onNodeClick?: (node: Node) => void;
  onEdgeClick?: (edge: Edge | null) => void;
  onPaneClick?: () => void;
  selectedNode?: Node | null;
  selectedEdgeId?: string | null;
  onNodeAdd?: (type: NodeType, position: { x: number; y: number }) => void;
}

// Função utilitária: grid, obstáculos e BFS ortogonal (copiada do FlowEdge)
function findOrthogonalPathAvoidingNodes(start: [number, number], end: [number, number], nodeRects: DOMRect[], gridSize = 20) {
  // Limites do canvas
  const minX = 0, minY = 0, maxX = 4000, maxY = 4000;
  // Sanitizar coordenadas de entrada
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  function safeNum(n: number) {
    return isNaN(n) || !isFinite(n) ? 0 : n;
  }
  const safeStart: [number, number] = [clamp(safeNum(start[0]), minX, maxX), clamp(safeNum(start[1]), minY, maxY)];
  const safeEnd: [number, number] = [clamp(safeNum(end[0]), minX, maxX), clamp(safeNum(end[1]), minY, maxY)];
  // Função para grid cell (garante tupla)
  const toCell = (x: number, y: number): [number, number] => [Math.round(x / gridSize), Math.round(y / gridSize)];
  const toCoord = (cell: [number, number]) => [cell[0] * gridSize, cell[1] * gridSize];
  // Montar set de obstáculos
  const obstacles = new Set<string>();
  nodeRects.forEach(rect => {
    const x0 = Math.floor(rect.left / gridSize), x1 = Math.ceil(rect.right / gridSize);
    const y0 = Math.floor(rect.top / gridSize), y1 = Math.ceil(rect.bottom / gridSize);
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) obstacles.add(`${x},${y}`);
  });
  // Timeout global para o BFS
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  // BFS com limite de iterações
  const startCell: [number, number] = toCell(safeStart[0], safeStart[1]);
  const endCell = toCell(safeEnd[0], safeEnd[1]);
  // Fallback imediato se destino está em obstáculo
  if (obstacles.has(`${endCell[0]},${endCell[1]}`)) {
    return fallbackOrthogonal(safeStart, safeEnd);
  }
  // Fallback imediato se destino está cercado por obstáculos nas 4 direções
  const directions = [[1,0],[-1,0],[0,1],[0,-1]];
  const surrounded = directions.every(([dx, dy]) => obstacles.has(`${endCell[0]+dx},${endCell[1]+dy}`));
  if (surrounded) {
    return fallbackOrthogonal(safeStart, safeEnd);
  }
  const queue: Array<[[number, number], [number, number][]]> = [[startCell, [startCell]]];
  const visited = new Set<string>();
  let steps = 0;
  const MAX_STEPS = 500;
  while (queue.length) {
    // Timeout global: se passar de 5ms, faz fallback
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - startTime > 5) return fallbackOrthogonal(safeStart, safeEnd);
    if (++steps > MAX_STEPS) break; // Proteção contra loop infinito
    const [cell, path] = queue.shift()!;
    const key = `${cell[0]},${cell[1]}`;
    if (visited.has(key)) continue;
    visited.add(key);
    if (cell[0] === endCell[0] && cell[1] === endCell[1]) {
      if (path.length > 20) return fallbackOrthogonal(safeStart, safeEnd);
      return path.map(toCoord);
    }
    for (const [dx, dy] of directions) {
      const nx = cell[0] + dx, ny = cell[1] + dy;
      if (nx < minX || ny < minY || nx > maxX || ny > maxY) continue;
      const nkey = `${nx},${ny}`;
      if (obstacles.has(nkey)) continue;
      queue.push([[nx, ny], [...path, [nx, ny]]]);
    }
  }
  // fallback: caminho ortogonal (L/Z)
  return fallbackOrthogonal(safeStart, safeEnd);
}

// Fallback ortogonal simples extraído para função
function fallbackOrthogonal(safeStart: [number, number], safeEnd: [number, number]) {
  const [sx, sy] = safeStart;
  const [ex, ey] = safeEnd;
  // Se o caminho ortogonal teria mais de 10 pontos, desenhe só uma linha reta
  const dist = Math.abs(ex - sx) + Math.abs(ey - sy);
  if (dist / 20 > 10) {
    return [safeStart, safeEnd];
  }
  if (Math.abs(ex - sx) > Math.abs(ey - sy)) {
    // L horizontal-vertical
    const midX = sx + (ex - sx) / 2;
    return [
      [sx, sy],
      [midX, sy],
      [midX, ey],
      [ex, ey],
    ];
  } else {
    // L vertical-horizontal
    const midY = sy + (ey - sy) / 2;
    return [
      [sx, sy],
      [sx, midY],
      [ex, midY],
      [ex, ey],
    ];
  }
}

type ConnectorInfo = { nodeId: string; connectorId: string; x: number; y: number; dist: number };
function findClosestConnector(mouse: { x: number; y: number }, nodes: FlowNodeType[]): ConnectorInfo | null {
  let minDist = Infinity;
  let closest: ConnectorInfo | null = null;
  nodes.forEach((node) => {
    const nodeWidth = (node.data && typeof (node.data as any).width === 'number') ? (node.data as any).width : 80;
    const nodeHeight = (node.data && typeof (node.data as any).height === 'number') ? (node.data as any).height : 80;
    const connectors = [
      { id: 'top', x: node.position.x + nodeWidth / 2, y: node.position.y },
      { id: 'right', x: node.position.x + nodeWidth, y: node.position.y + nodeHeight / 2 },
      { id: 'bottom', x: node.position.x + nodeWidth / 2, y: node.position.y + nodeHeight },
      { id: 'left', x: node.position.x, y: node.position.y + nodeHeight / 2 },
    ];
    connectors.forEach((conn) => {
      const dx = mouse.x - conn.x;
      const dy = mouse.y - conn.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        closest = { nodeId: node.id, connectorId: conn.id, x: conn.x, y: conn.y, dist };
      }
    });
  });
  return (closest && (closest as ConnectorInfo).dist < 20) ? closest : null;
}

const nodeTypes = {
  loop: LoopNode,
  webhook: WebhookNode,
  start: StartNode,
  end: EndNode,
  funcion: FunctionNode,
  email: EmailNode,
  decision: DecisionNode,
  subprocess: SubprocessNode,
  Database: DatabaseNode,
  api: ApiNode,
  spreadsheet: SpreadsheetNode,
  warning: WarningNode,
};

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onEdgeClick,
  onPaneClick,
  selectedNode,
  selectedEdgeId,
  onNodeAdd,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);
  const { getIntersectingNodes, getNode } = useReactFlow();
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [startOffset, setStartOffset] = useState<{ x: number; y: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedLabelEdgeId, setSelectedLabelEdgeId] = useState<string | null>(null);
  const [editingLabelEdgeId, setEditingLabelEdgeId] = useState<string | null>(null);
  const [editingLabelValue, setEditingLabelValue] = useState<string>('');
  // Estado para drag de edge
  const [draggingEdgeId, setDraggingEdgeId] = useState<string | null>(null);
  const [draggingEnd, setDraggingEnd] = useState<'source' | 'target' | null>(null);
  const draggingFromRef = useRef<{ nodeId: string; connectorId: string } | null>(null);
  const draggingToRef = useRef<{ x: number; y: number } | null>(null);
  const [isDraggingConnection, setIsDraggingConnection] = useState(false);
  const [hoveredConnector, setHoveredConnector] = useState<{ nodeId: string; connectorId: string; x: number; y: number } | null>(null);
  const [edgeBackup, setEdgeBackup] = useState<Edge | null>(null);
  const [viewport, setViewport] = React.useState({ x: 0, y: 0, zoom: 1 });
  // Estado para seleção e ligação de conectores
  const [activeConnector, setActiveConnector] = useState<{ nodeId: string; connectorId: string } | null>(null);
  const [connectionStart, setConnectionStart] = useState<{ nodeId: string; connectorId: string } | null>(null);
  // Força re-render após drop
  const [forceUpdate, setForceUpdate] = useState(0);

  // Centralizar o canvas na inicialização com posição arredondada
  useEffect(() => {
    if (reactFlowWrapper.current) {
      const { width, height } = reactFlowWrapper.current.getBoundingClientRect();
      setPosition({
        x: Math.round(width / 2 - 20000),
        y: Math.round(height / 2 - 20000)
      });
    }
  }, []);

  const getMousePosition = useCallback((event: MouseEvent) => {
    const container = reactFlowWrapper.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    const rect = reactFlowWrapper.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Posição do mouse relativa ao canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setScale((prevScale) => {
      // Ajuste mais suave do zoom com fator menor para maior precisão
      const zoomFactor = 0.0005;
      const newScale = Math.max(0.1, Math.min(2, prevScale - delta * zoomFactor));
      
      // Calcula a posição do mouse no mundo antes do zoom
      const worldX = (mouseX - position.x) / prevScale;
      const worldY = (mouseY - position.y) / prevScale;
      
      // Ajusta a posição para manter o ponto do mouse fixo
      // Usa Math.round para evitar problemas de precisão com números decimais
      setPosition({
        x: Math.round(mouseX - worldX * newScale),
        y: Math.round(mouseY - worldY * newScale)
      });
      
      return newScale;
    });
  }, [position]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!reactFlowBounds) return;

    const data = event.dataTransfer.getData('application/json');
    if (!data) return;

    const { type } = JSON.parse(data) as { type: NodeType };
    if (!type) return;

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    onNodeAdd?.(type, position);
  }, [onNodeAdd]);

  const handleCanvasMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanning || !startPoint || !startOffset) return;
    
    const dx = e.clientX - startPoint.x;
    const dy = e.clientY - startPoint.y;
    
    setPosition({
      x: Math.round(startOffset.x + dx),
      y: Math.round(startOffset.y + dy)
    });
  }, [isPanning, startPoint, startOffset]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsPanning(false);
    setStartPoint(null);
    setStartOffset(null);
  }, []);

  useEffect(() => {
    if (isPanning) {
      window.addEventListener('mousemove', handleCanvasMouseMove);
      window.addEventListener('mouseup', handleCanvasMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleCanvasMouseMove);
      window.removeEventListener('mouseup', handleCanvasMouseUp);
    };
  }, [isPanning, handleCanvasMouseMove, handleCanvasMouseUp]);

  // Função para selecionar uma edge
  const handleEdgeSelect = (edge: Edge) => {
    onEdgeClick?.(edge);
  };

  // Função para atualizar o label da edge
  const handleEdgeLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedEdgeId) {
      const updatedEdges = edges.map(edge =>
        edge.id === selectedEdgeId ? { ...edge, label: e.target.value } : edge
      );
      setEdges(updatedEdges);
    }
  };

  // Função para desfocar input
  const handleEdgeLabelBlur = () => {
    onEdgeClick?.(null);
  };

  // Atualiza o labelOffset da edge ao arrastar o label
  useEffect(() => {
    function handleUpdateEdgeLabelOffset(e: any) {
      const { edgeId, offset } = e.detail;
      const updatedEdges = edges.map((edge: Edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, labelOffset: offset } }
          : edge
      );
      setEdges(updatedEdges);
    }
    window.addEventListener('updateEdgeLabelOffset', handleUpdateEdgeLabelOffset);
    return () => {
      window.removeEventListener('updateEdgeLabelOffset', handleUpdateEdgeLabelOffset);
    };
  }, [edges, setEdges]);

  // Handler para selecionar label para arrasto
  const handleLabelSelect = (edge: Edge) => {
    console.log('handleLabelSelect', edge.id);
    onEdgeClick?.(null);
    setSelectedLabelEdgeId(edge.id);
  };

  // Handler para deselecionar label
  const handleLabelDeselect = () => {
    console.log('handleLabelDeselect');
    onEdgeClick?.(null);
    setSelectedLabelEdgeId(null);
  };

  // Handler para iniciar edição do label
  const handleLabelEdit = (edge: Edge) => {
    console.log('handleLabelEdit', edge.id);
    setEditingLabelEdgeId(edge.id);
    setEditingLabelValue(String(edge.label || ''));
  };

  // Handler para salvar edição do label
  const handleLabelEditSave = () => {
    console.log('handleLabelEditSave', editingLabelEdgeId);
    if (editingLabelEdgeId) {
      const updatedEdges = edges.map(edge =>
        edge.id === editingLabelEdgeId ? { ...edge, label: editingLabelValue } : edge
      );
      setEdges(updatedEdges);
      setEditingLabelEdgeId(null);
      setSelectedLabelEdgeId(null); // Desmarca o label após salvar
    }
  };

  useEffect(() => {
    function handleUpdateEdgeLabel(e: any) {
      const { edgeId, label } = e.detail;
      const updatedEdges = edges.map(edge =>
        edge.id === edgeId ? { ...edge, label } : edge
      );
      setEdges(updatedEdges);
    }
    window.addEventListener('updateEdgeLabel', handleUpdateEdgeLabel);
    return () => {
      window.removeEventListener('updateEdgeLabel', handleUpdateEdgeLabel);
    };
  }, [edges, setEdges]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onEdgeClick?.(null);
    }
  };

  // Handler para hover/click em conector
  const handleConnectorEnter = (nodeId: string, connectorId: string) => {
    setActiveConnector({ nodeId, connectorId });
  };

  const handleConnectorLeave = () => {
    setActiveConnector(null);
  };

  // Handler para iniciar drag
  const handleConnectorMouseDown = useCallback((nodeId: string, connectorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!reactFlowBounds) return;

    const x = (e.clientX - reactFlowBounds.left - position.x) / scale;
    const y = (e.clientY - reactFlowBounds.top - position.y) / scale;
    draggingFromRef.current = { nodeId, connectorId };
    draggingToRef.current = { x, y };
    setIsDraggingConnection(true);
  }, [position, scale]);

  // Handler para iniciar drag de conector da seta
  const handleEdgeConnectorDragStart = useCallback((edgeId: string, end: 'source' | 'target', connector: { nodeId: string; connectorId: string }, event: React.MouseEvent) => {
    event.stopPropagation();
    const edge = edges.find(e => e.id === edgeId);
    if (!edge) return;
    
    setEdgeBackup(edge);
    setDraggingEdgeId(edgeId);
    setDraggingEnd(end);
    draggingFromRef.current = connector;
    
    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!reactFlowBounds) return;
    
    const x = (event.clientX - reactFlowBounds.left - position.x) / scale;
    const y = (event.clientY - reactFlowBounds.top - position.y) / scale;
    
    draggingToRef.current = { x, y };
    setIsDraggingConnection(true);
  }, [edges, position, scale]);

  // Atualiza draggingTo em tempo real durante arraste de ligação e limpa ao soltar
  useEffect(() => {
    if (!isDraggingConnection) return;

    function handleMouseMove(e: MouseEvent) {
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;
      const x = (e.clientX - reactFlowBounds.left - position.x) / scale;
      const y = (e.clientY - reactFlowBounds.top - position.y) / scale;
      draggingToRef.current = { x, y };
      setIsDraggingConnection(v => v); // força re-render
    }

    function handleMouseUp() {
      if (isDraggingConnection) {
        draggingFromRef.current = null;
        draggingToRef.current = null;
        setIsDraggingConnection(false);
      }
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingConnection, position, scale]);

  const handleConnectorDrop = useCallback((nodeId: string, connectorId: string) => {
    setTimeout(() => {
      draggingFromRef.current = null;
      draggingToRef.current = null;
      setIsDraggingConnection(false);
    }, 0);
    console.log('handleConnectorDrop chamado');
    if (draggingEdgeId && draggingEnd && draggingFromRef.current) {
      const updated = edges.map((edge: Edge) => {
        if (edge.id !== draggingEdgeId) return edge;
        if (draggingEnd === 'source') {
          return { ...edge, source: nodeId, data: { ...edge.data, sourceConnector: connectorId } };
        } else {
          return { ...edge, target: nodeId, data: { ...edge.data, targetConnector: connectorId } };
        }
      });
      setEdges(updated);
    }
    setDraggingEdgeId(null);
    setDraggingEnd(null);
    setEdgeBackup(null);
    setActiveConnector(null);
    setForceUpdate(f => f + 1);
  }, [draggingEdgeId, draggingEnd, setEdges, edges]);

  // Exemplo de objeto de ícones
  const nodeIcons = {
    decision: (
      <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" fill="#eab308" />
        <text x="24" y="32" textAnchor="middle" fontSize="22" fill="#fff" fontWeight="bold">?</text>
      </svg>
    ),
    // ... outros tipos
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'start':
        return <StartNodeIcon />;
      case 'end':
        return <EndNodeIcon />;
      case 'funcion':
        return <FunctionNodeIcon />;
      case 'email':
        return <EmailNodeIcon />;
      case 'webhook':
        return <WebhookNodeIcon />;
      case 'decision':
        return <DecisionNodeIcon />;
      case 'loop':
        return <LoopNodeIcon />;
      case 'subprocess':
        return <SubprocessNodeIcon />;
      case 'Database':
        return <DatabaseNodeIcon />;
      case 'api':
        return <ApiNodeIcon />;
      case 'spreadsheet':
        return <SpreadsheetNodeIcon />;
      case 'warning':
        return (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <polygon points="12,3 22,21 2,21" fill="#facc15" stroke="#b45309" strokeWidth="2"/>
            <text x="12" y="18" textAnchor="middle" fontSize="16" fill="#b45309" fontWeight="bold">!</text>
          </svg>
        );
      default:
        return null;
    }
  };

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isNode = target.closest('[id^="node-"]');
    const isConnector = target.id && target.id.includes('-connector-');
    
    if (e.currentTarget === e.target) {
      handleLabelDeselect();
    }
    
    if (isNode || isConnector) return;
    
    if (e.button === 0 || e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setStartPoint({ x: e.clientX, y: e.clientY });
      setStartOffset({ x: position.x, y: position.y });
    }
  }, [position, handleLabelDeselect]);

  const handleConnectionStart = useCallback((nodeId: string, connectorId: string) => {
    setConnectionStart({ nodeId, connectorId });
  }, []);

  const handleConnectionEnd = useCallback((nodeId: string, connectorId: string) => {
    if (connectionStart && connectionStart.nodeId !== nodeId) {
      const newEdge: Edge = {
        id: `edge-${Date.now()}`,
        source: connectionStart.nodeId,
        target: nodeId,
        data: {
          sourceConnector: connectionStart.connectorId,
          targetConnector: connectorId,
        },
      };
      setEdges([...edges, newEdge]);
    }
    setConnectionStart(null);
  }, [connectionStart, edges, setEdges]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      // Verifica se já existe uma conexão entre os nós
      const existingConnection = edges.find(
        (edge) => edge.source === connection.source && edge.target === connection.target
      );

      if (existingConnection) {
        return;
      }

      // Verifica se o nó de destino já tem uma conexão de entrada
      const targetNode = getNode(connection.target!);
      const hasIncomingConnection = edges.some((edge) => edge.target === connection.target);

      if (hasIncomingConnection && targetNode?.type !== 'decision') {
        return;
      }

      const newEdge = {
        ...connection,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#555' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#555',
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
      onConnect?.(connection);
    },
    [edges, getNode, onConnect, setEdges]
  );

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeInternal}
        onEdgesChange={onEdgesChangeInternal}
        onConnect={handleConnect}
        onNodeClick={(_, node) => onNodeClick?.(node)}
        onEdgeClick={(_, edge) => onEdgeClick?.(edge)}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right" className="bg-[#181a1b] text-white p-2 rounded shadow-lg">
          <div className="text-sm">Nodes: {nodes.length}</div>
          <div className="text-sm">Edges: {edges.length}</div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas; 