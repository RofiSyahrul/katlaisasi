<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { quintOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import { enhance } from '$app/forms';
  import { userName } from '$lib/stores';

  let input: HTMLInputElement;

  export let hasBeenSaved = false;
  export let shouldResetStateOnDestroy = false;

  onMount(() => {
    input.focus();
  });

  onDestroy(() => {
    if (shouldResetStateOnDestroy) {
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
    placeholder="Nama kamu"
    type="text"
  />
  <button aria-label="Simpan nama kamu" disabled={!$userName}>Simpan</button>
</form>

<style>
  @media (max-width: 480px) {
    form {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    button {
      flex: 1;
    }
  }
</style>
