<template>
    <div class="bg-white p-4">
        <p v-if="nodeName">Nome do Objeto: {{ nodeType }}</p>
        <p v-else>Coluna 3</p>
        <StartTime />
    </div>
</template>

<script>
import { EventBus } from '../EventBus.js';
import StartTime from "./GraphComponents/StartTimeComponent.vue";

export default {
    components: {StartTime},
    data() {
        return {
            nodeName: null,
            nodeType: null
        };
    },
    mounted() {
        EventBus.on('nodeSelected', (name) => {
            this.nodeName = name;
        });
        EventBus.on('nodeType', (type) => {
            this.nodeType = type;
        });

    }
}
</script>
