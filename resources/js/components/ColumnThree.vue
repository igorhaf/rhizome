<template>
    <div class="bg-white p-4 shadow-lg rounded">
        <p v-if="nodeName">Nome do Objeto: {{ nodeName }}</p>
        <p v-else>Coluna 3</p>
        <TextboxComponent />
    </div>
</template>

<script>
import { EventBus } from '../EventBus.js';
import TextboxComponent from "./TextboxComponent.vue";

export default {
    components: {TextboxComponent},
    data() {
        return {
            nodeName: null,
        };
    },
    mounted() {
        EventBus.on('nodeSelected', (name) => {
            this.nodeName = name;
        });
    }
}
</script>
