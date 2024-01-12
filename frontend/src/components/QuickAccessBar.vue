<template>
  <div class="quick-access-bar w-1/6">
    <div @click="showComponent('treeView')" class="qm-icons components"></div>
    <div @click="showComponent('project')" class="qm-icons frames"></div>
    <div @click="showComponent('project')" class="qm-icons integrations"></div>
    <div @click="showComponent('treeView')" class="qm-icons play"></div>
    <div @click="showComponent('treeView')" class="qm-icons database"></div>
    <div @click="showComponent('project')" class="qm-icons config"></div>
  </div>
</template>

<script>
import { EventBus } from '../EventBus.js';

export default {
  methods: {
    showComponent(componentName) {
      EventBus.emit('change-component', componentName);
    }
  }
};
</script>

<style>
.quick-access-bar{
  min-width: 200px;
}
</style>
