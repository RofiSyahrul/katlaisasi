<script lang="ts">
  import { copyToClipBoard } from '$lib/utils/copy-to-clipboard';

  async function handleClick() {
    const { origin, pathname, search } = window.location;
    const text = `Mari kita adu mekanik Katla di Katlaisasi ${origin}${pathname}${search}`;
    const isSuccess = await copyToClipBoard(text);
    console.log({ isSuccess });
  }
</script>

<button on:click={handleClick}>Undang teman/keluarga</button>

<style>
  button {
    margin: 4px auto;
    min-height: unset;
    padding: 4px;
    background-color: transparent;
    border: 1px solid var(--color-text-body);
    color: var(--color-primary);
  }

  button:hover,
  button:focus {
    border: 2px solid var(--color-primary);
  }
</style>
