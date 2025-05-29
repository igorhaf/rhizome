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
}

// Tamanho visual do nó (deve bater com o SVG e o CSS)
const NODE_SIZE = 56; // ajuste conforme necessário
const CONNECTOR_RADIUS = 8; // Raio visual do conector

const FlowEdge: React.FC<FlowEdgeProps> = ({ edge, canvasRef, sourcePosition, targetPosition, nodes, onSelect, selected, labelSelected, onLabelSelect, onLabelDeselect, onLabelEdit, editingLabel, editingLabelValue, setEditingLabelValue, onLabelEditSave }) => {
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
    // node.position já é o centro do nó
    const { x, y } = node.position;
    switch (connectorId) {
      case 'top': return { x, y: y - NODE_SIZE / 2 + 4 };
      case 'right': return { x: x + NODE_SIZE / 2 - 4, y };
      case 'bottom': return { x, y: y + NODE_SIZE / 2 - 4 };
      case 'left': return { x: x - NODE_SIZE / 2 + 4, y };
      default: return { x, y };
    }
  }

  useEffect(() => {
    const sourceConnector = edge.data?.sourceConnector || 'right';
    const targetConnector = edge.data?.targetConnector || 'left';
    // Busca os nós pelo estado
    const sourceNode = nodes?.find(n => n.id === edge.source);
    const targetNode = nodes?.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return;
    // Calcula a posição dos conectores sem depender do DOM
    const start = getConnectorPosition(sourceNode, sourceConnector);
    const end = getConnectorPosition(targetNode, targetConnector);
    // NÃO aplica panning/scale aqui, pois o container já está transformado
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

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <defs>
        <marker
          id="arrowhead"
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
      <g>
        <polyline
          points={points}
          stroke="transparent"
          strokeWidth={10}
          fill="none"
          style={{ pointerEvents: 'stroke' }}
          onClick={e => {
            e.stopPropagation();
            onSelect?.(edge);
          }}
          onDoubleClick={e => {
            e.stopPropagation();
            onSelect?.(edge);
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const scale = parseFloat(getComputedStyle(canvasRef.current).transform.split(',')[0].split('(')[1]) || 1;
            const x = (e.clientX - rect.left) / scale;
            const y = (e.clientY - rect.top) / scale;
            setInlineEdit({ x, y, value: edge.label || '' });
          }}
        />
        <polyline
          points={points}
          className={`${getEdgeStyle(edge.type)} stroke-2 fill-none ${selected ? 'stroke-blue-500 drop-shadow-[0_0_4px_rgba(59,130,246,0.7)]' : ''}`}
          markerEnd="url(#arrowhead)"
          style={{ cursor: 'pointer', pointerEvents: 'none' }}
        />
      </g>
      {edge.label && (
        (() => {
          // Posição base do label (meio da linha)
          const pts = points.split(' ').map(p => p.split(',').map(Number));
          let lx = 0, ly = 0;
          if (pts.length >= 2) {
            const [x1, y1] = pts[0];
            const [x2, y2] = pts[pts.length-1];
            lx = (x1 + x2) / 2;
            ly = (y1 + y2) / 2;
          }
          const offsetRaw = edge.data?.labelOffset;
          const offset = (typeof offsetRaw === 'object' && offsetRaw !== null && 'x' in offsetRaw && 'y' in offsetRaw)
            ? offsetRaw
            : { x: 0, y: 0 };
          lx += offset.x;
          ly += offset.y;
          if (editingLabel && typeof editingLabelValue === 'string' && setEditingLabelValue) {
            // Renderiza input para edição
            return (
              <foreignObject x={lx - 60} y={ly - 16} width={120} height={32} style={{ overflow: 'visible' }}>
                <input
                  id={`label-input-${edge.id}`}
                  name={`label-input-${edge.id}`}
                  type="text"
                  value={editingLabelValue}
                  onChange={e => setEditingLabelValue(e.target.value)}
                  onBlur={onLabelEditSave}
                  onKeyDown={e => { if (e.key === 'Enter') onLabelEditSave?.(); }}
                  style={{ width: '100%', fontSize: 16, fontWeight: 'bold', color: '#fff', background: '#23272e', border: '1px solid #4b5563', borderRadius: 4, padding: '2px 8px', outline: 'none' }}
                  autoFocus
                />
              </foreignObject>
            );
          }
          console.log('render label', { edgeId: edge.id, labelSelected, editingLabel });
          return (
            <g>
              {labelSelected && (
                <rect
                  x={lx - 40}
                  y={ly - 16}
                  width={80}
                  height={32}
                  rx={8}
                  fill="#23272e"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  opacity={0.7}
                />
              )}
              <text
                x={lx}
                y={ly}
                fontSize="16"
                fill="#fff"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ 
                  textShadow: '0 1px 4px #23272e, 0 0 2px #23272e', 
                  cursor: labelSelected ? 'grab' : 'pointer', 
                  userSelect: 'none',
                  pointerEvents: 'all'
                }}
                onClick={e => {
                  e.stopPropagation();
                  onLabelSelect?.();
                }}
                onDoubleClick={e => {
                  e.stopPropagation();
                  onLabelEdit?.();
                }}
                onMouseDown={e => {
                  if (labelSelected) {
                    e.stopPropagation();
                    handleLabelMouseDown(e);
                  }
                }}
              >
                {edge.label}
              </text>
            </g>
          );
        })()
      )}
      {inlineEdit && (
        <foreignObject x={inlineEdit.x - 60} y={inlineEdit.y - 16} width={120} height={32} style={{ overflow: 'visible', position: 'absolute', zIndex: 10000 }}>
          <input
            id={`label-input-${edge.id}`}
            name={`label-input-${edge.id}`}
            type="text"
            value={inlineEdit.value}
            onChange={e => setInlineEdit({ ...inlineEdit, value: e.target.value })}
            onBlur={() => {
              // Salva o label
              if (inlineEdit.value.trim() !== '') {
                const event = new CustomEvent('updateEdgeLabel', { detail: { edgeId: edge.id, label: inlineEdit.value } });
                window.dispatchEvent(event);
              }
              setInlineEdit(null);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (inlineEdit.value.trim() !== '') {
                  const event = new CustomEvent('updateEdgeLabel', { detail: { edgeId: edge.id, label: inlineEdit.value } });
                  window.dispatchEvent(event);
                }
                setInlineEdit(null);
              }
            }}
            style={{ width: '100%', fontSize: 16, fontWeight: 'bold', color: '#fff', background: '#23272e', border: '1px solid #4b5563', borderRadius: 4, padding: '2px 8px', outline: 'none' }}
            autoFocus
          />
        </foreignObject>
      )}
    </svg>
  );
};

export default FlowEdge; 