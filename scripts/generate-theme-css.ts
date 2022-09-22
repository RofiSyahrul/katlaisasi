/**
 * This script generates the theme CSS from src/lib/theme/styles.ts.
 * The generated CSS can improve developer experience on using CSS
 * variables from theme
 */

import { writeFile } from 'fs/promises';
import path from 'path';

import { darkStyles, lightStyles, systemStyles } from '../src/lib/theme/styles';

(async () => {
  const cssFilePath = path.resolve(__dirname, '../src/lib/theme/styles.css');
  const css = `${darkStyles}

${lightStyles}

${systemStyles}
`;

  try {
    await writeFile(cssFilePath, css, { encoding: 'utf-8' });
    console.log('Success generate theme CSS to ', cssFilePath);
  } catch (error) {
    console.error('Failed to generate theme CSS. Error: ', error);
    process.exit(1);
  }
})();
