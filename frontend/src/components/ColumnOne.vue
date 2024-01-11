<!--ColumnOne.vue-->
<template>
  <div class="flex h-full"> <!-- Container flexível para toda a altura -->

    <!-- Quick Access Bar -->
    <div class="bg w-10 flex-shrink-0"> <!-- Ajuste a largura conforme necessário -->
      <quick-access-bar></quick-access-bar>
    </div>

    <!-- Conteúdo Principal -->
    <div  class="flex-1 bg  flex flex-col space-y-4 overflow-auto"> <!-- Flexível, ocupando o espaço restante -->
      <h2 v-if="currentComponent === 'treeView'" class="text font-semibold p-4" style="padding-bottom:0px">Components</h2>
      <!-- Componentes -->
      <div v-if="currentComponent === 'treeView'" class="flex flex-col h-full overflow-auto" style="padding-bottom: 0px;"> <!-- Ajuste de altura 1/2 -->

        <div class="flex-1">
          <div class="min-w-max">
            <tree-view :tree-data="logic"></tree-view>
          </div>
        </div>
      </div>
      <h2 v-if="currentComponent === 'project'" class="text font-semibold p-4" style="padding-bottom:0px">Project</h2>
      <!-- Objetos -->
      <div v-if="currentComponent === 'project'" class="flex flex-col h-full overflow-auto" style="padding-bottom: 0px;"> <!-- Ajuste de altura 1/2 -->

        <div class="flex-1">
          <div class="min-w-max">
            <objects :tree-data="objects"></objects>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import TreeView from './TreeView.vue';
import Objects from './Objects.vue';
import QuickAccessBar from "./QuickAccessBar.vue";
import { EventBus } from '../EventBus.js';

export default {
    components: {
        Objects,
        TreeView,
        QuickAccessBar
    },
    created() {
      EventBus.on('change-component', this.updateComponent);
    },
    beforeDestroy() {
      EventBus.off('change-component', this.updateComponent);
    },
    methods: {
      updateComponent(componentName) {
        this.currentComponent = componentName;
      }
    },
    data() {
        return {
            currentComponent: 'treeView',
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
                            type: "starttime",
                            iconClass: "starttime"
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
                        {
                            id: 13,
                            name: "Database",
                            type: "database",
                            iconClass: "database"

                        },
                        {
                            id: 30,
                            name: "Javascript",
                            type: "javascript",
                            iconClass: "javascript"

                        },
                        {
                            id: 50,
                            name: "Bash",
                            type: "bash",
                            iconClass: "bash"

                        }
                    ]
                },
                {
                    id: 14,
                    name: "Presets",
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
