import json
import os
from datetime import datetime
from uuid import uuid4
from app.ui.widgets.block_card import BlockCard

class FlowExporter:
    def __init__(self, canvas_area, connection_manager):
        self.canvas_area = canvas_area
        self.connection_manager = connection_manager
        self._block_id_map = {}  # Maps JSON IDs to actual block instances
        
    def export_to_json(self, filename=None):
        """Export the current flow to a JSON file"""
        if not filename:
            # Create default filename with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"flow_{timestamp}.json"
            
        # Ensure the directory exists
        os.makedirs("data/fluxos", exist_ok=True)
        filepath = os.path.join("data/fluxos", filename)
        
        # Prepare the flow data
        flow_data = {
            "blocks": self._export_blocks(),
            "connections": self._export_connections()
        }
        
        # Write to file
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(flow_data, f, indent=2)
            
        return filepath
        
    def import_from_json(self, filepath):
        """Import a flow from a JSON file"""
        # Clear existing blocks and connections
        self._clear_canvas()
        
        # Read the JSON file
        with open(filepath, 'r', encoding='utf-8') as f:
            flow_data = json.load(f)
            
        # Create blocks
        for block_data in flow_data["blocks"]:
            block = self._create_block(block_data)
            self._block_id_map[block_data["id"]] = block
            
        # Create connections
        for conn_data in flow_data["connections"]:
            self._create_connection(conn_data)
            
        return True
        
    def _clear_canvas(self):
        """Clear all blocks and connections from the canvas"""
        # Clear connections
        for conn in self.connection_manager.connections[:]:
            self.connection_manager.remove_connection(conn)
        
        # Clear blocks
        for child in self.canvas_area.children[:]:
            if isinstance(child, BlockCard):
                # Remove all input connections
                for conn in list(child.input_connections):
                    if hasattr(self.connection_manager, 'remove_connection'):
                        self.connection_manager.remove_connection(conn)
                child.input_connections.clear()
                # Remove all output connections
                for conn in list(child.output_connections):
                    if hasattr(self.connection_manager, 'remove_connection'):
                        self.connection_manager.remove_connection(conn)
                child.output_connections.clear()
                self.canvas_area.remove_widget(child)
        
        # Clear ID mapping
        self._block_id_map.clear()
        
    def _create_block(self, block_data):
        """Create a block from JSON data"""
        block = BlockCard(
            title=block_data["type"],
            description=block_data["description"]
        )
        block.pos = (block_data["position"]["x"], block_data["position"]["y"])
        block.connection_manager = self.connection_manager
        # Ensure block is not parented elsewhere
        if block.parent:
            try:
                block.parent.remove_widget(block)
            except Exception:
                pass
        # Add as direct child of canvas_area
        self.canvas_area.add_widget(block)
        # Double check: if block is in any other widget, remove from there
        for child in list(block.children):
            if isinstance(child, BlockCard):
                block.remove_widget(child)
                self.canvas_area.add_widget(child)
        return block
        
    def _create_connection(self, conn_data):
        """Create a connection from JSON data"""
        source = self._block_id_map.get(conn_data["source"])
        target = self._block_id_map.get(conn_data["target"])
        
        if source and target:
            self.connection_manager.create_connection(source, target)
        
    def _export_blocks(self):
        """Export all blocks in the canvas"""
        blocks = []
        for child in self.canvas_area.children:
            if isinstance(child, BlockCard):
                block_id = str(uuid4())
                self._block_id_map[block_id] = child
                
                block_data = {
                    "id": block_id,
                    "type": child.title,
                    "description": child.description,
                    "position": {
                        "x": child.pos[0],
                        "y": child.pos[1]
                    }
                }
                blocks.append(block_data)
        return blocks
        
    def _export_connections(self):
        """Export all connections between blocks"""
        connections = []
        for conn in self.connection_manager.connections:
            # Find source and target block IDs
            source_id = self._find_block_id(conn.source)
            target_id = self._find_block_id(conn.target)
            
            if source_id and target_id:
                connection_data = {
                    "source": source_id,
                    "target": target_id
                }
                connections.append(connection_data)
        return connections
        
    def _find_block_id(self, block):
        """Find the ID of a block in the canvas"""
        for block_id, block_instance in self._block_id_map.items():
            if block_instance == block:
                return block_id
        return None 