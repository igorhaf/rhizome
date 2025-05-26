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
  const mouseDownPos = useRef<{x: number, y: number} | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        setIsDragging(true);
        dragOffsetRef.current = {
          x: e.clientX - node.position.x,
          y: e.clientY - node.position.y,
        };
        mouseDownPos.current = { x: e.clientX, y: e.clientY };
        const handleGlobalMouseMove = (ev: MouseEvent) => {
          setIsDragging(true);
          const offset = dragOffsetRef.current;
          onPositionChange({
            x: ev.clientX - offset.x,
            y: ev.clientY - offset.y,
          });
        };
        const handleGlobalMouseUp = (ev: MouseEvent) => {
          setIsDragging(false);
          if (
            mouseDownPos.current &&
            Math.abs(ev.clientX - mouseDownPos.current.x) < 5 &&
            Math.abs(ev.clientY - mouseDownPos.current.y) < 5 &&
            !isConnecting
          ) {
            onClick?.();
          }
          mouseDownPos.current = null;
          window.removeEventListener('mousemove', handleGlobalMouseMove);
          window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
      }
    },
    [node.position, onPositionChange, isDragging, onClick, isConnecting]
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
          className={`absolute w-3 h-3 rounded-full bg-white border border-gray-400 cursor-crosshair hover:bg-blue-400 hover:border-blue-600 transition-colors ${connector.position} ${
            activeConnector === connector.id ? 'bg-blue-400 border-blue-600 scale-110' : ''
          }`}
          onMouseDown={(e) => handleConnectorMouseDown(e, connector.id)}
          onMouseUp={(e) => handleConnectorMouseUp(e, connector.id)}
          title={`Connect from ${connector.id}`}
          style={{ zIndex: 2 }}
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

  // SVGs para cada tipo de nó
  const nodeIcons: Record<string, React.ReactNode> = {
    start: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="#2563eb" />
        <polygon points="22,18 42,28 22,38" fill="#fff" />
      </svg>
    ),
    end: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="#ef4444" />
        <rect x="18" y="18" width="20" height="20" rx="4" fill="#fff" />
      </svg>
    ),
    action: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="#f59e42" />
        <path d="M28 16v16l10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    decision: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="#eab308" />
        <text x="28" y="38" textAnchor="middle" fontSize="32" fill="#fff" fontWeight="bold">?</text>
      </svg>
    ),
    loop: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="#6366f1" />
        <path d="M18 36a10 10 0 1 0 4-16" stroke="#fff" strokeWidth="3" fill="none" />
        <polygon points="18,18 26,18 22,26" fill="#fff" />
      </svg>
    ),
    subprocess: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect x="8" y="8" width="40" height="40" rx="8" fill="#f59e42" />
        <rect x="18" y="26" width="20" height="4" rx="2" fill="#fff" />
      </svg>
    ),
    data: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect x="8" y="8" width="40" height="40" rx="8" fill="#a78bfa" />
        <ellipse cx="28" cy="28" rx="16" ry="8" fill="#fff" fillOpacity=".7" />
      </svg>
    ),
    api: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="#38bdf8" />
        <circle cx="28" cy="28" r="14" fill="#fff" fillOpacity=".2" />
        <circle cx="28" cy="28" r="6" fill="#fff" fillOpacity=".5" />
      </svg>
    ),
  };

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
        background: 'none',
        boxShadow: 'none',
        padding: 0,
        minWidth: 0,
      }}
      onMouseDown={handleMouseDown}
    >
      {renderConnectors()}
      <div className="flex flex-col items-center">
        <div
          className={`flex items-center justify-center ${['data','subprocess'].includes(node.type) ? 'w-24 h-24 rounded-md' : 'w-24 h-24 rounded-full'} shadow-md`}
          style={{ background: 'none' }}
        >
          {nodeIcons[node.type]}
        </div>
        <div className="mt-2 text-sm font-semibold text-white text-center pointer-events-none">
          {node.data.label}
        </div>
      </div>
    </div>
  );
};

export default FlowNode; 