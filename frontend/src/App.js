import React, { useEffect, useRef, useState } from 'react';
import Split from 'split.js';
import Footer from './Footer'; // Importe os componentes React equivalentes
import ColumnOne from './ColumnOne';
import ColumnTwo from './ColumnTwo';
import ColumnThree from './ColumnThree';
import './App.css';
import ProgressBar from "./ProgressBar";

const MainComponent = () => {
  const splitContainerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [showBar, setShowBar] = useState(true);
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
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 20; // Incrementa mais rápido
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowBar(false), 500); // Espera 500ms antes de esconder a barra
          return 100;
        }
        return newProgress;
      });
    }, 500); // Atualiza a cada 500ms
    return () => clearInterval(interval);
  }, []); // O array vazio assegura que o efeito será executado apenas uma vez após o componente montar

  return (
      <div>
        {/*<div className="text">
          {showBar && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex flex-col items-center justify-center" style={{zIndex: 1000}}>
                <ProgressBar progress={progress} show={showBar}/>
                <div className="text-center text-black mt-2 font-semibold">
                  Carregando... {progress}%
                </div>
              </div>
          )}
        </div>*/}
        <div className="h-screen flex flex-col">

          <div ref={splitContainerRef} style={{backgroundColor: "#1e1f22"}}
               className="overflow-hidden split-container flex-1 flex">
            <div className="split-pane">
              <ColumnOne className="flex-1 h-full"/>
            </div>
            <div className="split-pane">

              <ColumnTwo className="flex-grow overflow-hidden h-full"/>

                </div>
                <div className="split-pane">
                  <ColumnThree className="flex-1 h-full"/>
                </div>
              </div>

              <Footer/>
            </div>
      </div>
  );
};

export default MainComponent;