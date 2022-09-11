import type { Cookies } from '@sveltejs/kit';

import { THEME } from '$lib/constants/cookie-keys';
import { cookieMaxAge } from '$lib/constants/time';

export function setTheme(theme: Theme, cookies?: Cookies) {
  if (cookies) {
    cookies.set(THEME, theme, {
      maxAge: cookieMaxAge,
      httpOnly: false
    });
  } else if (typeof document !== 'undefined') {
    document.cookie = `${THEME}=${theme};path=/;max-age=${cookieMaxAge};secure`;
  }
}
