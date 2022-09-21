<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { quintOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import { enhance } from '$app/forms';
  import { userName } from '$lib/stores';
  import { validUserNamePattern } from '$lib/utils/user-name';

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
    on:change={(e) => e.currentTarget.setCustomValidity('')}
    on:invalid={(e) => {
      e.currentTarget.setCustomValidity(
        `2-20 karakter,
        tidak boleh ada karakter selain alphabet atau spasi, serta
        tidak boleh diawali dan diakhiri dengan spasi ygy`
      );
    }}
    maxlength="20"
    minlength="2"
    name="katlaisasi-userName"
    pattern={validUserNamePattern}
    placeholder="Nama kamu"
    required
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
