<template>
    <div class="bg-white p-4 shadow-lg rounded">
        <TabsComponent :tabs="tabs" :activeTab="activeTab" @tabAdded="handleTabAdded" @tabChanged="handleTabChange" />
        <MxGraphComponent
            v-for="(tab, index) in tabs"
            :key="tab.id"
            v-show="activeTab === index"
            :graphContent="tab.content"
            @nodeSelected="handleNodeSelected" />
    </div>
</template>

<script>
import MxGraphComponent from './MxGraphComponent.vue';
import TabsComponent from "./TabsComponent.vue";
import { EventBus } from '../EventBus.js';

export default {
    data() {
        return {
            tabs: [
                {
                    id: 1,
                    label: 'Tab 1',
                    content: 'Conteúdo da Tab 1',
                    graphData: null
                }
            ],
            activeTab: 0,
            nextTabId: 2
        };
    },
    methods: {
        handleTabChange(index) {
            this.activeTab = index;
        },
        handleTabAdded() {
            const nextTab = {
                id: this.nextTabId,
                label: `Tab ${this.nextTabId}`,
                content: `Conteúdo da Tab ${this.nextTabId}`,
                graphData: null
            };
            this.tabs.push(nextTab);
            this.activeTab = this.tabs.length - 1;
            this.nextTabId++;
        },
        handleNodeSelected(node) {
            console.log('Node selecionado:', node);
        }
    },
    components: {
        MxGraphComponent,
        TabsComponent
    }
}
</script>
