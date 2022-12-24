<script lang="ts">
  import { slide } from 'svelte/transition';

  import { applyAction, enhance, type SubmitFunction } from '$app/forms';
  import Spinner from './Spinner.svelte';

  export let shouldDisableSubmit = false;
  export let title = 'Siap adu mekanik?';

  let roomID: string;
  let roomIDErrorMessage = '';
  let submittedAction: 'create' | 'join' | null = null;
  $: isInvalid = !!roomIDErrorMessage && !roomID;

  const submitFn: SubmitFunction<Record<string, unknown>, { message: string }> = ({ action }) => {
    submittedAction = action.toString().endsWith('?/create-room') ? 'create' : 'join';

    return async ({ form, result }) => {
      if (result.type !== 'failure' && result.type !== 'error') {
        roomIDErrorMessage = '';
        await applyAction(result);
        submittedAction = null;
        return;
      }

      form.reset();
      form.getElementsByTagName('input').item(0)?.focus();
      roomID = '';
      if (result.type === 'failure') roomIDErrorMessage = result.data?.message ?? '';
      else roomIDErrorMessage = 'Terjadi kesalahan. Silakan coba lagi';
      submittedAction = null;
    };
  };
</script>

<h3>{title}</h3>

<form action="/?/create-room" method="post" use:enhance={submitFn}>
  <button class="create-room-btn" disabled={!!submittedAction || shouldDisableSubmit}>
    {#if submittedAction === 'create'}
      <div class="spinner-wrapper">
        <Spinner />
      </div>
    {/if}
    Bikin ruangan baru
  </button>
</form>

<div class="divider">atau</div>

<form action="/?/join-room" class="join-room-form" method="post" use:enhance={submitFn}>
  <label for="katlaisasi-room-id"> Gabung dengan yang lain </label>
  <input
    aria-describedby={isInvalid ? 'katlaisasi-room-id-error-description' : ''}
    aria-invalid={isInvalid}
    id="katlaisasi-room-id"
    name="katlaisasi-roomID"
    placeholder="Masukkan ID Ruangan"
    type="text"
    bind:value={roomID}
  />
  {#if isInvalid}
    <p id="katlaisasi-room-id-error-description" class="error-description" transition:slide>
      {roomIDErrorMessage}
    </p>
  {/if}
  <button disabled={!roomID || !!submittedAction || shouldDisableSubmit}>
    {#if submittedAction === 'join'}
      <div class="spinner-wrapper">
        <Spinner />
      </div>
    {/if}
    Gabung
  </button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
  }

  .create-room-btn {
    background-color: var(--color-secondary);
    min-height: 56px;
    font-size: 1.5rem;
    line-height: 1.5rem;
    font-weight: 700;
  }

  .spinner-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .spinner-wrapper :global(progress),
  .spinner-wrapper :global(label)::before,
  .spinner-wrapper :global(label)::after {
    box-shadow: 0 0 2em 0.5em var(--color-text-inverse);
  }

  .divider {
    display: flex;
    align-items: center;
    width: 280px;
    max-width: 100%;
    text-align: center;
    color: var(--color-text-subtle);
    --text-divider-gap: 1rem;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex-grow: 1;
    height: 1px;
    background-color: var(--color-text-subtle);
  }

  .divider::before {
    margin-right: var(--text-divider-gap);
  }

  .divider::after {
    margin-left: var(--text-divider-gap);
  }

  .join-room-form {
    position: relative;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .divider,
  .join-room-form {
    margin-top: 12px;
  }

  .error-description {
    position: absolute;
    top: 100%;
    width: 100%;
    margin: 8px 0 0;
    text-align: center;
    font-size: 0.8rem;
    color: var(--color-text-subtle);
  }

  h3 {
    margin: 0;
  }

  button {
    position: relative;
  }

  label {
    width: 100%;
    text-align: center;
  }

  @media (max-width: 480px) {
    button,
    .divider {
      width: 100%;
    }

    .error-description {
      position: static;
      margin: 0;
    }
  }
</style>
