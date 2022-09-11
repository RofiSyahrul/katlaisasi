import { setTheme } from '$lib/utils/theme';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  let initialTheme = cookies.get('theme') as Theme;

  if (initialTheme !== 'dark' && initialTheme !== 'light') {
    initialTheme = 'system';
    setTheme(initialTheme, cookies);
  }

  return {
    initialTheme
  };
};
