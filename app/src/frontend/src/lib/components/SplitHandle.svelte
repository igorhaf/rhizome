<script>
    export let onDrag;
    let dragging = false;
    let startX;

    function handleMouseDown(e) {
        dragging = true;
        startX = e.clientX;
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }

    function handleMouseMove(e) {
        if (dragging) {
            const dx = e.clientX - startX;
            onDrag(dx);
            startX = e.clientX;
        }
    }

    function handleMouseUp() {
        dragging = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }
</script>

<div class="split-handle" 
     on:mousedown={handleMouseDown}
     class:dragging>
</div>

<style>
    .split-handle {
        width: 4px;
        height: 100%;
        background: #e0e0e0;
        cursor: col-resize;
        transition: background 0.2s;
    }

    .split-handle:hover,
    .split-handle.dragging {
        background: #999;
    }

    .split-handle.dragging {
        position: relative;
        z-index: 1000;
    }
</style>