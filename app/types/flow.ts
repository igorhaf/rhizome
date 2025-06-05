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
  | 'warning';

export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  label: string;
  description: string;
  returnStatus?: 'success' | 'error';
  returnCode?: number;
  returnType?: 'json' | 'text' | 'xml';
  shouldLog?: boolean;
  inputVars?: any;
  timeout?: number;
  retryCount?: number;
  retryInterval?: number;
  isAsync?: boolean;
  notes?: string;
  to?: string;
  subject?: string;
  emailBody?: string;
  webhookUrl?: string;
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  headers?: { key: string; value: string }[];
  payload?: string;
  loopType?: 'while' | 'for';
  condition?: string;
  iterations?: number;
  loopBody?: any[];
  queryInterface?: string;
  inputParams?: string;
  actionType?: string;
  apiUrl?: string;
  authType?: string;
  authUsername?: string;
  authPassword?: string;
  authToken?: string;
  apiKey?: string;
  apiKeyValue?: string;
  apiKeyLocation?: string;
  bodyType?: string;
  rawBody?: string;
  formData?: { key: string; value: string }[];
  preRequestScript?: string;
  tests?: string;
  followRedirects?: boolean;
  sslVerification?: boolean;
  outputVars?: any;
  from?: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  contentType?: string;
  templateId?: string;
  body?: string;
  attachments?: { name: string; url: string; path?: string }[];
  priority?: string;
  trackOpens?: boolean;
  trackClicks?: boolean;
  emailConfig?: {
    to?: string;
    subject?: string;
    body?: string;
    attachments?: string[];
  };
  finalMessage?: string;
  functionType?: string;
  functionCode?: string;
  functionInputs?: any[];
  functionOutputs?: any[];
  functionTests?: string;
  functionTimeout?: number;
  functionRetryCount?: number;
  functionRetryInterval?: number;
  functionIsAsync?: boolean;
  functionShouldLog?: boolean;
  functionNotes?: string;
  databaseConfig?: any;
  conditionExpression?: string;
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