<script>
    import ScheduleForm from './ScheduleForm.svelte';

    export let selectedNode = null;
    export let width = 300;

    $: componentToShow = selectedNode?.type === 'start' ? 'schedule' : null;
</script>

<div class="right-panel" style="width: {width}px">
    <div class="panel-content">
        {#if componentToShow === 'schedule'}
            <ScheduleForm 
                nodeId={selectedNode.id} 
                on:save
            />
        {/if}
    </div>
</div>

<style>
    .right-panel {
        height: 100%;
        border-left: 1px solid #ddd;
        background: white;
        transition: width 0.3s ease;
        overflow: hidden;
    }

    .panel-content {
        height: 100%;
        overflow-y: auto;
        padding: 1rem;
    }
</style>