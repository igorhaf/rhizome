'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Node, NodeType } from '../types/flow';
import FlowNode from './FlowNode';
import FlowEdge from './FlowEdge';
import {
  EndNode,
  FunctionNode,
  SpreadsheetNode,
  StartNode,
  EmailNode,
  DecisionNode,
  LoopNode,
  SubprocessNode,
  DatabaseNode,
  ApiNode,
  WarningNode,
  WebhookNode,
  ScheduleNode
} from './nodes';
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
import type { Edge } from 'reactflow';

// Add custom styles to hide ReactFlow attribution
const customStyles = `
  .react-flow__attribution {
    display: none !important;
  }
  .react-flow__node,
  .react-flow__node-default,
  .react-flow__node[data-type],
  .react-flow__node[data-type='decision'],
  .react-flow__node[data-type='api'],
  .react-flow__node[data-type='loop'],
  .react-flow__node[data-type='webhook'],
  .react-flow__node[data-type='email'],
  .react-flow__node[data-type='subprocess'],
  .react-flow__node[data-type='Database'],
  .react-flow__node[data-type='warning'] {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
`;

interface FlowCanvasProps {
  nodes?: Node[];
  edges?: Edge[];
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
  onNodeAdd?: (nodeData: Partial<Node>, position: { x: number; y: number }) => void;
  onNodeDoubleClick?: (node: Node) => void;
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
  schedule: ScheduleNode,
};

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
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
  onNodeDoubleClick,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  // Se nodes/edges são passados como props, use-os; senão, use estado local
  const [localNodes, setLocalNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [localEdges, setLocalEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);
  const renderNodes = nodes ?? localNodes;
  const renderEdges = edges ?? localEdges;
  const { getIntersectingNodes, getNode, project } = useReactFlow();
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [startOffset, setStartOffset] = useState<{ x: number; y: number } | null>(null);
  const [scale, setScale] = useState(0.7);
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
  const [isDragOver, setIsDragOver] = useState(false);

  // Debug visual
  const [debugInfo, setDebugInfo] = useState({
    lastType: '',
    lastDrop: '',
    overlay: false,
    lastEvent: '',
  });

  React.useEffect(() => {
    setDebugInfo((info) => ({ ...info, overlay: isDragOver }));
  }, [isDragOver]);

  // Diagnóstico: Adiciona um nó fixo ao montar
  React.useEffect(() => {
    setLocalNodes((nds) => {
      if (nds.length === 0) {
        return [
          ...nds,
          {
            id: 'diagnostic-node',
            type: 'start',
            position: { x: 100, y: 100 },
            data: { label: 'Diagnóstico', description: 'Nó de teste' },
          },
        ];
      }
      return nds;
    });
  }, [setLocalNodes]);

  // Diagnóstico: log nodeTypes
  console.log('[DEBUG] nodeTypes:', nodeTypes);

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

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    setDebugInfo((info) => ({ ...info, lastEvent: 'drop', overlay: false }));
    
    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!reactFlowBounds) return;
    
    let nodeData;
    try {
      const data = event.dataTransfer.getData('application/json');
      setDebugInfo((info) => ({ ...info, lastDrop: data }));
      if (!data) return;
      nodeData = JSON.parse(data);
    } catch (error) {
      return;
    }
    const type = nodeData.type || 'start';
    setDebugInfo((info) => ({ ...info, lastType: type }));
    // Corrigir posição usando project do ReactFlow
    const pos = project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    if (onNodeAdd) {
      onNodeAdd({ type, data: nodeData }, pos);
    } else {
      // Corrige headers se vier como objeto vazio
      if (nodeData.headers && !Array.isArray(nodeData.headers)) {
        nodeData.headers = [];
      }
      setLocalNodes((nds) => [
        ...nds,
        {
          id: `node-${Date.now()}`,
          type,
          position: pos,
          data: nodeData,
        },
      ]);
    }
  }, [onNodeAdd, setLocalNodes, project]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) setIsDragOver(true);
    setDebugInfo((info) => ({ ...info, lastEvent: 'dragOver', overlay: true }));
  }, [isDragOver]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    setDebugInfo((info) => ({ ...info, lastEvent: 'dragLeave', overlay: false }));
  }, []);

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
      const updatedEdges = renderEdges.map(edge =>
        edge.id === selectedEdgeId ? { ...edge, label: e.target.value } : edge
      );
      setLocalEdges(updatedEdges);
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
      const updatedEdges = renderEdges.map((edge: Edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, labelOffset: offset } }
          : edge
      );
      setLocalEdges(updatedEdges);
    }
    window.addEventListener('updateEdgeLabelOffset', handleUpdateEdgeLabelOffset);
    return () => {
      window.removeEventListener('updateEdgeLabelOffset', handleUpdateEdgeLabelOffset);
    };
  }, [renderEdges, setLocalEdges]);

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
      const updatedEdges = renderEdges.map(edge =>
        edge.id === editingLabelEdgeId ? { ...edge, label: editingLabelValue } : edge
      );
      setLocalEdges(updatedEdges);
      setEditingLabelEdgeId(null);
      setSelectedLabelEdgeId(null); // Desmarca o label após salvar
    }
  };

  useEffect(() => {
    function handleUpdateEdgeLabel(e: any) {
      const { edgeId, label } = e.detail;
      const updatedEdges = renderEdges.map(edge =>
        edge.id === edgeId ? { ...edge, label } : edge
      );
      setLocalEdges(updatedEdges);
    }
    window.addEventListener('updateEdgeLabel', handleUpdateEdgeLabel);
    return () => {
      window.removeEventListener('updateEdgeLabel', handleUpdateEdgeLabel);
    };
  }, [renderEdges, setLocalEdges]);

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
    const edge = renderEdges.find(e => e.id === edgeId);
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
  }, [renderEdges, position, scale]);

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
      const updated = renderEdges.map((edge: Edge) => {
        if (edge.id !== draggingEdgeId) return edge;
        if (draggingEnd === 'source') {
          return { ...edge, source: nodeId, data: { ...edge.data, sourceConnector: connectorId } };
        } else {
          return { ...edge, target: nodeId, data: { ...edge.data, targetConnector: connectorId } };
        }
      });
      setLocalEdges(updated);
    }
    setDraggingEdgeId(null);
    setDraggingEnd(null);
    setEdgeBackup(null);
    setActiveConnector(null);
    setForceUpdate(f => f + 1);
  }, [draggingEdgeId, draggingEnd, setLocalEdges, renderEdges]);

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
        return <ApiNodeIcon/>;
      case 'warning':
        return (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <polygon points="12,3 22,21 2,21" fill="#facc15" stroke="#b45309" strokeWidth="2"/>
            <text x="12" y="18" textAnchor="middle" fontSize="16" fill="#b45309" fontWeight="bold">!</text>
          </svg>
        );
      case 'schedule':
        return (
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" fill="#eab308" />
            <text x="24" y="32" textAnchor="middle" fontSize="22" fill="#fff" fontWeight="bold">?</text>
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
      setLocalEdges([...renderEdges, newEdge]);
    }
    setConnectionStart(null);
  }, [connectionStart, renderEdges, setLocalEdges]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      // Verifica se já existe uma conexão entre os nós
      const existingConnection = renderEdges.find(
        (edge) => edge.source === connection.source && edge.target === connection.target
      );

      if (existingConnection) {
        return;
      }

      // Verifica se o nó de destino já tem uma conexão de entrada
      const targetNode = getNode(connection.target!);
      const hasIncomingConnection = renderEdges.some((edge) => edge.target === connection.target);

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

      setLocalEdges((eds) => addEdge(newEdge, eds));
      onConnect?.(connection);
    },
    [renderEdges, getNode, onConnect, setLocalEdges]
  );

  // Ajustar tipo e estilo das edges definitivas
  const getEdgeType = (edge: Edge) => {
    if ((edge as any).animatedDragging) {
      return 'smoothstep';
    }
    return 'smoothstep';
  };
  const getEdgeStyle = (edge: Edge) => {
    if ((edge as any).animatedDragging) {
      return { stroke: '#38bdf8', strokeWidth: 2 };
    }
    return { strokeDasharray: '6 3', stroke: '#555', strokeWidth: 2 };
  };

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      <style>{customStyles}</style>
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 z-50 pointer-events-none flex items-center justify-center">
          <span className="text-blue-700 text-lg font-bold">Solte aqui para criar o nó</span>
        </div>
      )}
      {/* Painel de debug visual */}
      <div className="fixed bottom-2 right-2 bg-black bg-opacity-80 text-green-300 text-xs rounded p-3 z-[1000] shadow-lg max-w-xs w-72">
        <div className="font-bold text-green-400 mb-1">Debug FlowCanvas</div>
        <div><b>Último tipo:</b> {debugInfo.lastType}</div>
        <div><b>Último drop:</b> {debugInfo.lastDrop}</div>
        <div><b>Status overlay:</b> {debugInfo.overlay ? 'Ativo' : 'Inativo'}</div>
        <div><b>Último evento:</b> {debugInfo.lastEvent}</div>
      </div>
      <ReactFlow
        nodes={renderNodes}
        edges={renderEdges.map(e => ({
          ...e,
          type: getEdgeType(e),
          animated: !(e as any).animatedDragging,
          style: getEdgeStyle(e),
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#555',
          },
        }))}
        onNodesChange={onNodesChange ?? onNodesChangeInternal}
        onEdgesChange={onEdgesChange ?? onEdgesChangeInternal}
        onConnect={handleConnect}
        onNodeClick={(_, node) => onNodeClick?.(node)}
        onNodeDoubleClick={(_, node) => onNodeDoubleClick?.(node)}
        onEdgeClick={(_, edge) => onEdgeClick?.(edge)}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
      >
        <Background />
        <Controls />
        <Panel position="top-right" className="bg-[#181a1b] text-white p-2 rounded shadow-lg">
          <div className="text-sm">Nodes: {renderNodes.length}</div>
          <div className="text-sm">Edges: {renderEdges.length}</div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas; 