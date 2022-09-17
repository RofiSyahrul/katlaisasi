<script lang="ts" context="module">
  const appleIconSizes = ['152', '144', '120', '114', '76', '72', '60', '57'];
</script>

<script lang="ts">
  import '../app.css';

  import { page } from '$app/stores';
  import { createPortal } from '$lib/actions/portal';
  import Header from '$lib/components/Header.svelte';
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  import { theme, userName } from '$lib/stores';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $theme = data.initialTheme;
  $userName = data.userName;

  let description: string,
    image = data.seo.image,
    keyword = data.seo.keyword,
    shouldBlockSearchIndex: boolean | undefined,
    title: string;

  $: {
    ({ description, title, shouldBlockSearchIndex } = $page.data.seo);

    if (!title) {
      title = data.seo.title;
    } else if (title !== data.seo.title && !title.endsWith(`| ${data.seo.title}`)) {
      title = `${title} | ${data.seo.title}`;
    }

    if (!description) {
      description = data.seo.description;
    }

    if ($page.data.seo.image) {
      image = $page.data.seo.image;
    }

    if ($page.data.seo.keyword) {
      keyword = $page.data.seo.keyword;
    }
  }
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta httpequiv="X-UA-Compatible" content="IE=edge" />

  <meta name="color-scheme" content={$theme == 'system' ? 'light dark' : $theme} />
  <link rel="stylesheet" href={`/theme/${$theme}.css`} />

  {#each appleIconSizes as size (size)}
    <link
      rel="apple-touch-icon"
      sizes={`${size}x${size}`}
      href={`/icons/apple-touch-icon-${size}x${size}.png`}
    />
  {/each}

  <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/icons/android-chrome-192x192.png" />
  <link rel="icon" type="image/png" sizes="384x384" href="/icons/android-chrome-384x384.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:creator" content="@RofiSyahrul" />

  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta name="twitter:title" content={title} />

  <link rel="canonical" href={$page.url.href} />
  <meta name="og:url" content={$page.url.href} />

  <meta name="description" content={description} />
  <meta property="og:description" content={description} />
  <meta name="twitter:description" content={description} />

  <meta property="og:image" content={image} />
  <meta name="twitter:image" content={image} />

  <meta name="keywords" content={keyword} />

  {#if shouldBlockSearchIndex}
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>

<ThemeSwitcher />
<Header />

<main class:no-header-xs={$page.url.pathname.startsWith('/ruangan/')}>
  <slot />
</main>

<div use:createPortal />

<style>
  main {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    height: calc(100vh - 48px);
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  @media (max-width: 450px) {
    main.no-header-xs {
      height: 100vh;
    }
  }
</style>
