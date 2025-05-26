'use client';

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Node, Position } from '../types/flow';

interface FlowNodeProps {
  node: Node;
  onPositionChange: (position: Position) => void;
  onConnectionStart?: (nodeId: string, connectorId: string) => void;
  onConnectionEnd?: (nodeId: string, connectorId: string) => void;
  onClick?: () => void;
}

const FlowNode: React.FC<FlowNodeProps> = ({
  node,
  onPositionChange,
  onConnectionStart,
  onConnectionEnd,
  onClick,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeConnector, setActiveConnector] = useState<string | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        if (!isDragging) {
          onClick?.();
        }
        setIsDragging(true);
        dragOffsetRef.current = {
          x: e.clientX - node.position.x,
          y: e.clientY - node.position.y,
        };
        const handleGlobalMouseMove = (ev: MouseEvent) => {
          setIsDragging(true);
          const offset = dragOffsetRef.current;
          onPositionChange({
            x: ev.clientX - offset.x,
            y: ev.clientY - offset.y,
          });
        };
        const handleGlobalMouseUp = () => {
          setIsDragging(false);
          window.removeEventListener('mousemove', handleGlobalMouseMove);
          window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
      }
    },
    [node.position, onPositionChange, isDragging, onClick]
  );

  const getNodeStyle = (type: Node['type']) => {
    const baseStyle = 'rounded-lg shadow-md p-4 min-w-[150px] cursor-move relative';
    switch (type) {
      case 'start':
        return `${baseStyle} bg-green-500 text-white`;
      case 'end':
        return `${baseStyle} bg-red-500 text-white`;
      case 'action':
        return `${baseStyle} bg-blue-500 text-white`;
      case 'decision':
        return `${baseStyle} bg-yellow-500 text-white`;
      case 'loop':
        return `${baseStyle} bg-purple-500 text-white`;
      case 'subprocess':
        return `${baseStyle} bg-orange-500 text-white`;
      case 'data':
        return `${baseStyle} bg-teal-500 text-white`;
      case 'api':
        return `${baseStyle} bg-indigo-500 text-white`;
      default:
        return `${baseStyle} bg-gray-500 text-white`;
    }
  };

  const handleConnectorMouseDown = useCallback(
    (e: React.MouseEvent, connectorId: string) => {
      e.stopPropagation();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const nodeElement = document.getElementById(`node-${node.id}`);
      const connectorElement = document.getElementById(`node-${node.id}-connector-${connectorId}`);
      const canvasElement = nodeElement?.closest('.w-full.h-full.bg-gray-100.overflow-hidden');
      const canvasRect = canvasElement?.getBoundingClientRect();
      const nodeRect = nodeElement?.getBoundingClientRect();
      const connectorRect = connectorElement?.getBoundingClientRect();
      console.log('[FlowNode] handleConnectorMouseDown', {
        mouseX,
        mouseY,
        canvasRect,
        nodeRect,
        connectorRect,
        nodeId: node.id,
        connectorId,
      });
      setIsConnecting(true);
      setActiveConnector(connectorId);
      onConnectionStart?.(node.id, connectorId);
    },
    [node.id, onConnectionStart]
  );

  const handleConnectorMouseUp = useCallback(
    (e: React.MouseEvent, connectorId: string) => {
      e.stopPropagation();
      if (isConnecting) {
        setIsConnecting(false);
        setActiveConnector(null);
        onConnectionEnd?.(node.id, connectorId);
      }
    },
    [isConnecting, node.id, onConnectionEnd]
  );

  const renderConnectors = () => {
    const connectors = [
      { id: 'top', position: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
      { id: 'right', position: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2' },
      { id: 'bottom', position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
      { id: 'left', position: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2' },
    ];

    return connectors.map((connector) => {
      console.log('[FlowNode] render connector', `${node.id}-connector-${connector.id}`);
      return (
        <div
          key={connector.id}
          id={`${node.id}-connector-${connector.id}`}
          className={`absolute w-4 h-4 rounded-full bg-white border-2 border-gray-400 cursor-crosshair hover:bg-blue-400 hover:border-blue-600 transition-colors ${connector.position} ${
            activeConnector === connector.id ? 'bg-blue-400 border-blue-600 scale-125' : ''
          }`}
          onMouseDown={(e) => handleConnectorMouseDown(e, connector.id)}
          onMouseUp={(e) => handleConnectorMouseUp(e, connector.id)}
          title={`Connect from ${connector.id}`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
          </div>
        </div>
      );
    });
  };

  // Cleanup defensivo (caso listeners fiquem presos)
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', () => {});
      window.removeEventListener('mouseup', () => {});
    };
  }, []);

  // Log do id do nó
  console.log('[FlowNode] render node', node.id);

  return (
    <div
      id={node.id}
      {...(() => { console.log('[FlowNode] render node', node.id); return {}; })()}
      className={`${getNodeStyle(node.type)} transition-shadow duration-200 select-none ${
        isDragging ? 'shadow-lg' : ''
      }`}
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        transform: 'translate(-50%, -50%)',
        zIndex: isDragging ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
    >
      {renderConnectors()}
      <div className="flex items-center gap-2 pointer-events-none">
        <div className="font-semibold pointer-events-none">{node.data.label}</div>
      </div>
      {node.data.description && (
        <div className="text-sm mt-1 opacity-80 pointer-events-none">{node.data.description}</div>
      )}
    </div>
  );
};

export default FlowNode; 