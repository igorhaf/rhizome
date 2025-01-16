<script>
    export let item;
    export let level = 0;

    function handleDragStart(event) {
        event.dataTransfer.setData('application/json', JSON.stringify({
            type: item.type,
            label: item.name,
            x: 100,
            y: 100
        }));
    }
</script>

<div class="tree-item"
     style="margin-left: {level * 20}px"
     draggable={item.draggable}
     on:dragstart={handleDragStart}>
    
    <div class="item-content">
        {#if item.children}
            <div class="folder">
                <span class="folder-name">{item.name}</span>
                <div class="children">
                    {#each item.children as child}
                        <svelte:self item={child} level={level + 1} />
                    {/each}
                </div>
            </div>
        {:else}
            <div class="leaf">
                <span class="item-name">{item.name}</span>
            </div>
        {/if}
    </div>
</div>

<style>
    .tree-item {
        padding: 4px;
    }

    .item-content {
        display: flex;
        flex-direction: column;
    }

    .folder {
        font-weight: bold;
    }

    .folder-name {
        color: #333;
        padding: 4px 0;
    }

    .children {
        margin-left: 16px;
        border-left: 1px solid #ddd;
        padding-left: 8px;
    }

    .leaf {
        padding: 8px;
        margin: 4px 0;
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: move;
    }

    .leaf:hover {
        background: #e9e9e9;
    }

    .item-name {
        color: #666;
    }
</style>