<script>
    import ScheduleForm from './ScheduleForm.svelte';
    import TreeView from '$lib/components/TreeView.svelte';
    import DiagramArea from '$lib/components/DiagramArea.svelte';
    import SplitHandle from '$lib/components/SplitHandle.svelte';
    import Properties from '$lib/components/Properties.svelte';

    let leftWidth = 300;
    let rightWidth = 300;
    let selectedNodeId = null;
</script>

<div class="app-container">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Flow Designer</a>
        </div>
    </nav>

    <div class="main-content">
        <div class="layout-container">
            <div class="col-left" style="width: {leftWidth}px">
                <TreeView />
            </div>

            <SplitHandle onDrag={handleLeftResize}/>

            <div class="col-middle">
                <DiagramArea 
                    on:nodeSelect={e => selectedNodeId = e.detail.id} 
                />
            </div>

            <SplitHandle onDrag={handleRightResize}/>

            <div class="col-right" style="width: {rightWidth}px">
                <Properties {selectedNodeId} />
            </div>
        </div>
    </div>

    <footer class="bg-dark text-white py-2">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 text-center">
                    <p class="m-0">&copy; 2024 Flow Designer. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        height: 100vh;
        overflow: hidden;
    }

    .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .main-content {
        flex: 1;
        overflow: hidden;
    }

    .layout-container {
        display: flex;
        height: 100%;
    }

    .col-left, .col-right {
        flex: 0 0 auto;
    }

    .col-middle {
        flex: 1;
        overflow: hidden;
    }

    footer {
        flex-shrink: 0;
    }
</style>