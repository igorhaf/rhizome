from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button

class BPMNToolbar(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'horizontal'
        self.size_hint_y = None
        self.height = 48
        self.register_event_type('on_add_block')

        self.add_widget(Button(text="⏺ Evento de Início", on_release=lambda x: self.dispatch('on_add_block', 'start')))
        self.add_widget(Button(text="▭ Tarefa", on_release=lambda x: self.dispatch('on_add_block', 'task')))
        self.add_widget(Button(text="◇ Gateway", on_release=lambda x: self.dispatch('on_add_block', 'gateway')))
        self.add_widget(Button(text="◎ Evento de Fim", on_release=lambda x: self.dispatch('on_add_block', 'end')))

    def on_add_block(self, block_type):
        pass 