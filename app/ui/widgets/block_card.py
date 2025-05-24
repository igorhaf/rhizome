from kivymd.uix.card import MDCard
from kivymd.uix.label import MDLabel
from kivy.lang import Builder
from kivy.properties import StringProperty, NumericProperty, ListProperty, ObjectProperty
from kivy.clock import Clock
from kivy.uix.boxlayout import BoxLayout
from kivy.graphics import Line, Color, Triangle, Rectangle, Ellipse, RoundedRectangle
from kivy.uix.textinput import TextInput
from kivy.uix.popup import Popup
from kivy.uix.button import Button
from kivy.core.window import Window
import json
import math

KV = '''
<BlockCard>:
    orientation: 'vertical'
    padding: "8dp"
    spacing: "10dp"
    size_hint: None, None
    size: "200dp", "120dp"
    elevation: 0  # Remove elevation to prevent shadow interference
    radius: [10]
    md_bg_color: 0, 0, 0, 0  # Make background transparent

    canvas.before:
        # White border
        Color:
            rgba: 1, 1, 1, 1
        RoundedRectangle:
            size: self.width + 2, self.height + 2
            pos: self.x - 1, self.y - 1
            radius: [8]

    MDLabel:
        text: root.title
        theme_text_color: "Custom"
        text_color: 1, 1, 1, 1
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
        text_color: 0.7, 0.7, 0.7, 1
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
                    rgba: 0.5, 0.5, 0.5, 1
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
                    rgba: 0.5, 0.5, 0.5, 1
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
    block_type = StringProperty("task")  # "start", "end", "gateway", "task"

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
        self._last_touch_time = 0
        Clock.schedule_once(self._force_render)
        Window.bind(on_key_down=self._on_key_down)
        self.selected_blocks = []
        self.undo_stack = []
        self.redo_stack = []
        self.bind(pos=self.update_canvas, size=self.update_canvas, block_type=self.update_canvas)
        Clock.schedule_once(self.update_canvas, 0)

    def _force_render(self, dt):
        self.canvas.ask_update()
        for child in self.children:
            child.canvas.ask_update()

    def on_size(self, *args):
        self.update_canvas()
        for child in self.children:
            child.canvas.ask_update()
        self.update_connections()

    def on_pos(self, *args):
        self.update_canvas()
        for child in self.children:
            child.canvas.ask_update()
        self.update_connections()

    def on_touch_down(self, touch):
        if self.collide_point(*touch.pos):
            if hasattr(self.parent, 'selected_blocks'):
                if 'shift' in touch.modifiers:
                    # Seleção múltipla
                    if self not in self.parent.selected_blocks:
                        self.parent.selected_blocks.append(self)
                        self.is_selected = 1
                    else:
                        self.parent.selected_blocks.remove(self)
                        self.is_selected = 0
                else:
                    # Seleção única
                    for b in self.parent.selected_blocks:
                        b.is_selected = 0
                    self.parent.selected_blocks = [self]
                    self.is_selected = 1
            # Detecta duplo clique para editar nome
            if hasattr(self, '_last_touch_time') and touch.time_start - self._last_touch_time < 0.3:
                self._show_edit_label_popup()
                self._last_touch_time = 0
                return True
            self._last_touch_time = touch.time_start
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
                # Arrasto manual
                self._drag_touch = touch
                self._drag_offset_x = touch.x - self.x
                self._drag_offset_y = touch.y - self.y
                return True
            except Exception as e:
                return False
        return False

    def on_touch_move(self, touch):
        if hasattr(self, '_drag_touch') and touch is self._drag_touch:
            new_x = touch.x - self._drag_offset_x
            new_y = touch.y - self._drag_offset_y
            parent = self.parent
            if parent:
                new_x = max(0, min(new_x, parent.width - self.width))
                new_y = max(0, min(new_y, parent.height - self.height))
            self.pos = (new_x, new_y)
            if hasattr(self.parent, 'selected_blocks') and self in self.parent.selected_blocks:
                for b in self.parent.selected_blocks:
                    if b is not self:
                        b.pos = (b.x + (new_x - self.x), b.y + (new_y - self.y))
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
                return False
        return False

    def update_connections(self):
        print(f"[DEBUG] {self.title} output_connections: {self.output_connections}")
        print(f"[DEBUG] {self.title} input_connections: {self.input_connections}")
        for conn in self.output_connections:
            if hasattr(conn, 'update'):
                conn.update()
        for conn in self.input_connections:
            if hasattr(conn, 'update'):
                conn.update()

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

    def _show_edit_label_popup(self):
        box = BoxLayout(orientation='vertical', spacing=10, padding=10)
        ti = TextInput(text=self.title, multiline=False)
        btn = Button(text='OK', size_hint_y=None, height=40)
        box.add_widget(ti)
        box.add_widget(btn)
        popup = Popup(title='Editar nome do bloco', content=box, size_hint=(None, None), size=(300, 150))
        def confirm(instance):
            self.title = ti.text
            popup.dismiss()
        btn.bind(on_release=confirm)
        popup.open()

    def _on_key_down(self, window, key, scancode, codepoint, modifiers):
        # Undo: Ctrl+Z
        if key == 122 and 'ctrl' in modifiers:
            self.undo()
        # Redo: Ctrl+Y
        if key == 121 and 'ctrl' in modifiers:
            self.redo()
        # Delete = 127 (Linux) ou 8 (Backspace) ou 46 (Windows)
        if key in (127, 8, 46):
            if self.selected_block:
                self._delete_block(self.selected_block)
                self.selected_block = None
        # Ctrl+D para duplicar bloco
        if key == 100 and 'ctrl' in modifiers:
            if hasattr(self, 'selected_blocks') and self.selected_blocks:
                for block in self.selected_blocks:
                    self._duplicate_block(block)

    def _delete_block(self, block):
        # Remove conexões visuais (se usar ConnectionManager, adapte)
        for conn in getattr(self, 'connection_manager', []).connections[:]:
            if conn.start_block == block or conn.end_block == block:
                self.canvas_area.remove_widget(conn)
                self.connection_manager.connections.remove(conn)
        self.canvas_area.remove_widget(block)
        self.push_undo('delete_block', block)

    def _duplicate_block(self, block):
        # Cria uma cópia do bloco com deslocamento
        new_block = BlockCard(
            title=block.title,
            description=block.description
        )
        new_block.size_hint = (None, None)
        new_block.size = block.size
        new_block.pos = (block.x + 40, block.y - 40)
        new_block.connection_manager = self.connection_manager
        self.canvas_area.add_widget(new_block)

    def push_undo(self, action, data):
        self.undo_stack.append((action, data))
        self.redo_stack.clear()

    def undo(self):
        if not self.undo_stack:
            return
        action, data = self.undo_stack.pop()
        if action == 'add_block':
            self.canvas_area.remove_widget(data)
            # Remover conexões associadas, se necessário
        elif action == 'delete_block':
            self.canvas_area.add_widget(data)
            # Restaurar conexões associadas, se necessário
        # ... outros casos ...
        self.redo_stack.append((action, data))

    def redo(self):
        if not self.redo_stack:
            return
        action, data = self.redo_stack.pop()
        if action == 'add_block':
            self.canvas_area.add_widget(data)
        elif action == 'delete_block':
            self.canvas_area.remove_widget(data)
        # ... outros casos ...
        self.undo_stack.append((action, data))

    def push_undo(self, action, data):
        self.undo_stack.append((action, data))
        self.redo_stack.clear()

    def push_undo(self, action, data):
        self.undo_stack.append((action, data))
        self.redo_stack.clear()

    def export_to_json(self, filename):
        data = []
        for child in self.canvas_area.children:
            if isinstance(child, BlockCard):
                data.append({
                    'title': child.title,
                    'description': child.description,
                    'x': child.x,
                    'y': child.y,
                    'width': child.width,
                    'height': child.height,
                    # Adicione outros campos relevantes
                })
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)

    def import_from_json(self, filename):
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
        # Limpa o canvas
        for child in self.canvas_area.children[:]:
            if isinstance(child, BlockCard):
                self.canvas_area.remove_widget(child)
        # Adiciona os blocos
        for block_data in data:
            block = BlockCard(
                title=block_data['title'],
                description=block_data.get('description', '')
            )
            block.size_hint = (None, None)
            block.size = (block_data.get('width', 180), block_data.get('height', 80))
            block.pos = (block_data['x'], block_data['y'])
            block.connection_manager = self.connection_manager
            self.canvas_area.add_widget(block)

    def validate_connection(self, target_block, target_port):
        """Validate BPMN connection rules"""
        if self.block_type == 'start' and target_block.block_type == 'end':
            return False
            
        if self.block_type == 'end':
            return False
            
        if target_block.block_type == 'start':
            return False
            
        if self.block_type == 'gateway':
            # Count existing outgoing connections
            outgoing = sum(1 for conn in self.output_connections if conn)
            if outgoing >= 2 and target_port == 'input':
                return False
                
        if target_block.block_type == 'gateway':
            # Count existing incoming connections
            incoming = sum(1 for conn in target_block.input_connections if conn)
            if incoming >= 2 and target_port == 'output':
                return False
                
        return True

    def end_connection(self, target_block, target_port):
        if not self.validate_connection(target_block, target_port):
            return
        if self.connection_manager:
            conn = self.connection_manager.create_connection(self, target_block)
            if conn not in self.output_connections:
                self.output_connections.append(conn)
            if conn not in target_block.input_connections:
                target_block.input_connections.append(conn)
        if self.block_type == 'gateway':
            self.validate_gateway_connections()
        if target_block.block_type == 'gateway':
            target_block.validate_gateway_connections()

    def validate_gateway_connections(self):
        """Validate that gateway has proper number of connections"""
        if self.block_type != 'gateway':
            return
            
        incoming = sum(1 for conn in self.input_connections if conn)
        outgoing = sum(1 for conn in self.output_connections if conn)
        
        if incoming < 1:
            pass
        if outgoing < 2:
            pass

    def validate_gateway(self, block):
        if block.block_type == 'gateway':
            outgoing = sum(1 for conn in self.connections if conn.start_block == block)
            incoming = sum(1 for conn in self.connections if conn.end_block == block)
            if outgoing < 2 and incoming < 2:
                pass

    def update_canvas(self, *args):
        self.canvas.before.clear()
        with self.canvas.before:
            # Draw white border
            Color(1, 1, 1, 1)
            RoundedRectangle(pos=self.pos, size=self.size, radius=[12])
            
            # Draw main shape based on block type
            if self.block_type == 'start':
                # Green circle for start event
                Color(0.2, 0.8, 0.2, 1)
                Ellipse(pos=self.pos, size=self.size)
                # Draw play icon
                Color(1, 1, 1, 1)
                center_x = self.pos[0] + self.size[0]/2
                center_y = self.pos[1] + self.size[1]/2
                icon_size = min(self.size[0], self.size[1]) * 0.4
                Triangle(points=[
                    center_x - icon_size/2, center_y - icon_size/2,
                    center_x - icon_size/2, center_y + icon_size/2,
                    center_x + icon_size/2, center_y
                ])
            elif self.block_type == 'end':
                # Red circle for end event
                Color(1, 0.2, 0.2, 1)
                Ellipse(pos=self.pos, size=self.size)
                # Draw stop icon
                Color(1, 1, 1, 1)
                center_x = self.pos[0] + self.size[0]/2
                center_y = self.pos[1] + self.size[1]/2
                icon_size = min(self.size[0], self.size[1]) * 0.4
                Rectangle(pos=(center_x - icon_size/2, center_y - icon_size/2),
                         size=(icon_size, icon_size))
            elif self.block_type == 'gateway':
                # Yellow diamond for gateway
                Color(1, 0.8, 0.2, 1)
                w, h = self.size
                x, y = self.pos
                center_x = x + w/2
                center_y = y + h/2
                diamond_size = min(w, h) * 0.8
                points = [
                    center_x, y + h - diamond_size/2,  # top
                    x + w - diamond_size/2, center_y,  # right
                    center_x, y + diamond_size/2,      # bottom
                    x + diamond_size/2, center_y,      # left
                    center_x, y + h - diamond_size/2   # back to top
                ]
                Line(points=points, width=2)
                # Draw X icon
                Color(0.2, 0.2, 0.2, 1)
                icon_size = diamond_size * 0.4
                Line(points=[
                    center_x - icon_size/2, center_y - icon_size/2,
                    center_x + icon_size/2, center_y + icon_size/2
                ], width=2)
                Line(points=[
                    center_x - icon_size/2, center_y + icon_size/2,
                    center_x + icon_size/2, center_y - icon_size/2
                ], width=2)
            else:  # task
                # Blue rounded rectangle for task
                Color(0.2, 0.5, 1, 1)
                RoundedRectangle(pos=self.pos, size=self.size, radius=[12])
                # Draw task icon (document)
                Color(1, 1, 1, 1)
                center_x = self.pos[0] + self.size[0]/2
                center_y = self.pos[1] + self.size[1]/2
                icon_size = min(self.size[0], self.size[1]) * 0.4
                Rectangle(pos=(center_x - icon_size/2, center_y - icon_size/2),
                         size=(icon_size, icon_size))
                # Draw lines to represent text
                Color(0.2, 0.2, 0.2, 1)
                line_spacing = icon_size/4
                for i in range(3):
                    y = center_y - icon_size/4 + i * line_spacing
                    Line(points=[
                        center_x - icon_size/3, y,
                        center_x + icon_size/3, y
                    ], width=1)
