<!--ColumnOne.vue-->
<template>
    <div class="bg-white p-4  shadow-lg rounded flex flex-col h-full space-y-4">

        <!-- TreeView Card -->
        <div class="flex flex-col flex-1 bg p-4 rounded shadow">
            <h2 class="text font-semibold mb-4">Components</h2>
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
                    name: "Basic Components",
                    expanded: false,
                    children: [
                        {
                            id: 2,
                            name: "Start",
                            type: "start",
                            iconClass: "start"
                        },
                        {
                            id: 3,
                            name: "Schedule",
                            type: "schedule",
                            iconClass: "schedule"
                        },
                        {
                            id: 4,
                            name: "If",
                            type: "if",
                            iconClass: "if"
                        },
                        {
                            id: 5,
                            name: "Switch",
                            type: "switch",
                            iconClass: "switch"
                        },
                        {
                            id: 6,
                            name: "Sleep",
                            type: "sleep",
                            iconClass: "sleep"
                        },
                        {
                            id: 7,
                            name: "Start Time",
                            type: "start-time",
                            iconClass: "start-time"
                        },
                        {
                            id: 8,
                            name: "Webhook",
                            type: "webhook",
                            iconClass: "webhook"
                        },
                        {
                            id: 9,
                            name: "Api",
                            type: "api",
                            iconClass: "api"
                        },
                        {
                            id: 10,
                            name: "Exception",
                            type: "exception",
                            iconClass: "exception"
                        },
                        {
                            id: 11,
                            name: "Link",
                            type: "link",
                            iconClass: "link"
                        },
                        {
                            id: 12,
                            name: "Stop",
                            type: "stop",
                            iconClass: "stop"
                        },
                    ]
                },
                {
                    id: 13,
                    name: "Third-party",
                    expanded: false,
                    children: [
                        {
                            id: 14,
                            name: "Gmail",
                            expanded: false,
                            children: [
                                {
                                    id: 15,
                                    name: "Send mail",
                                    type: "gmail-send",
                                    iconClass: "gmail-send"
                                },
                                {
                                    id: 16,
                                    name: "Get mail",
                                    type: "gmail-receive",
                                    iconClass: "gmail-receive"
                                }
                            ]
                        },
                        {
                            id: 17,
                            name: "Trello",
                            expanded: false,
                            children: [
                                {
                                    id: 18,
                                    name: "Create card",
                                    type: "trello-add-card",
                                    iconClass: "trello-add-card"
                                },
                                {
                                    id: 19,
                                    name: "Remove card",
                                    type: "trello-remove-card",
                                    iconClass: "trello-remove-card"
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 20,
                    name: "Miscellaneous",
                    expanded: false,
                    children: [
                        {
                            id: 21,
                            name: "Database",
                            type: "database",
                            iconClass: "database"

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
