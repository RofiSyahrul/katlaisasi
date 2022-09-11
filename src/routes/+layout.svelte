<script lang="ts">
  import '../app.css';

  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  import Header from '$lib/header/Header.svelte';
  import { theme } from '$lib/stores';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $theme = data.initialTheme;
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme == 'system' ? 'light dark' : $theme} />
  <link rel="stylesheet" href={`/theme/${$theme}.css`} />
</svelte:head>

<ThemeSwitcher />
<Header />

<main>
  <slot />
</main>

<footer>
  <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
</footer>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }
</style>
