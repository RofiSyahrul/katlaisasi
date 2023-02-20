<script lang="ts">
  import Tile from '$lib/components/Tile.svelte';
  import { TOTAL_GUESS_ROW } from '$lib/constants/game';
  import type { GuessItem } from '$lib/types/game';

  export let guesses: GuessItem[][] = [];
  export let isCurrentUser: boolean;
  export let isCurrentUserPlaying: boolean;
  export let isHost: boolean;
  export let isVictory: boolean;
  export let score: number;
  export let submittedRow: number;
  export let userName: string;

  const guessesPlaceholder = Array.from<unknown, string[]>({ length: TOTAL_GUESS_ROW }, () => [
    '',
    '',
    '',
    '',
    ''
  ]);
</script>

<div class="card" class:card_current-user={isCurrentUser}>
  <div class="card__header">
    <div class="card__header__left">
      <h4 class="card__header__title" title={userName}>
        {userName || 'Unknown'}
      </h4>
      {score}
    </div>
    <div class="card__header__right">
      {#if isHost}
        <div title="Host">
          <svg
            aria-label="Host"
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
      <slot name="editButton" />
    </div>
  </div>
  <div class="card__guess-board">
    {#each guessesPlaceholder as guessChars, guessIndex (`guess-${guessIndex}`)}
      <div class="card__guess-row">
        {#each guessChars as defaultChar, charIndex}
          {@const guess = guesses?.[guessIndex]?.[charIndex]}
          {@const char = guess?.char ?? defaultChar}
          {@const shouldShowChar = isCurrentUser || !isCurrentUserPlaying}
          {@const shownChar = shouldShowChar ? char : ''}
          <Tile
            letter={shownChar}
            status={submittedRow === guessIndex && !isVictory
              ? 'submitted'
              : !char
              ? 'empty'
              : guess.status}
          />
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

  .card.card_current-user {
    border-width: 2px;
  }

  .card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    width: 100%;
    height: 56px;
    padding: 4px;
    border-bottom: 1px solid var(--color-border);
  }

  .card__header__left {
    flex: 1;
  }

  .card__header__title {
    margin: 0 0 4px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card__header__right {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .card__guess-board {
    display: grid;
    grid-template-rows: repeat(6, 1.5fr);
    gap: 6px;
    width: 100%;
    padding: 4px;
    user-select: none;
  }

  .card__guess-row {
    display: grid;
    grid-template-columns: repeat(5, 1.5fr);
    gap: 6px;
    width: 100%;
  }
</style>
