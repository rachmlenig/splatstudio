export type Tool = 'paint' | 'fill';

export interface AppState {
  color: string;
  tool: Tool;
  stamp: string | null;
  painting: boolean;
}

export interface Point {
  x: number;
  y: number;
}
