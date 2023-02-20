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
  const scores = [85, 60, 40, 25, 15, 10];
  return scores[activeRow] ?? 0;
}
