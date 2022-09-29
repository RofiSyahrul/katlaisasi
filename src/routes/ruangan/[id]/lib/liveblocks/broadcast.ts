import type { CurrentUser, Presence, RoomType } from './types';

let isJoinRoomEventBroadcasted = false;

export function broadcastJoinRoomEvent(room: RoomType, userOrPresence: CurrentUser | Presence) {
  if (isJoinRoomEventBroadcasted) return;

  let userName = '';
  if (userOrPresence) {
    if ('info' in userOrPresence) {
      userName = userOrPresence.presence?.userName || userOrPresence.info.name;
    } else if ('userName' in userOrPresence) {
      userName = userOrPresence.userName;
    }
  }

  if (userName) {
    room.broadcastEvent({
      type: 'JOIN_ROOM',
      userName
    });
    isJoinRoomEventBroadcasted = true;
  }
}
