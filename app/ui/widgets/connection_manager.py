from kivy.event import EventDispatcher
from kivy.properties import ListProperty, ObjectProperty
from app.ui.widgets.connector_line import ConnectorLine
from kivy.uix.widget import Widget
from kivy.graphics import Line, Color, Triangle
from kivy.vector import Vector
from math import atan2, cos, sin

class ConnectionManager(EventDispatcher):
    connections = ListProperty([])
    preview_line = ObjectProperty(None, allownone=True)
    preview_arrow = ObjectProperty(None, allownone=True)
    
    def __init__(self, canvas_area, **kwargs):
        super().__init__(**kwargs)
        self.canvas_area = canvas_area
        self._start_block = None
        self._start_port = None
        
    def _clear_preview(self):
        """Clear preview line and arrow"""
        if self.preview_line:
            self.canvas_area.canvas.remove(self.preview_line)
            self.preview_line = None
        if self.preview_arrow:
            self.canvas_area.canvas.remove(self.preview_arrow)
            self.preview_arrow = None
        
    def start_connection(self, block, port):
        """Start creating a connection from a block's port"""
        # Clear any existing preview
        self._clear_preview()
        
        self._start_block = block
        self._start_port = port
        
        # Get the correct port position
        if port == 'output':
            start_pos = block.get_output_port_pos()
        else:
            start_pos = block.get_input_port_pos()
        
        # Create preview line and arrow
        with self.canvas_area.canvas:
            Color(1, 1, 1, 1)  # White color
            self.preview_line = Line(points=[*start_pos, *start_pos])
            self.preview_arrow = Triangle(points=[0, 0, 0, 0, 0, 0])
            
    def update_preview(self, pos):
        """Update the preview line position"""
        if self.preview_line and self._start_block:
            # Get the correct port position
            if self._start_port == 'output':
                start_pos = self._start_block.get_output_port_pos()
            else:
                start_pos = self._start_block.get_input_port_pos()
            
            end_x = pos[0]
            end_y = pos[1]
            
            # Update line
            self.preview_line.points = [*start_pos, end_x, end_y]
            
            # Update arrow
            arrow_length = 18
            arrow_width = 10
            dx = end_x - start_pos[0]
            dy = end_y - start_pos[1]
            angle = atan2(dy, dx)
            tip_x, tip_y = end_x, end_y
            left_x = tip_x - arrow_length * cos(angle) + arrow_width * sin(angle) / 2
            left_y = tip_y - arrow_length * sin(angle) - arrow_width * cos(angle) / 2
            right_x = tip_x - arrow_length * cos(angle) - arrow_width * sin(angle) / 2
            right_y = tip_y - arrow_length * sin(angle) + arrow_width * cos(angle) / 2
            self.preview_arrow.points = [tip_x, tip_y, left_x, left_y, right_x, right_y]
            
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
        self._clear_preview()

class Connection(Widget):
    def __init__(self, start_block, end_block, start_port, end_port, **kwargs):
        super().__init__(**kwargs)
        self.start_block = start_block
        self.end_block = end_block
        self.start_port = start_port
        self.end_port = end_port
        
        with self.canvas:
            Color(0.2, 0.5, 1, 1)  # Azul
            start = self._get_start_pos()
            end = self._get_end_pos()
            self.line = Line(points=[*start, *end], width=1)
            self.arrow = Triangle(points=[0, 0, 0, 0, 0, 0])

        self.start_block.bind(pos=self._update_line, size=self._update_line)
        self.end_block.bind(pos=self._update_line, size=self._update_line)

        self._update_line()

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
        start = self._get_start_pos()
        end = self._get_end_pos()
        self.line.points = [*start, *end]
        self._update_arrow(start, end)

    def _update_arrow(self, start, end):
        arrow_length = 18
        arrow_width = 10
        dx = end[0] - start[0]
        dy = end[1] - start[1]
        angle = atan2(dy, dx)
        tip_x, tip_y = end
        left_x = tip_x - arrow_length * cos(angle) + arrow_width * sin(angle) / 2
        left_y = tip_y - arrow_length * sin(angle) - arrow_width * cos(angle) / 2
        right_x = tip_x - arrow_length * cos(angle) - arrow_width * sin(angle) / 2
        right_y = tip_y - arrow_length * sin(angle) + arrow_width * cos(angle) / 2
        self.arrow.points = [tip_x, tip_y, left_x, left_y, right_x, right_y]

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

class ConnectionLine(Widget):
    def __init__(self, start_block, end_block=None, **kwargs):
        super().__init__(**kwargs)
        self.start_block = start_block
        self.end_block = end_block
        self.points = []
        with self.canvas:
            Color(0.2, 0.5, 1, 1)
            self.line = Line(points=self.points, width=2)
            self.arrow = Triangle(points=[0, 0, 0, 0, 0, 0])
        self.update()
        # Atualiza a linha sempre que os blocos se movem
        self.start_block.bind(pos=self._update_from_blocks, size=self._update_from_blocks)
        if self.end_block:
            self.end_block.bind(pos=self._update_from_blocks, size=self._update_from_blocks)

    def _update_from_blocks(self, *args):
        self.update()

    def update(self, end_pos=None):
        if self.end_block:
            start = self.start_block.center
            end = self.end_block.center
        else:
            start = self.start_block.center
            end = end_pos if end_pos else start
        self.line.points = [*start, *end]
        # Arrow
        arrow_length = 18
        arrow_width = 10
        dx = end[0] - start[0]
        dy = end[1] - start[1]
        angle = atan2(dy, dx)
        tip_x, tip_y = end
        left_x = tip_x - arrow_length * cos(angle) + arrow_width * sin(angle) / 2
        left_y = tip_y - arrow_length * sin(angle) - arrow_width * cos(angle) / 2
        right_x = tip_x - arrow_length * cos(angle) - arrow_width * sin(angle) / 2
        right_y = tip_y - arrow_length * sin(angle) + arrow_width * cos(angle) / 2
        self.arrow.points = [tip_x, tip_y, left_x, left_y, right_x, right_y]

class ConnectionManager:
    def __init__(self, canvas_area):
        self.canvas_area = canvas_area
        self.preview_line = None
        self.connections = []

    def start_preview(self, start_block):
        self.preview_line = ConnectionLine(start_block)
        self.canvas_area.add_widget(self.preview_line)

    def update_preview(self, pos):
        if self.preview_line:
            self.preview_line.update(end_pos=pos)

    def end_preview(self, end_block):
        if self.preview_line and end_block and end_block != self.preview_line.start_block:
            self.preview_line.end_block = end_block
            self.preview_line.update()
            # Bind para atualizar a linha ao mover o bloco de destino
            self.preview_line.end_block.bind(pos=self.preview_line._update_from_blocks, size=self.preview_line._update_from_blocks)
            self.connections.append(self.preview_line)
            self.preview_line = None
        elif self.preview_line:
            self.canvas_area.remove_widget(self.preview_line)
            self.preview_line = None 