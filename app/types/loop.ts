import { Node } from 'reactflow';

export interface LoopData {
  label: string;
  description?: string;
  type: 'while' | 'for' | 'do-while';
  condition: string;
  iterations: number;
  body: any[];
}

export interface LoopNode extends Node {
  data: LoopData;
  type: 'loop';
}

export const defaultLoopData: LoopData = {
  label: 'Loop',
  condition: '',
  type: 'while',
  body: [],
}; 