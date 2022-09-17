import { writeFile } from 'fs/promises';
import path from 'path';

import { encode } from '../src/lib/utils/codec.server';

function generateValidRoomIDs() {
  const validRoomIDs: string[] = [];

  for (const stringifiedNumber in [...Array.from({ length: 100_000 })]) {
    const originalRoomID = stringifiedNumber.padStart(5, '0');
    const encoded = encode(originalRoomID);
    if (!/\W/.test(encoded)) {
      validRoomIDs.push(encoded);
    }
  }

  return validRoomIDs;
}

(async () => {
  try {
    const validRoomIDs = generateValidRoomIDs();
    const roomIDsFilePath = path.resolve(__dirname, '../src/lib/constants/room-ids.server.ts');
    await writeFile(
      roomIDsFilePath,
      `export const validRoomIDs = ${JSON.stringify(validRoomIDs)};`,
      'utf-8'
    );
    // eslint-disable-next-line no-console
    console.log(
      `Success generating ${validRoomIDs.length} room IDs. It has been saved at ${roomIDsFilePath}`
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
})();
