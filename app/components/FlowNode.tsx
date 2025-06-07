'use client';

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Node, Position, NodeType } from '../types/flow';

interface FlowNodeProps {
  node: Node;
  onPositionChange: (position: Position) => void;
  onConnectionStart?: (nodeId: string, connectorId: string) => void;
  onConnectionEnd?: (nodeId: string, connectorId: string) => void;
  onClick?: () => void;
  onDoubleClick?: () => void;
  selected?: boolean;
  handleConnectorEnter?: (nodeId: string, connectorId: string) => void;
  handleConnectorLeave?: () => void;
  handleConnectorMouseDown?: (nodeId: string, connectorId: string, e: React.MouseEvent) => void;
  activeConnector?: { nodeId: string; connectorId: string } | null;
  draggingFrom?: { nodeId: string; connectorId: string } | null;
  draggingTo?: { x: number; y: number } | null;
  draggingEdgeId?: string | null;
  draggingEnd?: 'source' | 'target' | null;
  handleConnectorDrop?: (nodeId: string, connectorId: string) => void;
}

const FlowNode: React.FC<FlowNodeProps> = ({
  node,
  onPositionChange,
  onConnectionStart,
  onConnectionEnd,
  onClick,
  onDoubleClick,
  selected = false,
  handleConnectorEnter,
  handleConnectorLeave,
  handleConnectorMouseDown,
  activeConnector,
  draggingFrom,
  draggingTo,
  draggingEdgeId,
  draggingEnd,
  handleConnectorDrop,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [localActiveConnector, setLocalActiveConnector] = useState<string | null>(null);
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
    switch (type as string) {
      case 'start':
        return `${baseStyle} bg-green-500 text-white`;
      case 'end':
        return `${baseStyle} bg-red-500 text-white`;
      case 'funcion':
        return `${baseStyle} bg-green-400 text-white`;
      case 'email':
        return `${baseStyle} text-white`;
      case 'webhook':
        return `${baseStyle} text-white`;
      case 'decision':
        return `${baseStyle} text-white`;
      case 'loop':
        return `${baseStyle} text-white`;
      case 'subprocess':
        return `${baseStyle} text-white`;
      case 'Database':
        return `${baseStyle} text-white`;
      case 'api':
        return `${baseStyle} text-white`;
      case 'spreadsheet':
        return `${baseStyle} bg-green-500 text-white`;
      case 'warning':
        return `${baseStyle} text-black`;
      default:
        return `${baseStyle} bg-gray-500 text-white`;
    }
  };

  const handleConnectorMouseUp = useCallback(
    (e: React.MouseEvent, connectorId: string) => {
      e.stopPropagation();
      onConnectionEnd?.(node.id, connectorId);
      setIsConnecting(false);
      setLocalActiveConnector(null);
    },
    [node.id, onConnectionEnd]
  );

  const renderConnectors = () => {
    return (
      <>
        <div
          id={`${node.id}-connector-top`}
          className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-gray-400 bg-gray-800 cursor-crosshair transition-all duration-200 hover:scale-125 hover:border-blue-400 hover:bg-blue-500 ${localActiveConnector === 'top' ? 'scale-125 border-blue-400 bg-blue-500' : ''}`}
          style={{ pointerEvents: 'auto' }}
          onMouseEnter={() => handleConnectorEnter?.(node.id, 'top')}
          onMouseLeave={handleConnectorLeave}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsConnecting(true);
            setLocalActiveConnector('top');
            if (handleConnectorMouseDown) {
              handleConnectorMouseDown(node.id, 'top', e);
            }
            onConnectionStart?.(node.id, 'top');
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            setIsConnecting(false);
            setLocalActiveConnector(null);
            handleConnectorMouseUp(e, 'top');
            if (draggingEdgeId && handleConnectorDrop) {
              handleConnectorDrop(node.id, 'top');
            }
          }}
        >
          <div className="w-0.5 h-0.5 rounded-full bg-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div
          id={`${node.id}-connector-right`}
          className={`absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full border border-gray-400 bg-gray-800 cursor-crosshair transition-all duration-200 hover:scale-125 hover:border-blue-400 hover:bg-blue-500 ${localActiveConnector === 'right' ? 'scale-125 border-blue-400 bg-blue-500' : ''}`}
          style={{ pointerEvents: 'auto' }}
          onMouseEnter={() => handleConnectorEnter?.(node.id, 'right')}
          onMouseLeave={handleConnectorLeave}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsConnecting(true);
            setLocalActiveConnector('right');
            if (handleConnectorMouseDown) {
              handleConnectorMouseDown(node.id, 'right', e);
            }
            onConnectionStart?.(node.id, 'right');
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            setIsConnecting(false);
            setLocalActiveConnector(null);
            handleConnectorMouseUp(e, 'right');
            if (draggingEdgeId && handleConnectorDrop) {
              handleConnectorDrop(node.id, 'right');
            }
          }}
        >
          <div className="w-0.5 h-0.5 rounded-full bg-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div
          id={`${node.id}-connector-bottom`}
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full border border-gray-400 bg-gray-800 cursor-crosshair transition-all duration-200 hover:scale-125 hover:border-blue-400 hover:bg-blue-500 ${localActiveConnector === 'bottom' ? 'scale-125 border-blue-400 bg-blue-500' : ''}`}
          style={{ pointerEvents: 'auto' }}
          onMouseEnter={() => handleConnectorEnter?.(node.id, 'bottom')}
          onMouseLeave={handleConnectorLeave}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsConnecting(true);
            setLocalActiveConnector('bottom');
            if (handleConnectorMouseDown) {
              handleConnectorMouseDown(node.id, 'bottom', e);
            }
            onConnectionStart?.(node.id, 'bottom');
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            setIsConnecting(false);
            setLocalActiveConnector(null);
            handleConnectorMouseUp(e, 'bottom');
            if (draggingEdgeId && handleConnectorDrop) {
              handleConnectorDrop(node.id, 'bottom');
            }
          }}
        >
          <div className="w-0.5 h-0.5 rounded-full bg-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div
          id={`${node.id}-connector-left`}
          className={`absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-gray-400 bg-gray-800 cursor-crosshair transition-all duration-200 hover:scale-125 hover:border-blue-400 hover:bg-blue-500 ${localActiveConnector === 'left' ? 'scale-125 border-blue-400 bg-blue-500' : ''}`}
          style={{ pointerEvents: 'auto' }}
          onMouseEnter={() => handleConnectorEnter?.(node.id, 'left')}
          onMouseLeave={handleConnectorLeave}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsConnecting(true);
            setLocalActiveConnector('left');
            if (handleConnectorMouseDown) {
              handleConnectorMouseDown(node.id, 'left', e);
            }
            onConnectionStart?.(node.id, 'left');
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            setIsConnecting(false);
            setLocalActiveConnector(null);
            handleConnectorMouseUp(e, 'left');
            if (draggingEdgeId && handleConnectorDrop) {
              handleConnectorDrop(node.id, 'left');
            }
          }}
        >
          <div className="w-0.5 h-0.5 rounded-full bg-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </>
    );
  };

  // Adiciona um efeito para garantir que mouseup global sempre limpa conexão
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsConnecting(false);
      setLocalActiveConnector(null);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // SVGs para cada tipo de nó
  const nodeIcons: Record<string, React.ReactNode> = {
    start: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {selected && (
          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" filter="url(#node-glow)" />
        )}
        <circle cx="24" cy="24" r="20" fill="#2563eb" />
        <polygon points="16,16 36,24 16,32" fill="#fff" />
      </svg>
    ),
    end: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {selected && (
          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" filter="url(#node-glow)" />
        )}
        <circle cx="24" cy="24" r="20" fill="#ef4444" />
        <rect x="17" y="17" width="14" height="14" rx="3" fill="#fff" />
      </svg>
    ),
    funcion: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {selected && (
          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" filter="url(#node-glow)" />
        )}
        <circle cx="24" cy="24" r="20" fill="#10b981" />
        <rect x="18" y="18" width="12" height="12" rx="2" fill="#fff" />
      </svg>
    ),
    email: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {selected && (
          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" filter="url(#node-glow)" />
        )}
        <circle cx="24" cy="24" r="20" fill="#2563eb" />
        <rect x="14" y="20" width="20" height="12" rx="3" fill="#fff" />
        <polyline points="14,20 24,30 34,20" fill="none" stroke="#2563eb" strokeWidth="2.2" />
        <rect x="14" y="20" width="20" height="12" rx="3" fill="none" stroke="#2563eb" strokeWidth="1.5" />
      </svg>
    ),
    webhook: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {selected && (
          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" filter="url(#node-glow)" />
        )}
        <circle cx="24" cy="24" r="20" fill="#f59e42" />
        <path d="M16 28a8 8 0 0 1 16 0" stroke="#fff" strokeWidth="2.5" fill="none" />
      </svg>
    ),
    decision: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {selected && (
          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" filter="url(#node-glow)" />
        )}
        <circle cx="24" cy="24" r="20" fill="#eab308" />
        <text x="24" y="32" textAnchor="middle" fontSize="22" fill="#fff" fontWeight="bold">?</text>
      </svg>
    ),
    loop: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {selected && (
          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" filter="url(#node-glow)" />
        )}
        <circle cx="24" cy="24" r="20" fill="#6366f1" />
        <path d="M17 33a7 7 0 1 0 3-11" stroke="#fff" strokeWidth="2" fill="none" />
        <polygon points="17,17 23,17 20,23" fill="#fff" />
      </svg>
    ),
    subprocess: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {selected && (
          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" filter="url(#node-glow)" />
        )}
        <circle cx="24" cy="24" r="20" fill="#f59e42" />
        <rect x="18" y="25" width="12" height="2" rx="1" fill="#fff" />
      </svg>
    ),
    data: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="10" y="10" width="28" height="28" rx="6" fill="#a78bfa" />
        <ellipse cx="24" cy="24" rx="11" ry="5" fill="#fff" fillOpacity=".7" />
      </svg>
    ),
    Database: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {selected && (
          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" filter="url(#node-glow)" />
        )}
        <circle cx="24" cy="24" r="20" fill="#a78bfa" />
        <ellipse cx="24" cy="28" rx="10" ry="5" fill="#fff" fillOpacity=".7" />
        <ellipse cx="24" cy="20" rx="10" ry="5" fill="#fff" fillOpacity=".7" />
      </svg>
    ),
    api: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {selected && (
          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" filter="url(#node-glow)" />
        )}
        <circle cx="24" cy="24" r="20" fill="#38bdf8" />
        <circle cx="24" cy="24" r="10" fill="#fff" fillOpacity=".2" />
        <circle cx="24" cy="24" r="4" fill="#fff" fillOpacity=".5" />
      </svg>
    ),
    spreadsheet: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {selected && (
          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" filter="url(#node-glow)" />
        )}
        <circle cx="24" cy="24" r="20" fill="#10b981" />
        <rect x="14" y="14" width="20" height="20" rx="4" fill="#fff" />
        <rect x="18" y="18" width="4" height="4" rx="1" fill="#10b981" />
        <rect x="26" y="18" width="4" height="4" rx="1" fill="#10b981" />
        <rect x="34" y="18" width="4" height="4" rx="1" fill="#10b981" />
        <rect x="18" y="26" width="4" height="4" rx="1" fill="#10b981" />
        <rect x="26" y="26" width="4" height="4" rx="1" fill="#10b981" />
        <rect x="34" y="26" width="4" height="4" rx="1" fill="#10b981" />
        <rect x="18" y="34" width="4" height="4" rx="1" fill="#10b981" />
        <rect x="26" y="34" width="4" height="4" rx="1" fill="#10b981" />
        <rect x="34" y="34" width="4" height="4" rx="1" fill="#10b981" />
      </svg>
    ),
    warning: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        {selected && (
          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" filter="url(#node-glow)" />
        )}
        <circle cx="24" cy="24" r="20" fill="#facc15" />
        <text x="24" y="32" textAnchor="middle" fontSize="28" fill="#b45309" fontWeight="bold">!</text>
        <defs>
          <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    ),
  };

  return (
    <div
      id={node.id}
      className={`${getNodeStyle(node.type || '')} transition-shadow duration-200 select-none ${
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
      onDoubleClick={onDoubleClick}
    >
      {renderConnectors()}
      <div className="flex flex-col items-center">
        <div
          className={`flex items-center justify-center ${['data','subprocess'].includes(node.type || '') ? 'w-16 h-16 rounded-md' : 'w-16 h-16 rounded-full'} shadow-md`}
          style={{ background: 'none' }}
        >
          {nodeIcons[node.type || '']}
        </div>
      </div>
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-white text-center pointer-events-none whitespace-nowrap">
        {node.data.label}
      </div>
    </div>
  );
};

export default FlowNode; 