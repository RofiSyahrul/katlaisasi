import { LiveMap, LiveObject } from '@liveblocks/client';

import type { GameState, Presence, UserState, UserStateLiveObject } from './types';

export const initialGameState = new LiveObject<GameState>({
  activeRound: 0,
  activeRow: 0,
  roundStatus: 'playing'
});

export const initialUsersMap = new LiveMap<string, UserStateLiveObject>();

export const baseInitialUserState: UserState = {
  activeRow: 0,
  currentRowStatus: 'guessing',
  guesses: [],
  userName: '',
  userRoundStatus: 'playing'
};

export const initialUserState = new LiveObject<UserState>({ ...baseInitialUserState, guesses: [] });

export function createInitialPresence(userName: string): Presence {
  return {
    activeRow: baseInitialUserState.activeRow,
    currentRowStatus: baseInitialUserState.currentRowStatus,
    userName,
    userRoundStatus: baseInitialUserState.userRoundStatus
  };
}
