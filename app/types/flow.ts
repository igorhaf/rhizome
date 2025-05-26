export type NodeType = 
  | 'start'
  | 'end'
  | 'action'
  | 'decision'
  | 'loop'
  | 'subprocess'
  | 'data'
  | 'api';

export interface Position {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  type: NodeType;
  position: Position;
  data: {
    label: string;
    description?: string;
    properties?: Record<string, any>;
    color?: string;
    active?: boolean;
    outputs?: string;
    notes?: string;
    returnStatus?: 'success' | 'error' | 'warning' | 'info';
    returnCode?: number;
    finalMessage?: string;
    returnType?: 'json' | 'text' | 'html' | 'xml' | 'binary';
    shouldLog?: boolean;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'success' | 'error' | 'conditional';
  label?: string;
  data?: {
    condition?: string;
    properties?: Record<string, any>;
    sourceConnector?: string;
    targetConnector?: string;
  };
} 