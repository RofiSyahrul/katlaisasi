<script lang="ts">
  import { LiveObject } from '@liveblocks/client';
  import type { ActionResult } from '@sveltejs/kit';
  import { slide } from 'svelte/transition';

  import { browser } from '$app/environment';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import Popup from '$lib/components/Popup.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
  import { REQUIRED_GUESS_LENGTH, TOTAL_GUESS_ROW } from '$lib/constants/game';
  import { userName } from '$lib/stores';
  import type { GuessItem } from '$lib/types/game';
  import type { DefineAnswerSuccessResponse } from '../../types';
  import { baseInitialUserState } from '../liveblocks/initials';
  import type { RowStatus, UserRoundStatus } from '../liveblocks/types';
  import { useGameState } from '../liveblocks/use-game-state';
  import { useMyPresence } from '../liveblocks/use-my-presence';
  import { useMyState } from '../liveblocks/use-my-state';
  import { useOthers } from '../liveblocks/use-others';
  import { useSelf } from '../liveblocks/use-self';
  import { useUsersMap } from '../liveblocks/use-users-map';
  import Card from './Card.svelte';
  import Keyboard, { type KeyboardGameEvent } from './Keyboard.svelte';
  import { splitLettersFromGuess } from './utils';

  export let isUserNameUpdated = false;

  const others = useOthers();
  const self = useSelf();
  const presence = useMyPresence();

  const gameState = useGameState();
  const usersMap = useUsersMap();
  const myState = useMyState($self?.id);

  let isInitialLoad = true;
  let answerAndDefinitions: DefineAnswerSuccessResponse | null = null;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  let AnswerDefinitionsComponent: typeof import('./AnswerDefinitions.svelte').default | undefined;
  let isAnswerDefinitionPopupOpen = false;

  let guessesByCurrentUser: GuessItem[][] = [];
  let guessResultCurrentRow: GuessItem[] = [];
  let invalidGuessMessage = '';

  let wrongLetters: string[] = [];
  let correctLetters: string[] = [];
  let exactLetters: string[] = [];

  let newWrongLetters: string[] = [];
  let newCorrectLetters: string[] = [];
  let newExactLetters: string[] = [];

  $: if (isUserNameUpdated) {
    presence.update((prev) => ({ ...prev, userName: $userName }));
    isUserNameUpdated = false;
  }

  $: if (isInitialLoad && $myState) {
    $myState.get('guesses').forEach((guess) => {
      const splitted = splitLettersFromGuess(guess);
      wrongLetters = [...wrongLetters, ...splitted.wrongLetters];
      correctLetters = [...correctLetters, ...splitted.correctLetters];
      exactLetters = [...exactLetters, ...splitted.exactLetters];
    });

    presence.update((prev) => ({
      ...prev,
      activeRow: $myState.get('activeRow'),
      currentRowStatus: $myState.get('currentRowStatus'),
      userRoundStatus: $myState.get('userRoundStatus')
    }));

    isInitialLoad = false;
  }

  $: if ($usersMap && $gameState) {
    let nextActiveRow = 0;
    $usersMap.forEach((userState) => {
      const activeRow = Math.min(userState.get('activeRow'), TOTAL_GUESS_ROW);
      if (activeRow > nextActiveRow) nextActiveRow = activeRow;
    });

    if ($gameState.get('activeRow') < nextActiveRow) {
      $gameState.set('activeRow', nextActiveRow);
    }
  }

  let isHost = false;
  let hostConnectionID = 0;
  $: if ($self) {
    if (!$others) isHost = true;

    const myConnectionID = $self.connectionId;
    let minimumConnectionID = myConnectionID;
    $others.toArray().forEach((other) => {
      if (other.connectionId < minimumConnectionID) minimumConnectionID = other.connectionId;
    });

    isHost = minimumConnectionID === myConnectionID;
    hostConnectionID = minimumConnectionID;
  }

  let isAllUsersSubmittedCurrentRow = false;
  $: if ($presence && $gameState) {
    if ($presence.currentRowStatus !== 'submitted') {
      isAllUsersSubmittedCurrentRow = false;
    } else if ($presence.activeRow < $gameState.get('activeRow') || $others?.count === 0) {
      isAllUsersSubmittedCurrentRow = true;
    } else if ($others) {
      isAllUsersSubmittedCurrentRow = [...$others].every((other) => {
        if (!other.presence) return false;
        return (
          other.presence.currentRowStatus === 'submitted' &&
          (other.presence.activeRow === $gameState.get('activeRow') ||
            other.presence.userRoundStatus !== 'playing')
        );
      });
    }
  }

  $: if (
    $self?.id &&
    isAllUsersSubmittedCurrentRow &&
    guessResultCurrentRow.length === REQUIRED_GUESS_LENGTH
  ) {
    wrongLetters = [...wrongLetters, ...newWrongLetters];
    newWrongLetters = [];

    correctLetters = [...correctLetters, ...newCorrectLetters];
    newCorrectLetters = [];

    exactLetters = [...exactLetters, ...newExactLetters];
    newExactLetters = [];

    let prevActiveRow = 0;
    let nextActiveRow = 0;
    let nextRowStatus: RowStatus = 'submitted';
    let userLatestRoundStatus: UserRoundStatus = 'playing';

    presence.update((prev) => {
      prevActiveRow = prev.activeRow;
      nextActiveRow = prev.activeRow + 1;
      const isVictory = guessResultCurrentRow.every((guess) => guess.status === 'exact');

      if (isVictory) {
        userLatestRoundStatus = 'victory';
      } else if (nextActiveRow > TOTAL_GUESS_ROW) {
        userLatestRoundStatus = 'defeat';
      } else {
        nextRowStatus = 'guessing';
      }

      return {
        ...prev,
        activeRow: nextActiveRow,
        currentRowStatus: nextRowStatus,
        userRoundStatus: userLatestRoundStatus
      };
    });

    const myPrevGuesses = $myState.get('guesses');
    const myNextGuesses = [...myPrevGuesses];
    myNextGuesses[prevActiveRow] = guessResultCurrentRow;
    $usersMap.set(
      $self.id,
      new LiveObject({
        activeRow: nextActiveRow,
        currentRowStatus: nextRowStatus,
        guesses: [...myNextGuesses],
        userRoundStatus: userLatestRoundStatus
      })
    );

    isAllUsersSubmittedCurrentRow = false;
    guessResultCurrentRow = [];
  }

  $: if ($myState) guessesByCurrentUser = $myState.get('guesses');

  let isAllUsersVictory = false;
  $: if ($presence && $gameState) {
    if ($presence.userRoundStatus !== 'victory') {
      isAllUsersVictory = false;
    } else if ($others?.count > 0) {
      isAllUsersVictory = [...$others].every(
        (other) => other.presence?.userRoundStatus === 'victory'
      );
    } else {
      isAllUsersVictory = true;
    }
  }

  $: if (
    $gameState?.get('roundStatus') === 'playing' &&
    (isAllUsersVictory || $gameState?.get('activeRow') >= TOTAL_GUESS_ROW)
  ) {
    $gameState.set('roundStatus', 'finished');
    isAllUsersVictory = false;
  }

  function handleChangeGuess(e: CustomEvent<KeyboardGameEvent['change-guess']>) {
    const { guess } = e.detail;
    invalidGuessMessage = '';
    guessesByCurrentUser[$presence.activeRow] = guess.split('').map<GuessItem>((char) => ({
      char,
      status: 'guessing'
    }));
  }

  function handleGetGuessResponse(e: CustomEvent<KeyboardGameEvent['get-guess-response']>) {
    const { guessResult } = e.detail;
    const splitted = splitLettersFromGuess(guessResult);

    newWrongLetters = splitted.wrongLetters;
    newCorrectLetters = splitted.correctLetters;
    newExactLetters = splitted.exactLetters;
    guessResultCurrentRow = guessResult;
    presence.update((prev) => ({ ...prev, currentRowStatus: 'submitted' }));
  }

  function handleInvalidGuess(e: CustomEvent<KeyboardGameEvent['invalid-guess']>) {
    const { guess, message } = e.detail;
    invalidGuessMessage = message;
    guessesByCurrentUser[$presence.activeRow] = guess.split('').map<GuessItem>((char) => ({
      char,
      status: 'invalid'
    }));
  }

  async function fetchAnswerAndDefinitions() {
    const { pathname, searchParams } = $page.url;
    const resource = `${pathname}?/define-answer&${searchParams.toString()}`;
    const result: ActionResult<DefineAnswerSuccessResponse> = await fetch(resource, {
      body: new FormData(),
      headers: {
        accept: 'application/json'
      },
      method: 'POST'
    }).then((res) => res.json());

    if (result.type !== 'success' || !result.data) return;

    answerAndDefinitions = result.data;
    if (!AnswerDefinitionsComponent) {
      AnswerDefinitionsComponent = (await import('./AnswerDefinitions.svelte')).default;
    }
  }

  $: if (browser && $gameState?.get('roundStatus') === 'finished') {
    fetchAnswerAndDefinitions();
  }

  function handleClickPlayAgain() {
    $gameState.update({ roundStatus: 'waiting-for-next-round' });
  }

  $: isCurrentUserPlaying = $presence.userRoundStatus === 'playing';

  $: isWaitingForNextRound = $gameState?.get('roundStatus') === 'waiting-for-next-round';
  $: if (browser && isWaitingForNextRound) {
    const url = $page.url;
    const nextRound = $gameState.get('activeRound') + 1;
    url.searchParams.set('round', `${nextRound}`);
    goto(url, { replaceState: true })
      .then(invalidateAll)
      .then(() => {
        wrongLetters = [];
        correctLetters = [];
        exactLetters = [];
        answerAndDefinitions = null;

        if (isHost) {
          $usersMap.forEach((userState) => {
            userState.update({ ...baseInitialUserState });
          });

          $gameState.update({
            activeRound: nextRound,
            activeRow: 0,
            roundStatus: 'playing'
          });
        }

        presence.update((prev) => ({
          ...prev,
          activeRow: baseInitialUserState.activeRow,
          currentRowStatus: baseInitialUserState.currentRowStatus,
          userRoundStatus: baseInitialUserState.userRoundStatus
        }));
      });
  }
</script>

<section aria-live="polite" class="round-info">
  {#if isWaitingForNextRound || !$gameState}
    <Spinner label="Menunggu ronde berikutnya" />
  {:else}
    <strong>
      Ronde {$gameState.get('activeRound') + 1}{$gameState.get('roundStatus') === 'finished'
        ? ' Selesai'
        : ''}
    </strong>
    {#if $gameState.get('roundStatus') !== 'finished'}
      <p>Masih adu mekanik</p>
    {:else if isHost}
      <button on:click={handleClickPlayAgain}>Main lagi</button>
    {:else}
      <p>Tunggu host</p>
    {/if}
  {/if}
</section>

<section class="card-list scrollable">
  {#if $self}
    <Card
      on:editUserName
      guesses={guessesByCurrentUser}
      isCurrentUser
      {isCurrentUserPlaying}
      {isHost}
      isVictory={$presence.userRoundStatus === 'victory'}
      submittedRow={$presence.currentRowStatus === 'submitted' ? $presence.activeRow : -1}
      userName={$presence.userName ?? $self.info.name ?? $userName}
    />
  {/if}
  {#if $others && $usersMap}
    {#each [...$others] as { connectionId, id, info, presence } (connectionId)}
      {#if presence}
        <Card
          guesses={$usersMap.get(id)?.get('guesses')}
          isCurrentUser={false}
          {isCurrentUserPlaying}
          isHost={hostConnectionID === connectionId}
          isVictory={presence.userRoundStatus === 'victory'}
          submittedRow={presence.currentRowStatus === 'submitted' ? presence.activeRow : -1}
          userName={presence.userName || info.name}
        />
      {/if}
    {/each}
  {/if}
</section>

{#if invalidGuessMessage}
  <p class="game-description" transition:slide>
    {@html invalidGuessMessage}
  </p>
{:else if answerAndDefinitions}
  <section class="game-description">
    <p>
      Jawaban:
      <strong style:text-transform="uppercase">
        {answerAndDefinitions.answer}
      </strong>
    </p>
    <button
      on:click={() => (isAnswerDefinitionPopupOpen = true)}
      style:background-color="var(--color-secondary)"
    >
      Lihat definisi
    </button>
  </section>
{/if}

<Keyboard
  on:change-guess={handleChangeGuess}
  on:get-guess-response={handleGetGuessResponse}
  on:invalid-guess={handleInvalidGuess}
  isPlaying={$presence.userRoundStatus === 'playing'}
  isSubmitted={$presence.currentRowStatus === 'submitted'}
  {correctLetters}
  {exactLetters}
  {wrongLetters}
/>

<Popup isOpen={isAnswerDefinitionPopupOpen} on:close={() => (isAnswerDefinitionPopupOpen = false)}>
  {#if answerAndDefinitions && AnswerDefinitionsComponent}
    <svelte:component this={AnswerDefinitionsComponent} {...answerAndDefinitions}>
      <a
        slot="kbbi-link"
        let:kbbiURL
        let:kbbiLinkLabel
        aria-label={kbbiLinkLabel}
        href={kbbiURL}
        target="_blank"
        title={kbbiLinkLabel}
      >
        <VisuallyHidden>
          {kbbiLinkLabel}
        </VisuallyHidden>
        <svg
          focusable="false"
          aria-hidden="true"
          fill="currentColor"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
        >
          <path
            d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
          />
        </svg>
      </a>
    </svelte:component>
  {/if}
</Popup>

<style>
  .round-info {
    position: absolute;
    bottom: calc(100% - 8px);
    left: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 48px;
  }

  .round-info * {
    margin: 0;
  }

  .card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    align-items: center;
    gap: 12px;
    width: 100%;
    height: max(calc(100% - 250px), 250px);
    padding: 4px 12px;
    border-radius: 4px;
    border: 1px solid var(--color-border);
  }

  .game-description {
    width: 100%;
    margin: 12px 0 0;
    text-align: center;
  }

  .game-description p {
    margin: 0 0 8px;
  }

  button {
    min-height: unset;
    padding: 4px;
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 450px) {
    .round-info {
      position: static;
    }
  }
</style>