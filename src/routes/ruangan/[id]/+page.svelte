<script lang="ts">
  import { createClient, type Client } from '@liveblocks/client';
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import Footer from '$lib/components/Footer.svelte';
  import HowToPlay from '$lib/components/HowToPlay.svelte';
  import Popup from '$lib/components/Popup.svelte';
  import RoomForm from '$lib/components/RoomForm.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import UserNameForm from '$lib/components/UserNameForm.svelte';
  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
  import { MAX_ROUND_PER_ROOM } from '$lib/constants/game';
  import { ONE_MINUTE_IN_SECONDS, ONE_SECOND_IN_MS } from '$lib/constants/time';
  import { userName } from '$lib/stores';
  import { noop } from '$lib/utils/noop';
  import Timer from '$lib/utils/timer';
  import type { PageServerData } from './$types';
  import Game from './Game.svelte';
  import { broadcastJoinRoomEvent } from './lib/liveblocks/broadcast';
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
  let isEditNamePopupOpen = !$userName;
  let isFullCapacity = false;
  let isHelpPopupOpen = false;
  let isReady = false;
  let isUserNameSaved = false;

  let unsubscribeError = noop;

  const LAST_TIME_EDIT_NAME_STORAGE_KEY = 'TGFzdCB0aW1lIGVkaXQgbmFtZQ==';

  const minutesCanEditNameAgain = 3;
  const msCanEditNameAgain = minutesCanEditNameAgain * ONE_MINUTE_IN_SECONDS * ONE_SECOND_IN_MS;

  const editNameTimer = new Timer(() => {
    canEditName = true;
  }, msCanEditNameAgain);

  $: editNameTitle = canEditName ? 'Edit nama kamu' : 'Kamu udah edit nama barusan';
  $: roomID = `katlaisasi-${$page.params.id}`;
  $: if (isUserNameSaved) {
    isEditNamePopupOpen = false;
    canEditName = false;
    if (browser) {
      localStorage.setItem(LAST_TIME_EDIT_NAME_STORAGE_KEY, new Date().toISOString());
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  $: setRoomContext(room);

  function leaveRoom() {
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
  }

  function handleBeforeUnload() {
    leaveRoom();
    unsubscribeError();
    localStorage.removeItem(roomID);
  }

  function handleClickEditButton() {
    isEditNamePopupOpen = true;
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

    unsubscribeError();
    unsubscribeError = room.subscribe('error', (error) => {
      if (error.message.toLowerCase().startsWith('max number of concurrent connections')) {
        isFullCapacity = true;
      }
    });

    if (browser) {
      room.getStorage().then(async ({ root }) => {
        const gameStatus = root.get('gameState').get('status');
        const activeRound = root.get('gameState').get('activeRound');

        if ((gameStatus === 'finished' || activeRound >= MAX_ROUND_PER_ROOM) && !data.isFinished) {
          const url = $page.url;
          url.searchParams.delete('round');
          url.searchParams.set('finished', 'true');
          await goto(url, { replaceState: true });
          await invalidateAll();
        } else if (data.round !== activeRound && gameStatus !== 'finished') {
          const url = $page.url;
          if (activeRound > 0) {
            url.searchParams.set('round', `${activeRound}`);
          } else {
            url.searchParams.delete('round');
          }

          if (data.isFinished) {
            url.searchParams.delete('finished');
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

        const user = room.getSelf();
        broadcastJoinRoomEvent(room, user);
        isReady = true;
      });

      localStorage.setItem(roomID, 'true');
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
  });

  onDestroy(() => {
    leaveRoom();
    unsubscribeError();
    if (browser) {
      localStorage.removeItem(roomID);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  });

  $: if (isFullCapacity) {
    leaveRoom();
  }
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
  {:else if isFullCapacity}
    <section class="full-capacity-section">
      <RoomForm title={`Ruangan ${$page.params.id} sudah penuh`} />
    </section>
  {:else}
    <Spinner label="Sedang memuat" size="100px" />
  {/if}
  <button
    aria-label="Bantuan"
    class="help-button"
    title="Bantuan"
    on:click={() => (isHelpPopupOpen = true)}
  >
    <VisuallyHidden>Bantuan</VisuallyHidden>
    <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32">
      <path
        fill="currentColor"
        d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
      />
    </svg>
  </button>
  <Popup isOpen={isEditNamePopupOpen} on:close={() => (isEditNamePopupOpen = false)}>
    {#if isEditNamePopupOpen}
      <UserNameForm bind:hasBeenSaved={isUserNameSaved} shouldResetStateOnDestroy />
    {/if}
  </Popup>
  <Popup isOpen={isHelpPopupOpen} on:close={() => (isHelpPopupOpen = false)}>
    <div class="how-to-play-container">
      <HowToPlay />
      <hr />
      <Footer isFullWidth />
    </div>
  </Popup>
{/if}

<style>
  .edit-button {
    min-height: unset;
    height: 32px;
    width: 32px;
  }

  .help-button {
    position: fixed;
    top: 8px;
    right: 88px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: unset;
    height: fit-content;
    width: fit-content;
    background-color: transparent;
    color: var(--color-text-body);
    box-shadow: var(--shadow-md);
    border-radius: 50%;
  }

  .how-to-play-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .how-to-play-container > hr {
    margin: 8px 0;
    height: 0px;
    width: 100%;
    border: none;
    border-top: 1px solid var(--color-border);
  }

  .full-capacity-section {
    width: 480px;
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  @media (max-width: 450px) {
    .help-button {
      right: unset;
      left: 8px;
    }

    .full-capacity-section {
      margin-top: 48px;
    }
  }
</style>
