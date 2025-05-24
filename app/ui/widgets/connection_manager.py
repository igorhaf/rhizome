from kivy.event import EventDispatcher
from kivy.properties import ListProperty, ObjectProperty
from kivy.uix.widget import Widget
from kivy.graphics import Line, Color, Triangle
from kivy.vector import Vector
from math import atan2, cos, sin

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
            self.line = Line(points=[*start, *end], width=2)
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
        if self.preview_line:
            self.canvas_area.canvas.remove(self.preview_line)
            self.preview_line = None
        if self.preview_arrow:
            self.canvas_area.canvas.remove(self.preview_arrow)
            self.preview_arrow = None
        
    def start_connection(self, block, port):
        self._clear_preview()
        self._start_block = block
        self._start_port = port
        if port == 'output':
            start_pos = block.get_output_port_pos()
        else:
            start_pos = block.get_input_port_pos()
        with self.canvas_area.canvas:
            Color(1, 1, 1, 1)
            self.preview_line = Line(points=[*start_pos, *start_pos])
            self.preview_arrow = Triangle(points=[0, 0, 0, 0, 0, 0])

    def update_preview(self, pos):
        if not self.preview_line or not self._start_block:
            return
        if self._start_port == 'output':
            start_pos = self._start_block.get_output_port_pos()
        else:
            start_pos = self._start_block.get_input_port_pos()
        end_x, end_y = pos
        self.preview_line.points = [*start_pos, end_x, end_y]
        # Arrow
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

    def end_connection(self, target_block, target_port):
        if not self._start_block:
            return
        # Cria a conexão visual
        conn = Connection(self._start_block, target_block, self._start_port, target_port)
        self.canvas_area.add_widget(conn)
        self.connections.append(conn)
        # Adiciona nas listas dos blocos
        if conn not in self._start_block.output_connections:
            self._start_block.output_connections.append(conn)
        if conn not in target_block.input_connections:
            target_block.input_connections.append(conn)
        self._clear_preview()
        self._start_block = None
        self._start_port = None

    def create_connection(self, start_block, end_block):
        # Cria conexão padrão de output para input
        conn = Connection(start_block, end_block, 'output', 'input')
        self.canvas_area.add_widget(conn)
        self.connections.append(conn)
        return conn

    def clear_connections(self):
        """Clear all connections"""
        for conn in self.connections:
            self.canvas_area.remove_widget(conn)
        self.connections.clear() 