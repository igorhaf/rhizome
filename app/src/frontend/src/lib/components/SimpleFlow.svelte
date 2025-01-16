<script>
    let containerRef;
    let nodes = [
        { id: 1, x: 100, y: 50, text: "Start" },
        { id: 2, x: 100, y: 150, text: "Process" },
        { id: 3, x: 100, y: 250, text: "End" }
    ];

    let dragging = false;
    let selectedNode = null;
    let startPos = { x: 0, y: 0 };
    let nodeStartPos = { x: 0, y: 0 };

    function handleMouseDown(event, node) {
        dragging = true;
        selectedNode = node;
        
        // Store initial positions
        startPos = {
            x: event.clientX,
            y: event.clientY
        };
        nodeStartPos = {
            x: node.x,
            y: node.y
        };
    }

    function handleMouseMove(event) {
        if (dragging && selectedNode && containerRef) {
            const containerRect = containerRef.getBoundingClientRect();
            const nodeWidth = 100;  // Width of node rectangle
            const nodeHeight = 50;  // Height of node rectangle

            // Calculate new position with boundaries
            let newX = nodeStartPos.x + (event.clientX - startPos.x);
            let newY = nodeStartPos.y + (event.clientY - startPos.y);

            // Constrain X position
            newX = Math.max(0, Math.min(newX, containerRect.width - nodeWidth));
            // Constrain Y position
            newY = Math.max(0, Math.min(newY, containerRect.height - nodeHeight));

            // Update node position
            const index = nodes.findIndex(n => n.id === selectedNode.id);
            nodes[index] = {
                ...selectedNode,
                x: newX,
                y: newY
            };
            nodes = [...nodes]; // trigger reactivity
        }
    }

    function handleMouseUp() {
        dragging = false;
        selectedNode = null;
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flow-container" 
     bind:this={containerRef}
     on:mousemove={handleMouseMove} 
     on:mouseup={handleMouseUp}
     on:mouseleave={handleMouseUp}>
    <svg width="100%" height="400">
        <!-- Connections -->
        {#each nodes as node, i}
            {#if i < nodes.length - 1}
                <line 
                    x1={node.x + 50} 
                    y1={node.y + 25} 
                    x2={nodes[i + 1].x + 50} 
                    y2={nodes[i + 1].y + 25}
                    stroke="#999"
                    stroke-width="2"/>
            {/if}
        {/each}

        <!-- Nodes -->
        {#each nodes as node}
            <g transform="translate({node.x}, {node.y})"
               on:mousedown={(e) => handleMouseDown(e, node)}
               class="node">
                <rect width="100" height="50" rx="5"
                      class="node-rect"/>
                <text x="50" y="30" text-anchor="middle">
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
</style>