export type GuessStatus = 'guessing' | 'wrong' | 'correct' | 'exact';

export type GuessItem = {
  char: string;
  status: GuessStatus;
};
