import type { CurrentUser, RoomType } from './types';

let isJoinRoomEventBroadcasted = false;

export function broadcastJoinRoomEvent(room: RoomType, user: CurrentUser) {
  if (isJoinRoomEventBroadcasted) return;

  let userName = '';
  if (user) {
    userName = user.presence?.userName || user.info.name;
  }

  if (userName) {
    room.broadcastEvent({
      type: 'JOIN_ROOM',
      userName
    });
    isJoinRoomEventBroadcasted = true;
  }
}
