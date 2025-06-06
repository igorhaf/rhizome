import { Node as ReactFlowNode, Edge as ReactFlowEdge } from 'reactflow';

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
  | 'api'
  | 'spreadsheet'
  | 'warning'
  | 'schedule';

export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  label: string;
  description?: string;
  notes?: string;
  shouldLog?: boolean;
  timeout?: number;
  retryCount?: number;
  retryInterval?: number;
  isAsync?: boolean;
  active?: boolean;
  isFinal?: boolean;
  conditions?: any[];
  iterations?: number;
  inputParams?: string;
  to?: string;
  subject?: string;
  body?: string;
  attachments?: { name: string; url: string; path?: string }[];
  url?: string;
  method?: string;
  headers?: { key: string; value: string }[];
  file?: string;
  sheet?: string;
  range?: string;
  operation?: 'read' | 'write';
  conditionExpression?: string;
  databaseConfig?: {
    type: string;
    query: string;
  };
  returnStatus?: 'success' | 'error';
  returnCode?: number;
  returnType?: 'json' | 'text' | 'xml';
  inputVars?: any;
  emailBody?: string;
  webhookUrl?: string;
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  payload?: string;
  loopType?: 'while' | 'for';
  loopBody?: any[];
  queryInterface?: string;
  actionType?: string;
  apiUrl?: string;
  sslVerification?: boolean;
  outputVars?: any;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  contentType?: string;
  templateId?: string;
  priority?: string;
  trackOpens?: boolean;
  functionShouldLog?: boolean;
  functionNotes?: string;
  scheduleType?: 'interval' | 'cron';
  interval?: number;
  intervalUnit?: 'seconds' | 'minutes' | 'hours' | 'days';
  cronExpression?: string;
  timezone?: string;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

export type Node = ReactFlowNode<NodeData>;
export type Edge = ReactFlowEdge;

export interface Tab {
  id: string;
  title: string;
  type: 'main' | 'subprocess';
  nodeId?: string;
}

export interface SubprocessState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  selectedEdgeId: string | null;
}

export interface Flow {
  nodes: Node[];
  edges: Edge[];
} 