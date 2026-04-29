export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  color: string;
}

export type Point = { x: number; y: number };

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  isGameOver: boolean;
  score: number;
  highScore: number;
}
