import type { Cookies } from '@sveltejs/kit';

import { THEME } from '$lib/constants/cookie-keys';
import { cookieMaxAge } from '$lib/constants/time';

export function setTheme(theme: Theme, cookies?: Cookies, isLocalhost?: boolean) {
  if (cookies) {
    cookies.delete(THEME);
    cookies.set(THEME, theme, {
      httpOnly: false,
      maxAge: cookieMaxAge,
      path: '/',
      secure: !isLocalhost
    });
  } else if (typeof document !== 'undefined') {
    const secure = isLocalhost ? '' : ';secure';
    document.cookie = `${THEME}=;path=/;expires=${new Date(0).toUTCString()}${secure}`;
    document.cookie = `${THEME}=${theme};path=/;max-age=${cookieMaxAge}${secure}`;
  }
}
