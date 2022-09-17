<script lang="ts">
  import { createClient, type Client } from '@liveblocks/client';
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import Popup from '$lib/components/Popup.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import UserNameForm from '$lib/components/UserNameForm.svelte';
  import { userName } from '$lib/stores';
  import type { PageServerData } from './$types';
  import Game from './lib/components/Game.svelte';
  import { setRoomContext } from './lib/liveblocks/context';
  import {
    createInitialPresence,
    initialGameState,
    initialUsersMap
  } from './lib/liveblocks/initials';
  import type {
    Presence,
    RoomEvent,
    RoomStorage,
    RoomType,
    UserMeta
  } from './lib/liveblocks/types';

  export let data: PageServerData;

  let client: Client;
  let room: RoomType;

  let isAlreadyOpenedInOtherTab = false;
  let isPopupOpen = !$userName;
  let isReady = false;
  let isUserNameSaved = false;

  $: roomID = `katlaisasi-${$page.params.id}`;
  $: if (isUserNameSaved) isPopupOpen = false;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  $: setRoomContext(room);

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

    room = client.enter<Presence, RoomStorage, UserMeta, RoomEvent>(roomID, {
      initialPresence: createInitialPresence($userName),
      initialStorage: {
        gameState: initialGameState,
        userStateMap: initialUsersMap
      }
    });

    if (browser) {
      room.getStorage().then(async ({ root }) => {
        const activeRound = root.get('gameState').get('activeRound');
        if (data.round !== activeRound) {
          const url = $page.url;
          if (activeRound > 0) {
            url.searchParams.set('round', `${activeRound}`);
          } else {
            url.searchParams.delete('round');
          }
          await goto(url, { replaceState: true });
          await invalidateAll();
        }
        isReady = true;
      });

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
  <p>
    Ruangan <strong>{$page.params.id}</strong> udah dibuka di tab lain. Tolong buka di 1 tab aja
  </p>
{:else}
  {#if isReady}
    <Game isUserNameUpdated={isUserNameSaved} on:editUserName={() => (isPopupOpen = true)} />
  {:else}
    <Spinner label="Sedang memuat" size="100px" />
  {/if}
  <Popup isOpen={isPopupOpen} on:close={() => (isPopupOpen = false)}>
    {#if isPopupOpen}
      <UserNameForm bind:hasBeenSaved={isUserNameSaved} shouldResetStateOnDestroy />
    {/if}
  </Popup>
{/if}
