from kivymd.uix.toolbar import MDTopAppBar
from kivy.lang import Builder
from kivy.event import EventDispatcher
from kivy.properties import ObjectProperty

KV = '''
<EditorToolbar>:
    title: "Rhizome"
    elevation: 2
    md_bg_color: app.theme_cls.bg_darkest
    specific_text_color: app.theme_cls.text_color
    left_action_items: [["menu", lambda x: None]]
    right_action_items: [["plus", lambda x: None], ["folder-open", lambda x: self.dispatch('on_open')], ["content-save", lambda x: self.dispatch('on_save')], ["play", lambda x: None]]
'''

class EditorToolbar(MDTopAppBar, EventDispatcher):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        Builder.load_string(KV)
        
        # Configure icon colors to be light
        self.icon_color = (1, 1, 1, 1)  # White icons
        self.text_color = (1, 1, 1, 1)  # White text
        
    def on_save(self, *args):
        """Event handler for save action"""
        pass
        
    def on_open(self, *args):
        """Event handler for open action"""
        pass 