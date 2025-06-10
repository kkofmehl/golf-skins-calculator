export interface Player {
  id: string;
  name: string;
}

export interface HoleResult {
  holeNumber: number;
  winnerId: string | null; // null means hole was halved
  isBirdie: boolean;
}

export interface GameSettings {
  players: Player[];
  skinValue: number;
  birdieDoublesValue: boolean;
  numberOfHoles: 9 | 18;
}

export interface PlayerResult {
  playerId: string;
  playerName: string;
  skinsWon: number;
  expectedWinnings: number;
  fairShare: number;
  totalWinnings: number;
  payments: Payment[];
}

export interface Payment {
  toPlayerId: string;
  toPlayerName: string;
  amount: number;
} 