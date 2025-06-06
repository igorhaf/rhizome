import React from 'react';
import { Node } from '../types/flow';

interface ScheduleNodeSidebarProps {
  node: Node;
  onUpdate: (node: Node) => void;
  onClose: () => void;
}

const ScheduleNodeSidebar: React.FC<ScheduleNodeSidebarProps> = ({ node, onUpdate, onClose }) => {
  const data = node.data;

  return (
    <div className="w-80 h-full bg-[#1e2228] border-l border-[#23272e] p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white">Schedule Node</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={data.label || ''}
            onChange={e => onUpdate({ ...node, data: { ...data, label: e.target.value } })}
            placeholder="Node Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            rows={2}
            value={data.description || ''}
            onChange={e => onUpdate({ ...node, data: { ...data, description: e.target.value } })}
            placeholder="Add a description..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Schedule Type</label>
          <select
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={data.scheduleType || 'interval'}
            onChange={e => onUpdate({ ...node, data: { ...data, scheduleType: e.target.value as 'interval' | 'cron' } })}
          >
            <option value="interval">Interval</option>
            <option value="cron">Cron</option>
          </select>
        </div>
        {data.scheduleType === 'interval' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Interval</label>
              <input
                type="number"
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={data.interval || ''}
                onChange={e => onUpdate({ ...node, data: { ...data, interval: parseInt(e.target.value) } })}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Interval Unit</label>
              <select
                className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
                value={data.intervalUnit || 'minutes'}
                onChange={e => onUpdate({ ...node, data: { ...data, intervalUnit: e.target.value as 'seconds' | 'minutes' | 'hours' | 'days' } })}
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </>
        )}
        {data.scheduleType === 'cron' && (
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Cron Expression</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
              value={data.cronExpression || ''}
              onChange={e => onUpdate({ ...node, data: { ...data, cronExpression: e.target.value } })}
              placeholder="* * * * *"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Timezone</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={data.timezone || ''}
            onChange={e => onUpdate({ ...node, data: { ...data, timezone: e.target.value } })}
            placeholder="e.g. UTC, America/Sao_Paulo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Start Date</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={data.startDate || ''}
            onChange={e => onUpdate({ ...node, data: { ...data, startDate: e.target.value } })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">End Date</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 bg-[#23272e] border border-[#333] rounded text-white"
            value={data.endDate || ''}
            onChange={e => onUpdate({ ...node, data: { ...data, endDate: e.target.value } })}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.enabled ?? true}
            onChange={e => onUpdate({ ...node, data: { ...data, enabled: e.target.checked } })}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <label className="text-sm text-gray-200">Enabled</label>
        </div>
      </div>
    </div>
  );
};

export default ScheduleNodeSidebar; 