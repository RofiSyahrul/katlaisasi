import { describe, expect, it, vi } from 'vitest';

import type { GuessItem } from '$lib/types/game';
import { decode } from './codec.server';
import { generateEncodedAnswer, getGameResult } from './game.server';

const maxRoundPerRoom = 4;

vi.mock('$lib/constants/game', () => ({
  MAX_ROUND_PER_ROOM: 4
}));

describe('Test game utils', () => {
  describe('Test generateEncodedAnswer function', () => {
    const words = [
      'abadi',
      'alami',
      'badak',
      'berak',
      'cakap',
      'cebur',
      'dajal',
      'damai',
      'ember',
      'encer',
      'fardu',
      'fasad',
      'gaduh',
      'galau',
      'habis',
      'hamba',
      'ialah',
      'iklim',
      'jeruk',
      'jorok',
      'kudis',
      'kukus',
      'libur',
      'lodeh',
      'mimik',
      'motto',
      'nilon',
      'novel',
      'objek',
      'orbit',
      'pajak',
      'panai',
      'qolbu',
      'quran',
      'redam',
      'ribut',
      'sadar',
      'sekam',
      'tahun',
      'telah',
      'urung',
      'utama',
      'versi',
      'viral',
      'windu',
      'wisma',
      'xenia',
      'xenon',
      'yaitu',
      'yatim',
      'zakat',
      'zigot'
    ];

    const totalWords = words.length;

    it('should use roomNumber % words.length as answer index for round 0', () => {
      const roomNumber = 47;
      const expectedAnswer = words[roomNumber % totalWords];
      expect(decode(generateEncodedAnswer({ roomNumber, round: 0, words }))).toBe(expectedAnswer);
    });

    it.each([[1], [2], [3]])(
      `if the roomNumber is less than MAX_ROUND_PER_ROOM squared,
      then the answer index should use (roomNumber * (round + 1)) % words.length for round %i (round > 0)`,
      (round) => {
        const roomNumber = 14;
        const expectedAnswerIndex = (roomNumber * (round + 1)) % totalWords;
        const expectedAnswer = words[expectedAnswerIndex];
        expect(decode(generateEncodedAnswer({ roomNumber, round, words }))).toBe(expectedAnswer);
      }
    );

    it.each([
      ['odd', -1, 1],
      ['even', 1, 2]
    ])(
      `if the roomNumber is greater than or equal MAX_ROUND_PER_ROOM squared and the round is %s,
      then the answer index should use
      FLOOR(roomNumber * (MAX_ROUND_PER_ROOM + %i * round) / MAX_ROUND_PER_ROOM) % words.length`,
      (...args) => {
        const [, roundFactor, round] = args;
        const roomNumber = 69;
        const expectedAnswerIndex =
          Math.floor((roomNumber * (maxRoundPerRoom + roundFactor * round)) / maxRoundPerRoom) %
          totalWords;

        const expectedAnswer = words[expectedAnswerIndex];

        expect(decode(generateEncodedAnswer({ roomNumber, round, words }))).toBe(expectedAnswer);
      }
    );
  });

  describe('Test getGameResult function', () => {
    it('exact guess', () => {
      const actual = getGameResult('abcde', 'abcde');
      const expected: GuessItem[] = [
        { char: 'a', status: 'exact' },
        { char: 'b', status: 'exact' },
        { char: 'c', status: 'exact' },
        { char: 'd', status: 'exact' },
        { char: 'e', status: 'exact' }
      ];

      expect(actual).toStrictEqual(expected);
    });

    it(`guess with 2 same correct letters, in the answer we have the letter only one,
    then the first letter should be "correct" and the other one should be "wrong"`, () => {
      const actual = getGameResult('qwara', 'abcde');
      const expected: GuessItem[] = [
        { char: 'q', status: 'wrong' },
        { char: 'w', status: 'wrong' },
        { char: 'a', status: 'correct' },
        { char: 'r', status: 'wrong' },
        { char: 'a', status: 'wrong' }
      ];

      expect(actual).toStrictEqual(expected);
    });

    it(`two same letters in a guess and the one has exact position in the answer,
    but the letter is only one in the answer,
    then the non-exact one should have "wrong" status`, () => {
      const actual = getGameResult('badai', 'sadur');
      const expected: GuessItem[] = [
        { char: 'b', status: 'wrong' },
        { char: 'a', status: 'exact' },
        { char: 'd', status: 'exact' },
        { char: 'a', status: 'wrong' },
        { char: 'i', status: 'wrong' }
      ];

      expect(actual).toStrictEqual(expected);
    });

    it(`two same letters in a guess and the one has exact position in the answer,
    in the answer we have that 2 letters,
    then the non-exact one should have "correct" status`, () => {
      const actual = getGameResult('badai', 'akbar');
      const expected: GuessItem[] = [
        { char: 'b', status: 'correct' },
        { char: 'a', status: 'correct' },
        { char: 'd', status: 'wrong' },
        { char: 'a', status: 'exact' },
        { char: 'i', status: 'wrong' }
      ];

      expect(actual).toStrictEqual(expected);
    });
  });
});
