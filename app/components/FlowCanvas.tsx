'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Node, Edge, NodeType } from '../types/flow';
import FlowNode from './FlowNode';
import FlowEdge from './FlowEdge';

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  onNodeClick?: (node: Node) => void;
  selectedNode?: Node | null;
  selectedEdgeId?: string | null;
  onEdgeSelect?: (edgeId: string | null) => void;
  setSelectedNode?: (node: Node | null) => void;
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

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  selectedNode,
  selectedEdgeId,
  onEdgeSelect,
  setSelectedNode,
  onNodeDoubleClick,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [startOffset, setStartOffset] = useState<{ x: number; y: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState<{ nodeId: string; connectorId: string } | null>(null);
  const [tempEdge, setTempEdge] = useState<{ x: number; y: number } | null>(null);
  const [selectedLabelEdgeId, setSelectedLabelEdgeId] = useState<string | null>(null);
  const [editingLabelEdgeId, setEditingLabelEdgeId] = useState<string | null>(null);
  const [editingLabelValue, setEditingLabelValue] = useState<string>('');
  // Ref para throttle do preview da seta
  const lastPreviewUpdateRef = useRef(0);
  const lastPreviewPosRef = useRef<{x: number, y: number} | null>(null);
  // Estado para drag de edge
  const [draggingEdgeId, setDraggingEdgeId] = useState<string | null>(null);
  const [draggingEnd, setDraggingEnd] = useState<'source' | 'target' | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<{ nodeId: string; connectorId: string } | null>(null);
  const [draggingTo, setDraggingTo] = useState<{ x: number; y: number } | null>(null);
  const [dragOverConnector, setDragOverConnector] = useState<{ nodeId: string; connectorId: string } | null>(null);
  const [edgeBackup, setEdgeBackup] = useState<Edge | null>(null);
  const [viewport, setViewport] = React.useState({ x: 0, y: 0, zoom: 1 });
  // Estado para seleção e ligação de conectores
  const [activeConnector, setActiveConnector] = useState<{ nodeId: string; connectorId: string } | null>(null);

  const getMousePosition = useCallback((event: MouseEvent) => {
    const container = canvasRef.current;
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
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Posição do mouse relativa ao canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setScale((prevScale) => {
      let newScale = prevScale - delta * 0.001;
      newScale = Math.min(Math.max(0.1, newScale), 2);
      setPosition((prevPos) => {
        // Corrigir cálculo: posição do mouse no mundo antes do zoom
        const worldX = (mouseX - prevPos.x) / prevScale;
        const worldY = (mouseY - prevPos.y) / prevScale;
        // Nova posição para manter o ponto do mouse fixo
        return {
          x: mouseX - worldX * newScale,
          y: mouseY - worldY * newScale,
        };
      });
      return newScale;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType') as NodeType;
    if (!nodeType) return;

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const x = (e.clientX - canvasRect.left - position.x) / scale;
    const y = (e.clientY - canvasRect.top - position.y) / scale;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: nodeType,
      position: { x, y },
      data: {
        label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`,
        description: `This is a ${nodeType} node`,
      },
    };

    onNodesChange([...nodes, newNode]);
  }, [nodes, onNodesChange, position, scale]);

  const handleConnectionStart = useCallback((nodeId: string, connectorId: string) => {
    setIsPanning(false);
    setConnectionStart({ nodeId, connectorId });
    setDraggingFrom({ nodeId, connectorId });
  }, []);

  const handleConnectionEnd = useCallback((nodeId: string, connectorId: string) => {
    if (connectionStart && connectionStart.nodeId !== nodeId) {
      // Verifica se já existe uma conexão entre estes nós
      const existingEdge = edges.find(
        edge => 
          (edge.source === connectionStart.nodeId && edge.target === nodeId) ||
          (edge.source === nodeId && edge.target === connectionStart.nodeId)
      );

      if (!existingEdge) {
        const newEdge: Edge = {
          id: `edge-${Date.now()}`,
          source: connectionStart.nodeId,
          target: nodeId,
          type: 'default',
          data: {
            sourceConnector: connectionStart.connectorId,
            targetConnector: connectorId,
          },
        };
        onEdgesChange([...edges, newEdge]);
      }
    }
    setConnectionStart(null);
    setTempEdge(null);
    setDraggingFrom(null);
    setDraggingTo(null);
  }, [connectionStart, edges, onEdgesChange]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingEdgeId && draggingEnd && draggingFrom) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left - position.x) / scale;
      const y = (e.clientY - rect.top - position.y) / scale;
      setDraggingTo({ x, y });
    }
    // mantém pan/preview
    if (isDragging && draggingTo) {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;
      const x = (e.clientX - canvasRect.left - position.x) / scale;
      const y = (e.clientY - canvasRect.top - position.y) / scale;
      setDraggingTo({ x, y });
      setTempEdge({ x, y });
    }
  }, [draggingEdgeId, draggingEnd, draggingFrom, position, scale, isDragging, draggingTo]);

  const handleCanvasMouseUp = useCallback((e: React.MouseEvent) => {
    if (draggingEdgeId && edgeBackup) {
      // Restaura a seta original se não existir
      const exists = edges.some((ed: Edge) => ed.id === edgeBackup.id);
      if (!exists) {
        onEdgesChange([...edges, edgeBackup]);
      }
    }
    setDraggingEdgeId(null);
    setDraggingEnd(null);
    setDraggingFrom(null);
    setDraggingTo(null);
    setEdgeBackup(null);
    setIsDragging(false);
    setActiveConnector(null);
    setTempEdge(null);
  }, [draggingEdgeId, edgeBackup, onEdgesChange, edges]);

  React.useEffect(() => {
    // Só ativa panning global se NÃO estiver em drag de conexão
    if (!isPanning || !startPoint || !startOffset || connectionStart) return;
    const handleMove = (e: MouseEvent) => {
      // Proteção extra: nunca panning durante drag de conexão
      if (connectionStart) return;
      const dx = e.clientX - startPoint.x;
      const dy = e.clientY - startPoint.y;
      const sidebarWidth = 240;
      const canvasWidth = canvasRef.current?.clientWidth || 0;
      let newX = startOffset.x + dx;
      setPosition({
        x: newX,
        y: startOffset.y + dy,
      });
    };
    const handleUp = () => {
      setIsPanning(false);
      setStartPoint(null);
      setStartOffset(null);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isPanning, startPoint, startOffset, connectionStart]);

  // Remover o useEffect que estava causando conflito
  React.useEffect(() => {
    if (!connectionStart) return;
    const handleUp = () => {
      setTempEdge(null);
      setConnectionStart(null);
    };
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
    };
  }, [connectionStart]);

  // Função para selecionar uma edge
  const handleEdgeSelect = (edge: Edge) => {
    onEdgeSelect?.(edge.id);
    setSelectedNode?.(null);
  };

  // Função para atualizar o label da edge
  const handleEdgeLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedEdgeId) {
      const updatedEdges = edges.map(edge =>
        edge.id === selectedEdgeId ? { ...edge, label: e.target.value } : edge
      );
      onEdgesChange(updatedEdges);
    }
  };

  // Função para desfocar input
  const handleEdgeLabelBlur = () => {
    onEdgeSelect?.(null);
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
      onEdgesChange(updatedEdges);
    }
    window.addEventListener('updateEdgeLabelOffset', handleUpdateEdgeLabelOffset);
    return () => {
      window.removeEventListener('updateEdgeLabelOffset', handleUpdateEdgeLabelOffset);
    };
  }, [onEdgesChange]);

  // Handler para selecionar label para arrasto
  const handleLabelSelect = (edge: Edge) => {
    console.log('handleLabelSelect', edge.id);
    onEdgeSelect?.(null);
    setSelectedLabelEdgeId(edge.id);
  };

  // Handler para deselecionar label
  const handleLabelDeselect = () => {
    console.log('handleLabelDeselect');
    onEdgeSelect?.(null);
    setSelectedLabelEdgeId(null);
  };

  // Handler para iniciar edição do label
  const handleLabelEdit = (edge: Edge) => {
    console.log('handleLabelEdit', edge.id);
    setEditingLabelEdgeId(edge.id);
    setEditingLabelValue(edge.label || '');
  };

  // Handler para salvar edição do label
  const handleLabelEditSave = () => {
    console.log('handleLabelEditSave', editingLabelEdgeId);
    if (editingLabelEdgeId) {
      const updatedEdges = edges.map(edge =>
        edge.id === editingLabelEdgeId ? { ...edge, label: editingLabelValue } : edge
      );
      onEdgesChange(updatedEdges);
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
      onEdgesChange(updatedEdges);
    }
    window.addEventListener('updateEdgeLabel', handleUpdateEdgeLabel);
    return () => {
      window.removeEventListener('updateEdgeLabel', handleUpdateEdgeLabel);
    };
  }, [edges, onEdgesChange]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedNode?.(null);
      onEdgeSelect?.(null);
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
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const x = (e.clientX - canvasRect.left - position.x) / scale;
    const y = (e.clientY - canvasRect.top - position.y) / scale;
    setIsDragging(true);
    setDraggingTo({ x, y });
    setActiveConnector({ nodeId, connectorId });
    setTempEdge({ x, y });
  }, [position, scale]);

  // Iniciar drag de conector da seta
  const handleEdgeConnectorDragStart = useCallback((edgeId: string, end: 'source' | 'target', connector: { nodeId: string; connectorId: string }, event: React.MouseEvent) => {
    event.stopPropagation();
    const edge = edges.find(e => e.id === edgeId);
    if (!edge) return;
    setEdgeBackup(edge); // Salva o estado original
    setDraggingEdgeId(edgeId);
    setDraggingEnd(end);
    setDraggingFrom(connector);
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    const x = (event.clientX - canvasRect.left - position.x) / scale;
    const y = (event.clientY - canvasRect.top - position.y) / scale;
    setDraggingTo({ x, y });
  }, [edges, position, scale]);

  // Mouse up sobre conector válido
  const handleConnectorDrop = useCallback((nodeId: string, connectorId: string) => {
    if (draggingEdgeId && draggingEnd && draggingFrom) {
      const updated = edges.map((edge: Edge) => {
        if (edge.id !== draggingEdgeId) return edge;
        if (draggingEnd === 'source') {
          return { ...edge, source: nodeId, data: { ...edge.data, sourceConnector: connectorId } };
        } else {
          return { ...edge, target: nodeId, data: { ...edge.data, targetConnector: connectorId } };
        }
      });
      onEdgesChange(updated);
    }
    setDraggingEdgeId(null);
    setDraggingEnd(null);
    setDraggingFrom(null);
    setDraggingTo(null);
    setEdgeBackup(null);
    setActiveConnector(null);
  }, [draggingEdgeId, draggingEnd, draggingFrom, onEdgesChange, edges]);

  return (
    <div
      ref={canvasRef}
      className={`w-full h-full bg-[#1e2228] overflow-hidden select-none relative ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{}}
      onWheel={handleWheel}
      onMouseDown={e => {
        if (connectionStart) return;
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
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
    >
      {/* Botão de debug para resetar interação */}
      <button
        style={{ position: 'absolute', top: 8, right: 8, zIndex: 1000, background: '#23272e', color: '#fff', border: '1px solid #444', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}
        onClick={() => {
          setTempEdge(null);
          setConnectionStart(null);
          setIsPanning(false);
          setStartPoint(null);
          setStartOffset(null);
        }}
      >Resetar Interação</button>
      {/* Grid de fundo SVG infinito */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: '40000px',
          height: '40000px',
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          zIndex: 1,
        }}
        onClick={handleCanvasClick}
      >
        {/* Grid de fundo SVG infinito agora dentro do container escalado */}
        <svg
          width="40000"
          height="40000"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          <defs>
            <pattern
              id="smallGrid"
              width={32 * scale}
              height={32 * scale}
              patternUnits="userSpaceOnUse"
              patternTransform={`translate(${position.x % (32 * scale)},${position.y % (32 * scale)})`}
            >
              <path d={`M ${32 * scale} 0 L 0 0 0 ${32 * scale}`} fill="none" stroke="#23272e" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="40000" height="40000" fill="url(#smallGrid)" />
        </svg>
        {/* SVG das edges agora DENTRO do container escalado */}
        <svg
          width="40000"
          height="40000"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="4"
              refX="5.5"
              refY="2"
              orient="auto"
              className="stroke-gray-500"
            >
              <polygon points="0 0, 6 2, 0 4" className="fill-gray-500" />
            </marker>
          </defs>
          {edges.map((edge) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            return (
              <FlowEdge
                key={edge.id}
                edge={edge}
                canvasRef={canvasRef}
                sourcePosition={sourceNode?.position}
                targetPosition={targetNode?.position}
                nodes={nodes}
                onSelect={() => {
                  handleLabelDeselect();
                  handleEdgeSelect(edge);
                }}
                selected={selectedEdgeId === edge.id}
                labelSelected={selectedLabelEdgeId === edge.id}
                onLabelSelect={() => handleLabelSelect(edge)}
                onLabelDeselect={handleLabelDeselect}
                onLabelEdit={() => handleLabelEdit(edge)}
                editingLabel={editingLabelEdgeId === edge.id}
                editingLabelValue={editingLabelValue}
                setEditingLabelValue={setEditingLabelValue}
                onLabelEditSave={handleLabelEditSave}
                handleConnectorEnter={handleConnectorEnter}
                handleConnectorLeave={handleConnectorLeave}
                handleConnectorMouseDown={handleConnectorMouseDown}
                activeConnector={activeConnector}
                draggingFrom={draggingFrom}
                draggingTo={draggingTo}
                handleEdgeConnectorDragStart={handleEdgeConnectorDragStart}
              />
            );
          })}
          {/* Linha fantasma durante drag de edge */}
          {isDragging && draggingTo && activeConnector && (
            (() => {
              const sourceNode = nodes.find(n => n.id === activeConnector.nodeId);
              if (!sourceNode) return null;
              const { x, y } = sourceNode.position;
              const size = 56;
              let fromPos;
              switch (activeConnector.connectorId) {
                case 'top': fromPos = { x, y: y - size / 2 }; break;
                case 'right': fromPos = { x: x + size / 2, y }; break;
                case 'bottom': fromPos = { x, y: y + size / 2 }; break;
                case 'left': fromPos = { x: x - size / 2, y }; break;
                default: fromPos = { x, y }; break;
              }
              return (
                <polyline
                  points={`${fromPos.x},${fromPos.y} ${draggingTo.x},${draggingTo.y}`}
                  className="stroke-blue-400 stroke-2 fill-none pointer-events-none"
                  style={{ zIndex: 9999 }}
                  markerEnd="url(#arrowhead)"
                />
              );
            })()
          )}
        </svg>
        {tempEdge && connectionStart && (
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1000 }}
          >
            <defs>
              <marker
                id="temp-arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  className="fill-gray-500"
                />
              </marker>
            </defs>
            {(() => {
              const sourceNode = nodes.find(n => n.id === connectionStart.nodeId);
              if (!sourceNode) return null;

              const connectorId = connectionStart.connectorId;
              const connectorElement = document.getElementById(`${sourceNode.id}-connector-${connectorId}`);
              if (!connectorElement) return null;
              const connectorRect = connectorElement.getBoundingClientRect();
              const canvasRect = canvasRef.current?.getBoundingClientRect();
              if (!canvasRect) return null;
              const startX = connectorRect.left + connectorRect.width / 2 - canvasRect.left;
              const startY = connectorRect.top + connectorRect.height / 2 - canvasRect.top;

              // Sempre desenha apenas caminho ortogonal simples (L/Z) no preview
              const fallbackPoints = fallbackOrthogonal([startX, startY], [tempEdge.x, tempEdge.y]);
              const pointsStr = fallbackPoints.map(([x, y]) => `${x},${y}`).join(' ');
              return (
                <polyline
                  points={pointsStr}
                  className="stroke-gray-500 stroke-2 fill-none stroke-dasharray-4"
                  markerEnd="url(#temp-arrowhead)"
                />
              );
            })()}
          </svg>
        )}
        {nodes.map((node) => (
          <FlowNode
            key={node.id}
            node={node}
            onPositionChange={(newPosition) => {
              const limitedPosition = {
                x: Math.max(newPosition.x, 0),
                y: Math.max(newPosition.y, 0)
              };
              const updatedNodes = nodes.map((n) =>
                n.id === node.id ? { ...n, position: limitedPosition } : n
              );
              onNodesChange(updatedNodes);
            }}
            onConnectionStart={handleConnectionStart}
            onConnectionEnd={handleConnectionEnd}
            onClick={() => {
              handleLabelDeselect();
              setSelectedNode?.(node);
              onEdgeSelect?.(null);
              onNodeClick?.(node);
            }}
            onDoubleClick={() => {
              if (typeof onNodeDoubleClick === 'function') {
                onNodeDoubleClick(node);
              }
            }}
            selected={selectedNode?.id === node.id}
            handleConnectorEnter={handleConnectorEnter}
            handleConnectorLeave={handleConnectorLeave}
            handleConnectorMouseDown={handleConnectorMouseDown}
            activeConnector={activeConnector}
            draggingFrom={draggingFrom}
            draggingTo={draggingTo}
            draggingEdgeId={draggingEdgeId}
            draggingEnd={draggingEnd}
            handleConnectorDrop={handleConnectorDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default FlowCanvas; 