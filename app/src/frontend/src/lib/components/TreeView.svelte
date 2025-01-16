<script>
    const treeData = {
        name: "Root",
        children: [
            {
                name: "Components",
                children: [
                    {
                        name: "Start",
                        type: 'start',
                        draggable: true
                    },
                    {
                        name: "If",
                        type: 'if',
                        draggable: true
                    },
                    {
                        name: "Sleep",
                        type: 'sleep',
                        draggable: true
                    },
                    {
                        name: "Schedule",
                        type: 'schedule',
                        draggable: true
                    },
                    {
                        name: "API",
                        type: 'api',
                        draggable: true
                    },
                    {
                        name: "Exception",
                        type: 'exception',
                        draggable: true
                    },
                    {
                        name: "Stop",
                        type: 'stop',
                        draggable: true
                    }
                ]
            },
            {
                name: "Other",
                children: []
            }
        ]
    };

    function handleDragStart(event, item) {
        event.dataTransfer.setData('application/json', JSON.stringify({
            type: item.type,
            label: item.name,
            x: 100,
            y: 100
        }));
    }
</script>

<div class="tree-container">
    <div class="tree-title">{treeData.name}</div>
    {#each treeData.children as child}
        {#if child.children}
            <div class="folder">
                <span class="folder-name">{child.name}</span>
                <div class="children">
                    {#each child.children as item}
                        <div class="tree-item"
                             draggable={item.draggable}
                             on:dragstart={(e) => handleDragStart(e, item)}>
                            {item.name}
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
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

    .folder-name {
        font-weight: 500;
        color: #666;
        padding: 4px 8px;
    }

    .children {
        margin-left: 16px;
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
</style>