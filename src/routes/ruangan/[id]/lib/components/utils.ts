import type { GuessItem } from '$lib/types/game';

export function splitLettersFromGuess(guess: GuessItem[]) {
  const exactLetters: string[] = [];
  const correctLetters: string[] = [];
  const wrongLetters: string[] = [];

  guess.forEach(({ char, status }) => {
    switch (status) {
      case 'exact': {
        return exactLetters.push(char);
      }
      case 'correct': {
        return correctLetters.push(char);
      }
      case 'wrong': {
        return wrongLetters.push(char);
      }
    }
  });

  return { correctLetters, exactLetters, wrongLetters };
}
