import { authorize } from '@liveblocks/node';

import { LIVEBLOCKS_SECRET_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

type LoginRequest = {
  room: string;
};

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!LIVEBLOCKS_SECRET_KEY) {
    return new Response('LIVEBLOCKS_SECRET_KEY is not available', { status: 403 });
  }

  try {
    const { room }: LoginRequest = await request.json();
    if (!room) {
      return new Response('room is not available', { status: 400 });
    }

    const response = await authorize({
      room,
      secret: LIVEBLOCKS_SECRET_KEY,
      userId: locals.userid,
      userInfo: {
        name: locals.userName
      }
    });

    return new Response(response.body, { status: response.status });
  } catch (error) {
    return new Response((error as Error)?.message || 'Internal Server Error', { status: 500 });
  }
};
