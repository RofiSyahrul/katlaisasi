import { onDestroy } from 'svelte';
import { writable, type Writable } from 'svelte/store';

import { noop } from '$lib/utils/noop';
import { getRoomContext } from './context';
import { initialUserState } from './initials';
import type { UserStateLiveObject } from './types';
import { useUsersMap } from './use-users-map';

export function useMyState(userID?: string): Writable<UserStateLiveObject> {
  const room = getRoomContext();
  const usersMap = useUsersMap();
  const myState = writable<UserStateLiveObject>();
  let unsubscribe = noop;

  const unsubscribeUsersMap = usersMap.subscribe((usersMapStorage) => {
    if (!userID || !usersMapStorage) return;

    if (!usersMapStorage.get(userID)) {
      usersMapStorage.set(userID, initialUserState);
    }

    myState.set(usersMapStorage.get(userID) as UserStateLiveObject);
    unsubscribe();

    unsubscribe = room.subscribe(
      usersMapStorage.get(userID) as UserStateLiveObject,
      (myLatestState) => {
        myState.set(myLatestState);
      }
    );
  });

  onDestroy(() => {
    unsubscribe();
    unsubscribeUsersMap();
  });

  return myState;
}
