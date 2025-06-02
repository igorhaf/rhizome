export type NodeType = 
  | 'start'
  | 'end'
  | 'funcion'
  | 'email'
  | 'webhook'
  | 'decision'
  | 'loop'
  | 'subprocess'
  | 'database'
  | 'Database'
  | 'api'
  | 'spreadsheet';

export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  label: string;
  description?: string;
  notes?: string;
  outputs?: string;
  active?: boolean;
  databaseConfig?: {
    type: 'postgres' | 'mysql' | 'sqlite' | 'mongodb';
    query: string;
  };
  emailConfig?: {
    to: string;
    subject: string;
    body: string;
    attachments?: string[];
  };
  spreadsheetConfig?: {
    fileType: 'xlsx' | 'xls' | 'csv' | 'ods';
    operationType: 'read' | 'write' | 'append' | 'update';
    sheetName: string;
    range: string;
    format: 'none' | 'number' | 'currency' | 'date' | 'percentage';
  };
}

export interface Node {
  id: string;
  type: NodeType;
  position: Position;
  data: NodeData;
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
    labelOffset?: number;
  };
}

export interface Flow {
  nodes: Node[];
  edges: Edge[];
} 