<template>
  <div class="overflow-x-auto relative">
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th scope="col" class="py-3 px-6">Coluna 1</th>
        <th scope="col" class="py-3 px-6">Coluna 2</th>
        <th scope="col" class="py-3 px-6">Coluna 3</th>
        <th scope="col" class="py-3 px-6">Coluna 4</th>
        <th scope="col" class="py-3 px-6">Coluna 5</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in 20" :key="row" class="bg-white border-b">
        <td class="py-4 px-6">Linha {{ row }} - Coluna 1</td>
        <td class="py-4 px-6">Linha {{ row }} - Coluna 2</td>
        <td class="py-4 px-6">Linha {{ row }} - Coluna 3</td>
        <td class="py-4 px-6">Linha {{ row }} - Coluna 4</td>
        <td class="py-4 px-6">Linha {{ row }} - Coluna 5</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'SimpleTable'
}
</script>

<style>
/* Aqui você pode adicionar estilos específicos se necessário */
</style>
