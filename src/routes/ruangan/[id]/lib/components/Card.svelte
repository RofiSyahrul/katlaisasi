<script lang="ts">
  import { TOTAL_GUESS_ROW } from '$lib/constants/game';
  import type { GuessItem } from '$lib/types/game';

  export let guesses: GuessItem[][] = [];
  export let isCurrentUser: boolean;
  export let isCurrentUserPlaying: boolean;
  export let isHost: boolean;
  export let isVictory: boolean;
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
    <h4 class="card__header__title" title={userName}>
      {userName || 'Unknown'}
    </h4>
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
          <div
            class={`card__guess-tile card__guess-tile_${
              submittedRow === guessIndex && !isVictory
                ? 'submitted'
                : !char
                ? 'empty'
                : guess.status
            }`}
          >
            {shownChar}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }

  @keyframes flip {
    0% {
      transform: rotateX(0);
    }
    50% {
      transform: rotateX(-90deg);
    }
    100% {
      transform: rotateX(0);
    }
  }

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
    height: 48px;
    padding: 4px;
    border-bottom: 1px solid var(--color-border);
  }

  .card__header__title {
    margin: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card__header__right {
    display: flex;
    gap: 4px;
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

  .card__guess-tile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    line-height: 1rem;
    font-weight: bold;
    font-family: var(--font-family);
    vertical-align: middle;
    text-transform: uppercase;
    border-radius: 4px;
    color: var(--color-neutral-bright);
  }

  .card__guess-tile::before {
    content: '';
    display: inline-block;
    padding-bottom: 100%;
  }

  .card__guess-tile_empty {
    background-color: var(--color-bg-tile-empty);
    border: 1px solid var(--color-border);
    transition: background-color 50ms ease-in-out;
  }

  .card__guess-tile_guessing,
  .card__guess-tile_invalid {
    background-color: var(--color-bg-tile-guessing);
  }

  .card__guess-tile_submitted {
    background-color: var(--color-bg-tile-guessing);
    border: 1px solid var(--color-border);
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

  .card__guess-tile_wrong,
  .card__guess-tile_correct,
  .card__guess-tile_exact {
    transition: background-color 0ms linear 300ms;
    animation: flip 800ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  .card__guess-tile_invalid {
    animation: shake 800ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
</style>
