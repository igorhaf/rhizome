from kivymd.app import MDApp
from kivy.uix.screenmanager import ScreenManager
from kivy.core.window import Window
from kivy.clock import Clock
from app.ui.screens.editor_screen import EditorScreen
from app.ui.widgets.block_card import BlockCard

class RhizomeApp(MDApp):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.theme_cls.theme_style = "Dark"
        self.theme_cls.primary_palette = "Gray"
        self.theme_cls.accent_palette = "Blue"
        
    def build(self):
        # Set window size
        Window.size = (1200, 800)
        
        # Create screen manager
        sm = ScreenManager()
        
        # Add editor screen
        editor_screen = EditorScreen(name='editor')
        sm.add_widget(editor_screen)
        
        # Schedule canvas check
        Clock.schedule_interval(self._check_canvas_ready, 0.1)
        
        return sm
        
    def _check_canvas_ready(self, dt):
        """Check if canvas is ready and blocks are visible"""
        editor_screen = self.root.get_screen('editor')
        if not editor_screen or not editor_screen.canvas_area:
            return
            
        # Check if blocks are visible
        for child in editor_screen.canvas_area.children:
            if isinstance(child, BlockCard):
                # Force render
                child._force_render(0)
                
if __name__ == '__main__':
    RhizomeApp().run() 