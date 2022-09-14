<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import { fade } from 'svelte/transition';

  import { browser } from '$app/environment';
  import { TOTAL_GUESS_ROW } from '$lib/constants/game';
  import { userName } from '$lib/stores';
  import type { GuessItem } from '$lib/types/game';
  import { getRoom } from '../room-context';
  import Card from './Card.svelte';
  import Keyboard, { type KeyboardGameEvent } from './Keyboard.svelte';
  import { sortUsers } from './utils';

  const room = getRoom();

  export let isUserNameUpdated = false;

  let cardListNode: HTMLDivElement;
  let currentRow = 0;
  let currentUser = room.getSelf();
  let guessesByCurrentUser: GuessItem[][] = [];
  let others = room.getOthers().toArray();

  $: if (isUserNameUpdated) {
    room.updatePresence({ userName: $userName });
    isUserNameUpdated = false;
  }

  const unsubscribeOthers = room.subscribe('others', (otherUsers) => {
    others = otherUsers.toArray();
  });

  const unsubscribeConnection = room.subscribe('connection', () => {
    currentUser = room.getSelf();
  });

  const unsubscribeMyPresence = room.subscribe('my-presence', (presence) => {
    if (currentUser) {
      currentUser = {
        ...currentUser,
        presence
      };
    }
  });

  $: users = sortUsers(currentUser ? [...others, currentUser] : [...others]);
  $: isAdmin = users.length > 0 && users[0].id === currentUser?.id;

  function handleChangeGuess(e: CustomEvent<KeyboardGameEvent['change-guess']>) {
    const { guess } = e.detail;
    guessesByCurrentUser[currentRow] = guess.split('').map<GuessItem>((char) => ({
      char,
      status: 'guessing'
    }));
  }

  function handleGetGuessResponse(e: CustomEvent<KeyboardGameEvent['get-guess-response']>) {
    const { guessResult } = e.detail;
    guessesByCurrentUser[currentRow] = guessResult;
    currentRow += 1;
    const isVictory = guessResult.every((guess) => guess.status === 'exact');
    if (isVictory) {
      room.updatePresence({ gameStatus: 'victory' });
    } else if (currentRow > TOTAL_GUESS_ROW) {
      room.updatePresence({ gameStatus: 'defeat' });
    }
  }

  onMount(async () => {
    if (browser && cardListNode) {
      await tick();
      const currentUserCard = cardListNode.getElementsByClassName('card_current-user')[0];
      if (currentUserCard) {
        cardListNode.scrollTo({ behavior: 'smooth', top: currentUserCard.clientTop });
      }
    }
  });

  onDestroy(() => {
    unsubscribeOthers();
    unsubscribeConnection();
    unsubscribeMyPresence();
  });
</script>

<div bind:this={cardListNode} class="card-list">
  {#each users as { id, presence }, index (id)}
    {@const isCurrentUser = id === currentUser?.id}
    <Card
      on:editUserName
      guesses={isCurrentUser ? guessesByCurrentUser : []}
      isAdmin={index === 0}
      {isCurrentUser}
      isCurrentUserPlaying={currentUser?.presence?.gameStatus === 'playing'}
      userName={presence?.userName ?? ''}
    />
  {/each}
</div>

<Keyboard
  on:change-guess={handleChangeGuess}
  on:get-guess-response={handleGetGuessResponse}
  isVictory={currentUser?.presence?.gameStatus === 'victory'}
/>

{#if isAdmin}
  <button in:fade={{ delay: 1000 }}>Ulangi adu mekanik</button>
{/if}

<style>
  .card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    align-items: center;
    gap: 12px;
    width: 100%;
    height: max(calc(100% - 250px), 250px);
    padding: 4px;
    overflow: auto;
  }

  button {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    min-height: fit-content;
    box-shadow: var(--shadow-md);
  }
</style>
