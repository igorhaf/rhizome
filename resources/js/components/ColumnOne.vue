<template>
    <div class="bg-white p-4 shadow-lg rounded flex flex-col h-full space-y-4">

        <!-- TreeView Card -->
        <div class="flex flex-col flex-1 bg-gray-100 p-4 rounded shadow">
            <h2 class="text-xl font-bold mb-4">Tree View</h2>
            <div class="flex-1 overflow-auto" style="max-height: 45vh;">
                <div class="min-w-max">
                    <tree-view :tree-data="data"></tree-view>
                </div>
            </div>
        </div>

        <!-- Projects Card -->
        <div class="flex flex-col flex-1 bg-gray-100 p-4 rounded shadow">
            <h2 class="text-xl font-bold mb-4">Projects</h2>
            <div class="flex-1 overflow-auto" style="max-height: 45vh;">
                <div class="min-w-max">
                    <projects :tree-data="data"></projects>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import TreeView from './TreeView.vue';
import Projects from './Projects.vue';

export default {
    components: {
        Projects,
        TreeView
    },
    data() {
        return {
            data: [
                {
                    id: 1,
                    name: "Desktop",
                    expanded: true,
                    children: [
                        { id: 2, name: "Resume" },
                        { id: 3, name: "Cover Letter" }
                    ]
                },
                {
                    id: 4,
                    name: "Hard Drive",
                    expanded: true,
                    children: [
                        { id: 5, name: "Remote Time-Sheet" },
                        { id: 6, name: "Monthly Budget" }
                    ]
                },
                {
                    id: 7,
                    name: "C:/",
                    expanded: true,
                    children: [
                        {
                            id: 8,
                            name: "Documents",
                            expanded: true,
                            children: [
                                { id: 9, name: "Repositories" }
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
</script>
