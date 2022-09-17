import { getContext, setContext } from 'svelte';

import type { RoomType } from './types';

const contextKey = Symbol('room-context');

export function setRoomContext(room: RoomType) {
  setContext<RoomType>(contextKey, room);
}

export function getRoomContext(): RoomType {
  return getContext<RoomType>(contextKey);
}
