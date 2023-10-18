<!--Objects.vue-->
<template>
    <ul class="pl-4 space-y-2">
        <li v-for="node in treeData" :key="node.id">
            <div class="flex items-center space-x-2" @click="toggle(node)">
                <span v-if="node.children && node.children.length">
                    <FolderOpenIcon v-if="node.expanded" class="w-5 h-5 text-yellow-400"/>
                    <FolderIcon v-else class="w-5 h-5 text-yellow-400"/>
                </span>
                <span v-else @dragstart="startDrag($event, node)" draggable="true">
                    <DocumentIcon class="w-5 h-5"/>
                </span>
                {{ node.name }}
            </div>
            <tree-view v-if="node.expanded && node.children" :tree-data="node.children" />
        </li>
    </ul>
</template>

<script>
import { FolderIcon, FolderOpenIcon, DocumentIcon } from '@heroicons/vue/solid';

export default {
    name: "TreeView",
    components: {
        FolderIcon,
        FolderOpenIcon,
        DocumentIcon,
        TreeView: "TreeView"
    },
    props: {
        treeData: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        toggle(node) {
            node.expanded = !node.expanded;
        },
        startDrag(event, node) {
            event.dataTransfer.setData('nodeData', JSON.stringify(node));
        },

    }
}
</script>
<style scoped>
.project-pane, .structure-pane {
    max-height: 300px; /* Defina a altura máxima que você deseja para os painéis. */
}
</style>
