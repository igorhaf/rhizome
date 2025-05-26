'use client';

import React, { useCallback, useState } from 'react';
import { Node, Position } from '../types/flow';

interface FlowNodeProps {
  node: Node;
  onPositionChange: (position: Position) => void;
  onConnectionStart?: (nodeId: string, connectorId: string) => void;
  onConnectionEnd?: (nodeId: string, connectorId: string) => void;
}

const FlowNode: React.FC<FlowNodeProps> = ({
  node,
  onPositionChange,
  onConnectionStart,
  onConnectionEnd,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeConnector, setActiveConnector] = useState<string | null>(null);

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

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        setIsDragging(true);
        setDragOffset({
          x: e.clientX - node.position.x,
          y: e.clientY - node.position.y,
        });
      }
    },
    [node.position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        onPositionChange({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    },
    [isDragging, dragOffset, onPositionChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleConnectorMouseDown = useCallback(
    (e: React.MouseEvent, connectorId: string) => {
      e.stopPropagation();
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

    return connectors.map((connector) => (
      <div
        key={connector.id}
        className={`absolute w-4 h-4 rounded-full bg-white border-2 border-gray-400 cursor-crosshair hover:bg-blue-400 hover:border-blue-600 transition-colors ${connector.position} ${
          activeConnector === connector.id ? 'bg-blue-400 border-blue-600' : ''
        }`}
        onMouseDown={(e) => handleConnectorMouseDown(e, connector.id)}
        onMouseUp={(e) => handleConnectorMouseUp(e, connector.id)}
      />
    ));
  };

  return (
    <div
      id={`node-${node.id}`}
      className={getNodeStyle(node.type)}
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {renderConnectors()}
      <div className="flex items-center gap-2">
        <div className="font-semibold">{node.data.label}</div>
      </div>
      {node.data.description && (
        <div className="text-sm mt-1 opacity-80">{node.data.description}</div>
      )}
    </div>
  );
};

export default FlowNode; 