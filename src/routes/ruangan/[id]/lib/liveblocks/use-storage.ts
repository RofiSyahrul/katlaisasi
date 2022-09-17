import { writable, type Writable } from 'svelte/store';

import { getRoomContext } from './context';
import type { StorageRoot } from './types';

export function useStorage(): Writable<StorageRoot> {
  const room = getRoomContext();
  const rootStore = writable<StorageRoot>();

  async function fetchStorage() {
    const { root } = await room.getStorage();
    rootStore.set(root);
  }

  fetchStorage();

  return rootStore;
}
