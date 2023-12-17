<template>
    <div ref="splitContainer" class="split-container" v-show="isOpen">
        <div class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded shadow-lg flex max-w-xl w-full max-h-screen mt-20 mb-20 overflow-y-auto text-black">
                <div class="flex-1 border-r border-gray-300 p-4 split-pane">
                    <ThirdPartyListComponent />
                </div>
                <div class="flex-1 p-4 split-pane">
                    <ThirdPartyListResourcesComponent />
                    <button @click="closeModal" class="mt-4">Fechar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ThirdPartyListComponent from "./ThirdPartyListComponent.vue";
import ThirdPartyListResourcesComponent from "./ThirdPartyListResourcesComponent.vue";
import Split from 'split.js';

export default {
    components: { ThirdPartyListResourcesComponent, ThirdPartyListComponent },
    props: {
        isOpen: Boolean
    },

    mounted() {
        this.$nextTick(() => {
            if (this.$refs.splitContainer) {
                this.setupSplit();
            }
        });
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        setupSplit() {
            if (this.$refs.splitContainer) {
                const splitPanes = this.$refs.splitContainer.querySelectorAll('.split-pane');
                if (splitPanes && splitPanes.length === 2) {
                    Split(Array.from(splitPanes), {
                        sizes: [50, 50],
                        direction: 'horizontal',
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
.modal {
    z-index: 1000;
}
.gutter {
    cursor: col-resize !important;
}
</style>
