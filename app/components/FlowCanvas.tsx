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
      // Permitir todas as conexões, exceto ida e volta entre os mesmos conectores
      const bidirectionalExists = edges.some(
        edge =>
          edge.source === nodeId &&
          edge.target === connectionStart.nodeId &&
          edge.data?.sourceConnector === connectorId &&
          edge.data?.targetConnector === connectionStart.connectorId
      );

      if (!bidirectionalExists) {
        // LOG: detalhes da conexão
        console.log('[FlowCanvas] Criando conexão', {
          source: connectionStart.nodeId,
          target: nodeId,
          sourceConnector: connectionStart.connectorId,
          targetConnector: connectorId,
        });
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

              // Calculate control points for a smoother curve
              const dx = tempEdge.x - startX;
              const dy = tempEdge.y - startY;
              let controlPointX, controlPointY;

              if (connectionStart.connectorId === 'right') {
                controlPointX = startX + dx / 2;
                controlPointY = startY;
              } else if (connectionStart.connectorId === 'left') {
                controlPointX = startX + dx / 2;
                controlPointY = startY;
              } else if (connectionStart.connectorId === 'top') {
                controlPointX = startX;
                controlPointY = startY + dy / 2;
              } else if (connectionStart.connectorId === 'bottom') {
                controlPointX = startX;
                controlPointY = startY + dy / 2;
              } else {
                controlPointX = startX + dx / 2;
                controlPointY = startY + dy / 2;
              }

              return (
                <path
                  d={`M ${startX} ${startY} Q ${controlPointX} ${controlPointY} ${tempEdge.x} ${tempEdge.y}`}
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
          />
        ))}
      </div>
    </div>
  );
};

export default FlowCanvas; 