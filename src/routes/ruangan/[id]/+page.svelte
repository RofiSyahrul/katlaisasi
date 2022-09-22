<script lang="ts">
  import { createClient, type Client } from '@liveblocks/client';
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import Popup from '$lib/components/Popup.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import UserNameForm from '$lib/components/UserNameForm.svelte';
  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
  import { ONE_MINUTE_IN_SECONDS, ONE_SECOND_IN_MS } from '$lib/constants/time';
  import { userName } from '$lib/stores';
  import Timer from '$lib/utils/timer';
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

  let canEditName = true;
  let isAlreadyOpenedInOtherTab = false;
  let isPopupOpen = !$userName;
  let isReady = false;
  let isUserNameSaved = false;

  const LAST_TIME_EDIT_NAME_STORAGE_KEY = 'TGFzdCB0aW1lIGVkaXQgbmFtZQ==';

  const minutesCanEditNameAgain = 3;
  const msCanEditNameAgain = minutesCanEditNameAgain * ONE_MINUTE_IN_SECONDS * ONE_SECOND_IN_MS;

  const editNameTimer = new Timer(() => {
    canEditName = true;
  }, msCanEditNameAgain);

  $: editNameTitle = canEditName ? 'Edit nama kamu' : 'Kamu udah edit nama barusan';
  $: roomID = `katlaisasi-${$page.params.id}`;
  $: if (isUserNameSaved) {
    isPopupOpen = false;
    canEditName = false;
    if (browser) {
      localStorage.setItem(LAST_TIME_EDIT_NAME_STORAGE_KEY, new Date().toISOString());
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  $: setRoomContext(room);

  function handleBeforeUnload() {
    localStorage.removeItem(roomID);
  }

  function handleClickEditButton() {
    isPopupOpen = true;
    editNameTimer.reset();
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
        const lastTimeEditName = localStorage.getItem(LAST_TIME_EDIT_NAME_STORAGE_KEY);
        if (lastTimeEditName) {
          canEditName = Date.now() > Date.parse(lastTimeEditName) + msCanEditNameAgain;
          if (!canEditName) {
            editNameTimer.init();
          }
        }
        isReady = true;
      });

      localStorage.setItem(roomID, 'true');
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
  });

  onDestroy(() => {
    editNameTimer.destroy();

    if (client && room) {
      const self = room.getSelf();
      room.broadcastEvent({
        type: 'LEAVE_ROOM',
        user: {
          id: self?.id ?? '',
          name: self?.presence?.userName || 'Unknown'
        }
      });
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
    <Game hostID={data.hostID} isUserNameUpdated={isUserNameSaved}>
      <button
        aria-label={editNameTitle}
        class="edit-button"
        disabled={!canEditName}
        title={editNameTitle}
        on:click={handleClickEditButton}
        slot="editButton"
      >
        <VisuallyHidden>Edit nama kamu</VisuallyHidden>
        <svg aria-label="Edit" fill="currentColor" focusable="false" viewBox="0 0 24 24">
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
          />
        </svg>
      </button>
    </Game>
  {:else}
    <Spinner label="Sedang memuat" size="100px" />
  {/if}
  <Popup isOpen={isPopupOpen} on:close={() => (isPopupOpen = false)}>
    {#if isPopupOpen}
      <UserNameForm bind:hasBeenSaved={isUserNameSaved} shouldResetStateOnDestroy />
    {/if}
  </Popup>
{/if}

<style>
  .edit-button {
    min-height: unset;
    height: 32px;
    width: 32px;
  }
</style>
