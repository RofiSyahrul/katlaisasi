<script lang="ts">
  import { quintOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import HowToPlay from '$lib/components/HowToPlay.svelte';
  import RoomForm from '$lib/components/RoomForm.svelte';
  import UserNameForm from '$lib/components/UserNameForm.svelte';
  import { userName } from '$lib/stores';

  let isUserNameSaved = false;
  let hasInitialUserName = !!$userName;

  $: isUserNameFormShown = !isUserNameSaved && !hasInitialUserName;
  $: if (isUserNameSaved) hasInitialUserName = true;
</script>

<p>
  Adu mekanik
  <a href="https://katla.vercel.app?utm_source=katlaisasi&utm_medium=web" target="_blank">
    <strong>KATLA</strong>
  </a>
  bersama teman/keluarga
</p>

<section class="welcome">
  {#if hasInitialUserName && $userName}
    <h2>Selamat Datang, <u><em>{$userName}</em></u>!</h2>
  {:else}
    <h2>Selamat Datang!</h2>
    <p>Kenalan dulu yuk! Siapa nama kamu?</p>
  {/if}

  {#if isUserNameFormShown}
    <UserNameForm
      bind:hasBeenSaved={isUserNameSaved}
      shouldResetStateOnDestroy={hasInitialUserName}
    />
  {:else}
    <button on:click={() => (isUserNameFormShown = true)} in:slide={{ easing: quintOut }}>
      Ganti nama
    </button>
  {/if}
</section>

<div>
  <section>
    <HowToPlay />
  </section>
  <section class="room-form-section">
    <RoomForm shouldDisableSubmit={!$userName || isUserNameFormShown} />
  </section>
</div>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 24px;
  }

  .welcome {
    gap: 16px;
  }

  div {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;
    max-width: 1366px;
    margin: 24px auto 0;
  }

  div > section {
    margin: 0;
    justify-content: flex-start;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 8px;
  }

  h2,
  p {
    margin: 0;
    text-align: center;
  }

  button {
    min-height: unset;
  }

  @media (min-width: 768px) {
    div {
      grid-template-columns: 2fr 1fr;
    }
  }

  @media (min-width: 768px) and (max-width: 960px) {
    .room-form-section :global(button),
    .room-form-section :global(input),
    .room-form-section :global(.divider) {
      width: 100%;
    }
  }
</style>
