import { error, invalid } from '@sveltejs/kit';

import { ANSWER_COOKIE_KEY } from '$env/static/private';
import { MAX_ROUND_PER_ROOM } from '$lib/constants/game';
import { decode, encode } from '$lib/utils/codec.server';
import { generateEncodedAnswer, getGameResult } from '$lib/utils/game.server';
import type { Actions, PageServerLoad } from './$types';
import type { SubmitGuessInvalidResponse, SubmitGuessSuccessResponse } from './types';

function getRound(url: URL) {
  const round = Number(url.searchParams.get('round'));
  if (Number.isNaN(round) || round < 0) return 0;
  return parseInt(`${round}`);
}

function getKey(roomID: string, round: number) {
  return encode(`${roomID}::${ANSWER_COOKIE_KEY};;${round}`);
}

const cachedAnswerMap = new Map<string, string>();

export const load: PageServerLoad = async ({ cookies, locals, params, url }) => {
  const roomID = decode(params.id);

  if (!/\d{5}/.test(roomID)) {
    throw error(404, 'Ruangan tidak ditemukan. Yo ndak tau kok tanya saya 🤷🏽');
  }

  const round = getRound(url);
  if (round >= MAX_ROUND_PER_ROOM) {
    throw error(
      406,
      `Kamu udah main ${MAX_ROUND_PER_ROOM} kali di ruangan ini. Udahan dulu mainnya 🥹`
    );
  }

  const key = getKey(params.id, round);
  let encodedAnswer = cookies.get(key);
  if (!encodedAnswer) {
    encodedAnswer = cachedAnswerMap.get(key);
    if (!encodedAnswer) {
      const roomNumber = Number(roomID);
      encodedAnswer = generateEncodedAnswer({ roomNumber, round, words: locals.words });
      cachedAnswerMap.set(key, encodedAnswer);
    }
    cookies.set(key, encodedAnswer, { secure: url.hostname !== 'localhost' });
  }

  return { round, seo: { shouldBlockSearchIndex: true, title: 'Adu Mekanik Katla' } };
};

export const actions: Actions = {
  submit: async ({ cookies, locals, params, request, url }) => {
    const invalidResponse: SubmitGuessInvalidResponse = { message: '' };

    const form = await request.formData();
    const { words } = locals;
    const guess = form.get('guess')?.toString().toLowerCase() ?? '';

    if (!words.includes(guess)) {
      invalidResponse.message = `<strong>${guess.toUpperCase()}</strong> ga ada di KBBI`;
      return invalid(400, invalidResponse);
    }

    const round = getRound(url);
    const encodedAnswer = cookies.get(getKey(params.id, round));
    if (!encodedAnswer) {
      invalidResponse.message = 'Terjadi kesalahan. Tolong refresh dulu.';
      return invalid(400, invalidResponse);
    }

    const answer = decode(encodedAnswer);
    const successResponse: SubmitGuessSuccessResponse = {
      guessResult: getGameResult(guess, answer)
    };

    return successResponse;
  }
};
