import type { GuessItem } from '$lib/types/game';

export type SubmitGuessSuccessResponse = {
  guessResult: GuessItem[];
};

export type SubmitGuessInvalidResponse = {
  message: string;
};

export type DefineAnswerSuccessResponse = {
  answer: string;
  definitions: string[];
};
