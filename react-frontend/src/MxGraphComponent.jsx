import React, { useRef, useEffect, useState } from 'react';
import mxgraph from 'mxgraph';
import './MxGraphComponent.css';

const {
  mxGraph, mxRubberband, mxKeyHandler, mxClient, mxUtils, mxEvent, mxConstants, mxCodec
} = mxgraph();

const MxGraphComponent = ({ onNodeSelected, onNodeType }) => {
  const graphContainer = useRef(null);
  const [graph, setGraph] = useState(null);

  const getIconURLFromClassName = (className) => {
    const icons = {
      'if': '/path/to/ifIcon.svg',
      'schedule': '/path/to/scheduleIcon.svg',
      // ...outros ícones
    };
    return icons[className] || '';
  };

  const initGraph = (container) => {
    const newGraph = new mxGraph(container);
    setGraph(newGraph);
    mxUtils.alert = (message) => {
      console.log("Emitindo evento de erro:", message);
    };

    newGraph.setCellsEditable(true);
    newGraph.setConnectable(true);
    newGraph.setMultigraph(false);
    newGraph.setAllowDanglingEdges(false);

    const style = newGraph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_EXIT_X] = 1.0;
    style[mxConstants.STYLE_EXIT_Y] = 0.5;
    style[mxConstants.STYLE_EXIT_PERIMETER] = 0;
    style[mxConstants.STYLE_ENTRY_X] = 0;
    style[mxConstants.STYLE_ENTRY_Y] = 0.5;
    style[mxConstants.STYLE_ENTRY_PERIMETER] = 0;

    newGraph.setPanning(true);
    newGraph.panningHandler.useLeftButtonForPanning = true;
    newGraph.panningHandler.border = 0;
    newGraph.gridSize = 10;
    newGraph.scrollbars = false;
    newGraph.pageVisible = false;
    newGraph.setEnabled(true);
    newGraph.setCellsDeletable(true);
    newGraph.stylesheet.getDefaultEdgeStyle().rounded = 1;
    newGraph.stylesheet.getDefaultEdgeStyle().jettySize = 30;
    newGraph.setCellsResizable(false);

    newGraph.getModel().beginUpdate();
    try {
      newGraph.getStylesheet().putDefaultVertexStyle(style);
    } finally {
      newGraph.getModel().endUpdate();
    }

    new mxRubberband(newGraph);
    new mxKeyHandler(newGraph);

    return newGraph;
  };

  const drop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('nodeData');
    const { iconClass, name } = JSON.parse(data);

    const parent = graph.getDefaultParent();
    graph.getModel().beginUpdate();
    try {
      const iconURL = getIconURLFromClassName(iconClass);
      const x = event.clientX - graph.container.getBoundingClientRect().left;
      const y = event.clientY - graph.container.getBoundingClientRect().top;
      graph.insertVertex(parent, null, name, x, y, 48, 48, `shape=image;image=${iconURL}`);
    } finally {
      graph.getModel().endUpdate();
    }
  };

  const addClickEventListener = (graph) => {
    graph.addListener(mxEvent.CLICK, (sender, evt) => {
        graph.addListener(mxEvent.CLICK, (sender, evt) => {
            const cell = evt.getProperty('cell');
            if (cell && cell.value) {
              let regex = /shape=image;image=\/img\/([^.]+)\..*\.svg/;
              let nodeType = cell.style.match(regex);
              if (nodeType && nodeType.length > 1) {
                onNodeSelected(cell.value);
                onNodeType(nodeType[1]);
              }
            }
          });
    });
  };
  const addConsoleEventListener = (graph) => {
    mxUtils.alert = function(message) {
      console.log("Alert from mxGraph:", message);
    };

    graph.addListener(mxEvent.CELL_CONNECTED, async (sender, evt) => {
      const edge = evt.getProperty('edge');

      const source = graph.getModel().getTerminal(edge, true);
      const target = graph.getModel().getTerminal(edge, false);

      if (!edge || !source || !target) {
        return; // Se não for uma aresta válida ou não tiver terminais, ignora
      }

      const regex = /shape=image;image=\/img\/([^.]+)\..*\.svg/;
      const sourceMatch = source.getStyle().match(regex);
      const targetMatch = target.getStyle().match(regex);
      const sourceType = sourceMatch ? sourceMatch[1] : null;
      const targetType = targetMatch ? targetMatch[1] : null;

      if (sourceType !== 'if'){
        if (sourceType !== 'switch'){
          const edges = graph.getModel().getEdges(source);
          const outgoingEdges = edges.filter(e => e.source === source && e.target !== source);
            if (outgoingEdges.length > 1) {
              // Se "start" já tem uma aresta saindo e está tentando fazer outra, remova a nova aresta.
              graph.getModel().beginUpdate();
              try {
                //EventBus.emit('errorOccurred', 'O "'+sourceType+'" não pode ter mais de uma conexão saindo.');
                target.removeEdge(edge, true);
              } finally {
                graph.getModel().endUpdate();
              }
              return;
            }
          }
        }

      if (targetType === 'start') {
        graph.getModel().beginUpdate();
        try {
          //EventBus.emit('errorOccurred', 'O "start" não pode ser o alvo de uma conexão.');
          target.removeEdge(edge, true);
        } finally {
          graph.getModel().endUpdate();
        }
        return;
      }

        if (sourceType === 'stop') {
            graph.getModel().beginUpdate();
            try {
                //EventBus.emit('errorOccurred', 'O "stop" não pode ser fonte de uma conexão.');
                target.removeEdge(edge, true);
            } finally {
                graph.getModel().endUpdate();
            }
            return;
        }

        if (sourceType === 'exception') {
            graph.getModel().beginUpdate();
            try {
                //EventBus.emit('errorOccurred', 'O "exception" não pode ser fonte de uma conexão.');
                target.removeEdge(edge, true);
            } finally {
                graph.getModel().endUpdate();
            }
            return;
        }


      // Verifica se já existe uma aresta na direção oposta
      let existingConnections = graph.getModel().getEdgesBetween(target, source);

      for (let i = 0; i < existingConnections.length; i++) {
        let src = graph.getModel().getTerminal(existingConnections[i], true);
        let trg = graph.getModel().getTerminal(existingConnections[i], false);

        if (src.id === target.id && trg.id === source.id) {
          // Se uma conexão inversa já existe
          graph.getModel().beginUpdate();
          try {
            //EventBus.emit('errorOccurred', 'Uma conexão inversa já existe!');
            target.removeEdge(edge, true);

            break;

          } finally {
            graph.getModel().endUpdate();
          }
          break;
        }
      }

      if (sourceType !== 'start') {
        let currentSource = source; // Começa com a fonte atual
        let foundStart = false; // Flag para indicar se encontrou um 'start'

        // Loop para subir a cadeia de ancestrais
        while (!foundStart && currentSource) {
          let edges = graph.getModel().getIncomingEdges(currentSource);
          if (edges.length > 0) {
            // Assume que cada vértice tem apenas uma aresta entrante
            let nextSource = graph.getModel().getTerminal(edges[0], true);
            if (nextSource) {
              let style = nextSource.getStyle();
              if (style) {
                let match = style.match(regex);
                if (match && match[1] === 'start') {
                  foundStart = true; // Encontrou um ancestral do tipo 'start'
                } else {
                  currentSource = nextSource; // Atualiza a fonte atual e continua o loop
                }
              } else {
                break; // Sai do loop se o estilo não for definido
              }
            } else {
              break; // Sai do loop se não houver mais fontes
            }
          } else {
            break; // Sai do loop se não houver arestas entrantes
          }
        }

        if (!followsStartFlow(target, graph) || !followsStartFlow(source, graph)) {
          target.removeEdge(edge, true);
          mxUtils.alert('A conexão deve seguir o fluxo a partir de "start".');
          evt.consume();
        }
      }
    });
    mxUtils.alert = function(message) {
      console.log("Emitindo evento de erro:", message);
      //EventBus.emit('errorOccurred', message);
    };
    /*if (!followsStartFlow(target) || !followsStartFlow(source)) {
      target.removeEdge(edge, true);
      mxUtils.alert('A conexão deve seguir o fluxo a partir de "start".');
      evt.consume();
    }*/
  };
  const followsStartFlow = (vertex, graph) => {
    if (!vertex) return false;
    console.log(graph)
    // Verifica se o vértice é do tipo 'start' através do seu estilo
    const style = vertex.getStyle();
    const regex = /shape=image;image=\/img\/start\.[^.]+\.svg/;
    console.log(regex.test(style));
    if (style && regex.test(style)) {
      return true; // O vértice atual é 'start'
    }

    // Rastreia o caminho de entrada até encontrar um 'start'
    let incomingEdges = graph.getModel().getIncomingEdges(vertex);
    for (let i = 0; i < incomingEdges.length; i++) {
      let source = graph.getModel().getTerminal(incomingEdges[i], true);
      if (source && followsStartFlow(source, graph)) {
        return true; // Caminho válido encontrado
      }
    }

    // Não encontrou um caminho válido até 'start'
    return false;
  };
  useEffect(() => {
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error('Browser não suportado!', 200, false);
      return;
    }

    const newGraph = initGraph(graphContainer.current);
    addClickEventListener(newGraph);
    addConsoleEventListener(newGraph);

    const sendGraphDataToAPI = async () => {
      // ... implementação de envio de dados para a API
    };

    newGraph.getModel().addListener(mxEvent.CHANGE, sendGraphDataToAPI);

    return () => {
      newGraph.destroy();
    };
  }, [graphContainer, onNodeSelected, onNodeType]); // As dependências corretas devem ser listadas aqui

  return (
    <div ref={graphContainer} className="graph-container" onDrop={drop} onDragOver={(e) => e.preventDefault()}>
      {/* Conteúdo do gráfico */}
    </div>
  );
};

export default MxGraphComponent;
