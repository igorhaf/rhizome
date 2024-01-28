<!--MxGraphComponent.vue-->
<template>
    <div ref="graphContainer"
         class="graph-container"
         @drop="drop"
         @dragover.prevent>
    </div>
</template>

<script>
import { EventBus } from '@/EventBus';
import mxgraph from "mxgraph";
import api from '../services/api';
var parseString = require('xml2js').parseString;

const {
    mxGraph, mxRubberband, mxKeyHandler, mxClient, mxUtils, mxEvent, mxConstants, mxCodec, mxGeometry, mxPoint, mxEdgeStyle
} = mxgraph();

export default {
    name: "MxGraphComponent",
    props: {
        graphContent: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            graph: null,
            ifIcon: require('@/assets/images/icons/if.svg'),
            scheduleIcon: require('@/assets/images/icons/schedule.svg'),
            sleepIcon: require('@/assets/images/icons/sleep.svg'),
            startIcon: require('@/assets/images/icons/start.svg'),
            starttimeIcon: require('@/assets/images/icons/starttime.svg'),
            stopIcon: require('@/assets/images/icons/stop.svg'),
            switchIcon: require('@/assets/images/icons/switch.svg'),
            webhookIcon: require('@/assets/images/icons/webhook.svg'),
            exceptionIcon: require('@/assets/images/icons/exception.svg'),
            queryIcon: require('@/assets/images/icons/query.svg'),
            gmailReceiveIcon: require('@/assets/images/icons/gmail-receive.svg'),
            gmailSendIcon: require('@/assets/images/icons/gmail-send.svg'),
            trelloAddCardIcon: require('@/assets/images/icons/trello-add-card.svg'),
            trelloRemoveCardIcon: require('@/assets/images/icons/trello-remove-card.svg'),
            linkIcon: require('@/assets/images/icons/link.svg'),
            apiIcon: require('@/assets/images/icons/api.svg'),
            bashIcon: require('@/assets/images/icons/bash.svg'),
            javascriptIcon: require('@/assets/images/icons/javascript.svg'),
        };
    },
    mounted() {
        this.$nextTick(() => {
            if (!mxClient.isBrowserSupported()) {
                mxUtils.error("Browser não suportado!", 200, false);
                return;
            }
            this.initGraph();
            this.addClickEventListener();
            this.addDblClickListener();
            //this.addConsoleEventListener()
            this.graph.getModel().addListener(mxEvent.CHANGE, this.sendGraphDataToAPI);
            this.graph.refresh();

            // Certifique-se de redimensionar o gráfico após a inicialização
        });
        // Ouvinte de eventos para redimensionamento da janela
    },
    beforeDestroy() {
        if (this.graph) {
            this.graph.destroy();
        }
    },
    methods: {
        created() {
            EventBus.on('tabClosed', (tabIndex) => {
                if (this.graph[tabIndex]) {
                    this.graph[tabIndex].destroy();
                }
            });
        },
        async sendGraphDataToAPI() {
            const encoder = new mxCodec();
            const result = encoder.encode(this.graph.getModel());
            const xml = mxUtils.getXml(result);

            EventBus.emit('graphDataUpdated', xml);

            try {
                await api.post('/graph-data', { data: xml });
                //console.log("Dados enviados com sucesso!");
            } catch (error) {
                //console.error('Erro ao enviar os dados para a API:', error);
            }
        },

        async initGraph() {
            const container = this.$refs.graphContainer;
            this.graph = new mxGraph(container);
            mxUtils.alert = function(message) {
              console.log("Emitindo evento de erro:", message);
              EventBus.emit('errorOccurred', message);
            };
            this.graph.setCellsEditable(true);
            this.graph.setConnectable(true);
            this.addConsoleEventListener();
            this.graph.setMultigraph(false);  // Evita múltiplas arestas entre dois vértices
            this.graph.setAllowDanglingEdges(false);  // Evita que arestas fiquem penduradas
            this.graph.getModel().addListener(mxEvent.AFTER_ADD, () => {
                this.graph.refresh();
            });

            // Define o estilo da aresta
            const style = this.graph.getStylesheet().getDefaultVertexStyle();


            style[mxConstants.STYLE_EXIT_X] = 1.0;  // Ponto de saída no meio do vértice
            style[mxConstants.STYLE_EXIT_Y] = 0.5;  // Ponto de saída na parte inferior do vértice
            style[mxConstants.STYLE_EXIT_PERIMETER] = 0;  // Desativa a busca do ponto de saída ao redor do perímetro do vértice
            style[mxConstants.STYLE_ENTRY_X] = 0;  // Ponto de entrada no meio do vértice
            style[mxConstants.STYLE_ENTRY_Y] = 0.5;    // Ponto de entrada na parte superior do vértice
            style[mxConstants.STYLE_ENTRY_PERIMETER] = 0;  // Desativa a busca do ponto de entrada ao redor do perímetro do vértice




            this.graph.setPanning(true);
            this.graph.panningHandler.useLeftButtonForPanning = true;
            this.graph.panningHandler.border = 0;
            this.graph.gridSize = 10;
            this.graph.scrollbars = false;  // Desabilita as barras de rolagem
            this.graph.pageVisible = false; // Evita que o mxGraph ajuste o tamanho do contêiner
            this.graph.setEnabled(true);
            this.graph.setCellsDeletable(true);
            //this.graph.stylesheet.getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';
            this.graph.stylesheet.getDefaultEdgeStyle()['rounded'] = 1;
            this.graph.stylesheet.getDefaultEdgeStyle()['jettySize'] = 30;
            this.graph.setCellsResizable(false);

            mxEvent.addListener(container, 'drop', (evt) => {
                const x = mxEvent.getClientX(evt);
                const y = mxEvent.getClientY(evt);
                const cord = mxUtils.convertPoint(container, x, y);
                this.drop(evt, cord.x, cord.y);
            });

            container.setAttribute('draggable', 'true');
            mxEvent.addListener(container, 'dragover', (evt) => {
                evt.stopPropagation();
                evt.preventDefault();
            });
            const initialWidth = container.offsetWidth;
            const initialHeight = container.offsetHeight;
            this.graph.addListener(mxEvent.SIZE, (sender, evt) => {
                container.style.width = `${initialWidth}px`;
                container.style.height = `${initialHeight}px`;
            });
            new mxRubberband(this.graph);
            new mxKeyHandler(this.graph);


            const parent = this.graph.getDefaultParent();
            this.graph.getModel().beginUpdate();


            try {
                let style = this.graph.getStylesheet().getDefaultVertexStyle();
                style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
                style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = 'bottom';
                style[mxConstants.STYLE_SPACING_BOTTOM] = 32; // Mova o label 32 pixels para cima
                style[mxConstants.STYLE_FONTCOLOR] = '#dee0e4';  // Branco


                this.graph.getStylesheet().putDefaultVertexStyle(style);
                const shapeType = 'start';
                const vertexName = "Start";

                const iconURL = this.getIconURLFromClassName(shapeType);
                const response = await api.get('/get-latest-diagram');
                const self = this;
                parseString(response.data.data, function (err, result) {
                    Object.values(result.mxGraphModel.root).forEach(val => {
                        Object.entries(val.mxCell).forEach(entry => {
                            const [key, value] = entry;
                            if(value.$.vertex === '1') {
                                if (key !== '0') {
                                    if (key !== '1') {
                                        console.log(value.$.parent);

                                        self.graph.insertVertex(parent, value.$.id, value.$.value, value.mxGeometry[0].$.x, value.mxGeometry[0].$.y, 48, 48, value.$.style);
                                    }
                                }
                            }
                            if (value.$.edge === '1') {
                                const edge = self.graph.insertEdge(parent, value.$.id, value.$.value, self.graph.model.getCell(value.$.source), self.graph.model.getCell(value.$.target));
                                if (value.Array && value.Array.mxPoint) {
                                    let geometry = new mxGeometry();
                                    geometry.relative = true;
                                    edge.geometry = geometry;
                                    geometry.points = value.Array.mxPoint.map(point => new mxPoint(point.$.x, point.$.y));
                                    self.graph.model.setGeometry(edge, geometry);
                                }
                            }

                        });
                    });
                });


            } finally {
                this.graph.getModel().endUpdate();
            }

            new mxRubberband(this.graph);



            const keyHandler = new mxKeyHandler(this.graph);
            keyHandler.bindKey(46, (evt) => {
                if (this.graph.isEnabled()) {
                    this.graph.removeCells();
                }
            });
        },
        addClickEventListener() {
            this.graph.addListener(mxEvent.CLICK, (sender, evt) => {
                const cell = evt.getProperty('cell');
                if (cell && cell.value) {
                    let regex = /shape=image;image=\/img\/([^.]+)\..*\.svg/;
                    let nodeType = cell.style.match(regex);
                    EventBus.emit('nodeSelected', cell.value);
                    EventBus.emit('nodeType', nodeType[1]);
                }
            });
        },

      addConsoleEventListener() {
        mxUtils.alert = function(message) {
          console.log("Alert from mxGraph:", message);
        };

        this.graph.addListener(mxEvent.CELL_CONNECTED, async (sender, evt) => {
          const edge = evt.getProperty('edge');

          const source = this.graph.getModel().getTerminal(edge, true);
          const target = this.graph.getModel().getTerminal(edge, false);

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
              const edges = this.graph.getModel().getEdges(source);
              const outgoingEdges = edges.filter(e => e.source === source && e.target !== source);
                if (outgoingEdges.length > 1) {
                  // Se "start" já tem uma aresta saindo e está tentando fazer outra, remova a nova aresta.
                  this.graph.getModel().beginUpdate();
                  try {
                    EventBus.emit('errorOccurred', 'O "'+sourceType+'" não pode ter mais de uma conexão saindo.');
                    target.removeEdge(edge, true);
                  } finally {
                    this.graph.getModel().endUpdate();
                  }
                  return;
                }
              }
            }

          if (targetType === 'start') {
            this.graph.getModel().beginUpdate();
            try {
              EventBus.emit('errorOccurred', 'O "start" não pode ser o alvo de uma conexão.');
              target.removeEdge(edge, true);
            } finally {
              this.graph.getModel().endUpdate();
            }
            return;
          }

            if (sourceType === 'stop') {
                this.graph.getModel().beginUpdate();
                try {
                    EventBus.emit('errorOccurred', 'O "stop" não pode ser fonte de uma conexão.');
                    target.removeEdge(edge, true);
                } finally {
                    this.graph.getModel().endUpdate();
                }
                return;
            }

            if (sourceType === 'exception') {
                this.graph.getModel().beginUpdate();
                try {
                    EventBus.emit('errorOccurred', 'O "exception" não pode ser fonte de uma conexão.');
                    target.removeEdge(edge, true);
                } finally {
                    this.graph.getModel().endUpdate();
                }
                return;
            }


          // Verifica se já existe uma aresta na direção oposta
          let existingConnections = this.graph.getModel().getEdgesBetween(target, source);

          for (let i = 0; i < existingConnections.length; i++) {
            let src = this.graph.getModel().getTerminal(existingConnections[i], true);
            let trg = this.graph.getModel().getTerminal(existingConnections[i], false);

            if (src.id === target.id && trg.id === source.id) {
              // Se uma conexão inversa já existe
              this.graph.getModel().beginUpdate();
              try {
                EventBus.emit('errorOccurred', 'Uma conexão inversa já existe!');
                target.removeEdge(edge, true);

                break;

              } finally {
                this.graph.getModel().endUpdate();
              }
              break;
            }
          }

          if (sourceType !== 'start') {
            let currentSource = source; // Começa com a fonte atual
            let foundStart = false; // Flag para indicar se encontrou um 'start'

            // Loop para subir a cadeia de ancestrais
            while (!foundStart && currentSource) {
              let edges = this.graph.getModel().getIncomingEdges(currentSource);
              if (edges.length > 0) {
                // Assume que cada vértice tem apenas uma aresta entrante
                let nextSource = this.graph.getModel().getTerminal(edges[0], true);
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

            if (!this.followsStartFlow(target) || !this.followsStartFlow(source)) {
              target.removeEdge(edge, true);
              mxUtils.alert('A conexão deve seguir o fluxo a partir de "start".');
              evt.consume();
            }
          }
        });
        mxUtils.alert = function(message) {
          console.log("Emitindo evento de erro:", message);
          EventBus.emit('errorOccurred', message);
        };
      },
      followsStartFlow(vertex) {
        if (!vertex) return false;

        // Verifica se o vértice é do tipo 'start' através do seu estilo
        const style = vertex.getStyle();
        const regex = /shape=image;image=\/img\/start\.[^.]+\.svg/;
        console.log(regex.test(style));
        if (style && regex.test(style)) {
          return true; // O vértice atual é 'start'
        }

        // Rastreia o caminho de entrada até encontrar um 'start'
        let incomingEdges = this.graph.getModel().getIncomingEdges(vertex);
        for (let i = 0; i < incomingEdges.length; i++) {
          let source = this.graph.getModel().getTerminal(incomingEdges[i], true);
          if (source && this.followsStartFlow(source)) {
            return true; // Caminho válido encontrado
          }
        }

        // Não encontrou um caminho válido até 'start'
        return false;
      },
        addDblClickListener() {
            this.graph.addListener(mxEvent.DOUBLE_CLICK, (sender, evt) => {
                const cell = evt.getProperty('cell');
                if (cell) {
                    if (cell.isVertex()) {
                        this.graph.startEditing(cell);
                    } else if (cell.isEdge()) {
                        this.graph.startEditingAtCell(cell);
                    }
                }
            });

        },
        getIconURLFromClassName(className) {
            const icons = {
                'if': this.ifIcon,
                'schedule': this.scheduleIcon,
                'sleep': this.sleepIcon,
                'start': this.startIcon,
                'starttime': this.starttimeIcon,
                'stop': this.stopIcon,
                'switch': this.switchIcon,
                'webhook': this.webhookIcon,
                'exception': this.exceptionIcon,
                'query': this.queryIcon,
                'gmail-receive': this.gmailReceiveIcon,
                'gmail-send': this.gmailSendIcon,
                'trello-add-card': this.trelloAddCardIcon,
                'trello-remove-card': this.trelloRemoveCardIcon,
                'link': this.linkIcon,
                'api': this.apiIcon,
                'javascript': this.javascriptIcon,
                'bash': this.bashIcon,
            };

            return icons[className] || this.stopIcon;
        },
      drop(evt, x, y) {
        const data = evt.dataTransfer.getData('nodeData');
        const shapeType = JSON.parse(data).iconClass;
        const vertexName = JSON.parse(data).name;

        const parent = this.graph.getDefaultParent();

        this.graph.getModel().beginUpdate();
        try {
          const iconURL = this.getIconURLFromClassName(shapeType);
          // Utiliza a expressão regular para determinar se o ícone é do tipo 'start'
          const regex = /\/img\/([^.]+)\..*\.svg/;
          const shapeMatch = iconURL.match(regex);
          const type = shapeMatch ? shapeMatch[1] : null;

          if (type === 'start') {
            // Verifica se já existe um vértice do tipo 'start'
            const existingVertices = this.graph.getChildVertices(parent);
            const startVertexExists = existingVertices.some(vertex => {
              const style = vertex.getStyle();
              const match = style && style.match(regex);
              return match && match[1] === 'start';
            });

            if (startVertexExists) {
              // Se um vértice 'start' já existe, não adiciona outro e emite um evento de erro
              EventBus.emit('errorOccurred', 'Dois vertices do tipo start, não podem coexistir no maesmo frame.');
              return; // Interrompe a execução do método
            }
          }

          // Se não for do tipo 'start' ou se não houver nenhum 'start', adiciona o novo vértice
          if (x !== undefined && y !== undefined) {
            this.graph.setHtmlLabels(true);
            this.graph.insertVertex(parent, null, vertexName, x - 24, y - 24, 48, 48, `shape=image;image=${iconURL}`);
          }
        } finally {
          this.graph.getModel().endUpdate();
        }
      },

    }
}
</script>
<style>

.graph-container {
    background-size: 15px 15px;
    background-image:
        linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px);
    flex: 1;
    background-color: #1e1f22;
    overflow: hidden;
    height: 100% !important;
    width: auto !important;

}
.graph-container .mxPlainTextEditor{
    color: #FFFFFF!important;
}
.mxGraph {
    height: 100%;
}

</style>
