'use client';

import React, { useEffect, useRef } from 'react';
import { Edge, Node } from '../types/flow';

interface FlowEdgeProps {
  edge: Edge;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  sourcePosition?: { x: number; y: number };
  targetPosition?: { x: number; y: number };
  nodes?: Node[];
  onSelect?: (edge: Edge) => void;
  selected?: boolean;
}

// Tamanho visual do nó (deve bater com o SVG e o CSS)
const NODE_SIZE = 56; // ajuste conforme necessário

const FlowEdge: React.FC<FlowEdgeProps> = ({ edge, canvasRef, sourcePosition, targetPosition, nodes, onSelect, selected }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [points, setPoints] = React.useState<string>('');

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

  // Função ortogonal simples (L/Z)
  function fallbackOrthogonal(start: [number, number], end: [number, number]) {
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

  // Função para calcular a posição do conector baseado no estado do nó
  function getConnectorPosition(node: Node, connectorId: string) {
    // node.position já é o centro do nó
    const { x, y } = node.position;
    switch (connectorId) {
      case 'top': return { x, y: y - NODE_SIZE / 2 };
      case 'right': return { x: x + NODE_SIZE / 2, y };
      case 'bottom': return { x, y: y + NODE_SIZE / 2 };
      case 'left': return { x: x - NODE_SIZE / 2, y };
      default: return { x, y };
    }
  }

  useEffect(() => {
    const sourceConnector = edge.data?.sourceConnector || 'right';
    const targetConnector = edge.data?.targetConnector || 'left';
    // Busca os nós pelo estado
    const sourceNode = nodes?.find(n => n.id === edge.source);
    const targetNode = nodes?.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return;
    // Calcula a posição dos conectores sem depender do DOM
    const start = getConnectorPosition(sourceNode, sourceConnector);
    const end = getConnectorPosition(targetNode, targetConnector);
    // NÃO aplica panning/scale aqui, pois o container já está transformado
    const fallbackPoints = fallbackOrthogonal([start.x, start.y], [end.x, end.y]);
    setPoints(fallbackPoints.map(([x, y]) => `${x},${y}`).join(' '));
  }, [edge.source, edge.target, edge.data?.sourceConnector, edge.data?.targetConnector, nodes]);

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="4"
          refX="5.5"
          refY="2"
          orient="auto"
          className={getEdgeStyle(edge.type)}
        >
          <polygon
            points="0 0, 6 2, 0 4"
            className={getEdgeStyle(edge.type)}
            fill="currentColor"
          />
        </marker>
      </defs>
      <polyline
        points={points}
        className={`${getEdgeStyle(edge.type)} stroke-2 fill-none ${selected ? 'stroke-blue-500 drop-shadow-[0_0_4px_rgba(59,130,246,0.7)]' : ''}`}
        markerEnd="url(#arrowhead)"
        style={{ cursor: 'pointer', pointerEvents: 'all' }}
        onClick={e => {
          e.stopPropagation();
          onSelect?.(edge);
        }}
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