import type { LiveMap, Room } from '@liveblocks/client';
import { getContext, setContext } from 'svelte';

export type Presence = {
  userName: string;
};

export type GuessStatus = 'guess' | 'wrong' | 'correct' | 'exact';

type Guess = {
  char: string;
  status: GuessStatus;
};

type RoomStorage = {
  guesses: LiveMap<string, Guess[][]>;
};

export type UserMeta = {
  id: string;
  info: {
    name: string;
  };
};

type RoomEventGetGuessResult = {
  result: Guess[];
  type: 'GET_GUEST_RESULT';
};

type RoomEvent = RoomEventGetGuessResult;

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
