'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Edge, Node } from '../types/flow';

interface FlowEdgeProps {
  edge: Edge;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  sourcePosition?: { x: number; y: number };
  targetPosition?: { x: number; y: number };
  nodes?: Node[];
  onSelect?: (edge: Edge) => void;
  selected?: boolean;
  labelSelected?: boolean;
  onLabelSelect?: () => void;
  onLabelDeselect?: () => void;
  onLabelEdit?: () => void;
  editingLabel?: boolean;
  editingLabelValue?: string;
  setEditingLabelValue?: (v: string) => void;
  onLabelEditSave?: () => void;
  onConnectorDragStart?: (edgeId: string, connectorType: 'source' | 'target', connectorData: { nodeId: string; connectorId: string }, connectorPosition: { x: number; y: number }) => void;
  handleConnectorEnter?: (nodeId: string, connectorId: string) => void;
  handleConnectorLeave?: () => void;
  handleConnectorMouseDown?: (nodeId: string, connectorId: string, e: React.MouseEvent) => void;
  activeConnector?: { nodeId: string; connectorId: string } | null;
  draggingFrom?: { nodeId: string; connectorId: string } | null;
  draggingTo?: { x: number; y: number } | null;
  handleEdgeConnectorDragStart?: (edgeId: string, end: 'source' | 'target', from: { nodeId: string; connectorId: string }, e: React.MouseEvent) => void;
}

// Tamanho visual do nó (deve bater com o SVG e o CSS)
const NODE_SIZE = 56; // ajuste conforme necessário
const CONNECTOR_RADIUS = 8; // Raio visual do conector

const FlowEdge: React.FC<FlowEdgeProps> = ({ edge, canvasRef, sourcePosition, targetPosition, nodes, onSelect, selected, labelSelected, onLabelSelect, onLabelDeselect, onLabelEdit, editingLabel, editingLabelValue, setEditingLabelValue, onLabelEditSave, onConnectorDragStart, handleConnectorEnter, handleConnectorLeave, handleConnectorMouseDown, activeConnector, draggingFrom, draggingTo, handleEdgeConnectorDragStart }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [points, setPoints] = React.useState<string>('');
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    mx: number;
    my: number;
    offset: { x: number; y: number };
    baseX: number;
    baseY: number;
  } | null>(null);
  const [inlineEdit, setInlineEdit] = useState<null | { x: number; y: number; value: string }>(null);

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

  // Função para calcular a posição do conector baseado no estado do nó
  function getConnectorPosition(node: Node, connectorId: string) {
    const { x, y } = node.position;
    const halfSize = NODE_SIZE / 2;
    
    switch (connectorId) {
      case 'top': return { x, y: y - halfSize };
      case 'right': return { x: x + halfSize, y };
      case 'bottom': return { x, y: y + halfSize };
      case 'left': return { x: x - halfSize, y };
      default: return { x, y };
    }
  }

  useEffect(() => {
    const sourceConnector = edge.data?.sourceConnector || 'right';
    const targetConnector = edge.data?.targetConnector || 'left';
    const sourceNode = nodes?.find(n => n.id === edge.source);
    const targetNode = nodes?.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return;

    // Calcula a posição dos conectores
    const start = getConnectorPosition(sourceNode, sourceConnector);
    const end = getConnectorPosition(targetNode, targetConnector);

    // Usa o caminho ortogonal com fallback
    const fallbackPoints = fallbackOrthogonal([start.x, start.y], [end.x, end.y]);
    setPoints(fallbackPoints.map(([x, y]) => `${x},${y}`).join(' '));
  }, [edge.source, edge.target, edge.data?.sourceConnector, edge.data?.targetConnector, nodes]);

  // Função para atualizar o offset do label
  const updateLabelOffset = (newOffset: { x: number; y: number }) => {
    if (typeof window === 'undefined') return;
    const event = new CustomEvent('updateEdgeLabelOffset', { detail: { edgeId: edge.id, offset: newOffset } });
    window.dispatchEvent(event);
  };

  // Handler de drag do label
  const handleLabelMouseDown = (e: React.MouseEvent<SVGTextElement, MouseEvent>) => {
    e.stopPropagation();
    const pts = points.split(' ').map(p => p.split(',').map(Number));
    if (pts.length < 2 || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = parseFloat(getComputedStyle(canvasRef.current).transform.split(',')[0].split('(')[1]) || 1;
    const mx = (e.clientX - rect.left) / scale;
    const my = (e.clientY - rect.top) / scale;
    // Posição base do label (meio da linha)
    const [x1, y1] = pts[0];
    const [x2, y2] = pts[pts.length-1];
    const baseX = (x1 + x2) / 2;
    const baseY = (y1 + y2) / 2;
    const offsetRaw = edge.data?.labelOffset;
    const offset = (typeof offsetRaw === 'object' && offsetRaw !== null && 'x' in offsetRaw && 'y' in offsetRaw)
      ? offsetRaw
      : { x: 0, y: 0 };
    setDragging(true);
    setDragStart({
      mx,
      my,
      offset,
      baseX,
      baseY
    });
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      if (!dragStart || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = parseFloat(getComputedStyle(canvasRef.current).transform.split(',')[0].split('(')[1]) || 1;
      const worldX = (e.clientX - rect.left) / scale;
      const worldY = (e.clientY - rect.top) / scale;
      const dx = worldX - dragStart.mx;
      const dy = worldY - dragStart.my;
      const newOffset = {
        x: dragStart.offset.x + dx,
        y: dragStart.offset.y + dy
      };
      updateLabelOffset(newOffset);
    };
    const handleUp = () => {
      console.log('[LABEL DRAG END]');
      setDragging(false);
      setDragStart(null);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, dragStart, points, canvasRef]);

  useEffect(() => {
    function handleUpdateEdgeLabel(e: any) {
      const { edgeId, label } = e.detail;
      if (edgeId === edge.id) {
        onLabelEdit?.(); // ativa edição no parent se necessário
        if (typeof onLabelEditSave === 'function') {
          onLabelEditSave();
        }
        // Atualiza o label diretamente
        if (typeof onLabelEditSave === 'function') {
          onLabelEditSave();
        }
      }
    }
    window.addEventListener('updateEdgeLabel', handleUpdateEdgeLabel);
    return () => {
      window.removeEventListener('updateEdgeLabel', handleUpdateEdgeLabel);
    };
  }, [edge.id, onLabelEdit, onLabelEditSave]);

  // Calcula posições dos conectores
  const sourceConnector = edge.data?.sourceConnector || 'right';
  const targetConnector = edge.data?.targetConnector || 'left';
  const sourceNode = nodes?.find(n => n.id === edge.source);
  const targetNode = nodes?.find(n => n.id === edge.target);
  let sourcePos = { x: 0, y: 0 };
  let targetPos = { x: 0, y: 0 };
  const size = 56;
  if (sourceNode) {
    const { x, y } = sourceNode.position;
    switch (sourceConnector) {
      case 'top': sourcePos = { x, y: y - size / 2 }; break;
      case 'right': sourcePos = { x: x + size / 2, y }; break;
      case 'bottom': sourcePos = { x, y: y + size / 2 }; break;
      case 'left': sourcePos = { x: x - size / 2, y }; break;
      default: sourcePos = { x, y }; break;
    }
  }
  if (targetNode) {
    const { x, y } = targetNode.position;
    switch (targetConnector) {
      case 'top': targetPos = { x, y: y - size / 2 }; break;
      case 'right': targetPos = { x: x + size / 2, y }; break;
      case 'bottom': targetPos = { x, y: y + size / 2 }; break;
      case 'left': targetPos = { x: x - size / 2, y }; break;
      default: targetPos = { x, y }; break;
    }
  }

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <defs>
        <marker
          id={`arrowhead-${edge.id}`}
          markerWidth="6"
          markerHeight="4"
          refX="5.5"
          refY="2"
          orient="auto"
          className={getEdgeStyle(edge.type)}
        >
          <polygon
            points="0 0, 6 2, 0 4"
            className={getEdgeStyle(edge.type)}
            fill="currentColor"
          />
        </marker>
      </defs>
      <g style={{ pointerEvents: 'auto' }}>
        <path
          ref={pathRef}
          d={`M ${points.split(' ').join(' L ')}`}
          className={`${getEdgeStyle(edge.type)} stroke-2 fill-none`}
          markerEnd={`url(#arrowhead-${edge.id})`}
          style={{
            cursor: 'pointer',
            transition: 'stroke 0.2s ease',
          }}
          onClick={() => onSelect?.(edge)}
        />
        {/* Pontos de arrasto nas extremidades */}
        {points.split(' ').length > 0 && (
          <>
            <circle
              cx={points.split(' ')[0].split(',')[0]}
              cy={points.split(' ')[0].split(',')[1]}
              r="4"
              className="fill-blue-400 stroke-blue-600 stroke-2 cursor-move opacity-0 hover:opacity-100 transition-opacity"
              onMouseDown={(e) => {
                e.stopPropagation();
                if (handleEdgeConnectorDragStart) {
                  const sourceNode = nodes?.find(n => n.id === edge.source);
                  if (sourceNode) {
                    handleEdgeConnectorDragStart(
                      edge.id,
                      'source',
                      { nodeId: edge.source, connectorId: edge.data?.sourceConnector || 'right' },
                      e
                    );
                  }
                }
              }}
              style={{ pointerEvents: 'auto' }}
            />
            <circle
              cx={points.split(' ')[points.split(' ').length - 1].split(',')[0]}
              cy={points.split(' ')[points.split(' ').length - 1].split(',')[1]}
              r="4"
              className="fill-blue-400 stroke-blue-600 stroke-2 cursor-move opacity-0 hover:opacity-100 transition-opacity"
              onMouseDown={(e) => {
                e.stopPropagation();
                if (handleEdgeConnectorDragStart) {
                  const targetNode = nodes?.find(n => n.id === edge.target);
                  if (targetNode) {
                    handleEdgeConnectorDragStart(
                      edge.id,
                      'target',
                      { nodeId: edge.target, connectorId: edge.data?.targetConnector || 'left' },
                      e
                    );
                  }
                }
              }}
              style={{ pointerEvents: 'auto' }}
            />
          </>
        )}
        {edge.data?.properties?.label && (
          <text
            x={points.split(' ').map(p => p.split(',')[0]).reduce((a, b) => a + Number(b), 0) / points.split(' ').length}
            y={points.split(' ').map(p => p.split(',')[1]).reduce((a, b) => a + Number(b), 0) / points.split(' ').length}
            className={`text-xs fill-current ${selected ? 'font-bold' : ''}`}
            style={{
              pointerEvents: 'auto',
              cursor: 'move',
              userSelect: 'none',
            }}
            onMouseDown={handleLabelMouseDown}
          >
            {edge.data.properties.label}
          </text>
        )}
      </g>
    </svg>
  );
};

export default FlowEdge;

// Adicionar export do SVG correto para decision
export const DecisionNodeIcon = (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" fill="#eab308" />
    <text x="24" y="32" textAnchor="middle" fontSize="22" fill="#fff" fontWeight="bold">?</text>
  </svg>
); 