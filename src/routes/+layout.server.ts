import { THEME } from '$lib/constants/cookie-keys';
import { DEFAULT_DESC, DEFAULT_IMAGE, DEFAULT_KEYWORD, DEFAULT_TITLE } from '$lib/constants/seo';
import { setTheme } from '$lib/utils/theme';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals, url }) => {
  let initialTheme = cookies.get(THEME) as Theme;

  if (initialTheme !== 'dark' && initialTheme !== 'light') {
    initialTheme = 'system';
    setTheme(initialTheme, cookies, url.hostname === 'localhost');
  }

  return {
    initialTheme,
    seo: {
      description: DEFAULT_DESC,
      image: DEFAULT_IMAGE,
      keyword: DEFAULT_KEYWORD,
      shouldBlockSearchIndex: false,
      title: DEFAULT_TITLE
    },
    userName: locals.userName
  };
};
