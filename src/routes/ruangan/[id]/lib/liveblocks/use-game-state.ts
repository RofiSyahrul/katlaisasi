import { onDestroy } from 'svelte';
import { writable, type Writable } from 'svelte/store';

import { noop } from '$lib/utils/noop';
import { getRoomContext } from './context';
import type { GameStateLiveObject } from './types';
import { useStorage } from './use-storage';

export function useGameState(): Writable<GameStateLiveObject> {
  const room = getRoomContext();
  const storage = useStorage();
  const gameState = writable<GameStateLiveObject>();
  let unsubscribe = noop;

  const unsubscribeStorage = storage.subscribe((root) => {
    if (!root) return;
    gameState.set(root.get('gameState'));
    unsubscribe();
    unsubscribe = room.subscribe(root.get('gameState'), (newGameState) => {
      gameState.set(newGameState);
    });
  });

  onDestroy(() => {
    unsubscribe();
    unsubscribeStorage();
  });

  return gameState;
}
