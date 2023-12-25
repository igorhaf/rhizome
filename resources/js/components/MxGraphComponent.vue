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
        };
    },
    mounted() {
        this.$nextTick(() => {
            if (!mxClient.isBrowserSupported()) {
                mxUtils.error("Browser não suportado!", 200, false);
                return;
            }
            this.initGraph();
            this.addEventListeners();
            this.graph.getModel().addListener(mxEvent.CHANGE, this.sendGraphDataToAPI);
            window.addEventListener('resize', this.handleResize);
            this.graph.refresh();
        });
    },
    beforeDestroy() {
        if (this.graph) {
            this.graph.destroy();
        }
        window.removeEventListener('resize', this.handleResize);
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
            } catch (error) {
                console.error('Erro ao enviar os dados para a API:', error);
            }
        },
        async initGraph() {
            const container = this.$refs.graphContainer;
            this.graph = new mxGraph(container);
            // Configurações adicionais do mxGraph...
            this.configureStyles();
            this.configureGraph();
            this.loadGraphFromAPI();
            new mxRubberband(this.graph);
            new mxKeyHandler(this.graph);
        },
        configureStyles() {
            let style = this.graph.getStylesheet().getDefaultVertexStyle();
            style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
            style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = 'bottom';
            style[mxConstants.STYLE_SPACING_BOTTOM] = 32;
            this.graph.getStylesheet().putDefaultVertexStyle(style);
        },
        configureGraph() {
            this.graph.setCellsEditable(true);
            this.graph.setConnectable(true);
            this.graph.setMultigraph(false);
            this.graph.setAllowDanglingEdges(false);
            this.graph.setPanning(true);
            this.graph.panningHandler.useLeftButtonForPanning = true;
            this.graph.panningHandler.border = 0;
            this.graph.gridSize = 10;
            this.graph.scrollbars = false;
            this.graph.pageVisible = false;
            this.graph.setEnabled(true);
            this.graph.setCellsDeletable(true);
            this.graph.setCellsResizable(false);
            this.graph.stylesheet.getDefaultEdgeStyle()['rounded'] = 1;
            this.graph.stylesheet.getDefaultEdgeStyle()['jettySize'] = 30;
        },
        async loadGraphFromAPI() {
            try {
                const response = await api.get('/get-latest-diagram');
                parseString(response.data, (err, result) => {
                    this.graph.getModel().beginUpdate();
                    try {
                        // Processa e adiciona células ao gráfico...
                    } finally {
                        this.graph.getModel().endUpdate();
                    }
                });
            } catch (error) {
                console.error('Erro ao carregar o diagrama:', error);
            }
        },
        handleResize() {
            if (this.graph && this.$refs.graphContainer) {
                const container = this.$refs.graphContainer;
                const width = container.offsetWidth;
                const height = container.offsetHeight;

                this.graph.container.style.width = width + 'px';
                this.graph.container.style.height = height + 'px';

                // Informa ao mxGraph sobre a mudança de tamanho
                this.graph.view.updateViewSize();
                this.graph.view.setTranslate(0, 0);
                this.graph.sizeDidChange();
            }
        },
        // Outros métodos...
        drop(evt, x, y) {
            // Implementação de drop...
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
    overflow: hidden;
    height: 100%;
}

.mxGraph {
    height: 100%;
}
</style>
