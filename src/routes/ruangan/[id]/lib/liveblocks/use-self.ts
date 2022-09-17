import { onDestroy } from 'svelte';
import { writable, type Writable } from 'svelte/store';

import { getRoomContext } from './context';
import type { CurrentUser } from './types';

export function useSelf(): Writable<CurrentUser> {
  const room = getRoomContext();
  const self = writable<CurrentUser>(room.getSelf());

  const unsubscribeConnection = room.subscribe('connection', () => {
    self.set(room.getSelf());
  });

  const unsubscribeMyPresence = room.subscribe('my-presence', () => {
    self.set(room.getSelf());
  });

  onDestroy(() => {
    unsubscribeConnection();
    unsubscribeMyPresence();
  });

  return self;
}
