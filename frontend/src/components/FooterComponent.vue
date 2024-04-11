<!--Footer.vue-->
<template>
  <footer v-if="errorMessage" class="bg text w-full p-2 flex items-center">
    <img src="../assets/images/icons/point-red.svg" height="32" width="32" alt="Error">
    <span class="ml-2">{{ errorMessage }}</span>
  </footer>
  <footer v-else class="bg text w-full p-2 flex items-center">
    <img src="../assets/images/icons/point-green.svg" height="32" width="32" alt="No Error">
  </footer>
</template>

<script>
import { EventBus } from '../EventBus.js';

export default {
  data() {
    return {
      errorMessage: null,
      successMessage: null,
    };
  },
  created() {
    EventBus.on('errorOccurred', this.handleError);
    EventBus.on('operationStatus', this.handleStatusChange);
  },
  beforeDestroy() {
    EventBus.off('errorOccurred', this.handleError);
    EventBus.off('operationStatus', this.handleStatusChange);
  },
  methods: {
    handleStatusChange(payload) {
      if (payload.status === 'success') {
        this.errorMessage = null;
        this.successMessage = payload.message;
      } else if (payload.status === 'error') {
        this.successMessage = null;
        this.errorMessage = payload.message;
      }
    },
    handleError(message) {
      this.errorMessage = null; // Reset para forçar a reatividade
      this.$nextTick(() => {
        this.errorMessage = message;
      });
    },
  },
};
</script>

<style>
/* Adicione estilos adicionais se necessário */
</style>
