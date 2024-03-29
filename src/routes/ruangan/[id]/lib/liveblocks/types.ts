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

export type GameStatus = 'playing' | 'finished';

export type GameState = {
  activeRound: number;
  activeRow: number;
  roundStatus: RoundStatus;
  status: GameStatus;
};

export type GameStateLiveObject = LiveObject<GameState>;

export type UserState = Presence & {
  guesses: GuessItem[][];
  score: number;
};

export type UserStateLiveObject = LiveObject<UserState>;

export type UserStateLiveMap = LiveMap<string, UserStateLiveObject>;

export type LeaderboardItem = Pick<UserState, 'score' | 'userName'> & {
  id: string;
};

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

type LeaveRoomEvent = {
  type: 'LEAVE_ROOM';
  user: {
    id: string;
    name: string;
  };
};

type JoinRoomEvent = {
  type: 'JOIN_ROOM';
  userName: string;
};

export type RoomEvent = LeaveRoomEvent | JoinRoomEvent;

export type RoomType = Room<Presence, RoomStorage, UserMeta, RoomEvent>;
