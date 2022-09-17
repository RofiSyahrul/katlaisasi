import { MAX_ROUND_PER_ROOM } from '$lib/constants/game';
import type { GuessItem } from '$lib/types/game';
import { encode } from './codec.server';

function generateAnswerIndex(params: {
  roomNumber: number;
  round: number;
  totalWords: number;
}): number {
  const { roomNumber, round, totalWords } = params;

  let roundFactor = 1;
  if (roomNumber < MAX_ROUND_PER_ROOM * MAX_ROUND_PER_ROOM) {
    roundFactor = MAX_ROUND_PER_ROOM;
  } else if (round % 2 === 1) {
    roundFactor = -1;
  }

  const roomFactor = (MAX_ROUND_PER_ROOM + roundFactor * round) / MAX_ROUND_PER_ROOM;
  const answerIndex = Math.floor(roomNumber * roomFactor) % totalWords;
  return answerIndex;
}

export function generateEncodedAnswer(params: {
  roomNumber: number;
  round: number;
  words: string[];
}): string {
  const { roomNumber, round, words } = params;
  const totalWords = words.length;
  const answerIndex = generateAnswerIndex({ roomNumber, round, totalWords });
  return encode(words[answerIndex]);
}

export function getGameResult(guess: string, answer: string): GuessItem[] {
  const answerCharIndicesMap: Record<string, number[]> = {};
  const correctGuessIndexMap: Record<string, number> = {};

  answer.split('').forEach((char, index) => {
    if (answerCharIndicesMap[char]) answerCharIndicesMap[char].push(index);
    else answerCharIndicesMap[char] = [index];
  });

  const guessResult = guess.split('').map<GuessItem>((char, index) => {
    const answerCharIndices = answerCharIndicesMap[char];
    if (!answerCharIndices || !answerCharIndices.length) {
      return { char, status: 'wrong' };
    }

    const indexNumber = answerCharIndices.indexOf(index);
    if (indexNumber > -1) {
      answerCharIndices.splice(indexNumber, 1);
      return { char, status: 'exact' };
    }

    correctGuessIndexMap[`${char}::${index}`] = index;
    return { char, status: 'correct' };
  });

  for (const key in correctGuessIndexMap) {
    const index = correctGuessIndexMap[key];
    const [char] = key.split('::');
    if (answerCharIndicesMap[char].length) {
      answerCharIndicesMap[char].splice(0, 1);
    } else {
      guessResult[index] = {
        char,
        status: 'wrong'
      };
    }
  }

  return guessResult;
}
