from kivy.event import EventDispatcher
from kivy.properties import ListProperty, ObjectProperty
from app.ui.widgets.connector_line import ConnectorLine
from kivy.uix.widget import Widget
from kivy.graphics import Line, Color
from kivy.vector import Vector

class ConnectionManager(EventDispatcher):
    connections = ListProperty([])
    preview_line = ObjectProperty(None, allownone=True)
    
    def __init__(self, canvas_area, **kwargs):
        super().__init__(**kwargs)
        self.canvas_area = canvas_area
        self._start_block = None
        self._start_port = None
        
    def start_connection(self, block, port):
        """Start creating a connection from a block's port"""
        self._start_block = block
        self._start_port = port
        
        # Create preview line
        with self.canvas:
            Color(1, 1, 1, 1)  # White color
            self.preview_line = Line(points=[block.center_x, block.center_y, block.center_x, block.center_y])
            
    def update_preview(self, pos):
        """Update the preview line position"""
        if self.preview_line and self._start_block:
            self.preview_line.points = [
                self._start_block.center_x,
                self._start_block.center_y,
                pos[0],
                pos[1]
            ]
            
    def end_connection(self, block, port):
        """End connection creation and create the actual connection"""
        if self._start_block and block and self._start_port != port:
            # Create the connection
            connection = Connection(
                self._start_block,
                block,
                self._start_port,
                port
            )
            self.connections.append(connection)
            
            # Add connection to canvas
            self.canvas_area.add_widget(connection)
            
        # Reset state
        self._start_block = None
        self._start_port = None
        if self.preview_line:
            self.canvas.remove(self.preview_line)
            self.preview_line = None
            
class Connection(Widget):
    def __init__(self, start_block, end_block, start_port, end_port, **kwargs):
        super().__init__(**kwargs)
        self.start_block = start_block
        self.end_block = end_block
        self.start_port = start_port
        self.end_port = end_port
        
        # Desenhar a linha
        with self.canvas:
            Color(1, 1, 1, 1)
            start = self._get_start_pos()
            end = self._get_end_pos()
            self.line = Line(points=[*start, *end])

        # Atualizar sempre que o bloco se mover
        self.start_block.bind(pos=self._update_line, size=self._update_line)
        self.end_block.bind(pos=self._update_line, size=self._update_line)

    def _get_start_pos(self):
        if self.start_port == 'output':
            return self.start_block.get_output_port_pos()
        else:
            return self.start_block.get_input_port_pos()

    def _get_end_pos(self):
        if self.end_port == 'input':
            return self.end_block.get_input_port_pos()
        else:
            return self.end_block.get_output_port_pos()

    def _update_line(self, *args):
        self.line.points = [*self._get_start_pos(), *self._get_end_pos()]

    def update_start(self, pos):
        self._update_line()

    def update_end(self, pos):
        self._update_line()
        
    def remove_connection(self, connection):
        """Remove a connection"""
        if connection in self.connections:
            # Remove from blocks
            if connection.start_block:
                connection.start_block.output_connections.remove(connection)
            if connection.end_block:
                connection.end_block.input_connections.remove(connection)
                
            # Remove from canvas and list
            self.canvas_area.remove_widget(connection)
            self.connections.remove(connection)
            
    def find_source_block(self):
        """Find the block that started the connection"""
        if not self.preview_line:
            return None
        # Find block at preview line start position
        for child in self.canvas_area.children:
            if isinstance(child, BlockCard):
                if child.collide_point(*self.preview_line.get_start_pos()):
                    return child
        return None
        
    def find_target_block(self):
        """Find the block that will receive the connection"""
        if not self.preview_line:
            return None
        # Find block at preview line end position
        for child in self.canvas_area.children:
            if isinstance(child, BlockCard):
                if child.collide_point(*self.preview_line.get_end_pos()):
                    return child
        return None 