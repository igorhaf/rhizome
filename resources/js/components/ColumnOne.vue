<template>
    <div class="bg-white p-4 shadow-lg rounded">
        <tree-view :tree-data="data"></tree-view>
    </div>
</template>

<script>
import TreeView from './TreeView.vue';

export default {
    components: {
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
