import { invalid, redirect } from '@sveltejs/kit';

import { USER_NAME } from '$lib/constants/cookie-keys';
import { validRoomIDs } from '$lib/constants/room-ids.server';
import { cookieMaxAge } from '$lib/constants/time';
import { createRoom, getCreatedRoomsIn7Days, getRoom } from '$lib/utils/supabase.server';
import type { Actions } from './$types';

export const actions: Actions = {
  'create-room': async ({ locals }) => {
    const existingRoomIDs = await getCreatedRoomsIn7Days();
    const availableRooms = validRoomIDs.filter((roomID) => !existingRoomIDs.includes(roomID));

    const randomIndex = Math.floor(Math.random() * availableRooms.length);
    const roomID = availableRooms[randomIndex];

    try {
      await createRoom({ creator_id: locals.userid, room_id: roomID });
    } catch (err) {
      console.error(`Failed to create room ${roomID} by user ${locals.userid}. Error: ${err}`);
      throw invalid(500, { message: 'Terjadi kesalahan' });
    }

    throw redirect(303, `/ruangan/${roomID}`);
  },
  'join-room': async ({ request }) => {
    const form = await request.formData();
    const roomID = `${form.get('katlaisasi-roomID') ?? ''}`;

    const invalidMessage = `Ruangan ${roomID} tidak ditemukan`;
    if (!validRoomIDs.includes(roomID)) {
      return invalid(404, { message: invalidMessage });
    }

    const room = await getRoom(roomID);
    if (!room) {
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
