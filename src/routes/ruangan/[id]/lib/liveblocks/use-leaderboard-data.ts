import { onDestroy } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';

import { userName } from '$lib/stores';
import type { CurrentUser, LeaderboardItem, OtherUsers, UserStateLiveMap } from './types';

interface UseLeaderboardDataParams {
  othersStore: Writable<OtherUsers>;
  selfStore: Writable<CurrentUser>;
  usersMapStore: Writable<UserStateLiveMap>;
}

export function useLeaderboardData({
  othersStore,
  selfStore,
  usersMapStore
}: UseLeaderboardDataParams) {
  const leaderboardDataStore = writable<LeaderboardItem[]>([]);

  function getUserName(id: string) {
    const self = get(selfStore);
    if (self?.id === id) {
      return self?.presence?.userName || self?.info?.name || get(userName);
    }

    const others = get(othersStore);
    const otherUser = others.find((other) => other.id === id);
    if (!otherUser) return 'Unknown';
    return otherUser.presence?.userName || otherUser.info?.name || 'Unknown';
  }

  const unsubscribeUsersMap = usersMapStore.subscribe((usersMap) => {
    if (!usersMap) return;

    const usersMapImmutable = usersMap.toImmutable();

    let leaderboardData: LeaderboardItem[] = [];
    for (const [id, userState] of usersMapImmutable.entries()) {
      leaderboardData.push({
        id,
        score: userState.score || 0,
        userName: userState.userName || getUserName(id)
      });
    }

    leaderboardData = leaderboardData.sort((a, b) => b.score - a.score);
    leaderboardDataStore.set(leaderboardData);
  });

  onDestroy(() => {
    unsubscribeUsersMap();
  });

  return leaderboardDataStore;
}
