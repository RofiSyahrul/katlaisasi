<script lang="ts">
  import type { GuessStatus } from '$lib/types/game';

  export let letter: string;
  export let status: GuessStatus | 'submitted' | 'empty' = 'empty';
</script>

<div class={`tile tile_${status}`}>
  {letter}
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

  .tile {
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

  .tile::before {
    content: '';
    display: inline-block;
    padding-bottom: 100%;
  }

  .tile_empty {
    background-color: var(--color-bg-tile-empty);
    border: 1px solid var(--color-border);
    transition: background-color 50ms ease-in-out;
  }

  .tile_guessing,
  .tile_invalid {
    background-color: var(--color-bg-tile-guessing);
  }

  .tile_submitted {
    background-color: var(--color-bg-tile-guessing);
    border: 1px solid var(--color-border);
  }

  .tile_wrong {
    background-color: var(--color-bg-tile-wrong);
  }

  .tile_correct {
    background-color: var(--color-bg-tile-correct);
  }

  .tile_exact {
    background-color: var(--color-bg-tile-exact);
  }

  .tile_wrong,
  .tile_correct,
  .tile_exact {
    transition: background-color 0ms linear 300ms;
    animation: flip 800ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  .tile_invalid {
    animation: shake 800ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
</style>
