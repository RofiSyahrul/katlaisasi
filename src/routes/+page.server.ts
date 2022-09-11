import { USER_NAME } from '$lib/constants/cookie-keys';
import { cookieMaxAge } from '$lib/constants/time';
import type { Actions } from '.svelte-kit/types/src/routes/$types';

export const actions: Actions = {
  'set-user-name': async ({ cookies, locals, request }) => {
    const form = await request.formData();
    const userName = `${form.get('katlaisasi-userName') ?? ''}`;
    locals.userName = userName;
    cookies.set(USER_NAME, userName, { maxAge: cookieMaxAge });
  }
};
