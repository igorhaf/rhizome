<script>
    const flowItems = [
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
    ];

    function handleDragStart(event, item) {
        event.dataTransfer.setData('application/json', JSON.stringify({
            type: item.type,
            label: item.name,
            x: 100,
            y: 100
        }));
    }
</script>

<div class="items-container">
    <div class="items-title">Flow Items</div>
    {#each flowItems as item}
        <div class="flow-item"
             draggable={item.draggable}
             on:dragstart={(e) => handleDragStart(e, item)}>
            {item.name}
        </div>
    {/each}
</div>

<style>
    .items-container {
        padding: 8px;
    }

    .items-title {
        font-weight: bold;
        padding: 8px;
        color: #333;
    }

    .flow-item {
        padding: 8px;
        margin: 4px;
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: move;
    }

    .flow-item:hover {
        background: #e9e9e9;
    }
</style>