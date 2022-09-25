import equal from 'fast-deep-equal';
import { onDestroy } from 'svelte';
import { writable, type Updater, type Writable } from 'svelte/store';

import { noop } from '$lib/utils/noop';
import { getRoomContext } from './context';
import type { Presence } from './types';

export function useMyPresence(): Writable<Presence> {
  const room = getRoomContext();
  const { set, subscribe } = writable<Presence>(room.getPresence());

  function update(updater: Updater<Presence>) {
    const prevPresence = room.getPresence();
    const newPresence = updater(prevPresence);
    if (!equal(prevPresence, newPresence)) {
      room.updatePresence(newPresence);
      if (!prevPresence.userName && newPresence.userName) {
        room.broadcastEvent({
          type: 'JOIN_ROOM',
          userName: newPresence.userName
        });
      }
    }
  }

  const unsubscribePresence = room.subscribe('my-presence', (newPresence) => {
    set(newPresence);
  });

  onDestroy(unsubscribePresence);

  return {
    set: noop,
    subscribe,
    update
  };
}
