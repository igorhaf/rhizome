'use client';

import React, { useEffect, useRef } from 'react';
import { Edge } from '../types/flow';

interface FlowEdgeProps {
  edge: Edge;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  sourcePosition?: { x: number; y: number };
  targetPosition?: { x: number; y: number };
}

const FlowEdge: React.FC<FlowEdgeProps> = ({ edge, canvasRef, sourcePosition, targetPosition }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [path, setPath] = React.useState('');

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
        // Calculate control points for a smoother curve
        const dx = endX - startX;
        const dy = endY - startY;
        let controlPointX, controlPointY;
        if (sourceConnector === 'right' && targetConnector === 'left') {
          controlPointX = startX + dx / 2;
          controlPointY = startY;
        } else if (sourceConnector === 'left' && targetConnector === 'right') {
          controlPointX = startX + dx / 2;
          controlPointY = startY;
        } else if (sourceConnector === 'top' && targetConnector === 'bottom') {
          controlPointX = startX;
          controlPointY = startY + dy / 2;
        } else if (sourceConnector === 'bottom' && targetConnector === 'top') {
          controlPointX = startX;
          controlPointY = startY + dy / 2;
        } else {
          controlPointX = startX + dx / 2;
          controlPointY = startY + dy / 2;
        }
        const pathData = `M ${startX} ${startY} Q ${controlPointX} ${controlPointY} ${endX} ${endY}`;
        setPath(pathData);
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
  }, [edge.source, edge.target, edge.data?.sourceConnector, edge.data?.targetConnector, canvasRef, sourcePosition, targetPosition]);

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
      <path
        ref={pathRef}
        d={path}
        className={`${getEdgeStyle(edge.type)} stroke-2 fill-none`}
        markerEnd="url(#arrowhead)"
      />
      {edge.label && (
        <text
          x={pathRef.current?.getPointAtLength(pathRef.current.getTotalLength() / 2).x}
          y={pathRef.current?.getPointAtLength(pathRef.current.getTotalLength() / 2).y}
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