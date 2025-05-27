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

  useEffect(() => {
    const sourceConnector = edge.data?.sourceConnector || 'right';
    const targetConnector = edge.data?.targetConnector || 'left';
    const sourceId = `${edge.source}-connector-${sourceConnector}`;
    const targetId = `${edge.target}-connector-${targetConnector}`;
    const sourceElement = document.getElementById(sourceId);
    const targetElement = document.getElementById(targetId);
    const canvasCurrent = canvasRef.current;
    requestAnimationFrame(() => {
      if (sourceElement && targetElement && canvasCurrent) {
        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const canvasRect = canvasCurrent.getBoundingClientRect();
        // Posição central do conector relativa ao canvas
        let startX = sourceRect.left + sourceRect.width / 2 - canvasRect.left;
        let startY = sourceRect.top + sourceRect.height / 2 - canvasRect.top;
        let endX = targetRect.left + targetRect.width / 2 - canvasRect.left;
        let endY = targetRect.top + targetRect.height / 2 - canvasRect.top;
        // Sempre desenha apenas caminho ortogonal simples (L/Z) para edges
        const fallbackPoints = fallbackOrthogonal([startX, startY], [endX, endY]);
        setPoints(fallbackPoints.map(([x, y]) => `${x},${y}`).join(' '));
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