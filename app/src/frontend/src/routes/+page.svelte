<script>
  import TreeView from '$lib/components/TreeView.svelte';
  import DiagramArea from '$lib/components/DiagramArea.svelte';
  import SplitHandle from '$lib/components/SplitHandle.svelte';
  import RightPanel from '$lib/components/RightPanel.svelte';

  let leftWidth = 300;
  let rightWidth = 300;
  let selectedNode = null;

  function handleLeftResize(dx) {
      leftWidth = Math.max(200, Math.min(600, leftWidth + dx));
  }

  function handleRightResize(dx) {
      rightWidth = Math.max(200, Math.min(600, rightWidth - dx));
  }
</script>

<div class="app-container">
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
          <a class="navbar-brand" href="/">Flow Designer</a>
      </div>
  </nav>

  <div class="container-fluid h-100 p-0">
      <div class="row g-0">
          <div class="col-left" style="width: {leftWidth}px">
              <div class="card rounded-0 border-0">
                  <div class="card-body p-0">
                      <h5 class="card-title p-2 m-0">Components</h5>
                      <TreeView />
                  </div>
              </div>
          </div>

          <SplitHandle onDrag={handleLeftResize}/>

          <div class="col-middle">
              <div class="card rounded-0 border-0">
                  <div class="card-body p-0">
                      <h5 class="card-title p-2 m-0">Flow Diagram</h5>
                      <DiagramArea 
                            on:selectNode={(event) => selectedNode = event.detail}
                        />
                  </div>
              </div>
          </div>

          <SplitHandle onDrag={handleRightResize}/>

          <div class="col-right" style="width: {rightWidth}px">
              <div class="card rounded-0 border-0">
                  <div class="card-body p-0">
                      <h5 class="card-title p-2 m-0">Properties</h5>
                      <RightPanel {selectedNode} />
                    </div>
              </div>
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

  .container-fluid {
      flex: 1;
      overflow: hidden;
  }

  .row {
      height: 100%;
  }

  .col-left, .col-right {
      flex: 0 0 auto;
  }

  .col-middle {
      flex: 1;
  }

  footer {
      flex-shrink: 0;
  }
</style>