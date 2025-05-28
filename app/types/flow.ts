export type NodeType = 
  | 'start'
  | 'end'
  | 'funcion'
  | 'email'
  | 'webhook'
  | 'decision'
  | 'loop'
  | 'subprocess'
  | 'Database'
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
    actionType?: 'function' | 'api' | 'database' | 'file' | 'email' | 'notification';
    inputParams?: string;
    timeout?: number;
    retryCount?: number;
    retryInterval?: number;
    isAsync?: boolean;
    conditionExpression?: string;
    inputVars?: string;
    outputVars?: string;
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
    labelOffset?: number;
  };
} 