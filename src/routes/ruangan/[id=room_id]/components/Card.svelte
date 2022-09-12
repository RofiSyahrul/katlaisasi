<script lang="ts" context="module">
  export type CardEvent = {
    editUserName: undefined;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
  import type { Guess } from '../room-context';

  export let guesses: Guess[][] = [];
  export let isAdmin: boolean;
  export let isCurrentUser: boolean;
  export let userName: string;

  const dispatch = createEventDispatcher<CardEvent>();

  const guessesPlaceholder = Array.from<unknown, string[]>({ length: 6 }, () => [
    '',
    '',
    '',
    '',
    ''
  ]);
</script>

<div class="card">
  <div class="card__title">
    <h3>
      {userName || 'Unknown'}
      {#if isCurrentUser}
        <em>(Kamu)</em>
      {/if}
    </h3>
    <div class="card__title__right">
      {#if isAdmin}
        <div title="Admin">
          <svg
            aria-label="Admin"
            fill="currentColor"
            focusable="false"
            height="32"
            viewBox="0 0 24 24"
            width="32"
          >
            <path
              d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
            />
          </svg>
        </div>
      {/if}
      {#if isCurrentUser}
        <button
          aria-label="Edit nama kamu"
          title="Edit nama kamu"
          on:click={() => dispatch('editUserName')}
        >
          <VisuallyHidden>Edit nama kamu</VisuallyHidden>
          <svg aria-label="Edit" fill="currentColor" focusable="false" viewBox="0 0 24 24">
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            />
          </svg>
        </button>
      {/if}
    </div>
  </div>
  <div class="card__guess-board">
    {#each guessesPlaceholder as guessChars, guessIndex (`guess-${guessIndex}`)}
      <div class="card__guess-row">
        {#each guessChars as defaultChar, charIndex}
          {@const guess = guesses[guessIndex]?.[charIndex]}
          {@const char = guess?.char ?? defaultChar}
          {@const status = guess && char ? guess.status : 'empty'}
          <div class={`card__guess-tile card__guess-tile_${status}`}>
            {char}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .card {
    width: 100%;
    background-color: var(--color-bg-body);
    border-radius: 8px;
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-md);
  }

  .card__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    width: 100%;
    height: 48px;
    padding: 4px;
    border-bottom: 1px solid var(--color-border);
  }

  .card__title h3 {
    margin: 0;
  }

  .card__title__right {
    display: flex;
    gap: 4px;
  }

  .card__title__right button {
    min-height: unset;
    height: 32px;
    width: 32px;
  }

  .card__guess-board {
    display: grid;
    grid-template-rows: repeat(6, 1.5fr);
    gap: 6px;
    width: 100%;
    padding: 4px;
  }

  .card__guess-row {
    display: grid;
    grid-template-columns: repeat(5, 1.5fr);
    gap: 6px;
    width: 100%;
  }

  .card__guess-tile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    line-height: 1rem;
    font-weight: bold;
    font-family: var(--font-family);
    vertical-align: middle;
    text-transform: uppercase;
    border-radius: 4px;
    color: var(--color-text-body);
  }

  .card__guess-tile::before {
    content: '';
    display: inline-block;
    padding-bottom: 100%;
  }

  .card__guess-tile_empty {
    background-color: var(--color-bg-tile-empty);
    border: 1px solid var(--color-border);
  }

  .card__guess-tile_guessing {
    background-color: var(--color-bg-tile-guessing);
  }

  .card__guess-tile_wrong {
    background-color: var(--color-bg-tile-wrong);
  }

  .card__guess-tile_correct {
    background-color: var(--color-bg-tile-correct);
  }

  .card__guess-tile_exact {
    background-color: var(--color-bg-tile-exact);
  }
</style>
