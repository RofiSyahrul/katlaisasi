import { invalid, redirect } from '@sveltejs/kit';

import { USER_NAME } from '$lib/constants/cookie-keys';
import { validRoomIDs } from '$lib/constants/room-ids.server';
import { cookieMaxAge } from '$lib/constants/time';
import type { Actions } from './$types';

export const actions: Actions = {
  'create-room': async () => {
    const randomIndex = Math.floor(Math.random() * validRoomIDs.length);
    const roomID = validRoomIDs[randomIndex];
    throw redirect(303, `/ruangan/${roomID}`);
  },
  'join-room': async ({ request }) => {
    const form = await request.formData();
    const roomID = `${form.get('katlaisasi-roomID') ?? ''}`;

    const invalidMessage = `Ruangan ${roomID} tidak ditemukan`;
    if (!validRoomIDs.includes(roomID)) {
      return invalid(404, { message: invalidMessage });
    }

    throw redirect(303, `/ruangan/${roomID}`);
  },
  'set-user-name': async ({ cookies, locals, request, url }) => {
    const form = await request.formData();
    const userName = `${form.get('katlaisasi-userName') ?? ''}`;
    locals.userName = userName;
    cookies.set(USER_NAME, userName, {
      maxAge: cookieMaxAge,
      secure: url.hostname !== 'localhost'
    });
  }
};
