<!--MxGraphComponent.vue-->
<template>
    <div ref="graphContainer"
         class="graph-container"
         @drop="drop"
         @dragover.prevent>
    </div>
</template>

<script>
import { EventBus } from '../EventBus.js';
import mxgraph from "mxgraph";
import api from '../services/api';
import { js2xml } from 'xml-js';

const {
    mxGraph, mxRubberband, mxKeyHandler, mxClient, mxUtils, mxEvent, mxConstants, mxCodec
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
        };
    },
    async mounted() {
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error("Browser não suportado!", 200, false);
            return;
        }

        this.initGraph();
        this.addClickEventListener();
        this.addDblClickListener();
        this.graph.getModel().addListener(mxEvent.CHANGE, this.sendGraphDataToAPI);
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
                console.log("Dados enviados com sucesso!");
            } catch (error) {
                console.error('Erro ao enviar os dados para a API:', error);
            }
        },

        async loadGraphFromDatabase() {
            const response = await api.get('/get-latest-diagram');
            const xmlData = response.data;
            let doc = mxUtils.parseXml(xmlData);
            const codec = new mxCodec(doc);
            codec.decode(doc.documentElement, this.graph.getModel());
            this.graph.getModel().beginUpdate();
            this.graph.getModel().endUpdate();

        },

        initGraph() {
            const container = this.$refs.graphContainer;
            this.graph = new mxGraph(container);

            this.graph.setCellsEditable(true);
            this.graph.setConnectable(true);

            this.graph.setMultigraph(false);  // Evita múltiplas arestas entre dois vértices
            this.graph.setAllowDanglingEdges(false);  // Evita que arestas fiquem penduradas
            this.graph.getModel().addListener(mxEvent.AFTER_ADD, () => {
                this.graph.refresh();
            });

            // Define o estilo da aresta
            const style = this.graph.getStylesheet().getDefaultVertexStyle();
            /*style[mxConstants.STYLE_ROUNDED] = true;
            style[mxConstants.STYLE_STROKEWIDTH] = 2;
            style[mxConstants.STYLE_STROKECOLOR] = '#000000';  // Define a cor da linha
            style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;*/

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
            this.graph.stylesheet.getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';
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
                this.graph.getStylesheet().putDefaultVertexStyle(style);
                const shapeType = 'start';
                const vertexName = "Start";

                const iconURL = this.getIconURLFromClassName(shapeType);
                this.graph.insertVertex(parent, null, vertexName, 80, 150, 48, 48, `shape=image;image=${iconURL}`);

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
                    EventBus.emit('nodeSelected', cell.value);
                }
            });
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
            // Isso é apenas um exemplo. Você deve ajustar de acordo com suas necessidades.
            const icons = {
                'if': '../images/icons/if.svg',
                'schedule': '../images/icons/schedule.svg',
                'sleep': '../images/icons/sleep.svg',
                'start': '../images/icons/start.svg',
                'start-time': '../images/icons/start-time.svg',
                'stop': '../images/icons/stop.svg',
                'switch': '../images/icons/switch.svg',
                'webhook': '../images/icons/webhook.svg',
                'exception': '../images/icons/exception.svg',
                'database': '../images/icons/database.svg',
                'gmail-receive': '../images/icons/gmail-receive.svg',
                'gmail-send': '../images/icons/gmail-send.svg',
                'trello-add-card': '../images/icons/trello-add-card.svg',
                'trello-remove-card': '../images/icons/trello-remove-card.svg'
            };

            return icons[className] || './images/icons/stop.svg';
        },
        drop(evt, x, y) {
            const data = evt.dataTransfer.getData('nodeData'); // ou o formato que você está usando
            const shapeType = JSON.parse(data).iconClass; // se você estiver enviando um objeto JSON como data
            const vertexName = `<div class="nb-icon-label">${JSON.parse(data).name}</div>`; // se você estiver enviando um objeto JSON como data

            const parent = this.graph.getDefaultParent();
            this.graph.getModel().beginUpdate();

            try {
                const iconURL = this.getIconURLFromClassName(shapeType);
                if(x !== undefined || y !== undefined) {
                    this.graph.setHtmlLabels(true);

                    this.graph.insertVertex(parent, null, vertexName, x, y, 48, 48, `shape=image;image=${iconURL}`);
                }
                console.log(x);
            } finally {
                this.graph.getModel().endUpdate();
            }
        }
    }
}
</script>
<style>
/*.mxCellEditor .mxPlainTextEditor{

}*/
.graph-container {
    background-size: 15px 15px;
    background-image:
        linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px);
    flex: 1;
    overflow: hidden;
    height: 100%;
}

.mxGraph {
    height: 100%;
}

</style>
