<!--ColumnOne.vue-->
<template>
    <div class="bg-white p-4 shadow-lg rounded flex flex-col h-full space-y-4">

        <!-- TreeView Card -->
        <div class="flex flex-col flex-1 bg-gray-100 p-4 rounded shadow">
            <h2 class="text-xl font-bold mb-4">Components</h2>
            <div class="flex-1 overflow-auto" style="max-height: 45vh;">
                <div class="min-w-max">
                    <tree-view :tree-data="logic"></tree-view>
                </div>
            </div>
        </div>

        <!-- Objects Card -->
        <div class="flex flex-col flex-1 bg-gray-100 p-4 rounded shadow">
            <h2 class="text-xl font-bold mb-4">Objects</h2>
            <div class="flex-1 overflow-auto" style="max-height: 45vh;">
                <div class="min-w-max">
                    <objects :tree-data="objects"></objects>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import TreeView from './TreeView.vue';
import Objects from './Objects.vue';

export default {
    components: {
        Objects,
        TreeView
    },
    data() {
        return {
            logic: [
                {
                    id: 1,
                    name: "Logic Layer",
                    expanded: false,
                    children: [
                        { id: 2, name: "if" },
                        { id: 3, name: "else" }
                    ]
                },
                {
                    id: 4,
                    name: "Third-party",
                    expanded: false,
                    children: [
                        {
                            id: 5,
                            name: "gmail",
                            expanded: false,
                            children: [
                                { id: 6, name: "send mail" },
                                { id: 7, name: "get mail" }
                            ]
                        },
                        {
                            id: 8,
                            name: "trello",
                            expanded: false,
                            children: [
                                { id: 9, name: "create card" },
                                { id: 10, name: "remove card" }
                            ]
                        }
                    ]
                },
                {
                    id: 11,
                    name: "Miscellaneous",
                    expanded: false,
                    children: [
                        {
                            id: 12,
                            name: "Documents",
                            expanded: false,
                            children: [
                                { id: 13, name: "Repositories" }
                            ]
                        }
                    ]
                }
            ],
            objects: [{
                    id: 1,
                    name: "Frame 1",
                    expanded: false,
                },
            ],
        };
    }
}
</script>
