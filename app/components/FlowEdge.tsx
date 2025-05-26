'use client';

import React, { useEffect, useRef } from 'react';
import { Edge, Node } from '../types/flow';

interface FlowEdgeProps {
  edge: Edge;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  sourcePosition?: { x: number; y: number };
  targetPosition?: { x: number; y: number };
  nodes?: Node[];
}

const FlowEdge: React.FC<FlowEdgeProps> = ({ edge, canvasRef, sourcePosition, targetPosition, nodes }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [points, setPoints] = React.useState<string>('');

  // LOG: Render do FlowEdge
  console.log('[FlowEdge] Render', { edge, canvasRef });

  const getEdgeStyle = (type: Edge['type']) => {
    switch (type) {
      case 'success':
        return 'stroke-green-500';
      case 'error':
        return 'stroke-red-500';
      case 'conditional':
        return 'stroke-yellow-500';
      default:
        return 'stroke-gray-500';
    }
  };

  // Função utilitária: grid, obstáculos e BFS ortogonal
  function findOrthogonalPathAvoidingNodes(start: [number, number], end: [number, number], nodeRects: DOMRect[], gridSize = 20) {
    // Limites do canvas
    const minX = 0, minY = 0, maxX = 4000, maxY = 4000;
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
    // BFS
    const startCell: [number, number] = toCell(start[0], start[1]);
    const queue: Array<[[number, number], [number, number][]]> = [[startCell, [startCell]]];
    const visited = new Set<string>();
    const endCell = toCell(end[0], end[1]);
    while (queue.length) {
      const [cell, path] = queue.shift()!;
      const key = `${cell[0]},${cell[1]}`;
      if (visited.has(key)) continue;
      visited.add(key);
      if (cell[0] === endCell[0] && cell[1] === endCell[1]) {
        return path.map(toCoord);
      }
      // 4 direções ortogonais
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = cell[0] + dx, ny = cell[1] + dy;
        if (nx < minX || ny < minY || nx > maxX || ny > maxY) continue;
        const nkey = `${nx},${ny}`;
        if (obstacles.has(nkey)) continue;
        queue.push([[nx, ny], [...path, [nx, ny]]]);
      }
    }
    // fallback: caminho ortogonal (L/Z)
    const [sx, sy] = start;
    const [ex, ey] = end;
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

  useEffect(() => {
    // LOG: useEffect rodou
    console.log('[FlowEdge] useEffect rodou', { edge });
    const sourceConnector = edge.data?.sourceConnector || 'right';
    const targetConnector = edge.data?.targetConnector || 'left';
    const sourceId = `${edge.source}-connector-${sourceConnector}`;
    const targetId = `${edge.target}-connector-${targetConnector}`;
    const sourceElement = document.getElementById(sourceId);
    const targetElement = document.getElementById(targetId);
    const canvasCurrent = canvasRef.current;
    // LOG: IDs buscados e existência dos elementos
    console.log('[FlowEdge] IDs e existência', {
      sourceId,
      targetId,
      sourceElementExists: !!sourceElement,
      targetElementExists: !!targetElement,
      canvasCurrentExists: !!canvasCurrent,
    });
    requestAnimationFrame(() => {
      if (sourceElement && targetElement && canvasCurrent) {
        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const canvasRect = canvasCurrent.getBoundingClientRect();
        // LOG: bounding box do node e do conector
        const sourceNodeId = sourceElement.parentElement?.id;
        const targetNodeId = targetElement.parentElement?.id;
        const sourceNodeRect = sourceNodeId ? document.getElementById(sourceNodeId)?.getBoundingClientRect() : undefined;
        const targetNodeRect = targetNodeId ? document.getElementById(targetNodeId)?.getBoundingClientRect() : undefined;
        console.log('[FlowEdge] bounding rects', {
          sourceNodeId,
          targetNodeId,
          sourceRect,
          targetRect,
          sourceNodeRect,
          targetNodeRect,
          canvasRect,
        });
        // Posição central do conector relativa ao canvas
        let startX = sourceRect.left + sourceRect.width / 2 - canvasRect.left;
        let startY = sourceRect.top + sourceRect.height / 2 - canvasRect.top;
        let endX = targetRect.left + targetRect.width / 2 - canvasRect.left;
        let endY = targetRect.top + targetRect.height / 2 - canvasRect.top;
        // LOG: coordenadas finais
        console.log('[FlowEdge] coordenadas finais', {
          startX,
          startY,
          endX,
          endY,
        });
        // Obstáculos: todos os nós menos source e target
        let nodeRects: DOMRect[] = [];
        if (nodes) {
          nodeRects = nodes
            .filter(n => n.id !== edge.source && n.id !== edge.target)
            .map(n => {
              const el = document.getElementById(n.id);
              return el ? el.getBoundingClientRect() : null;
            })
            .filter(Boolean) as DOMRect[];
        }
        const pathPoints = findOrthogonalPathAvoidingNodes([startX, startY], [endX, endY], nodeRects);
        setPoints(pathPoints.map(([x, y]) => `${x},${y}`).join(' '));
      } else {
        // LOG de erro explícito
        console.error('[FlowEdge] Elemento faltando', {
          sourceElement,
          targetElement,
          canvasCurrent,
          sourceId,
          targetId
        });
      }
    });
  }, [edge.source, edge.target, edge.data?.sourceConnector, edge.data?.targetConnector, canvasRef, sourcePosition, targetPosition, nodes]);

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          className={getEdgeStyle(edge.type)}
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            className={getEdgeStyle(edge.type)}
            fill="currentColor"
          />
        </marker>
      </defs>
      <polyline
        points={points}
        className={`${getEdgeStyle(edge.type)} stroke-2 fill-none`}
        markerEnd="url(#arrowhead)"
      />
      {edge.label && (
        <text
          x={points.split(' ')[1]?.split(',')[0] || 0}
          y={points.split(' ')[1]?.split(',')[1] || 0}
          className="text-sm fill-gray-700"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {edge.label}
        </text>
      )}
    </svg>
  );
};

export default FlowEdge; 