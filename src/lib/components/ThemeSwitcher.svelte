<script lang="ts">
  import { onMount } from 'svelte';

  import { theme } from '$lib/stores';
  import { setTheme } from '$lib/theme/set-theme';

  type ThemeOption = {
    label: string;
    value: Theme;
  };

  const themeOptions: ThemeOption[] = [
    { label: 'Sistem', value: 'system' },
    { label: 'Terang', value: 'light' },
    { label: 'Gelap', value: 'dark' }
  ];

  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  function handleChangeTheme(e: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
    setTheme(e.currentTarget.value as Theme, undefined, window.location.hostname === 'localhost');
  }
</script>

<select
  bind:value={$theme}
  on:change={handleChangeTheme}
  class:mounted
  label="Pilih mode"
  tabindex="0"
>
  {#each themeOptions as { label, value } (value)}
    <option {value}>
      {label}
    </option>
  {/each}
</select>

<style>
  select {
    display: none;
    position: fixed;
    z-index: 100;
    top: 8px;
    right: 8px;
    height: 32px;
    padding: 4px;
    border-radius: 4px;
    border: 1px solid var(--color-border);
    background-color: var(--color-bg-body);
    color: var(--color-text-body);
    cursor: pointer;
  }

  select:hover {
    border: 1px solid var(--color-primary);
  }

  select:focus {
    outline: 1px solid var(--color-primary);
    outline-offset: 2px;
  }

  select.mounted {
    display: inline-block;
  }
</style>
