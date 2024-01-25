import React, { useRef, useEffect } from 'react';
import mxgraph from 'mxgraph';
//import api from '../services/api'; // Ajuste conforme sua implementação de API
import parseString from 'xml2js'; // Certifique-se de que xml2js está instalado

// Substitua pelos caminhos corretos das suas imagens
{/*import ifIcon from '@/assets/images/icons/if.svg';*/}
{/*import scheduleIcon from '@/assets/images/icons/schedule.svg';*/}
// ... outros ícones

const { 
  mxGraph, mxRubberband, mxKeyHandler, mxClient, mxUtils, mxEvent, mxConstants, mxCodec, mxGeometry, mxPoint, mxEdgeStyle 
} = mxgraph();

const MxGraphComponent = ({ graphContent }) => {
  const graphContainer = useRef(null);

  useEffect(() => {
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error("Browser não suportado!", 200, false);
      return;
    }

    const container = graphContainer.current;
    const graph = new mxGraph(container);

    // Configurações adicionais do gráfico
    // ... (Configurações como no componente Vue original)

    // Listener para enviar dados do gráfico para a API
    const sendGraphDataToAPI = async () => {
      const encoder = new mxCodec();
      const result = encoder.encode(graph.getModel());
      const xml = mxUtils.getXml(result);

      // Implementação do envio para a API
      /*try {
        await api.post('/graph-data', { data: xml });
      } catch (error) {
        console.error('Erro ao enviar os dados para a API:', error);
      }*/
    };
    
    graph.getModel().addListener(mxEvent.CHANGE, sendGraphDataToAPI);

    // Implementação da inicialização do gráfico
    initGraph(graph, container);

    return () => {
      if (graph) {
        graph.destroy();
      }
    };
  }, []);

  const initGraph = (graph, container) => {
    // Implemente a lógica de inicialização aqui, baseada no seu componente Vue
    // Isso inclui configurações de estilo, eventos, e outras customizações
  };

  // Implementação da função drop baseada no componente Vue
  const drop = (event, x, y) => {
    // Implemente a lógica de drop aqui
  };

  return (
    <div ref={graphContainer} className="graph-container" onDrop={drop} onDragOver={(e) => e.preventDefault()}>
      {/* Conteúdo do gráfico */}
    </div>
  );
};

export default MxGraphComponent;
