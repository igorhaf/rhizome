<template>
    <div class="box border p-4 max-w-xs max-h-60 overflow-auto">
        <ul>
            <li v-for="n in 50" :key="n">
                Item {{ n }} - Conteúdo longo para potencial overflow horizontal
            </li>
        </ul>
    </div>
</template>

<script setup>
// Não há necessidade de lógica adicional para este componente.
</script>

<style scoped>
/* Você pode ajustar o tamanho do box conforme necessário */
.box {
    width: 300px;
    height: 300px;
}
</style>
