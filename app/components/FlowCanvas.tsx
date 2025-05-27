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
  // Ref para throttle do preview da seta
  const lastPreviewUpdateRef = useRef(0);
  const lastPreviewPosRef = useRef<{x: number, y: number} | null>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    setScale((prevScale) => {
      const newScale = prevScale - delta * 0.001;
      return Math.min(Math.max(0.1, newScale), 2);
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
  }, []);

  const handleConnectionEnd = useCallback((nodeId: string, connectorId: string) => {
    if (connectionStart && connectionStart.nodeId !== nodeId) {
      // Permitir todas as conexões, exceto ida e volta entre os mesmos conectores
      const bidirectionalExists = edges.some(
        edge =>
          edge.source === nodeId &&
          edge.target === connectionStart.nodeId &&
          edge.data?.sourceConnector === connectorId &&
          edge.data?.targetConnector === connectionStart.connectorId
      );

      if (!bidirectionalExists) {
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
  }, [connectionStart, edges, onEdgesChange]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (connectionStart && !isPanning) {
        const now = Date.now();
        if (now - lastPreviewUpdateRef.current < 100) return; // throttle 100ms
        const container = canvasRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const x = (e.clientX - rect.left - position.x) / scale;
          const y = (e.clientY - rect.top - position.y) / scale;
          // Só atualiza se mudou mais de 5px
          const last = lastPreviewPosRef.current;
          if (last && Math.abs(x - last.x) < 5 && Math.abs(y - last.y) < 5) return;
          lastPreviewUpdateRef.current = now;
          lastPreviewPosRef.current = { x, y };
          setTempEdge({ x, y });
        }
      }
    },
    [connectionStart, position, scale, isPanning]
  );

  const handleMouseUp = useCallback(() => {
    // Sempre limpa estados de interação
    setTempEdge(null);
    setConnectionStart(null);
    setIsPanning(false);
    setStartPoint(null);
    setStartOffset(null);
  }, []);

  React.useEffect(() => {
    // Só ativa panning global se NÃO estiver em drag de conexão
    if (!isPanning || !startPoint || !startOffset || connectionStart) return;
    const handleMove = (e: MouseEvent) => {
      // Proteção extra: nunca panning durante drag de conexão
      if (connectionStart) return;
      const dx = e.clientX - startPoint.x;
      const dy = e.clientY - startPoint.y;
      setPosition({
        x: startOffset.x + dx,
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

  // Listener global para garantir que drag de conexão sempre termina
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

  return (
    <div
      ref={canvasRef}
      className={`w-full h-full bg-[#1e2228] overflow-hidden select-none relative ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{}}
      onWheel={handleWheel}
      onMouseDown={e => {
        // Só bloqueia panning se estiver realmente em drag de conexão
        if (connectionStart) return;
        // Não inicia panning se clicar em nó ou conector
        const target = e.target as HTMLElement;
        const isNode = target.closest('[id^="node-"]');
        const isConnector = target.id && target.id.includes('-connector-');
        if (isNode || isConnector) return;
        if (e.button === 0 || e.button === 1 || (e.button === 0 && e.altKey)) {
          setIsPanning(true);
          setStartPoint({ x: e.clientX, y: e.clientY });
          setStartOffset({ x: position.x, y: position.y });
        }
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
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
      <svg
        className="absolute top-0 left-0 w-full h-full"
        style={{ zIndex: 0, pointerEvents: 'none' }}
        width="100%"
        height="100%"
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
        <rect width="100%" height="100%" fill="url(#smallGrid)" />
      </svg>
      <div
        className="absolute top-0 left-0"
        style={{
          width: '40000px',
          height: '40000px',
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          zIndex: 1,
        }}
      >
        {/* SVG das edges agora dentro do container transformado */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
              className="stroke-gray-500"
            >
              <polygon points="0 0, 10 3.5, 0 7" className="fill-gray-500" />
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
              />
            );
          })}
        </svg>
        {tempEdge && connectionStart && (
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: -1 }}
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
              const updatedNodes = nodes.map((n) =>
                n.id === node.id ? { ...n, position: newPosition } : n
              );
              onNodesChange(updatedNodes);
            }}
            onConnectionStart={handleConnectionStart}
            onConnectionEnd={handleConnectionEnd}
            onClick={() => onNodeClick?.(node)}
          />
        ))}
      </div>
    </div>
  );
};

export default FlowCanvas; 