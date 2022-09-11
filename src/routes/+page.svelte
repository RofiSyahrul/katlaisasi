<script lang="ts">
  import { quintOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import UserNameForm from '$lib/components/UserNameForm.svelte';
  import { userName } from '$lib/stores';

  let isUserNameSaved = false;
  let isEditUserNameCanceled = false;
  let hasInitialUserName = !!$userName;

  $: isUserNameFormShown = !isEditUserNameCanceled && !isUserNameSaved && !hasInitialUserName;
  $: if (isUserNameSaved) hasInitialUserName = true;
</script>

<section>
  <h1>KATLAISASI</h1>
  <p>
    Adu mekanik <a href="https://katla.vercel.app" target="_blank"><strong>KATLA</strong></a> bersama
    teman/keluarga
  </p>
</section>

<section class="welcome">
  <div>
    {#if hasInitialUserName && $userName}
      <h2>Selamat Datang, <u><em>{$userName}</em></u>!</h2>
    {:else}
      <h2>Selamat Datang!</h2>
      <p>Kenalan dulu yuk! Siapa nama kamu?</p>
    {/if}
  </div>

  {#if isUserNameFormShown}
    <UserNameForm
      bind:hasBeenSaved={isUserNameSaved}
      bind:hasBeenCanceled={isEditUserNameCanceled}
      shouldShowCancelButton={hasInitialUserName}
      shouldResetStateOnDestroy={hasInitialUserName}
    />
  {:else}
    <button on:click={() => (isUserNameFormShown = true)} in:slide={{ easing: quintOut }}>
      Ganti nama
    </button>
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    gap: 8px;
  }

  .welcome {
    gap: 16px;
  }
  .welcome > div:first-child {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 32px;
    text-align: center;
    flex: 1;
    gap: 4px;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  button {
    min-height: unset;
  }
</style>
