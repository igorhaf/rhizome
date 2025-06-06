import React from 'react';
import { Handle, Position } from 'reactflow';
import { StartNodeIcon } from '../icons/StartNodeIcon';

const ACTIVE_GREEN = '#10b981';

const StartNode = ({ data }: { data: any }) => {
  // Decide handle position based on node position
  let handlePosition = Position.Right;
  let handleStyle = { right: -8 };
  if (data && data.position && typeof data.position.x === 'number') {
    if (data.position.x < 300) {
      handlePosition = Position.Right;
      handleStyle = { right: -8 };
    } else {
      handlePosition = Position.Left;
      handleStyle = { left: -8 };
    }
  }

  // O toggle deve alterar o estado ativo e notificar o sidebar
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof data.onToggleActive === 'function') {
      data.onToggleActive(!data.active);
    }
  };

  return (
    <div className="px-3 py-2 shadow-md rounded-lg border-2 flex flex-col items-center bg-transparent min-w-[128px] relative" style={{ borderColor: ACTIVE_GREEN }}>
      {/* Handle colado do lado de fora */}
      <Handle type="source" position={handlePosition} className="handle-extended" style={{ ...handleStyle, background: ACTIVE_GREEN }} />
      {/* Icon + Toggle row */}
      <div className="flex flex-row items-center justify-center w-full">
        <span className="w-9 h-9 flex items-center justify-center mr-3">
          <StartNodeIcon color={ACTIVE_GREEN} size={36} centerFill="#fff" />
        </span>
        <button
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors duration-150 ${data.active ? 'text-white' : 'text-gray-700 bg-gray-300'}`}
          style={data.active ? { background: ACTIVE_GREEN } : {}}
          onClick={handleToggle}
        >
          {data.active ? 'Ativo' : 'Inativo'}
        </button>
        </div>
      {/* Label below */}
      <div className="mt-1 text-xs font-semibold text-center w-full truncate text-white">
        {data.label}
      </div>
    </div>
  );
};

export default StartNode; 