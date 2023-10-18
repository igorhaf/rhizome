<template>
    <div class="tabs-container mt-6">
        <div class="tabs-wrapper flex overflow-x-auto">
            <div v-for="(tab, index) in tabs" :key="tab.id"
                 :class="{'active-tab': activeTab === index}"
                 @click="changeTab(index)"
                 @dblclick="enableEdit(tab)"
                 class="tab inline-flex flex-shrink-0 px-6 py-2 mr-1 rounded-t-lg cursor-pointer">
                <input v-if="tab.isEditing" v-model="tab.label" @blur="saveTabName(tab)" ref="tabInput" class="border p-1 rounded"/>
                <span v-else>{{ tab.label }}</span>
            </div>
            <div @click="addTab" class="add-tab inline-flex flex-shrink-0 px-6 py-2 rounded-t-lg cursor-pointer bg-blue-500 text-white">
                +
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['tabs', 'activeTab'],

    data() {
        return {
            tabs: [
                { id: 1, label: 'Tab 1', content: 'MxGraphComponent', isEditing: false }
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
                label: `Tab ${this.nextTabId}`,
                content: 'MxGraphComponent',
                isEditing: false
            };
            this.tabs.push(nextTab);
            this.activeTab = this.tabs.length - 1;
            this.nextTabId++;
            this.$emit('tabAdded');
        },
        enableEdit(tab) {
            tab.isEditing = true;
            this.$nextTick(() => {
                this.$refs.tabInput.focus();
            });
        },
        saveTabName(tab) {
            tab.isEditing = false;
        }
    }
}
</script>

<style scoped>
.tab {
    background-color: #E0E0E0;
}

.add-tab:hover {
    background-color: #2563EB;
}

.active-tab {
    background-color: #FFFFFF;
    border: 1px solid #D1D5DB;
    border-bottom: none;
}

.content {
    border-top: none;
}
</style>
