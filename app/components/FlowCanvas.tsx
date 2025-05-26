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
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState<{ nodeId: string; connectorId: string } | null>(null);
  const [tempEdge, setTempEdge] = useState<{ x: number; y: number } | null>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    setScale((prevScale) => {
      const newScale = prevScale - delta * 0.001;
      return Math.min(Math.max(0.1, newScale), 2);
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsDragging(true);
      setStartPoint({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - startPoint.x;
        const dy = e.clientY - startPoint.y;
        setPosition((prev) => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }));
        setStartPoint({ x: e.clientX, y: e.clientY });
      }

      if (connectionStart) {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (canvasRect) {
          const x = (e.clientX - canvasRect.left - position.x) / scale;
          const y = (e.clientY - canvasRect.top - position.y) / scale;
          setTempEdge({ x, y });
        }
      }
    },
    [isDragging, startPoint, connectionStart, position, scale]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (connectionStart) {
      setConnectionStart(null);
      setTempEdge(null);
    }
  }, [connectionStart]);

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
    setConnectionStart({ nodeId, connectorId });
  }, []);

  const handleConnectionEnd = useCallback((nodeId: string, connectorId: string) => {
    if (connectionStart && connectionStart.nodeId !== nodeId) {
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
    setConnectionStart(null);
    setTempEdge(null);
  }, [connectionStart, edges, onEdgesChange]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-gray-100 overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className="relative w-full h-full"
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: '0 0',
        }}
      >
        {edges.map((edge) => (
          <FlowEdge key={edge.id} edge={edge} />
        ))}
        {tempEdge && connectionStart && (
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: -1 }}
          >
            <path
              d={`M ${nodes.find(n => n.id === connectionStart.nodeId)?.position.x} ${
                nodes.find(n => n.id === connectionStart.nodeId)?.position.y
              } Q ${(nodes.find(n => n.id === connectionStart.nodeId)?.position.x! + tempEdge.x) / 2} ${
                (nodes.find(n => n.id === connectionStart.nodeId)?.position.y! + tempEdge.y) / 2
              } ${tempEdge.x} ${tempEdge.y}`}
              className="stroke-gray-500 stroke-2 fill-none"
              markerEnd="url(#arrowhead)"
            />
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
          />
        ))}
      </div>
    </div>
  );
};

export default FlowCanvas; 