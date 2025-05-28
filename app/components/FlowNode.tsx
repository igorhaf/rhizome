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
    const baseStyle = 'rounded-lg shadow-md p-2 min-w-[105px] cursor-move relative';
    switch (type) {
      case 'start':
        return `${baseStyle} bg-green-500 text-white`;
      case 'end':
        return `${baseStyle} bg-red-500 text-white`;
      case 'funcion':
        return `${baseStyle} bg-green-400 text-white`;
      case 'email':
        return `${baseStyle} bg-blue-400 text-white`;
      case 'webhook':
        return `${baseStyle} bg-orange-400 text-white`;
      case 'decision':
        return `${baseStyle} bg-yellow-500 text-white`;
      case 'loop':
        return `${baseStyle} bg-purple-500 text-white`;
      case 'subprocess':
        return `${baseStyle} bg-orange-500 text-white`;
      case 'Database':
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
      setIsConnecting(true);
      setActiveConnector(connectorId);
      onConnectionStart?.(node.id, connectorId);
    },
    [node.id, onConnectionStart]
  );

  const handleConnectorMouseUp = useCallback(
    (e: React.MouseEvent, connectorId: string) => {
      e.stopPropagation();
      // Sempre tente finalizar a conexão, mesmo se isConnecting for falso
      onConnectionEnd?.(node.id, connectorId);
      setIsConnecting(false);
      setActiveConnector(null);
    },
    [node.id, onConnectionEnd]
  );

  const renderConnectors = () => {
    const connectors = [
      { id: 'top', position: 'top-0 left-1/2', style: { transform: 'translateX(-50%)' } },
      { id: 'right', position: 'right-0 top-1/2', style: { transform: 'translateY(-50%)' } },
      { id: 'bottom', position: 'bottom-0 left-1/2', style: { transform: 'translateX(-50%)' } },
      { id: 'left', position: 'left-0 top-1/2', style: { transform: 'translateY(-50%)' } },
    ];
    return connectors.map((connector) => {
      return (
      <div
        key={connector.id}
          id={`${node.id}-connector-${connector.id}`}
          className={`absolute w-2 h-2 rounded-full bg-white border border-gray-400 cursor-crosshair hover:bg-blue-400 hover:border-blue-600 transition-colors ${connector.position} ${
            activeConnector === connector.id ? 'bg-blue-400 border-blue-600 scale-110' : ''
        }`}
          style={{ zIndex: 2, ...connector.style }}
        onMouseDown={(e) => handleConnectorMouseDown(e, connector.id)}
        onMouseUp={(e) => handleConnectorMouseUp(e, connector.id)}
          title={`Connect from ${connector.id}`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-0.5 bg-gray-400 rounded-full" />
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

  // SVGs para cada tipo de nó
  const nodeIcons: Record<string, React.ReactNode> = {
    start: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="#2563eb" />
        <polygon points="14,13 30,20 14,27" fill="#fff" />
      </svg>
    ),
    end: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="#ef4444" />
        <rect x="13" y="13" width="14" height="14" rx="3" fill="#fff" />
      </svg>
    ),
    funcion: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="8" y="8" width="24" height="24" rx="6" fill="#10b981" />
        <rect x="14" y="14" width="12" height="12" rx="2" fill="#fff" />
      </svg>
    ),
    email: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="7" y="13" width="26" height="14" rx="3" fill="#2563eb" />
        <polyline points="7,13 20,27 33,13" fill="none" stroke="#fff" strokeWidth="2" />
      </svg>
    ),
    webhook: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="17" fill="#f59e42" />
        <path d="M12 20a8 8 0 0 1 16 0" stroke="#fff" strokeWidth="2" fill="none" />
      </svg>
    ),
    decision: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="#eab308" />
        <text x="20" y="28" textAnchor="middle" fontSize="22" fill="#fff" fontWeight="bold">?</text>
      </svg>
    ),
    loop: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="#6366f1" />
        <path d="M13 27a7 7 0 1 0 3-11" stroke="#fff" strokeWidth="2" fill="none" />
        <polygon points="13,13 19,13 16,19" fill="#fff" />
      </svg>
    ),
    subprocess: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="6" width="28" height="28" rx="6" fill="#f59e42" />
        <rect x="14" y="18" width="12" height="3" rx="1.5" fill="#fff" />
      </svg>
    ),
    data: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="6" width="28" height="28" rx="6" fill="#a78bfa" />
        <ellipse cx="20" cy="20" rx="11" ry="5" fill="#fff" fillOpacity=".7" />
      </svg>
    ),
    Database: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="6" width="28" height="28" rx="6" fill="#a78bfa" />
        <ellipse cx="20" cy="20" rx="11" ry="5" fill="#fff" fillOpacity=".7" />
      </svg>
    ),
    api: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="#38bdf8" />
        <circle cx="20" cy="20" r="10" fill="#fff" fillOpacity=".2" />
        <circle cx="20" cy="20" r="4" fill="#fff" fillOpacity=".5" />
      </svg>
    ),
  };

  return (
    <div
      id={node.id}
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
          className={`flex items-center justify-center ${['data','subprocess'].includes(node.type) ? 'w-16 h-16 rounded-md' : 'w-16 h-16 rounded-full'} shadow-md`}
          style={{ background: 'none' }}
        >
          {nodeIcons[node.type]}
        </div>
        <div className="mt-1 text-xs font-semibold text-white text-center pointer-events-none">
          {node.data.label}
        </div>
      </div>
    </div>
  );
};

export default FlowNode; 