<script lang="ts">
  import { createClient, type Client, LiveMap } from '@liveblocks/client';
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { userName } from '$lib/stores';
  import BoxList from './components/BoxList.svelte';
  import { setRoomContext, type RoomType } from './room-context';

  let client: Client;
  let room: RoomType;
  let isAlreadyOpenedInOtherTab = false;

  $: roomID = `katlaisasi-${$page.params.id}`;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  $: setRoomContext(room);

  $: if (room) {
    room.updatePresence({ userName: $userName });
  }

  function handleBeforeUnload() {
    localStorage.removeItem(roomID);
  }

  onMount(() => {
    if (browser && localStorage.getItem(roomID)) {
      isAlreadyOpenedInOtherTab = true;
      return;
    }

    client = createClient({
      authEndpoint: '/ruangan/masuk'
    });

    room = client.enter(roomID, {
      initialPresence: { userName: $userName },
      initialStorage: { guesses: new LiveMap() }
    });

    if (browser) {
      localStorage.setItem(roomID, 'true');
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
  });

  onDestroy(() => {
    if (client && room) {
      client.leave(roomID);
    }

    if (browser) {
      localStorage.removeItem(roomID);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  });
</script>

{#if isAlreadyOpenedInOtherTab}
  <p>Ruangan {$page.params.id} sudah dibuka di tab lain</p>
{/if}

{#if room}
  <BoxList />
{/if}
