<template>
    <div class="bg-white p-4 shadow-lg rounded">
        <MxGraphComponent @nodeSelected="handleNodeSelected" />
    </div>
</template>

<script>
import MxGraphComponent from './MxGraphComponent.vue';

export default {
    data() {
        return {
            selectedNode: null,
        };
    },
    methods: {
        handleNodeSelected(value) {
            this.selectedNode = value;
        }
    },
    components: {
        MxGraphComponent
    },
    // o resto de seu script...
};
</script>

<style scoped>
/* Seus estilos, se necessário */
</style>
