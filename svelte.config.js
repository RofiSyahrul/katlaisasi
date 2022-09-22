import adapter from '@sveltejs/adapter-auto';
import autoprefixer from 'autoprefixer';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: {
      plugins: [autoprefixer()]
    }
  }),

  kit: {
    adapter: adapter(),
    serviceWorker: {
      files: (filePath) => !filePath.startsWith('~partytown/debug')
    }
  }
};

export default config;
