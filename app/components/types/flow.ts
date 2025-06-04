export type NodeType =
  | 'default'
  | 'loop'
  | 'webhook'
  | 'start'
  | 'end'
  | 'funcion'
  | 'email'
  | 'decision'
  | 'subprocess'
  | 'Database'
  | 'api'
  | 'spreadsheet'
  | 'warning';

export interface Node {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    message?: string; // Para warning
    [key: string]: any;
  };
} 