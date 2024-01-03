<template>
    <div class="h-full flex flex-col">
            <div ref="splitContainer" style="background-color: #1e1f22" class=" overflow-hidden split-container flex-1 flex">
                <div class="split-pane">

                    <column-one class="flex-1 h-full"></column-one>

                </div>
                <div class="split-pane">
                    <column-two class="flex-grow overflow-hidden h-full"></column-two>
                </div>
                <div class="split-pane">
                    <column-three class="flex-1  h-full"></column-three>
                </div>
        </div>

        <footer-component></footer-component>
    </div>
</template>

<script>
import FooterComponent from "./FooterComponent.vue";
import ColumnOne from "./ColumnOne.vue";
import ColumnTwo from "./ColumnTwo.vue";
import ColumnThree from "./ColumnThree.vue";

import Split from "split.js";

export default {
    components: {
        FooterComponent,
        ColumnOne,
        ColumnTwo,
        ColumnThree,
    },
    mounted() {
        this.$nextTick(() => {
            if (this.$refs.splitContainer) {
                this.setupSplit();
            }
        });
    },
    methods: {
        setupSplit() {
            if (this.$refs.splitContainer) {
                const splitPanes = this.$refs.splitContainer.querySelectorAll('.split-pane');
                if (splitPanes && splitPanes.length === 3) {
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
        }
    }
}
</script>

<style>
.split-container {
    display: flex;
    width: 100%; /* Garante que o container ocupe toda a largura */
}

.split-pane {
  /* Removido flex: 1 para permitir controle mais preciso com Split.js */
  min-width: 0; /* Previne que as colunas não encolham abaixo de um certo ponto */
}

.gutter {
    cursor: col-resize !important;
}
</style>
