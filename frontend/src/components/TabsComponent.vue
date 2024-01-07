<!--TabsComponent.vue-->
<template>
  <div class="tabs-container">
    <div class="tabs-wrapper">
      <div @click="addTab" class="add-tab">
        +
      </div>
      <div v-for="(tab, index) in tabs" :key="tab.id"
           :class="{'active-tab': activeTab === index}"
           @click="changeTab(index)"
           @dblclick="enableEdit(tab)"
           class="tab">
        <input v-if="tab.isEditing" v-model="tab.label" @blur="saveTabName(tab)" ref="tabInput" class="tab-input"/>
        <span v-else>{{ tab.label }}</span>
        <span @click.stop="closeTab(index)" class="close-btn">X</span>
      </div>

    </div>
  </div>
</template>

<script>
import {DocumentIcon, FolderIcon, FolderOpenIcon} from "@heroicons/vue/solid";
import {EventBus} from "../EventBus";
export default {
    props: ['tabs', 'activeTab'],

    data() {
        return {
            tabs: [
                { id: 1, label: 'Frame 1', content: 'MxGraphComponent', isEditing: false }
            ],
            nextTabId: 2,
            activeTab: 0
        };
    },
    methods: {
        changeTab(index) {
            this.activeTab = index;
            this.$emit('tabChanged', index);
        },
        addTab() {
            const nextTab = {
                id: this.nextTabId,
                label: `Frame ${this.nextTabId}`,
                content: 'MxGraphComponent',
                isEditing: false
            };
            this.tabs.push(nextTab);
            this.activeTab = this.tabs.length - 1;
            this.nextTabId++;
            this.$emit('tabAdded');
            EventBus.emit('add-frame', nextTab.label); // Enviar o nome do frame junto com o evento
        },
        enableEdit(tab) {
            tab.isEditing = true;
            this.$nextTick(() => {
                this.$refs.tabInput.focus();
            });
        },
        saveTabName(tab) {
            tab.isEditing = false;
        },
      closeTab(index) {
          this.tabs.splice(index, 1);
          if (this.activeTab >= index) {
            this.activeTab = Math.max(0, this.activeTab - 1);
          }
          EventBus.emit('tabClosed', index);
          this.$emit('tabChanged', this.activeTab);  // Adicione essa linha
      }
    }
}
</script>

<style scoped>
.tabs-container {
  margin-top: 0; /* Adjusted to match your design */
  overflow-x: hidden;
}

.tabs-wrapper {
  display: flex;

  background: #2B2F3A; /* Color of your tab background */
  padding: 0; /* Adjusted to match your design */
}

.tab {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px; /* Adjusted to match your design */
  margin-right: 0; /* Adjusted to match your design */
  font-size: 12px; /* Adjusted to match your design */
  color: white; /* Text color */
  background: #3F4451; /* Non-active tab background */
  border: none;
  cursor: pointer;
  position: relative;
}

.tab.active-tab {
  background: #32363E; /* Active tab background */
}

.tab:not(.active-tab):hover {
  background: #373C49; /* Hover state for non-active tabs */
}

.tab.active-tab::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0; /* Coloca o pseudo-elemento na parte inferior da aba */
  width: 100%;
  height: 2px;
  background-color: #4fa0f8; /* Cor do indicador */
}

.close-btn {
  margin-left: 8px;
  color: #F56565;
  cursor: pointer;
  font-size: x-small;
}

.add-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px; /* Adjusted to match your design */
  height: 24px; /* Adjusted to match your design */
  font-size: 20px; /* Adjusted to match your design */
  color: white; /* Text color */
  background: #373C49; /* Color of your add button */
  border-radius: 50%; /* To make it round */
  cursor: pointer;
  margin: 5px 10px 5px 5px;
}

.add-tab:hover {
  background: #6DA0FE;
}
</style>
