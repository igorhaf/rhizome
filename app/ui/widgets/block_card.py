from kivymd.uix.card import MDCard
from kivymd.uix.label import MDLabel
from kivy.lang import Builder
from kivy.properties import StringProperty, NumericProperty, ListProperty, ObjectProperty
from kivy.clock import Clock
from kivy.uix.boxlayout import BoxLayout
from kivy.graphics import Line, Color, Triangle

KV = '''
<BlockCard>:
    orientation: 'vertical'
    padding: "8dp"
    spacing: "10dp"
    size_hint: None, None
    size: "200dp", "120dp"
    elevation: 2
    radius: [10]
    md_bg_color: app.theme_cls.bg_darkest if app else (0.1, 0.1, 0.1, 1)

    canvas.before:
        Color:
            rgba: 1, 1, 1, 1
        RoundedRectangle:
            size: self.width + 2, self.height + 2
            pos: self.x - 1, self.y - 1
            radius: [8]
        Color:
            rgba: app.theme_cls.primary_color if root.is_dragging and app else (0.1, 0.1, 0.1, 1)
        RoundedRectangle:
            size: self.size
            pos: self.pos
            radius: [6]

    MDLabel:
        text: root.title
        theme_text_color: "Custom"
        text_color: app.theme_cls.text_color if app else (1, 1, 1, 1)
        font_size: "18dp"
        size_hint_y: None
        size_hint_x: 1
        height: self.texture_size[1]
        halign: "left"
        shorten: True
        shorten_from: "right"

    MDLabel:
        text: root.description
        theme_text_color: "Custom"
        text_color: app.theme_cls.text_color if app else (0.7, 0.7, 0.7, 1)
        font_style: "Body2"
        size_hint_y: None
        size_hint_x: 1
        height: self.texture_size[1]
        halign: "left"
        shorten: True
        shorten_from: "right"

    BoxLayout:
        size_hint_y: None
        height: "24dp"
        spacing: "4dp"
        padding: "4dp"

        BoxLayout:
            id: input_port
            size_hint_x: None
            width: "20dp"
            canvas.before:
                Color:
                    rgba: app.theme_cls.primary_color if app else (0.5, 0.5, 0.5, 1)
                Ellipse:
                    size: self.size
                    pos: self.pos

        BoxLayout:
            id: output_port
            size_hint_x: None
            width: "20dp"
            pos_hint: {"right": 1}
            canvas.before:
                Color:
                    rgba: app.theme_cls.primary_color if app else (0.5, 0.5, 0.5, 1)
                Ellipse:
                    size: self.size
                    pos: self.pos
'''

Builder.load_string(KV)


class BlockCard(MDCard):
    title = StringProperty("Block")
    description = StringProperty("")
    is_selected = NumericProperty(0)
    drag_offset = ListProperty([0, 0])

    # Connection properties
    input_connections = ListProperty()
    output_connections = ListProperty()
    is_connecting = NumericProperty(0)
    connection_manager = ObjectProperty(None)
    is_dragging = False

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.register_event_type('on_drag_start')
        self.register_event_type('on_drag')
        self.register_event_type('on_drag_end')
        self._touch_pos = None
        self._original_pos = None
        self._dragging = False
        self._connection_start = None
        self._last_move_pos = None
        Clock.schedule_once(self._force_render)

    def _force_render(self, dt):
        self.canvas.ask_update()
        for child in self.children:
            child.canvas.ask_update()

    def on_size(self, *args):
        self.canvas.ask_update()
        for child in self.children:
            child.canvas.ask_update()

    def on_pos(self, *args):
        self.canvas.ask_update()
        for child in self.children:
            child.canvas.ask_update()

    def on_touch_down(self, touch):
        if self.collide_point(*touch.pos):
            try:
                input_port = self.ids.input_port
                output_port = self.ids.output_port
                local_pos = self.to_local(*touch.pos)

                if output_port.collide_point(*local_pos):
                    self._connection_start = 'output'
                    self.is_connecting = 1
                    if self.connection_manager:
                        self.connection_manager.start_connection(self, 'output')
                    return True
                elif input_port.collide_point(*local_pos):
                    self._connection_start = 'input'
                    self.is_connecting = 1
                    if self.connection_manager:
                        self.connection_manager.start_connection(self, 'input')
                    return True
                # Se não for clique nos ports, ativa o drag manualmente
                self._drag_touch = touch
                self._drag_start_x = self.x
                self._drag_start_y = self.y
                self._drag_offset_x = touch.x - self.x
                self._drag_offset_y = touch.y - self.y
                return True
            except Exception as e:
                print(f"Error in on_touch_down: {e}")
                return False
        return False

    def on_touch_move(self, touch):
        if hasattr(self, '_drag_touch') and touch is self._drag_touch:
            # Move o bloco
            new_x = touch.x - self._drag_offset_x
            new_y = touch.y - self._drag_offset_y
            parent = self.parent
            if parent:
                new_x = max(0, min(new_x, parent.width - self.width))
                new_y = max(0, min(new_y, parent.height - self.height))
            self.pos = (new_x, new_y)
            return True
        elif self.is_connecting and self.connection_manager:
            self.connection_manager.update_preview(touch.pos)
            return True
        return False

    def on_touch_up(self, touch):
        if hasattr(self, '_drag_touch') and touch is self._drag_touch:
            del self._drag_touch
            return True
        elif self.is_connecting and self.connection_manager:
            try:
                for child in self.parent.children:
                    if isinstance(child, BlockCard) and child != self:
                        local_pos = child.to_local(*touch.pos)
                        if self._connection_start == 'output':
                            if child.ids.input_port.collide_point(*local_pos):
                                self.connection_manager.end_connection(child, 'input')
                        else:
                            if child.ids.output_port.collide_point(*local_pos):
                                self.connection_manager.end_connection(child, 'output')
                self.is_connecting = 0
                self._connection_start = None
                return True
            except Exception as e:
                print(f"Error in on_touch_up (connection): {e}")
                return False
        return False

    def update_connections(self):
        try:
            for conn in self.output_connections:
                if conn and hasattr(conn, 'update_start'):
                    conn.update_start((self.center_x, self.center_y))
            for conn in self.input_connections:
                if conn and hasattr(conn, 'update_end'):
                    conn.update_end((self.center_x, self.center_y))
        except Exception as e:
            print(f"Error updating connections: {e}")

    def on_drag_start(self, touch):
        pass

    def on_drag(self, touch):
        pass

    def on_drag_end(self, touch):
        pass

    def get_input_port_pos(self):
        port = self.ids.input_port
        return port.to_window(port.center_x, port.center_y)

    def get_output_port_pos(self):
        port = self.ids.output_port
        return port.to_window(port.center_x, port.center_y)
