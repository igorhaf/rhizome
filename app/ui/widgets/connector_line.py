from kivy.uix.widget import Widget
from kivy.graphics import Line, Color
from kivy.properties import ListProperty, NumericProperty
from kivy.lang import Builder

KV = '''
<ConnectorLine>:
    canvas:
        Color:
            rgba: app.theme_cls.primary_color
        Line:
            points: self.points
            width: self.line_width
            bezier: self.points if len(self.points) == 4 else None
'''

class ConnectorLine(Widget):
    # Properties for line configuration
    points = ListProperty([0, 0, 0, 0])  # [x1, y1, x2, y2]
    line_width = NumericProperty(2)
    
    def __init__(self, start_pos=None, end_pos=None, **kwargs):
        super().__init__(**kwargs)
        Builder.load_string(KV)
        
        # Initialize with given positions or defaults
        if start_pos and end_pos:
            self.update_points(start_pos, end_pos)
            
    def update_points(self, start_pos, end_pos):
        """Update the line points with new start and end positions"""
        self.points = [
            start_pos[0], start_pos[1],
            end_pos[0], end_pos[1]
        ]
        
    def update_start(self, pos):
        """Update only the start point of the line"""
        self.points[0] = pos[0]
        self.points[1] = pos[1]
        
    def update_end(self, pos):
        """Update only the end point of the line"""
        self.points[2] = pos[0]
        self.points[3] = pos[1]
        
    def get_start_pos(self):
        """Get the current start position"""
        return (self.points[0], self.points[1])
        
    def get_end_pos(self):
        """Get the current end position"""
        return (self.points[2], self.points[3])
        
    def on_points(self, instance, value):
        """Called when points are updated"""
        # Force canvas update
        self.canvas.ask_update() 