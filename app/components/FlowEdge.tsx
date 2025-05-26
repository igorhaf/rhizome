'use client';

import React, { useEffect, useRef } from 'react';
import { Edge } from '../types/flow';

interface FlowEdgeProps {
  edge: Edge;
}

const FlowEdge: React.FC<FlowEdgeProps> = ({ edge }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [path, setPath] = React.useState('');

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
    const sourceElement = document.getElementById(`node-${edge.source}`);
    const targetElement = document.getElementById(`node-${edge.target}`);

    if (sourceElement && targetElement) {
      const sourceRect = sourceElement.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();

      const sourceX = sourceRect.left + sourceRect.width / 2;
      const sourceY = sourceRect.top + sourceRect.height / 2;
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;

      const dx = targetX - sourceX;
      const dy = targetY - sourceY;
      const controlPointX = sourceX + dx / 2;
      const controlPointY = sourceY + dy / 2;

      const pathData = `M ${sourceX} ${sourceY} Q ${controlPointX} ${controlPointY} ${targetX} ${targetY}`;
      setPath(pathData);
    }
  }, [edge.source, edge.target]);

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    >
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
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            className={getEdgeStyle(edge.type)}
          />
        </marker>
      </defs>
    </svg>
  );
};

export default FlowEdge; 