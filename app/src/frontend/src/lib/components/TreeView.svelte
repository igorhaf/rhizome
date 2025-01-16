<script>
    import { slide } from 'svelte/transition';
    import { writable } from 'svelte/store';

    const initialTreeData = {
        name: "Root",
        isOpen: true,
        children: [
            {
                name: "Components",
                isOpen: false,
                children: [
                    { name: "Start", type: 'start', draggable: true },
                    { name: "If", type: 'if', draggable: true },
                    { name: "Sleep", type: 'sleep', draggable: true },
                    { name: "Schedule", type: 'schedule', draggable: true },
                    { name: "API", type: 'api', draggable: true },
                    { name: "Exception", type: 'exception', draggable: true },
                    { name: "Stop", type: 'stop', draggable: true }
                ]
            },
            {
                name: "Other",
                isOpen: false,
                children: []
            }
        ]
    };

    const treeStore = writable(initialTreeData);

    function toggleFolder(folder) {
        treeStore.update(data => {
            const updatedFolder = data.children.find(f => f.name === folder.name);
            if (updatedFolder) {
                updatedFolder.isOpen = !updatedFolder.isOpen;
            }
            return data;
        });
    }

    function handleDragStart(event, item) {
        event.dataTransfer.setData('application/json', JSON.stringify({
            type: item.type,
            label: item.name,
            x: 100,
            y: 100
        }));
    }

    export let items = [];
    
    function toggleNode(node) {
        node.isOpen = !node.isOpen;
        items = [...items]; // Trigger Svelte reactivity
    }

    function hasChildren(node) {
        return node.children && node.children.length > 0;
    }

    function isFolder(node) {
        return node.type === 'folder' || hasChildren(node);
    }

    // Initialize isOpen property if not present
    items = items.map(item => ({
        ...item,
        isOpen: item.isOpen || false
    }));
</script>

<div class="tree-container">
    <div class="tree-title">{$treeStore.name}</div>
    {#each $treeStore.children as folder}
        <div class="folder">
            <div class="folder-header" on:click={() => toggleFolder(folder)}>
                <span class="toggle-icon">{folder.isOpen ? '▼' : '▶'}</span>
                <span class="folder-name">{folder.name}</span>
            </div>
            {#if folder.isOpen}
                <div class="children" transition:slide>
                    {#each folder.children as item}
                        <div class="tree-item"
                             draggable={item.draggable}
                             on:dragstart={(e) => handleDragStart(e, item)}>
                            {item.name}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/each}
</div>

<div class="tree-view">
    {#each items as item}
        <div class="tree-item" data-type={item.type}>
            <div class="item-header" 
                 class:is-folder={isFolder(item)}
                 on:click={() => isFolder(item) && toggleNode(item)}>
                
                {#if isFolder(item)}
                    <span class="toggle-icon">
                        {item.isOpen ? '▼' : '▶'}
                    </span>
                    <span class="folder-icon">
                        {item.isOpen ? '📂' : '📁'}
                    </span>
                {:else}
                    <span class="file-icon">📄</span>
                {/if}
                
                <span class="item-label">{item.name}</span>
            </div>

            {#if isFolder(item) && item.isOpen}
                <div class="item-children" transition:slide>
                    <svelte:self items={item.children || []} />
                </div>
            {/if}
        </div>
    {/each}
</div>

<style>
    .tree-container {
        padding: 8px;
        height: 100%;
        overflow-y: auto;
    }

    .tree-title {
        font-weight: bold;
        padding: 8px;
        color: #333;
    }

    .folder {
        margin: 4px 0;
    }

    .folder-header {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        cursor: pointer;
    }

    .folder-header:hover {
        background-color: #f0f0f0;
    }

    .toggle-icon {
        width: 20px;
        display: inline-block;
        text-align: center;
    }

    .folder-name {
        font-weight: 500;
        color: #666;
    }

    .children {
        margin-left: 24px;
    }

    .tree-item {
        padding: 8px;
        margin: 4px;
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: move;
    }

    .tree-item:hover {
        background: #e9e9e9;
    }

    .tree-view {
        font-family: system-ui, -apple-system, sans-serif;
        user-select: none;
    }

    .tree-item {
        margin: 2px 0;
    }

    .item-header {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        cursor: pointer;
        border-radius: 4px;
    }

    .item-header:hover {
        background-color: #f0f0f0;
    }

    .is-folder {
        font-weight: 500;
    }

    .toggle-icon, .folder-icon, .file-icon {
        width: 20px;
        display: inline-block;
        text-align: center;
    }

    .item-label {
        margin-left: 4px;
    }

    .item-children {
        padding-left: 24px;
    }
</style>