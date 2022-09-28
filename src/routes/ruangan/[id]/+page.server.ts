import { error, invalid } from '@sveltejs/kit';

import { ANSWER_COOKIE_KEY } from '$env/static/private';
import { MAX_ROUND_PER_ROOM } from '$lib/constants/game';
import { decode, encode } from '$lib/utils/codec.server';
import { generateEncodedAnswer, getGameResult } from '$lib/utils/game.server';
import { getRoom } from '$lib/utils/supabase.server';
import type { Actions, PageServerLoad } from './$types';
import type {
  DefineAnswerSuccessResponse,
  SubmitGuessInvalidResponse,
  SubmitGuessSuccessResponse
} from './types';

function getRound(url: URL) {
  const round = Number(url.searchParams.get('round'));
  if (Number.isNaN(round) || round < 0) return 0;
  return parseInt(`${round}`);
}

function getKey(roomID: string, round: number) {
  return encode(`${roomID}::${ANSWER_COOKIE_KEY};;${round}`);
}

const cachedAnswerMap = new Map<string, string>();
const cachedDefinitionsMap = new Map<string, string[]>();

export const load: PageServerLoad = async ({ cookies, locals, params, url }) => {
  const notFoundMessage = 'Ruangan tidak ditemukan. Yo ndak tau kok tanya saya 🤷🏽';

  const roomID = decode(params.id);
  if (!/\d{5}/.test(roomID)) {
    throw error(404, notFoundMessage);
  }

  const room = await getRoom(params.id);
  if (!room) {
    throw error(404, notFoundMessage);
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

  return {
    hostID: room.creator_id,
    round,
    seo: { shouldBlockSearchIndex: true, title: 'Adu Mekanik Katla' }
  };
};

export const actions: Actions = {
  'define-answer': async ({ cookies, params, url }) => {
    const round = getRound(url);
    const encodedAnswer = cookies.get(getKey(params.id, round));
    if (!encodedAnswer) {
      return invalid(400);
    }

    const answer = decode(encodedAnswer);
    const response: DefineAnswerSuccessResponse = {
      answer,
      definitions: []
    };

    const definitionsFromCache = cachedDefinitionsMap.get(answer);
    if (definitionsFromCache) {
      response.definitions = definitionsFromCache;
      return response;
    }

    try {
      const data: Array<{ makna?: Array<{ definisi: string }> }> = await fetch(
        `https://cdn.statically.io/gh/pveyes/makna/main/data/${answer}.json`
      ).then((res) => res.json());

      if (!Array.isArray(data)) return response;

      for (const item of data) {
        for (const { definisi } of item.makna ?? []) {
          if (definisi) response.definitions.push(definisi);
        }
      }

      cachedDefinitionsMap.set(answer, response.definitions);
      return response;
    } catch (error) {
      console.error(`Failed to fetch definitions of "${answer}" from makna. Error: ${error}`);
      return response;
    }
  },
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
