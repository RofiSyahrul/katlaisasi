import type { User } from '@liveblocks/client';

import type { Presence, UserMeta } from '../room-context';

export function sortUsers(users: User<Presence, UserMeta>[]) {
  return users.sort((userA, userB) => userA.connectionId - userB.connectionId);
}
