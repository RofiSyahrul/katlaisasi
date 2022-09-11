<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { quintOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import { enhance } from '$app/forms';
  import { userName } from '$lib/stores';

  let input: HTMLInputElement;

  export let hasBeenCanceled = false;
  export let hasBeenSaved = false;
  export let shouldResetStateOnDestroy = false;
  export let shouldShowCancelButton = false;

  onMount(() => {
    input.focus();
  });

  onDestroy(() => {
    if (shouldResetStateOnDestroy) {
      hasBeenCanceled = false;
      hasBeenSaved = false;
    }
  });
</script>

<form
  action="/?/set-user-name"
  method="post"
  in:slide={{ easing: quintOut }}
  use:enhance={() => {
    return ({ result }) => {
      hasBeenSaved = result.type === 'success';
    };
  }}
>
  <input
    bind:this={input}
    bind:value={$userName}
    maxlength="20"
    name="katlaisasi-userName"
    type="text"
  />
  <button aria-label="Simpan nama kamu" disabled={!$userName}>Simpan</button>
  {#if shouldShowCancelButton}
    <button
      aria-label="Batalkan"
      style:background-color="var(--color-danger)"
      type="button"
      on:click={() => (hasBeenCanceled = true)}
    >
      Batalkan
    </button>
  {/if}
</form>

<style>
  input {
    height: 40px;
    border-radius: 4px;
    padding: 0 8px;
    outline: none;
    border: 2px solid var(--color-border);
  }

  input:focus,
  input:hover {
    border-color: var(--color-primary);
  }

  @media screen and (max-width: 480px) {
    form {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    input {
      width: 100%;
    }

    button {
      flex: 1;
    }
  }
</style>
