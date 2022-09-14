import type { LiveMap, Room } from '@liveblocks/client';
import { getContext, setContext } from 'svelte';

import type { GuessItem } from '$lib/types/game';

export type GameStatus = 'playing' | 'defeat' | 'victory';

export type Presence = {
  gameStatus: GameStatus;
  userName: string;
};

export type SubmitGuessSuccessResponse = {
  guessResult: GuessItem[];
};

export type SubmitGuessInvalidResponse = {
  message: string;
};

export type RoomStorage = {
  activeRound: number;
  guesses: LiveMap<string, GuessItem[][]>;
};

export type UserMeta = {
  id: string;
  info: {
    name: string;
  };
};

type RoomEventGetGuessResult = {
  result: GuessItem[];
  type: 'GET_GUEST_RESULT';
  userID: string;
};

export type RoomEvent = RoomEventGetGuessResult;

export type RoomType = Room<Presence, RoomStorage, UserMeta, RoomEvent>;

export type RoomContext = {
  getRoom: () => RoomType;
};

const roomContextKey = Symbol('room-context');

export function setRoomContext(room: RoomType) {
  setContext<RoomContext>(roomContextKey, {
    getRoom: () => room
  });
}

export function getRoom(): RoomType {
  const { getRoom } = getContext<RoomContext>(roomContextKey);
  return getRoom();
}
