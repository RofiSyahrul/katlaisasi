import { createClient } from '@supabase/supabase-js';

import { SUPABASE_SECRET_KEY, SUPABASE_URL } from '$env/static/private';
import { ONE_DAY_IN_HOURS, ONE_HOUR_IN_SECONDS, ONE_SECOND_IN_MS } from '$lib/constants/time';

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const ROOM_TABLE = 'katlaisasi_room';

interface RoomItem {
  created_at: string;
  creator_id: string;
  guid: string;
  room_id: string;
}

export async function getCreatedRoomsIn7Days(): Promise<string[]> {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * ONE_DAY_IN_HOURS * ONE_HOUR_IN_SECONDS * ONE_SECOND_IN_MS;
  const sevenDaysAgoDate = new Date(sevenDaysAgo).toISOString();

  try {
    const { data, error } = await supabase
      .from<RoomItem>(ROOM_TABLE)
      .select()
      .gte('created_at', sevenDaysAgoDate);

    if (!data?.length || error) {
      if (error) throw error;
      return [];
    }

    return data.map((item) => item.room_id);
  } catch (error) {
    console.warn(`Failed to get created rooms after ${sevenDaysAgoDate}. Error: ${error}`);
    return [];
  }
}

export async function createRoom({
  creator_id,
  room_id
}: Pick<RoomItem, 'creator_id' | 'room_id'>) {
  const { error } = await supabase.from<RoomItem>(ROOM_TABLE).insert({ creator_id, room_id });
  if (error) throw error;
}

export async function getRoom(roomID: string): Promise<RoomItem | null> {
  try {
    const { data, error } = await supabase
      .from<RoomItem>(ROOM_TABLE)
      .select()
      .eq('room_id', roomID);

    if (!data?.length || error) {
      if (error) throw error;
      return null;
    }

    return data[0];
  } catch (error) {
    console.warn(`Failed to get room ${roomID}. Error: ${error}`);
    return null;
  }
}
