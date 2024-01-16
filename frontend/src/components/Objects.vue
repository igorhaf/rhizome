<!--Objects.vue-->
<template>
    <ul class="pl-4 space-y-2">
        <div  class="add-tab">
            +
        </div>
        <li v-for="node in treeData" :key="node.id">
            <div class="flex items-center space-x-2" @click="toggle(node)">
                <span v-if="node.children && node.children.length">
                    <FolderOpenIcon v-if="node.expanded" class="w-5 h-5 text-yellow-400"/>
                    <FolderIcon v-else class="w-5 h-5 text-yellow-400"/>
                </span>
                <span v-else @dragstart="startDrag($event, node)" draggable="true">
                    <DocumentIcon class="w-5 h-5"/>
                </span>
                <span class="text">
                {{ node.name }}
                    </span>
            </div>
            <tree-view v-if="node.expanded && node.children" :tree-data="node.children" />
        </li>
    </ul>
</template>

<script>
import { FolderIcon, FolderOpenIcon, DocumentIcon } from '@heroicons/vue/solid';
import { EventBus } from '@/EventBus';
export default {
    data() {
        return {
            frames: [] // Supondo que você tenha uma lista de frames
        };
    },
    props: {
        treeData: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        addNewFrame(frameName) {
            this.treeData.push({
                id: this.treeData.length + 1,
                name: frameName,
                expanded: false
            });
        },
        toggle(node) {
            node.expanded = !node.expanded;
        },
        startDrag(event, node) {
            event.dataTransfer.setData('nodeData', JSON.stringify(node));
        },

    },
    created() {
        EventBus.on('add-frame', this.addNewFrame);

    },
    beforeDestroy() {
        EventBus.off('add-frame', this.addNewFrame);
    },
}
</script>
<style scoped>
.project-pane, .structure-pane {
    max-height: 300px; /* Defina a altura máxima que você deseja para os painéis. */
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
