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

        try {

            console.log("Dados carregados com sucesso!");
        } catch (error) {
            console.error('Erro ao carregar os dados do gráfico:', error);
        }
    },
    beforeDestroy() {
        if (this.graph) {
            this.graph.destroy();
        }
    },
    methods: {
        async sendGraphDataToAPI() {
            const encoder = new mxCodec();
            const result = encoder.encode(this.graph.getModel());
            const xml = mxUtils.getXml(result);
            const graphData = this.getGraphData();

            // Emitindo o novo evento com os dados atualizados do gráfico.
            EventBus.emit('graphDataUpdated', xml);

            EventBus.emit('graphDataUpdated', graphData);

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
            this.graph.getModel().endUpdate();
            this.graph.getModel().beginUpdate();
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
            const style = this.graph.getStylesheet().getDefaultEdgeStyle();
            style[mxConstants.STYLE_ROUNDED] = true;
            style[mxConstants.STYLE_STROKEWIDTH] = 2;
            style[mxConstants.STYLE_STROKECOLOR] = '#000000';  // Define a cor da linha
            style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;

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
            this.graph.stylesheet.getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';
            this.graph.stylesheet.getDefaultEdgeStyle()['rounded'] = 1;
            this.graph.stylesheet.getDefaultEdgeStyle()['jettySize'] = 30;
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
                this.graph.insertVertex(parent, null, "Start", 80, 150, 80, 30);

            } finally {
                this.graph.getModel().endUpdate();
            }
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
        drop(event) {
            const nodeData = JSON.parse(event.dataTransfer.getData('nodeData'));
            const iconName = nodeData.children ? '📂' : '📄'; // Using emojis for simplicity. Replace with icons if needed.
            const label = `${iconName} ${nodeData.name}`;

            const point = this.graph.getPointForEvent(event);
            const parent = this.graph.getDefaultParent();
            this.graph.getModel().beginUpdate();
            try {
                this.graph.insertVertex(parent, null, label, point.x, point.y, 100, 30);
            } finally {
                this.graph.getModel().endUpdate();
            }
        }
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
    overflow: hidden;
    height: 100%;
}

.mxGraph {
    height: 100%;
}

</style>
