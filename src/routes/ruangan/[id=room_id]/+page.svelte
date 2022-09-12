<script lang="ts">
  import { createClient, type Client, LiveMap } from '@liveblocks/client';
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import Popup from '$lib/components/Popup.svelte';
  import UserNameForm from '$lib/components/UserNameForm.svelte';
  import { userName } from '$lib/stores';
  import Game from './components/Game.svelte';
  import { setRoomContext, type RoomType } from './room-context';

  let client: Client;
  let room: RoomType;
  let isAlreadyOpenedInOtherTab = false;
  let isPopupOpen = !$userName;
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
  <p>Ruangan {$page.params.id} udah dibuka di tab lain. Tolong buka di 1 tab aja</p>
{/if}

{#if room}
  <Game isUserNameUpdated={isUserNameSaved} on:editUserName={() => (isPopupOpen = true)} />
{/if}

<Popup isOpen={isPopupOpen} on:close={() => (isPopupOpen = false)}>
  {#if isPopupOpen}
    <UserNameForm bind:hasBeenSaved={isUserNameSaved} shouldResetStateOnDestroy />
  {/if}
</Popup>
