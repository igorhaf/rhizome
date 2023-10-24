<template>
    <div class="bg-white p-4 shadow-lg rounded">
        <p v-if="nodeName">Nome do Objeto: {{ nodeName }}</p>
        <p v-else>Coluna 3</p>
        <form class="space-y-4">
            <div>
                <label for="conditional" class="block text-sm font-medium text-gray-700">Conditional</label>
                <input type="text" name="conditional" id="conditional" class="mt-1 p-2 w-full border rounded-md">
            </div>
            <div>
                <button type="submit" class="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Enviar</button>
            </div>
        </form>
    </div>
</template>

<script>
import { EventBus } from '../EventBus.js';

export default {
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
