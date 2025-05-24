from kivy.event import EventDispatcher
from kivy.properties import ListProperty, ObjectProperty
from app.ui.widgets.connector_line import ConnectorLine
from kivy.uix.widget import Widget
from kivy.graphics import Line, Color, Triangle
from kivy.vector import Vector
from math import atan2, cos, sin
import math

class ConnectionLine(Widget):
    def __init__(self, start_block, end_block, **kwargs):
        super().__init__(**kwargs)
        self.start_block = start_block
        self.end_block = end_block
        with self.canvas:
            Color(0.2, 0.5, 1, 1)
            self.line = Line(points=[0, 0, 0, 0], width=2)
            self.arrow = Triangle(points=[0, 0, 0, 0, 0, 0])
        self.update()
        self.start_block.bind(pos=self._update_from_blocks, size=self._update_from_blocks)
        self.end_block.bind(pos=self._update_from_blocks, size=self._update_from_blocks)

    def _update_from_blocks(self, *args):
        self.update()

    def update(self):
        # Get connector positions in canvas_area coordinates
        start_pos = self.parent.to_widget(*self.start_block.get_output_port_pos())
        end_pos = self.parent.to_widget(*self.end_block.get_input_port_pos())
        self.line.points = [*start_pos, *end_pos]
        # Arrow
        arrow_length = 18
        arrow_width = 10
        dx = end_pos[0] - start_pos[0]
        dy = end_pos[1] - start_pos[1]
        angle = atan2(dy, dx)
        tip_x, tip_y = end_pos
        left_x = tip_x - arrow_length * cos(angle) + arrow_width * sin(angle) / 2
        left_y = tip_y - arrow_length * sin(angle) - arrow_width * cos(angle) / 2
        right_x = tip_x - arrow_length * cos(angle) - arrow_width * sin(angle) / 2
        right_y = tip_y - arrow_length * sin(angle) + arrow_width * cos(angle) / 2
        self.arrow.points = [tip_x, tip_y, left_x, left_y, right_x, right_y]

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
        
    def _to_canvas_area(self, window_pos):
        # Converts a (x, y) window position to canvas_area local coordinates
        return self.canvas_area.to_widget(*window_pos)

    def start_connection(self, block, port):
        """Start creating a connection from a block's port"""
        # Clear any existing preview
        self._clear_preview()
        
        self._start_block = block
        self._start_port = port
        
        # Get the correct port position
        if port == 'output':
            start_pos = self._to_canvas_area(block.get_output_port_pos())
        else:
            start_pos = self._to_canvas_area(block.get_input_port_pos())
        
        # Create preview line and arrow
        with self.canvas_area.canvas:
            Color(0.2, 0.5, 1, 1)  # Blue color
            self.preview_line = Line(points=[*start_pos, *start_pos], width=2)
            self.preview_arrow = Triangle(points=[0, 0, 0, 0, 0, 0])
            
    def update_preview(self, pos):
        """Update the preview line position"""
        if not self.preview_line or not self._start_block:
            return

        if self._start_port == 'output':
            start_pos = self._to_canvas_area(self._start_block.get_output_port_pos())
        else:
            start_pos = self._to_canvas_area(self._start_block.get_input_port_pos())
        
        end_pos = self._to_canvas_area(pos)
        self.preview_line.points = [*start_pos, *end_pos]
        
        # Update arrow
        arrow_length = 18
        arrow_width = 10
        dx = end_pos[0] - start_pos[0]
        dy = end_pos[1] - start_pos[1]
        angle = atan2(dy, dx)
        tip_x, tip_y = end_pos
        left_x = tip_x - arrow_length * cos(angle) + arrow_width * sin(angle) / 2
        left_y = tip_y - arrow_length * sin(angle) - arrow_width * cos(angle) / 2
        right_x = tip_x - arrow_length * cos(angle) - arrow_width * sin(angle) / 2
        right_y = tip_y - arrow_length * sin(angle) + arrow_width * cos(angle) / 2
        self.preview_arrow.points = [tip_x, tip_y, left_x, left_y, right_x, right_y]

    def end_connection(self, target_block, target_port):
        """End connection creation and create the actual connection"""
        if not self._start_block or not self.preview_line:
            return

        # Remove preview
        self._clear_preview()

        # Validate connection
        if not self._start_block.validate_connection(target_block, target_port):
            self._start_block = None
            self._start_port = None
            return

        # Create a ConnectionLine widget and add to canvas_area
        conn = ConnectionLine(self._start_block, target_block)
        self.canvas_area.add_widget(conn)
        self.connections.append(conn)

        # Update block connections
        self._start_block.end_connection(target_block, target_port)

        # Reset state
        self._start_block = None
        self._start_port = None

    def create_connection(self, start_block, end_block):
        """Create a connection between two blocks"""
        conn = ConnectionLine(start_block, end_block)
        self.canvas_area.add_widget(conn)
        self.connections.append(conn)

    def clear_connections(self):
        """Clear all connections"""
        for conn in self.connections:
            self.canvas_area.remove_widget(conn)
        self.connections.clear() 