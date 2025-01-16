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

    function startConnection(event, object, position) {
        event.stopPropagation();
        event.preventDefault();
        
        const rect = diagramArea.getBoundingClientRect();
        const point = getConnectionPoint(
            position, 
            object.x, 
            object.y, 
            100, // width
            50   // height
        );
        
        activeConnection = {
            sourceId: object.id,
            sourceConnector: position,
            sourceX: point.x,
            sourceY: point.y,
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

    function determineConnectionPoints(sourceObj, targetObj) {
        const dx = targetObj.x - sourceObj.x;
        const dy = targetObj.y - sourceObj.y;
        
        // Determine connection points based on relative positions
        let sourceConnector, targetConnector;
        
        // Check if connection is more horizontal or vertical
        if (Math.abs(dx) > Math.abs(dy)) {
            // Objects are arranged horizontally
            if (dx > 0) {
                sourceConnector = 'east';
                targetConnector = 'west';
            } else {
                sourceConnector = 'west';
                targetConnector = 'east';
            }
        } else {
            // Objects are arranged vertically
            if (dy > 0) {
                sourceConnector = 'south';
                targetConnector = 'north';
            } else {
                sourceConnector = 'north';
                targetConnector = 'south';
            }
        }

        // Get exact connection points
        const sourcePoint = getConnectionPoint(
            sourceConnector,
            sourceObj.x,
            sourceObj.y,
            100, // width
            50   // height
        );
        
        const targetPoint = getConnectionPoint(
            targetConnector,
            targetObj.x,
            targetObj.y,
            100, // width
            50   // height
        );

        return {
            sourceConnector,
            targetConnector,
            sourcePoint,
            targetPoint
        };
    }

    function handleMouseUp(event) {
        if (!activeConnection) return;

        const targetConnector = event.target.closest('.connector');
        if (!targetConnector) return;

        const sourceObject = objects.find(obj => obj.id === activeConnection.sourceId);
        const targetObject = objects.find(obj => 
            obj.id === parseInt(targetConnector.parentElement.dataset.objectId)
        );

        if (sourceObject && targetObject && sourceObject.id !== targetObject.id) {
            const { sourceConnector, targetConnector, sourcePoint, targetPoint } = 
                determineConnectionPoints(sourceObject, targetObject);

            connections = [...connections, {
                id: `conn-${nextId++}`,
                sourceId: sourceObject.id,
                targetId: targetObject.id,
                sourceConnector,
                targetConnector,
                sourceX: sourcePoint.x,
                sourceY: sourcePoint.y,
                targetX: targetPoint.x,
                targetY: targetPoint.y,
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

    function updateConnectionPositions(objectId, newX, newY) {
        const OBJECT_WIDTH = 100;
        const OBJECT_HEIGHT = 50;
        
        connections = connections.map(conn => {
            let updatedConn = { ...conn };
            
            if (conn.sourceId === objectId) {
                const sourcePoint = getConnectionPoint(
                    conn.sourceConnector,
                    newX,
                    newY,
                    OBJECT_WIDTH,
                    OBJECT_HEIGHT
                );
                updatedConn = { ...updatedConn, sourceX: sourcePoint.x, sourceY: sourcePoint.y };
            }
            
            if (conn.targetId === objectId) {
                const targetPoint = getConnectionPoint(
                    conn.targetConnector,
                    newX,
                    newY,
                    OBJECT_WIDTH,
                    OBJECT_HEIGHT
                );
                updatedConn = { ...updatedConn, targetX: targetPoint.x, targetY: targetPoint.y };
            }
            
            return updatedConn;
        });
    }

    function getConnectionPoint(position, x, y, width, height) {
        const offset = 12; // Consistent offset
        switch(position) {
            case 'north': return { x: x + width/2, y: y - offset };
            case 'south': return { x: x + width/2, y: y + height + offset };
            case 'east':  return { x: x + width + offset, y: y + height/2 };
            case 'west':  return { x: x - offset, y: y + height/2 };
            default:      return { x: x + width/2, y: y + height/2 };
        }
    }

    function calculatePath(conn) {
        // Calculate control points based on connector positions
        const midX = (conn.sourceX + conn.targetX) / 2;
        const midY = (conn.sourceY + conn.targetY) / 2;
        
        // Adjust control points based on connector positions
        let cp1x, cp1y, cp2x, cp2y;
        
        switch(conn.sourceConnector) {
            case 'east':
                cp1x = conn.sourceX + 50;
                cp1y = conn.sourceY;
                break;
            case 'west':
                cp1x = conn.sourceX - 50;
                cp1y = conn.sourceY;
                break;
            case 'north':
                cp1x = conn.sourceX;
                cp1y = conn.sourceY - 50;
                break;
            case 'south':
                cp1x = conn.sourceX;
                cp1y = conn.sourceY + 50;
                break;
        }
        
        switch(conn.targetConnector) {
            case 'east':
                cp2x = conn.targetX + 50;
                cp2y = conn.targetY;
                break;
            case 'west':
                cp2x = conn.targetX - 50;
                cp2y = conn.targetY;
                break;
            case 'north':
                cp2x = conn.targetX;
                cp2y = conn.targetY - 50;
                break;
            case 'south':
                cp2x = conn.targetX;
                cp2y = conn.targetY + 50;
                break;
        }

        // Create curved path using cubic bezier
        return `M ${conn.sourceX} ${conn.sourceY} 
                C ${cp1x} ${cp1y},
                  ${cp2x} ${cp2y},
                  ${conn.targetX} ${conn.targetY}`;
    }

    function calculateOrthogonalPath(conn) {
        const dx = conn.targetX - conn.sourceX;
        const dy = conn.targetY - conn.sourceY;
        let path = '';

        // Calculate intermediate points based on connector positions
        switch(conn.sourceConnector) {
            case 'east':
                if (conn.targetConnector === 'west') {
                    path = `M ${conn.sourceX} ${conn.sourceY}
                           L ${conn.sourceX + dx/2} ${conn.sourceY}
                           L ${conn.sourceX + dx/2} ${conn.targetY}
                           L ${conn.targetX} ${conn.targetY}`;
                } else {
                    path = `M ${conn.sourceX} ${conn.sourceY}
                           L ${conn.targetX} ${conn.sourceY}
                           L ${conn.targetX} ${conn.targetY}`;
                }
                break;
            case 'west':
                if (conn.targetConnector === 'east') {
                    path = `M ${conn.sourceX} ${conn.sourceY}
                           L ${conn.sourceX + dx/2} ${conn.sourceY}
                           L ${conn.sourceX + dx/2} ${conn.targetY}
                           L ${conn.targetX} ${conn.targetY}`;
                } else {
                    path = `M ${conn.sourceX} ${conn.sourceY}
                           L ${conn.targetX} ${conn.sourceY}
                           L ${conn.targetX} ${conn.targetY}`;
                }
                break;
            case 'north':
                if (conn.targetConnector === 'south') {
                    path = `M ${conn.sourceX} ${conn.sourceY}
                           L ${conn.sourceX} ${conn.sourceY + dy/2}
                           L ${conn.targetX} ${conn.sourceY + dy/2}
                           L ${conn.targetX} ${conn.targetY}`;
                } else {
                    path = `M ${conn.sourceX} ${conn.sourceY}
                           L ${conn.sourceX} ${conn.targetY}
                           L ${conn.targetX} ${conn.targetY}`;
                }
                break;
            case 'south':
                if (conn.targetConnector === 'north') {
                    path = `M ${conn.sourceX} ${conn.sourceY}
                           L ${conn.sourceX} ${conn.sourceY + dy/2}
                           L ${conn.targetX} ${conn.sourceY + dy/2}
                           L ${conn.targetX} ${conn.targetY}`;
                } else {
                    path = `M ${conn.sourceX} ${conn.sourceY}
                           L ${conn.sourceX} ${conn.targetY}
                           L ${conn.targetX} ${conn.targetY}`;
                }
                break;
        }
        
        return path;
    }

    function handleObjectDragEnd(event, object) {
        const rect = diagramArea.getBoundingClientRect();
        const newX = event.clientX - rect.left - dragOffset.x;
        const newY = event.clientY - rect.top - dragOffset.y;

        // Update object position
        const index = objects.findIndex(obj => obj.id === object.id);
        objects[index] = { ...object, x: newX, y: newY };
        objects = [...objects];

        // Update all connected arrows
        connections = connections.map(conn => {
            if (conn.sourceId === object.id) {
                const sourcePoint = getConnectionPoint(
                    conn.sourceConnector,
                    newX,
                    newY,
                    100, // width
                    50   // height
                );
                return {
                    ...conn,
                    sourceX: sourcePoint.x,
                    sourceY: sourcePoint.y
                };
            }
            if (conn.targetId === object.id) {
                const targetPoint = getConnectionPoint(
                    conn.targetConnector,
                    newX,
                    newY,
                    100, // width
                    50   // height
                );
                return {
                    ...conn,
                    targetX: targetPoint.x,
                    targetY: targetPoint.y
                };
            }
            return conn;
        });
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
        <defs>
            <marker 
                id="arrowhead"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerUnits="strokeWidth"
                markerWidth="10"
                markerHeight="7"
                orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#666"/>
            </marker>
        </defs>

        {#each connections as conn}
            <g>
                <path 
                    d={calculateOrthogonalPath(conn)}
                    class="connection"
                    marker-end="url(#arrowhead)"/>
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
            <path 
                d="M {activeConnection.sourceX} {activeConnection.sourceY} 
                   L {activeConnection.targetX} {activeConnection.targetY}"
                class="connection active"
                marker-end="url(#arrowhead)"/>
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
            <div class="connector north" on:mousedown={(e) => startConnection(e, object, 'north')}/>
            <div class="connector south" on:mousedown={(e) => startConnection(e, object, 'south')}/>
            <div class="connector east"  on:mousedown={(e) => startConnection(e, object, 'east')}/>
            <div class="connector west"  on:mousedown={(e) => startConnection(e, object, 'west')}/>
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
        fill: none;
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
        width: 10px;
        height: 10px;
        background: #666;
        border-radius: 50%;
        cursor: pointer;
    }

    .connector.north {
        top: -5px;
        left: 50%;
        transform: translateX(-50%);
    }

    .connector.south {
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
    }

    .connector.east {
        right: -5px;
        top: 50%;
        transform: translateY(-50%);
    }

    .connector.west {
        left: -5px;
        top: 50%;
        transform: translateY(-50%);
    }
</style>