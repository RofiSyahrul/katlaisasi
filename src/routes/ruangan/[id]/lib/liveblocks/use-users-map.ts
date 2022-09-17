import { onDestroy } from 'svelte';
import { writable, type Writable } from 'svelte/store';

import { noop } from '$lib/utils/noop';
import { getRoomContext } from './context';
import type { UserStateLiveMap } from './types';
import { useStorage } from './use-storage';

export function useUsersMap(): Writable<UserStateLiveMap> {
  const room = getRoomContext();
  const storage = useStorage();
  const usersMap = writable<UserStateLiveMap>();
  let unsubscribe = noop;

  const unsubscribeStorage = storage.subscribe((root) => {
    if (!root) return;
    usersMap.set(root.get('userStateMap'));
    unsubscribe();
    unsubscribe = room.subscribe(root.get('userStateMap'), (newUsersMap) => {
      usersMap.set(newUsersMap);
    });
  });

  onDestroy(() => {
    unsubscribe();
    unsubscribeStorage();
  });

  return usersMap;
}
