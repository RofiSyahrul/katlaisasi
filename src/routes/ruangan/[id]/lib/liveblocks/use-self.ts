import { onDestroy } from 'svelte';
import { writable, type Writable } from 'svelte/store';

import { broadcastJoinRoomEvent } from './broadcast';
import { getRoomContext } from './context';
import type { CurrentUser } from './types';

export function useSelf(): Writable<CurrentUser> {
  const room = getRoomContext();
  const self = writable<CurrentUser>(room.getSelf());

  const unsubscribeConnection = room.subscribe('connection', () => {
    const user = room.getSelf();
    broadcastJoinRoomEvent(room, user);
    self.set(user);
  });

  const unsubscribeMyPresence = room.subscribe('my-presence', () => {
    const user = room.getSelf();
    broadcastJoinRoomEvent(room, user);
    self.set(user);
  });

  onDestroy(() => {
    unsubscribeConnection();
    unsubscribeMyPresence();
  });

  return self;
}
