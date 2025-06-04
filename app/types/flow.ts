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
  shouldLog?: boolean;
  inputVars?: string;
  outputVars?: string;
  from?: string;
  to?: string;
  subject?: string;
  contentType?: string;
  priority?: string;
  conditionExpression?: string;
  retryCount?: number;
  retryInterval?: number;
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
  apiUrl?: string;
  httpMethod?: string;
  headers?: string;
  payload?: string;
  authType?: 'none' | 'basic' | 'bearer' | 'apiKey';
  authUsername?: string;
  authPassword?: string;
  authToken?: string;
  apiKey?: string;
  apiKeyValue?: string;
  apiKeyLocation?: 'header' | 'query';
  timeout?: number;
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