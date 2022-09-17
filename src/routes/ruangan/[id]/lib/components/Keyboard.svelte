<script context="module" lang="ts">
  const firstRowLetters = 'qwertyuiop'.split('');
  const secondRowLetters = 'asdfghjkl'.split('');
  const thirdRowLetters = 'zxcvbnm'.split('');

  export type KeyboardGameEvent = {
    'change-guess': {
      guess: string;
    };
    'get-guess-response': {
      guessResult: GuessItem[];
    };
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { applyAction, enhance, type SubmitFunction } from '$app/forms';
  import { page } from '$app/stores';
  import { REQUIRED_GUESS_LENGTH } from '$lib/constants/game';
  import type { GuessItem } from '$lib/types/game';
  import type { SubmitGuessInvalidResponse, SubmitGuessSuccessResponse } from '../../types';

  export let isRoundFinished: boolean;
  export let isSubmitted: boolean;
  export let isVictory: boolean;

  export let wrongLetters: string[];
  export let correctLetters: string[];
  export let exactLetters: string[];

  let guess = '';
  let isSubmitting = false;

  $: disabledKeyboard = isSubmitted || isSubmitting;

  const dispatch = createEventDispatcher<KeyboardGameEvent>();

  function handleTileClick(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    if (guess.length < REQUIRED_GUESS_LENGTH && !isVictory) {
      const letter = e.currentTarget.innerText;
      guess += letter;
      dispatch('change-guess', { guess });
    }
  }

  function handleBackspaceClick() {
    if (guess.length > 0) {
      guess = guess.substring(0, guess.length - 1);
      dispatch('change-guess', { guess });
    }
  }

  const submitFn: SubmitFunction<SubmitGuessSuccessResponse, SubmitGuessInvalidResponse> = () => {
    isSubmitting = true;
    return async ({ result }) => {
      if (result.type === 'success') {
        const guessResult = result.data?.guessResult || [];
        if (guessResult.length === REQUIRED_GUESS_LENGTH) {
          dispatch('get-guess-response', { guessResult });
          guess = '';
        }
        isSubmitting = false;
      } else if (result.type === 'invalid') {
        isSubmitting = false;
      } else {
        await applyAction(result);
      }
    };
  };

  $: isDisabledActionButton = isVictory || disabledKeyboard || isRoundFinished;

  $: getTileStatus = (letter: string): string => {
    if (exactLetters.includes(letter)) return 'exact';
    if (correctLetters.includes(letter)) return 'correct';
    if (wrongLetters.includes(letter)) return 'wrong';
    return 'default';
  };
</script>

<form
  action={`/ruangan/${$page.params.id}?/submit&${$page.url.searchParams.toString()}`}
  class="keyboard"
  method="post"
  use:enhance={submitFn}
>
  <div class="keyboard__row">
    {#each firstRowLetters as letter (letter)}
      <button
        class={`keyboard__tile keyboard__tile_${getTileStatus(letter)}`}
        disabled={disabledKeyboard}
        type="button"
        on:click={handleTileClick}
      >
        {letter}
      </button>
    {/each}
  </div>

  <div class="keyboard__row">
    <div class="keyboard__tile keyboard__tile_empty" />
    {#each secondRowLetters as letter (letter)}
      <button
        class={`keyboard__tile keyboard__tile_${getTileStatus(letter)}`}
        disabled={disabledKeyboard}
        type="button"
        on:click={handleTileClick}
      >
        {letter}
      </button>
    {/each}
    <div class="keyboard__tile keyboard__tile_empty" />
  </div>

  <div class="keyboard__row">
    <button
      class="keyboard__tile keyboard__tile_default
        keyboard__tile_small"
      disabled={guess.length < REQUIRED_GUESS_LENGTH || isDisabledActionButton}
      style:width="150%"
    >
      Enter
    </button>
    {#each thirdRowLetters as letter (letter)}
      <button
        class={`keyboard__tile keyboard__tile_${getTileStatus(letter)}`}
        disabled={disabledKeyboard}
        type="button"
        on:click={handleTileClick}
      >
        {letter}
      </button>
    {/each}
    <button
      class="keyboard__tile keyboard__tile_default"
      disabled={guess.length === 0 || isDisabledActionButton}
      style:width="150%"
      type="button"
      on:click={handleBackspaceClick}
    >
      ⌫
    </button>
  </div>

  <input name="guess" type="hidden" bind:value={guess} />
</form>

<style>
  .keyboard {
    position: absolute;
    bottom: 56px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 430px;
    max-width: 100%;
    margin: 0 auto;
  }

  .keyboard__row {
    display: flex;
    width: 100%;
    height: 50px;
  }

  .keyboard__tile {
    width: 100%;
    min-height: unset;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 2px;
    padding: unset;
    font-size: 1.8rem;
    line-height: 1.8rem;
    font-weight: bold;
    font-family: var(--font-family);
    color: var(--color-neutral-bright);
    vertical-align: middle;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.6s;
  }

  .keyboard__tile:disabled {
    cursor: not-allowed;
  }

  .keyboard__tile::before {
    content: '';
    display: inline-block;
    padding-bottom: 100%;
  }

  .keyboard__tile_empty {
    width: 50%;
    pointer-events: none;
  }

  .keyboard__tile_default {
    background-color: var(--color-bg-tile-guessing);
  }

  .keyboard__tile_correct {
    background-color: var(--color-bg-tile-correct);
  }

  .keyboard__tile_exact {
    background-color: var(--color-bg-tile-exact);
  }

  .keyboard__tile_wrong {
    background-color: var(--color-bg-tile-wrong);
  }

  .keyboard__tile_small {
    font-size: 0.8rem;
    line-height: 0.8rem;
  }
</style>
