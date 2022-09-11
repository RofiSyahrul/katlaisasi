import type { Cookies } from '@sveltejs/kit';

import { cookieMaxAge } from '$lib/constants/time';

export function setTheme(theme: Theme, cookies?: Cookies) {
  const cookieName = 'theme';

  if (cookies) {
    cookies.set(cookieName, theme, {
      maxAge: cookieMaxAge,
      httpOnly: false
    });
  } else if (typeof document !== 'undefined') {
    document.cookie = `${cookieName}=${theme};path=/;max-age=${cookieMaxAge};secure`;
  }
}
