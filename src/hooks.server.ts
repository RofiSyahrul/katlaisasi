import type { Handle } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { USER_ID, USER_NAME } from '$lib/constants/cookie-keys';
import { cookieMaxAge } from '$lib/constants/time';
import { words } from '$lib/constants/words.server';
import { isUserNameValid } from '$lib/utils/user-name';

export const handle: Handle = async ({ event, resolve }) => {
  let userName = event.cookies.get(USER_NAME) ?? '';
  if (userName && !isUserNameValid(userName)) {
    event.cookies.delete(USER_NAME);
    userName = '';
  }

  let userid = event.cookies.get(USER_ID);
  if (!userid) {
    // if this is the first time the user has visited this app,
    // set a cookie so that we recognise them when they return
    userid = crypto.randomUUID();
    event.cookies.set(USER_ID, userid, {
      maxAge: cookieMaxAge,
      path: '/',
      secure: !dev
    });
  }

  event.locals.userid = userid;
  event.locals.userName = userName;
  event.locals.words = words;

  return resolve(event);
};
