<script>
    let containerRef;
    let nodes = [
        { id: 1, x: 100, y: 50, text: "Start" },
        { id: 2, x: 100, y: 150, text: "Process" },
        { id: 3, x: 100, y: 250, text: "End" }
    ];

    let connections = [
        { from: 1, to: 2 },
        { from: 2, to: 3 }
    ];

    let dragging = false;
    let selectedNode = null;
    let startPos = { x: 0, y: 0 };
    let nodeStartPos = { x: 0, y: 0 };

    function handleMouseDown(event, node) {
        dragging = true;
        selectedNode = node;
        startPos = { x: event.clientX, y: event.clientY };
        nodeStartPos = { x: node.x, y: node.y };
    }

    function handleMouseMove(event) {
        if (!dragging) return;
        const dx = event.clientX - startPos.x;
        const dy = event.clientY - startPos.y;
        selectedNode.x = nodeStartPos.x + dx;
        selectedNode.y = nodeStartPos.y + dy;
        nodes = [...nodes];
    }

    function handleMouseUp() {
        dragging = false;
        selectedNode = null;
    }

    function calculatePath(fromId, toId) {
        const fromNode = nodes.find(n => n.id === fromId);
        const toNode = nodes.find(n => n.id === toId);
        return `M ${fromNode.x} ${fromNode.y + 25} L ${toNode.x} ${toNode.y - 25}`;
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flow-container" 
     bind:this={containerRef}
     on:mousemove={handleMouseMove} 
     on:mouseup={handleMouseUp}
     on:mouseleave={handleMouseUp}>
    <svg width="100%" height="100%">
        <defs>
            <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="6"
                refX="9"
                refY="5"
                orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/>
            </marker>
        </defs>

        {#each connections as conn}
            <path
                d={calculatePath(conn.from, conn.to)}
                class="connection"
                marker-end="url(#arrowhead)"/>
        {/each}

        <!-- Nodes -->
        {#each nodes as node}
            <g transform="translate({node.x}, {node.y})"
               on:mousedown={(e) => handleMouseDown(e, node)}
               class="node">
                <rect x="-50" y="-25" 
                      width="100" height="50" 
                      rx="5"
                      class="node-rect"/>
                <text x="0" y="0" 
                      text-anchor="middle" 
                      dominant-baseline="middle">
                    {node.text}
                </text>
            </g>
        {/each}
    </svg>
</div>

<style>
    .flow-container {
        width: 100%;
        height: 400px;
        background: #f8f9fa;
        border-radius: 4px;
        overflow: hidden;
    }

    .node {
        cursor: move;
    }

    .node-rect {
        fill: white;
        stroke: #666;
        stroke-width: 2;
    }

    text {
        user-select: none;
        font-size: 14px;
    }

    .connection {
        fill: none;
        stroke: #666;
        stroke-width: 2px;
    }
</style>