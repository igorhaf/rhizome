from kivymd.uix.card import MDCard
from kivymd.uix.label import MDLabel
from kivy.lang import Builder
from kivy.properties import StringProperty, NumericProperty, ListProperty, ObjectProperty
from kivy.clock import Clock
from kivy.uix.boxlayout import BoxLayout

KV = '''
<BlockCard>:
    orientation: 'vertical'
    padding: "8dp"
    spacing: "8dp"
    size_hint: None, None
    size: "180dp", "80dp"
    elevation: 1
    radius: [8]
    md_bg_color: app.theme_cls.bg_darkest if app else (0.1, 0.1, 0.1, 1)
    
    canvas.before:
        Color:
            rgba: app.theme_cls.primary_color if root.is_dragging and app else (0.1, 0.1, 0.1, 1)
        RoundedRectangle:
            size: self.size
            pos: self.pos
            radius: [8]
    
    MDLabel:
        text: root.title
        theme_text_color: "Custom"
        text_color: app.theme_cls.text_color if app else (1, 1, 1, 1)
        font_style: "H6"
        size_hint_y: None
        height: self.texture_size[1]
        
    MDLabel:
        text: root.description
        theme_text_color: "Custom"
        text_color: app.theme_cls.text_color if app else (0.7, 0.7, 0.7, 1)
        font_style: "Body2"
        size_hint_y: None
        height: self.texture_size[1]
        
    BoxLayout:
        size_hint_y: None
        height: "20dp"
        spacing: "4dp"
        
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
                else:
                    self._touch_pos = touch.pos
                    self._last_move_pos = touch.pos
                    self._original_pos = list(self.pos)
                    self._dragging = True
                    self.is_dragging = True
                    self.is_selected = 1
                    self.dispatch('on_drag_start', touch)
                    return True
            except Exception as e:
                print(f"Error in on_touch_down: {e}")
                return False
        return super().on_touch_down(touch)

    def on_touch_move(self, touch):
        if self._dragging:
            try:
                if self._last_move_pos is None:
                    self._last_move_pos = touch.pos
                    return True

                dx = touch.pos[0] - self._last_move_pos[0]
                dy = touch.pos[1] - self._last_move_pos[1]
                self._last_move_pos = touch.pos
                parent = self.parent
                if parent:
                    new_x = max(0, min(self.pos[0] + dx, parent.width - self.width))
                    new_y = max(0, min(self.pos[1] + dy, parent.height - self.height))
                    self.pos = (new_x, new_y)
                    self.update_connections()
                    self.dispatch('on_drag', touch)
                    return True
            except Exception as e:
                print(f"Error in on_touch_move: {e}")
                return False
        elif self.is_connecting and self.connection_manager:
            self.connection_manager.update_preview(touch.pos)
            return True
        return super().on_touch_move(touch)

    def on_touch_up(self, touch):
        if self._dragging:
            try:
                self._dragging = False
                self._touch_pos = None
                self._original_pos = None
                self._last_move_pos = None
                self.is_dragging = False
                self.is_selected = 0
                self.dispatch('on_drag_end', touch)
                return True
            except Exception as e:
                print(f"Error in on_touch_up: {e}")
                return False
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
        return super().on_touch_up(touch)

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
