import React from 'react';

interface SidebarBaseProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const SidebarBase: React.FC<SidebarBaseProps> = ({ title, onClose, children }) => (
  <aside
    className={`fixed top-0 right-0 h-full w-96 bg-[#1e1e1e] border-l border-[#222] p-6 z-50 flex flex-col
      transform transition-transform duration-200 ease-in-out`}
    style={{ maxHeight: '100vh', overflowY: 'auto' }}
  >
    <div className="flex justify-between items-center mb-1 sticky top-0 bg-[#1e1e1e] z-10">
      <h3 className="text-base font-semibold text-gray-200">{title}</h3>
      <button onClick={onClose} className="text-gray-500 hover:text-red-400 text-lg px-1">×</button>
    </div>
    <div className="flex flex-col gap-2">{children}</div>
    <style jsx>{`
      aside::-webkit-scrollbar {
        width: 7px;
      }
      aside::-webkit-scrollbar-thumb {
        background: #23272e;
        border-radius: 4px;
      }
      aside:hover::-webkit-scrollbar-thumb {
        background: #333842;
      }
      aside::-webkit-scrollbar-track {
        background: transparent;
      }
    `}</style>
  </aside>
);

export default SidebarBase; 