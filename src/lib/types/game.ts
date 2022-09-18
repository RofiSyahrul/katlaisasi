export type GuessStatus = 'guessing' | 'wrong' | 'correct' | 'exact' | 'invalid';

export type GuessItem = {
  char: string;
  status: GuessStatus;
};
