import type { LiveMap, LiveObject, Others, Room, User } from '@liveblocks/client';

import type { GuessItem } from '$lib/types/game';

export type UserRoundStatus = 'playing' | 'defeat' | 'victory';
export type RowStatus = 'guessing' | 'submitted';

export type Presence = {
  activeRow: number;
  currentRowStatus: RowStatus;
  userName: string;
  userRoundStatus: UserRoundStatus;
};

export type RoundStatus = 'playing' | 'finished' | 'waiting-for-next-round';

export type GameState = {
  activeRound: number;
  activeRow: number;
  roundStatus: RoundStatus;
};

export type GameStateLiveObject = LiveObject<GameState>;

export type UserState = Presence & {
  guesses: GuessItem[][];
};

export type UserStateLiveObject = LiveObject<UserState>;

export type UserStateLiveMap = LiveMap<string, UserStateLiveObject>;

export type RoomStorage = {
  gameState: GameStateLiveObject;
  userStateMap: UserStateLiveMap;
};

export type StorageRoot = LiveObject<RoomStorage>;

export type UserMeta = {
  id: string;
  info: {
    name: string;
  };
};

export type CurrentUser = User<Presence, UserMeta> | null;

export type OtherUsers = Others<Presence, UserMeta>;

export type RoomEvent = {
  type: 'DUMMY_EVENT';
};

export type RoomType = Room<Presence, RoomStorage, UserMeta, RoomEvent>;
