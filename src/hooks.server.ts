import { readFile } from 'fs/promises';
import path from 'path';

import type { Handle } from '@sveltejs/kit';

import { USER_ID, USER_NAME } from '$lib/constants/cookie-keys';
import { cookieMaxAge } from '$lib/constants/time';

export const handle: Handle = async ({ event, resolve }) => {
  let userid = event.cookies.get(USER_ID);
  const userName = event.cookies.get(USER_NAME) ?? '';

  if (!userid) {
    // if this is the first time the user has visited this app,
    // set a cookie so that we recognise them when they return
    userid = crypto.randomUUID();
    event.cookies.set(USER_ID, userid, { maxAge: cookieMaxAge, path: '/' });
  }

  event.locals.userid = userid;
  event.locals.userName = userName;

  const wordsFilePath = path.resolve(process.cwd(), './data/words.csv');
  event.locals.words = await readFile(wordsFilePath, { encoding: 'utf-8' }).then((res) =>
    res.split(',')
  );

  return resolve(event);
};
