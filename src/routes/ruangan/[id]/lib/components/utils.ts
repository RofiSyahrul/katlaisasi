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

export function getVictoryScore(activeRow: number) {
  const scores = [100, 75, 55, 40, 30, 25];
  return scores[activeRow] || scores[scores.length - 1];
}
