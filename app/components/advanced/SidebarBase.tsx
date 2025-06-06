import React, { useState, useEffect } from 'react';

interface SidebarBaseProps {
  title: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
}

const SidebarBase: React.FC<SidebarBaseProps> = ({ title, onClose, children }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 50 }}>
      {/* Overlay com fade - apenas para o sidebar */}
      <div 
        className={`absolute top-0 right-0 bottom-0 w-96 bg-black transition-all duration-300 pointer-events-auto ${
          isClosing ? 'opacity-0' : 'opacity-50'
        }`}
        onClick={handleClose}
      />
      
      {/* Sidebar */}
      <aside
        className={`absolute top-0 right-0 h-full w-96 bg-[#1e1e1e] border-l border-[#222] p-6 flex flex-col pointer-events-auto
          transform transition-all duration-300 ease-in-out
          ${isClosing ? 'translate-x-full' : isVisible ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ 
          maxHeight: '100vh', 
          overflowY: 'auto',
          willChange: 'transform'
        }}
      >
        <div className="flex justify-between items-center mb-1 sticky top-0 bg-[#1e1e1e] z-10">
          <h3 className="text-base font-semibold text-gray-200">{title}</h3>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-red-400 text-lg px-1 transition-colors duration-150"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-2">{children}</div>
        <style jsx>{`
          aside {
            transform-origin: right;
          }
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
    </div>
  );
};

export default SidebarBase; 