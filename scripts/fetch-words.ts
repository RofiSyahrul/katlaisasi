import { writeFile } from 'fs/promises';
import path from 'path';

import fetch from 'node-fetch';

type KBBIResponse = {
  entries: string[];
};

let fetchingCount = 0;
const MAX_FETCHING_COUNT = 10;

async function fetchWords(): Promise<string[]> {
  fetchingCount += 1;
  try {
    const kbbiResponse: KBBIResponse = await fetch('https://kbbi.vercel.app/', {}).then((res) =>
      res.json()
    );

    const words: string[] = [];
    kbbiResponse.entries.forEach((entry) => {
      const [word] = entry.split('/').reverse();
      if (/^[a-z]{5}$/.test(word)) {
        words.push(word);
      }
    });

    words.sort();
    return words;
  } catch (error) {
    if (fetchingCount <= MAX_FETCHING_COUNT) return fetchWords();
    return [];
  }
}

(async () => {
  try {
    const words = await fetchWords();
    const wordsFilePath = path.resolve(__dirname, '../src/lib/constants/words.server.ts');
    await writeFile(wordsFilePath, `export const words = ${JSON.stringify(words)};`, 'utf-8');
    // eslint-disable-next-line no-console
    console.log(`Success saving ${words.length} words from KBBI to ${wordsFilePath}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
})();
