<script lang="ts">
  import { createClient, type Client, LiveMap } from '@liveblocks/client';
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import Popup from '$lib/components/Popup.svelte';
  import UserNameForm from '$lib/components/UserNameForm.svelte';
  import { userName } from '$lib/stores';
  import type { PageServerData } from './$types';
  import Game from './components/Game.svelte';
  import {
    setRoomContext,
    type Presence,
    type RoomEvent,
    type RoomStorage,
    type RoomType,
    type UserMeta
  } from './room-context';

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
      initialPresence: { gameStatus: 'playing', userName: $userName },
      initialStorage: { activeRound: 0, guesses: new LiveMap() }
    });

    if (browser) {
      room.getStorage().then(({ root }) => {
        const activeRound = root.get('activeRound');
        if (data.round !== activeRound) {
          window.location.search = activeRound > 0 ? `?round=${activeRound}` : '';
          return;
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
  {#if room && isReady}
    <Game isUserNameUpdated={isUserNameSaved} on:editUserName={() => (isPopupOpen = true)} />
  {:else}
    <p>Loading...</p>
  {/if}
  <Popup isOpen={isPopupOpen} on:close={() => (isPopupOpen = false)}>
    {#if isPopupOpen}
      <UserNameForm bind:hasBeenSaved={isUserNameSaved} shouldResetStateOnDestroy />
    {/if}
  </Popup>
{/if}
