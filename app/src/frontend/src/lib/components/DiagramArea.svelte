<script>
    let diagramArea;
    let objects = [];
    let connections = [];
    let nextId = 1;
    let activeConnection = null;
    let dragOffset = { x: 0, y: 0 };

    function isValidConnection(sourceObj, targetObj) {
        if (!sourceObj || !targetObj) return false;
        
        if (sourceObj.type === 'start') {
            const startConnections = connections.filter(conn => 
                conn.sourceId === sourceObj.id
            );
            return startConnections.length === 0;
        }

        const hasStart = objects.some(obj => 
            obj.type === 'start' && 
            connections.some(conn => conn.sourceId === obj.id)
        );
        
        if (!hasStart) return false;

        return !connections.some(conn => 
            conn.sourceId === targetObj.id && 
            conn.targetId === sourceObj.id
        );
    }

    function startConnection(event, object) {
        event.stopPropagation();
        event.preventDefault();
        
        const rect = diagramArea.getBoundingClientRect();
        const connectorRect = event.target.getBoundingClientRect();
        
        activeConnection = {
            sourceId: object.id,
            sourceX: connectorRect.left - rect.left + (connectorRect.width / 2),
            sourceY: connectorRect.top - rect.top + (connectorRect.height / 2),
            targetX: event.clientX - rect.left,
            targetY: event.clientY - rect.top
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(event) {
        if (!activeConnection) return;
        const rect = diagramArea.getBoundingClientRect();
        activeConnection = {
            ...activeConnection,
            targetX: event.clientX - rect.left,
            targetY: event.clientY - rect.top
        };
    }

    function handleMouseUp(event) {
        if (!activeConnection) return;

        const targetConnector = event.target.closest('.connector');
        const sourceObject = objects.find(obj => obj.id === activeConnection.sourceId);
        const targetObject = targetConnector ? 
            objects.find(obj => obj.id === parseInt(targetConnector.parentElement.dataset.objectId)) : 
            null;
        
        if (targetConnector && 
            sourceObject && 
            targetObject &&
            sourceObject.id !== targetObject.id &&
            isValidConnection(sourceObject, targetObject)) {
            
            const rect = diagramArea.getBoundingClientRect();
            const targetRect = targetConnector.getBoundingClientRect();
            
            connections = [...connections, {
                id: `conn-${nextId++}`,
                sourceId: activeConnection.sourceId,
                targetId: parseInt(targetConnector.parentElement.dataset.objectId),
                sourceX: activeConnection.sourceX,
                sourceY: activeConnection.sourceY,
                targetX: targetRect.left - rect.left + (targetRect.width / 2),
                targetY: targetRect.top - rect.top + (targetRect.height / 2),
                label: 'Edit me'
            }];
        }

        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        activeConnection = null;
    }

    function handleObjectDragStart(event) {
        if (event.target.classList.contains('connector')) {
            event.preventDefault();
            return;
        }
        const rect = event.currentTarget.getBoundingClientRect();
        dragOffset = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function handleObjectDragEnd(event, object) {
        const rect = diagramArea.getBoundingClientRect();
        const newX = event.clientX - rect.left - dragOffset.x;
        const newY = event.clientY - rect.top - dragOffset.y;

        const index = objects.findIndex(obj => obj.id === object.id);
        objects[index] = { ...object, x: newX, y: newY };
        objects = [...objects];
    }

    function updateLabel(event, conn) {
        const index = connections.findIndex(c => c.id === conn.id);
        connections[index] = { ...conn, label: event.target.value };
        connections = [...connections];
    }

    function handleDrop(event) {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData('application/json'));
        const rect = diagramArea.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        objects = [...objects, {
            id: nextId++,
            ...data,
            x,
            y
        }];
    }
</script>

<div class="diagram-area" 
     bind:this={diagramArea}
     on:dragover|preventDefault
     on:drop={handleDrop}>
    <svg class="connections-layer">
        {#each connections as conn}
            <g>
                <line 
                    x1={conn.sourceX}
                    y1={conn.sourceY}
                    x2={conn.targetX}
                    y2={conn.targetY}
                    class="connection"/>
                <foreignObject 
                    x={(conn.sourceX + conn.targetX) / 2 - 50}
                    y={(conn.sourceY + conn.targetY) / 2 - 10}
                    width="100" 
                    height="20">
                    <input 
                        type="text" 
                        value={conn.label} 
                        on:input={(e) => updateLabel(e, conn)}
                        class="connection-label"/>
                </foreignObject>
            </g>
        {/each}
        
        {#if activeConnection}
            <line 
                x1={activeConnection.sourceX}
                y1={activeConnection.sourceY}
                x2={activeConnection.targetX}
                y2={activeConnection.targetY}
                class="connection active"/>
        {/if}
    </svg>

    {#each objects as object (object.id)}
        <div class="diagram-object"
             data-object-id={object.id}
             style="left: {object.x}px; top: {object.y}px"
             draggable="true"
             on:dragstart={(e) => handleObjectDragStart(e, object)}
             on:dragend={(e) => handleObjectDragEnd(e, object)}>
            {object.label}
            <div class="connector right"
                 on:mousedown={(e) => startConnection(e, object)}/>
        </div>
    {/each}
</div>

<style>
    .diagram-area {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 600px;
        background: #fff;
    }

    .connections-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .connection {
        stroke: #666;
        stroke-width: 2;
    }

    .connection.active {
        stroke-dasharray: 4;
    }

    .connection-label {
        width: 100%;
        height: 100%;
        border: none;
        background: transparent;
        text-align: center;
        font-size: 12px;
        pointer-events: all;
    }

    .diagram-object {
        position: absolute;
        padding: 12px 20px;
        background: white;
        border: 1px solid #666;
        border-radius: 4px;
        cursor: move;
        user-select: none;
    }

    .connector {
        position: absolute;
        right: -5px;
        top: 50%;
        transform: translateY(-50%);
        width: 10px;
        height: 10px;
        background: #666;
        border-radius: 50%;
        cursor: crosshair;
    }
</style>