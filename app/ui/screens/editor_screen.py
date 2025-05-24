from kivymd.uix.screen import MDScreen
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.floatlayout import MDFloatLayout
from kivymd.uix.label import MDLabel
from kivy.lang import Builder
from app.ui.widgets.block_card import BlockCard
from app.ui.widgets.toolbar import EditorToolbar
from app.ui.widgets.connection_manager import ConnectionManager
from app.core.flow_exporter import FlowExporter
from kivymd.uix.dialog import MDDialog
from kivymd.uix.button import MDFlatButton, MDIconButton
from kivymd.uix.toolbar import MDTopAppBar
from kivy.uix.filechooser import FileChooserListView
from kivy.properties import ObjectProperty
from kivy.clock import Clock
from kivymd.app import MDApp
import os
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.boxlayout import BoxLayout
from app.ui.widgets.bpmn_toolbar import BPMNToolbar
from kivy.uix.scrollview import ScrollView
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.graphics import Color, Rectangle

KV = '''
<EditorScreen>:
    canvas_area: canvas_area
    
    MDBoxLayout:
        orientation: 'vertical'
        spacing: "10dp"
        padding: "10dp"
        
        EditorToolbar:
            id: toolbar
            on_save: root.save_flow()
            on_open: root.show_open_dialog()
            
        MDFloatLayout:
            id: canvas_area
            size_hint: 1, 1
            md_bg_color: app.theme_cls.bg_normal
'''

class EditorScreen(MDScreen):
    canvas_area = ObjectProperty(None)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.register_event_type('on_canvas_ready')
        self.setup_ui()
        
    def setup_ui(self):
        # Main layout
        main_layout = MDBoxLayout(orientation='vertical')
        
        # Toolbar
        toolbar = MDTopAppBar(
            title="BPMN Editor",
            elevation=2
        )
        main_layout.add_widget(toolbar)
        
        # Content area with toolbar and canvas
        content = MDBoxLayout(orientation='horizontal')
        
        # BPMN Toolbar
        toolbar_layout = MDBoxLayout(
            orientation='vertical',
            size_hint_x=0.2,
            padding="8dp",
            spacing="8dp"
        )
        
        # Toolbar title
        toolbar_title = MDLabel(
            text="BPMN Elements",
            size_hint_y=None,
            height="48dp",
            halign="center"
        )
        toolbar_layout.add_widget(toolbar_title)
        
        # BPMN Elements
        bpmn_elements = [
            ("Start Event", "play-circle", "start"),
            ("End Event", "stop-circle", "end"),
            ("Task", "file-document", "task"),
            ("Gateway", "gate", "gateway")
        ]
        
        for label, icon, block_type in bpmn_elements:
            btn = MDIconButton(
                icon=icon,
                text=label,
                size_hint_y=None,
                height="48dp"
            )
            btn.bind(on_release=lambda x, bt=block_type: self.create_bpmn_block(bt))
            toolbar_layout.add_widget(btn)
        
        content.add_widget(toolbar_layout)
        
        # Canvas area container with padding
        canvas_container = MDBoxLayout(
            size_hint_x=0.8,
            padding="8dp"
        )
        
        # Canvas area
        self.canvas_area = MDFloatLayout(
            size_hint=(1, 1)
        )
        canvas_container.add_widget(self.canvas_area)
        content.add_widget(canvas_container)
        
        main_layout.add_widget(content)
        self.add_widget(main_layout)
        
        # Initialize connection manager
        self.connection_manager = ConnectionManager(self.canvas_area)
        
        # Wait for the next frame to ensure widgets are created
        Clock.schedule_once(self._finish_init)
        
    def on_canvas_ready(self, *args):
        """Event handler for when canvas is ready"""
        pass
        
    def _finish_init(self, dt):
        """Finish initialization after widgets are created"""
        print("Finishing initialization...")
        if not self.canvas_area:
            print("Canvas area not ready, retrying...")
            Clock.schedule_once(self._finish_init)
            return
            
        print("Canvas area is ready, initializing managers...")
        # Initialize flow exporter
        self.flow_exporter = FlowExporter(self.canvas_area, self.connection_manager)
        
        # Add initial blocks
        print("Adding initial blocks...")
        self._add_initial_blocks()
        
        # Dispatch canvas ready event
        self.dispatch('on_canvas_ready')
        print("Initialization complete!")
        
    def _add_initial_blocks(self):
        """Add initial blocks to the canvas"""
        if not self.canvas_area:
            print("Canvas area not available for adding blocks")
            return
        
        # Clear existing blocks
        for child in self.canvas_area.children[:]:
            if isinstance(child, BlockCard):
                self.canvas_area.remove_widget(child)
        
        # Create start event
        start_block = BlockCard(
            block_type="start",
            title="Start Process",
            description="Process begins here"
        )
        start_block.size_hint = (None, None)
        start_block.size = (180, 80)
        start_block.pos = (100, 300)
        start_block.connection_manager = self.connection_manager
        self.canvas_area.add_widget(start_block)
        
        # Create task
        task_block = BlockCard(
            block_type="task",
            title="Process Data",
            description="Main processing step"
        )
        task_block.size_hint = (None, None)
        task_block.size = (180, 80)
        task_block.pos = (400, 300)
        task_block.connection_manager = self.connection_manager
        self.canvas_area.add_widget(task_block)
        
        # Create gateway
        gateway_block = BlockCard(
            block_type="gateway",
            title="Decision Point",
            description="Make a decision"
        )
        gateway_block.size_hint = (None, None)
        gateway_block.size = (180, 80)
        gateway_block.pos = (400, 180)
        gateway_block.connection_manager = self.connection_manager
        self.canvas_area.add_widget(gateway_block)
        
        self.print_canvas_hierarchy()

    def print_canvas_hierarchy(self):
        print('--- CANVAS HIERARCHY ---')
        for child in self.canvas_area.children:
            print(f'{child.__class__.__name__} | pos={getattr(child, "pos", None)} | size={getattr(child, "size", None)} | parent={child.parent.__class__.__name__ if child.parent else None}')

    def save_flow(self, *args):
        """Save the current flow to a JSON file"""
        try:
            filepath = self.flow_exporter.export_to_json()
            self.show_success_dialog(f"Flow saved to {filepath}")
        except Exception as e:
            self.show_error_dialog(f"Error saving flow: {str(e)}")
            
    def show_open_dialog(self, *args):
        """Show dialog to select a flow file"""
        content = FileChooserListView(
            path=os.path.join(os.getcwd(), "data/fluxos"),
            filters=["*.json"]
        )
        
        dialog = MDDialog(
            title="Open Flow",
            type="custom",
            content_cls=content,
            buttons=[
                MDFlatButton(
                    text="CANCEL",
                    on_release=lambda x: dialog.dismiss()
                ),
                MDFlatButton(
                    text="OPEN",
                    on_release=lambda x: self.open_selected_file(content.selection, dialog)
                )
            ]
        )
        dialog.open()
        
    def open_selected_file(self, selection, dialog):
        """Open the selected flow file"""
        if not selection:
            self.show_error_dialog("No file selected")
            return
            
        try:
            filepath = selection[0]
            self.flow_exporter.import_from_json(filepath)
            self.show_success_dialog(f"Flow loaded from {filepath}")
            dialog.dismiss()
        except Exception as e:
            self.show_error_dialog(f"Error loading flow: {str(e)}")
            
    def show_success_dialog(self, message):
        """Show a success dialog"""
        dialog = MDDialog(
            title="Success",
            text=message,
            buttons=[
                MDFlatButton(
                    text="OK",
                    on_release=lambda x: dialog.dismiss()
                )
            ]
        )
        dialog.open()
        
    def show_error_dialog(self, message):
        """Show an error dialog"""
        dialog = MDDialog(
            title="Error",
            text=message,
            buttons=[
                MDFlatButton(
                    text="OK",
                    on_release=lambda x: dialog.dismiss()
                )
            ]
        )
        dialog.open()

    def create_bpmn_block(self, block_type):
        block = BlockCard(
            block_type=block_type,
            title=f"{block_type.title()} Block",
            description=f"This is a {block_type} block"
        )
        block.size_hint = (None, None)
        block.size = (180, 80)
        block.pos = (100, 100)  # Initial position
        block.connection_manager = self.connection_manager  # Set connection manager
        self.canvas_area.add_widget(block) 