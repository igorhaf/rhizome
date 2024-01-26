import React, { useEffect, useRef } from 'react';
import Split from 'split.js';
import Footer from './Footer'; // Importe os componentes React equivalentes
import ColumnOne from './ColumnOne';
import ColumnTwo from './ColumnTwo';
import ColumnThree from './ColumnThree';
import './App.css';

const MainComponent = () => {
  const splitContainerRef = useRef(null);

  useEffect(() => {
    if (splitContainerRef.current) {
      const splitPanes = splitContainerRef.current.querySelectorAll('.split-pane');
      if (splitPanes.length === 3) {
        Split(Array.from(splitPanes), {
          sizes: [20, 65, 15], // Ajustado para ter proporções 25%, 50%, 25%
          minSize: 0,
          gutterSize: 8,
          cursor: 'col-resize'
        });
      }
    } else {
      console.log("splitContainer não está definido ainda!");
    }
  }, []); // O array vazio assegura que o efeito será executado apenas uma vez após o componente montar

  return (
    <div className="h-screen flex flex-col">
      <div ref={splitContainerRef} style={{ backgroundColor: "#1e1f22" }} className="overflow-hidden split-container flex-1 flex">
        <div className="split-pane">
          <ColumnOne className="flex-1 h-full" />
        </div>
        <div className="split-pane">
          <ColumnTwo className="flex-grow overflow-hidden h-full" />
        </div>
        <div className="split-pane">
          <ColumnThree className="flex-1 h-full" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MainComponent;