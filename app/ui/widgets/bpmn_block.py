from kivy.uix.widget import Widget
from kivy.properties import StringProperty, ListProperty
from kivy.graphics import Color, Ellipse, Rectangle, Line
from kivy.uix.label import Label

class BPMNBlock(Widget):
    block_type = StringProperty('task')
    label = StringProperty('Tarefa')
    color = ListProperty([0.2, 0.5, 1, 1])

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.size = (80, 80)
        self.label_widget = Label(text=self.label, color=(1,1,1,1), font_size=16, halign='center', valign='middle')
        self.add_widget(self.label_widget)
        self.bind(pos=self._update_canvas, size=self._update_canvas, label=self._update_label)
        self._drag_touch = None
        self._connecting = False
        self._draw_shape()

    def _draw_shape(self):
        self.canvas.clear()
        with self.canvas:
            # Bloco BPMN
            if self.block_type == 'start':
                Color(0.2, 0.8, 0.2, 1)
                Ellipse(pos=self.pos, size=self.size)
            elif self.block_type == 'end':
                Color(1, 0.2, 0.2, 1)
                Ellipse(pos=self.pos, size=self.size)
            elif self.block_type == 'gateway':
                Color(1, 1, 0.2, 1)
                Line(points=[
                    self.x + self.width/2, self.y + self.height,
                    self.x + self.width, self.y + self.height/2,
                    self.x + self.width/2, self.y,
                    self.x, self.y + self.height/2,
                    self.x + self.width/2, self.y + self.height
                ], width=2)
            else:
                Color(*self.color)
                Rectangle(pos=self.pos, size=self.size)
            # Conector de entrada (esquerda)
            Color(0.2, 0.5, 1, 1)
            Ellipse(pos=(self.x - 8, self.y + self.height/2 - 8), size=(16, 16))
            # Conector de saída (direita)
            Color(0.2, 0.5, 1, 1)
            Ellipse(pos=(self.x + self.width - 8, self.y + self.height/2 - 8), size=(16, 16))

    def _update_canvas(self, *args):
        self._draw_shape()
        self.label_widget.center = self.center

    def _update_label(self, *args):
        self.label_widget.text = self.label

    def on_touch_down(self, touch):
        if self.collide_point(*touch.pos):
            # Detecta clique nos conectores
            if self._is_on_output_connector(touch.pos):
                if hasattr(self.parent, 'connection_manager'):
                    self.parent.connection_manager.start_preview(self)
                self._connecting = True
                return True
            if self._is_on_input_connector(touch.pos):
                return True
            self._drag_touch = touch
            self._drag_offset = (touch.x - self.x, touch.y - self.y)
            return True
        return super().on_touch_down(touch)

    def on_touch_move(self, touch):
        if getattr(self, '_connecting', False):
            if hasattr(self.parent, 'connection_manager'):
                self.parent.connection_manager.update_preview(touch.pos)
            return True
        if self._drag_touch is touch:
            new_x = touch.x - self._drag_offset[0]
            new_y = touch.y - self._drag_offset[1]
            parent = self.parent
            if parent:
                new_x = max(0, min(new_x, parent.width - self.width))
                new_y = max(0, min(new_y, parent.height - self.height))
            self.pos = (new_x, new_y)
            return True
        return super().on_touch_move(touch)

    def on_touch_up(self, touch):
        if getattr(self, '_connecting', False):
            # Verifica se soltou sobre o conector de entrada de outro bloco
            for child in self.parent.children:
                if isinstance(child, BPMNBlock) and child != self:
                    if child._is_on_input_connector(touch.pos):
                        if hasattr(self.parent, 'connection_manager'):
                            self.parent.connection_manager.end_preview(child)
                        break
            self._connecting = False
            return True
        if self._drag_touch is touch:
            self._drag_touch = None
            return True
        return super().on_touch_up(touch)

    def _is_on_input_connector(self, pos):
        cx = self.x - 8 + 8
        cy = self.y + self.height/2
        return (pos[0] - cx) ** 2 + (pos[1] - cy) ** 2 <= 8 ** 2

    def _is_on_output_connector(self, pos):
        cx = self.x + self.width - 8 + 8
        cy = self.y + self.height/2
        return (pos[0] - cx) ** 2 + (pos[1] - cy) ** 2 <= 8 ** 2

    # TODO: Adicionar label, arrasto, conectores futuramente 