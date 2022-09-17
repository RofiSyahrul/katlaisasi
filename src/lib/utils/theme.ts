import type { Cookies } from '@sveltejs/kit';

import { THEME } from '$lib/constants/cookie-keys';
import { cookieMaxAge } from '$lib/constants/time';

export function setTheme(theme: Theme, cookies?: Cookies, isLocalhost?: boolean) {
  if (cookies) {
    cookies.set(THEME, theme, {
      httpOnly: false,
      maxAge: cookieMaxAge,
      secure: !isLocalhost
    });
  } else if (typeof document !== 'undefined') {
    document.cookie = `${THEME}=${theme};path=/;max-age=${cookieMaxAge}${
      isLocalhost ? '' : ';secure'
    }`;
  }
}
