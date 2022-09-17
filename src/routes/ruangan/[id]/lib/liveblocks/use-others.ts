import { onDestroy } from 'svelte';
import { writable, type Writable } from 'svelte/store';

import { getRoomContext } from './context';
import type { OtherUsers } from './types';

export function useOthers(): Writable<OtherUsers> {
  const room = getRoomContext();
  const others = writable<OtherUsers>(room.getOthers());

  const unsubscribe = room.subscribe('others', (newOthers) => {
    others.set(newOthers);
  });

  onDestroy(unsubscribe);

  return others;
}
