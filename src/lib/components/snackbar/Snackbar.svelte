<script lang="ts" context="module">
  export type SnackbarVariant = 'danger' | 'neutral';

  export type SnackbarEvent = {
    destroyed: undefined;
  };
</script>

<script lang="ts">
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  import { notices } from './notices';
  import Notices from './Notices.svelte';

  export let isActive = true;
  export let duration = 3500;
  export let message: string;
  export let variant: SnackbarVariant = 'neutral';

  let element: HTMLDivElement;
  let timer: ReturnType<typeof setTimeout>;

  const dispatch = createEventDispatcher<SnackbarEvent>();
  const transitionY = -200;
  const fadeDuration = 400;

  export function close() {
    isActive = false;
  }

  function remove() {
    clearTimeout(timer);
    isActive = false;
    dispatch('destroyed');
  }

  onMount(async () => {
    await tick();

    if (!notices.component) {
      notices.component = new Notices({
        target: document.body
      });
    }

    notices.component.insert(element);

    timer = setTimeout(() => {
      close();
    }, duration);
  });
</script>

{#if isActive}
  <div
    class={`snackbar snackbar_${variant}`}
    role="alert"
    in:fly={{ y: transitionY }}
    out:fade={{ duration: fadeDuration }}
    on:outroend={remove}
    bind:this={element}
  >
    <div class="snackbar__message">
      {@html message}
    </div>
  </div>
{/if}

<style>
  .snackbar {
    display: inline-flex;
    pointer-events: auto;
    align-self: flex-end;
    align-items: center;
    justify-content: space-around;
    border-radius: 4px;
    margin: 8px 0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    pointer-events: auto;
    min-height: 48px;
  }

  .snackbar_neutral {
    background-color: var(--color-bg-subtle);
  }

  .snackbar_danger {
    background-color: var(--color-danger);
  }

  .snackbar__message {
    margin: 8px 16px;
    color: transparent;
    filter: invert(1) brightness(2.5) grayscale(1) contrast(9);
    background: inherit;
    background-clip: text;
  }
</style>
